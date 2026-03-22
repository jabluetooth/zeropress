import { supabase } from '@/lib/supabase';
import { PostCardLarge, PostCardMedium, PostCardCompact } from '@/components/PostCard';
import NewsletterForm from '@/components/NewsletterForm';
import EncryptedText from '@/components/EncryptedText';

export const revalidate = 60;

const SUPABASE_URL = 'https://qvhlprtppakttxseqkgh.supabase.co';
function toPublicUrl(url) {
  if (!url) return null;
  if (url.startsWith('http') && url.includes('/object/public/')) return url;
  if (url.startsWith('http') && url.includes('/storage/v1/object/')) {
    return url.replace('/storage/v1/object/', '/storage/v1/object/public/');
  }
  if (!url.startsWith('http')) {
    return `${SUPABASE_URL}/storage/v1/object/public/${url}`;
  }
  return url;
}

async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, tags, featured_image_url, published_at, reading_time, word_count')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) { console.error('Supabase error:', error); return []; }
  return data || [];
}

async function getAllTags() {
  const { data } = await supabase
    .from('posts')
    .select('tags')
    .eq('status', 'published');

  const tagCount = {};
  (data || []).forEach(post => {
    (post.tags || []).forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 15);
}

export default async function HomePage() {
  const posts = await getPosts();
  const tags = await getAllTags();

  // Bento slots
  const [featured, ...gridPosts] = posts;
  const [p0, p1, p2, p3, p4, p5, p6, ...rest] = gridPosts;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

      {/* Hero */}
      <section style={{ marginBottom: 48 }} className="fade-in">
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          ⚡ AI-Curated Tech Insights
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
          <EncryptedText text="Research. Write. Publish." className="glow-text" />
          <br />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.6em' }}>
            Automated content pipeline powered by AI
          </span>
        </h1>
      </section>

      {/* Featured */}
      {featured && (
        <section style={{ marginBottom: 40 }} className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>★ Featured</span>
          </div>
          <a href={`/post/${featured.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: featured.featured_image_url ? '1fr 1fr' : '1fr' }}>
              {featured.featured_image_url && (
                <div style={{ minHeight: 300, overflow: 'hidden' }}>
                  <img
                    src={toPublicUrl(featured.featured_image_url)}
                    alt={featured.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
              <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <h2 style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                  {featured.title}
                </h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(featured.tags || []).slice(0, 3).map(tag => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {featured.excerpt?.substring(0, 220)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>{featured.reading_time || Math.ceil((featured.word_count || 0) / 250)} min read</span>
                  <span>&middot;</span>
                  <span>{featured.published_at ? new Date(featured.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                </div>
              </div>
            </div>
          </a>
        </section>
      )}

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' }}>

        {/* Bento posts */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Latest Posts</span>
          </div>
          {posts.length === 0 ? (
            <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No posts yet. The AI pipeline will publish content here automatically.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>Check back soon or subscribe to get notified.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Row 1: Large (2/3) + Medium (1/3) */}
              {(p0 || p1) && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'stretch' }}>
                  {p0 && <PostCardLarge post={p0} />}
                  {p1 && <PostCardMedium post={p1} />}
                </div>
              )}

              {/* Row 2: Medium (1/3) + Large (2/3) — mirrored */}
              {(p2 || p3) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, alignItems: 'stretch' }}>
                  {p2 && <PostCardMedium post={p2} />}
                  {p3 && <PostCardLarge post={p3} />}
                </div>
              )}

              {/* Row 3: Three compact cards */}
              {(p4 || p5 || p6) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }}>
                  {p4 && <PostCardCompact post={p4} />}
                  {p5 && <PostCardCompact post={p5} />}
                  {p6 && <PostCardCompact post={p6} />}
                </div>
              )}

              {/* Remaining: 3-column compact grid */}
              {rest.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }}>
                  {rest.map(post => <PostCardCompact key={post.id} post={post} />)}
                </div>
              )}

            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 96 }}>
          {/* Newsletter */}
          <div className="card" style={{ padding: '28px 24px', marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
              🔔 Stay in the loop
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Get the latest AI insights delivered to your inbox. No spam, unsubscribe anytime.
            </p>
            <NewsletterForm />
          </div>

          {/* AI Badge */}
          <div style={{
            padding: '20px 24px',
            background: 'var(--accent-glow)', borderRadius: 12,
            border: '1px solid var(--accent-dim)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div className="pulse-dot" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>AI-POWERED</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Content is researched, written, and published by an automated AI pipeline using Groq, Hugging Face, and n8n.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
