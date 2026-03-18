import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

// POST /api/posts — n8n calls this to create a new post
// PUT  /api/posts — n8n calls this to update an existing post by slug
export async function POST(request) {
  try {
    // Authenticate — n8n sends the API_SECRET_KEY as a Bearer token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || token !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.body_html) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, body_html' },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    // Calculate reading time
    const wordCount = body.word_count || (body.body_html.replace(/<[^>]*>/g, '').split(/\s+/).length);
    const readingTime = Math.ceil(wordCount / 250);

    // Prepare the record
    const record = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || '',
      body_html: body.body_html,
      meta_description: body.meta_description || '',
      featured_image_url: body.featured_image_url || null,
      primary_keyword: body.primary_keyword || '',
      tags: body.tags || body.target_keywords || [],
      status: body.status || 'draft',
      word_count: wordCount,
      reading_time: readingTime,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
      run_id: body.run_id || null,
      interest_score: body.interest_score || 0,
    };

    // Upsert — insert or update if slug exists
    const { data, error } = await supabase
      .from('posts')
      .upsert(record, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the created post with its URL (for n8n to inject into social content)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.json({
      id: data.id,
      slug: data.slug,
      link: `${siteUrl}/post/${data.slug}`,
      status: data.status,
      title: data.title,
      created: true,
    }, { status: 201 });

  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/posts — list published posts (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag');

    const supabase = getServiceClient();
    let query = supabase
      .from('posts')
      .select('id, title, slug, excerpt, tags, featured_image_url, published_at, reading_time')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ posts: data || [] });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
