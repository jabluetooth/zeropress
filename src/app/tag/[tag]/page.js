import { supabase } from '@/lib/supabase';
import PostCard from '@/components/PostCard';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { tag } = await params;
  return { title: `#${tag}`, description: `Posts tagged with ${tag}` };
}

export default async function TagPage({ params }) {
  const { tag } = await params;

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, tags, featured_image_url, published_at, reading_time, word_count')
    .eq('status', 'published')
    .contains('tags', [tag])
    .order('published_at', { ascending: false })
    .limit(30);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <a href="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>&larr; All posts</a>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: 12, letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--accent)' }}>#</span>{tag}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
          {posts?.length || 0} post{(posts?.length || 0) !== 1 ? 's' : ''} tagged with <strong>{tag}</strong>
        </p>
      </div>
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {(posts || []).map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
