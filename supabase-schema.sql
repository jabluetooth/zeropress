-- =============================================
-- AI BLOG — Supabase Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body_html TEXT NOT NULL,
  meta_description TEXT,
  featured_image_url TEXT,
  primary_keyword TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  word_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- n8n pipeline metadata
  run_id TEXT,
  interest_score INTEGER DEFAULT 0
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed BOOLEAN DEFAULT false,
  unsubscribed BOOLEAN DEFAULT false
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (status = 'published');

-- Service role can do everything (n8n uses service key)
CREATE POLICY "Service role full access to posts"
  ON posts FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to subscribers"
  ON subscribers FOR ALL
  USING (true)
  WITH CHECK (true);

-- Public can insert subscribers (newsletter signup)
CREATE POLICY "Public can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

-- =============================================
-- STORAGE BUCKET — Post Images
-- Run this in the Supabase SQL Editor
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "Service role can upload post images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Service role can update post images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'post-images');

CREATE POLICY "Service role can delete post images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'post-images');

-- =============================================
-- STORAGE DIAGNOSTICS — Run if images not showing
-- =============================================

-- 1. Check what image URLs are stored in posts
SELECT slug, featured_image_url
FROM posts
WHERE status = 'published'
AND featured_image_url IS NOT NULL
LIMIT 5;

-- 2. Check existing storage policies
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 3. Fix: ensure bucket is public
UPDATE storage.buckets
SET public = true
WHERE id = 'post-images';

-- 4. Fix: drop and recreate public read policy if images still not accessible
DROP POLICY IF EXISTS "Public can view post images" ON storage.objects;

CREATE POLICY "Public can view post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images' AND auth.role() = 'anon' OR auth.role() = 'authenticated' OR auth.role() = 'service_role');
