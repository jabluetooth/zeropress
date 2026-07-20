-- =============================================
-- ZeroPress — RLS lockdown migration
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query)
--
-- WHY: The original policies in supabase-schema.sql were written as
--   CREATE POLICY "Service role full access to posts" ON posts FOR ALL
--     USING (true) WITH CHECK (true);
-- with no `TO service_role` clause. In Postgres, a policy with no `TO`
-- clause applies to the PUBLIC pseudo-role — which includes `anon` and
-- `authenticated`. Since NEXT_PUBLIC_SUPABASE_ANON_KEY is shipped in every
-- page's client bundle by design, this means ANY site visitor can currently
-- call the Supabase REST API directly with the anon key and INSERT/UPDATE/
-- DELETE any row in `posts` or `subscribers`, and write/overwrite/delete any
-- object in the `post-images` storage bucket — bypassing your app's own
-- Bearer-token checks entirely. Since posts.body_html is rendered via
-- dangerouslySetInnerHTML on the site, this is a stored-XSS / full
-- defacement / subscriber-list-exfiltration path.
--
-- This migration re-scopes every "full access" policy to `service_role`
-- only, and leaves the narrow public policies (read published posts,
-- insert-only subscribe, read post images) untouched.
-- =============================================

-- ---- posts ----
DROP POLICY IF EXISTS "Service role full access to posts" ON posts;

CREATE POLICY "Service role full access to posts"
  ON posts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---- subscribers ----
DROP POLICY IF EXISTS "Service role full access to subscribers" ON subscribers;

CREATE POLICY "Service role full access to subscribers"
  ON subscribers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Public can still subscribe (INSERT-only, unchanged) — but explicitly scope
-- to anon/authenticated so it's not implicitly PUBLIC either.
DROP POLICY IF EXISTS "Public can subscribe" ON subscribers;

CREATE POLICY "Public can subscribe"
  ON subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public read of posts stays scoped the same way, for consistency.
DROP POLICY IF EXISTS "Public can read published posts" ON posts;

CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- ---- storage.objects (post-images bucket) ----
DROP POLICY IF EXISTS "Service role can upload post images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update post images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete post images" ON storage.objects;

CREATE POLICY "Service role can upload post images"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Service role can update post images"
  ON storage.objects FOR UPDATE
  TO service_role
  USING (bucket_id = 'post-images');

CREATE POLICY "Service role can delete post images"
  ON storage.objects FOR DELETE
  TO service_role
  USING (bucket_id = 'post-images');

-- Public read of images stays public (bucket is meant to be public), just
-- explicitly scoped instead of implicit PUBLIC.
DROP POLICY IF EXISTS "Public can view post images" ON storage.objects;

CREATE POLICY "Public can view post images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'post-images');

-- =============================================
-- VERIFY — after running the above, confirm every policy is scoped:
-- =============================================
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename IN ('posts', 'subscribers', 'objects')
ORDER BY tablename, policyname;
-- `roles` should read {service_role} for every write/ALL policy, and
-- {anon,authenticated} (never the bare PUBLIC default) for the read-only /
-- insert-only ones.

-- =============================================
-- OPTIONAL BUT RECOMMENDED — rotate the service role key afterward, since
-- it may have been usable for unrestricted writes since the schema was
-- first created. Supabase dashboard → Project Settings → API → Reset
-- service_role key, then update SUPABASE_SERVICE_ROLE_KEY in Vercel + n8n
-- Supabase credential, then redeploy.
-- =============================================
