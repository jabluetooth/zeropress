import { supabase } from '@/lib/supabase';
import { PostCardLarge, PostCardMedium, PostCardCompact } from '@/components/PostCard';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag).trim();
  return { title: `#${tag}`, description: `Posts tagged with ${tag}` };
}

export default async function TagPage({ params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag).trim();

  // Fetch all published posts and filter case-insensitively
  const { data: allPosts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, tags, featured_image_url, published_at, reading_time, word_count')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(100);

  const posts = (allPosts || []).filter(post =>
    (post.tags || []).some(t => t.trim().toLowerCase() === tag.toLowerCase())
  );

  const [p0, p1, p2, p3, p4, p5, p6, ...rest] = posts;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <a href="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>&larr; All posts</a>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: 12, letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--accent)' }}>#</span>{tag}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
          {posts.length} post{posts.length !== 1 ? 's' : ''} tagged with <strong>{tag}</strong>
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No posts found for <strong>#{tag}</strong>.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(p0 || p1) && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'stretch' }}>
              {p0 && <PostCardLarge post={p0} />}
              {p1 && <PostCardMedium post={p1} />}
            </div>
          )}
          {(p2 || p3) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, alignItems: 'stretch' }}>
              {p2 && <PostCardMedium post={p2} />}
              {p3 && <PostCardLarge post={p3} />}
            </div>
          )}
          {(p4 || p5 || p6) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }}>
              {p4 && <PostCardCompact post={p4} />}
              {p5 && <PostCardCompact post={p5} />}
              {p6 && <PostCardCompact post={p6} />}
            </div>
          )}
          {rest.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }}>
              {rest.map(post => <PostCardCompact key={post.id} post={post} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
