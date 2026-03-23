# ZeroPress — AI-Powered Blog

A Next.js blog with a Supabase backend, designed to receive content from an automated n8n AI pipeline. Clean, minimal design. Hosted free on Vercel.

## Stack

- **Next.js 15** — App Router, ISR (revalidates every 60s)
- **Supabase** — Postgres database for posts + subscribers
- **Framer Motion** — Smooth animations
- **Vercel** — Free hosting with auto-deploy

## Quick Start

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Open the **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Local Development

```bash
cp .env.local.example .env.local
# Fill in your Supabase keys and a random API_SECRET_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com), import the repo
3. Add these environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `API_SECRET_KEY` (same random string you use in n8n)
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL, e.g. `https://zeropress.vercel.app`)
   - `NEXT_PUBLIC_SITE_NAME` (e.g. `ZeroPress`)
4. Deploy

### 4. Test the API

Create a test post:
```bash
curl -X POST https://your-site.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_SECRET_KEY" \
  -d '{
    "title": "Test Post",
    "slug": "test-post",
    "body_html": "<article><h2>Hello World</h2><p>This is a test post.</p></article>",
    "excerpt": "A test post from the API.",
    "tags": ["test", "ai"],
    "status": "published"
  }'
```

## API Reference

### POST /api/posts

Creates or updates a blog post (upserts by slug). This is what n8n calls.

**Headers:**
- `Authorization: Bearer YOUR_API_SECRET_KEY`
- `Content-Type: application/json`

**Body:**
```json
{
  "title": "Post Title",
  "slug": "post-slug",
  "body_html": "<article>...</article>",
  "excerpt": "Short summary",
  "meta_description": "SEO description",
  "featured_image_url": "https://...",
  "tags": ["ai", "machine-learning"],
  "status": "published",
  "word_count": 2000,
  "primary_keyword": "ai",
  "run_id": "run_123",
  "interest_score": 75
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "slug": "post-slug",
  "link": "https://your-site.vercel.app/post/post-slug",
  "status": "published",
  "title": "Post Title",
  "created": true
}
```

### POST /api/newsletter

Subscribe an email.

**Body:** `{ "email": "user@example.com" }`

### GET /api/posts

List published posts. Query params: `limit` (default 10), `tag` (filter by tag).

---

## n8n Pipeline Integration

Replace the WordPress node in your pipeline with an HTTP Request node:

**HTTP Request → "Publish to Blog"**

- Method: POST
- URL: `https://your-site.vercel.app/api/posts`
- Authentication: Header Auth
  - Name: `Authorization`
  - Value: `Bearer YOUR_API_SECRET_KEY`
- Body → JSON:

```json
{
  "title": "{{ $json.headline }}",
  "slug": "{{ $json.slug }}",
  "body_html": "{{ $json.body_html }}",
  "excerpt": "{{ $json.excerpt }}",
  "meta_description": "{{ $json.meta_description }}",
  "tags": {{ JSON.stringify($json.target_keywords || []) }},
  "primary_keyword": "{{ $json.primary_keyword }}",
  "status": "published",
  "word_count": {{ $json.word_count || 0 }},
  "run_id": "{{ $json.run_id }}",
  "interest_score": {{ $json.interest_score || 0 }}
}
```

The response contains a `link` field with the full post URL.
