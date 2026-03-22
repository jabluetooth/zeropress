import { supabase } from '@/lib/supabase';
import PostCard from '@/components/PostCard';
import NewsletterForm from '@/components/NewsletterForm';
import TagCloud from '@/components/TagCloud';
import EncryptedText from '@/components/EncryptedText';

export const revalidate = 60; // ISR: revalidate every 60 seconds

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
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
}

export default async function HomePage() {
  const posts = await getPosts();
  const tags = await getAllTags();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

      {/* Hero */}
      <section style={{ marginBottom: 56 }} className="fade-in">
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          \u26A1 AI-Curated Tech Insights
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
          <EncryptedText text="Research. Write. Publish." className="glow-text" />
          <br />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.6em' }}>
            Automated content pipeline powered by AI
          </span>
        </h1>
      </section>

      {/* Featured post */}
      {featured && (
        <section style={{ marginBottom: 48 }} className="fade-in" key={featured.id}>
          <a href={`/post/${featured.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: featured.featured_image_url ? '1fr 1fr' : '1fr', minHeight: 280 }}>
              {featured.featured_image_url && (
                <div style={{
                  backgroundImage: `url(${featured.featured_image_url})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  minHeight: 280,
                }} />
              )}
              <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Featured</span>
                  {(featured.tags || []).slice(0, 3).map(tag => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                  {featured.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>{featured.reading_time || Math.ceil((featured.word_count || 0) / 250)} min read</span>
                  <span>\u00B7</span>
                  <span>{featured.published_at ? new Date(featured.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                </div>
              </div>
            </div>
          </a>
        </section>
      )}

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}>

        {/* Posts grid */}
        <section>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Latest Posts
          </h2>
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {rest.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            {posts.length === 0 && (
              <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No posts yet. The AI pipeline will publish content here automatically.</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>Check back soon or subscribe to get notified.</p>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 96 }}>
          {/* Newsletter */}
          <div className="card" style={{ padding: '28px 24px', marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
              \uD83D\uDD14 Stay in the loop
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Get the latest AI insights delivered to your inbox. No spam, unsubscribe anytime.
            </p>
            <NewsletterForm />
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="card" style={{ padding: '28px 24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>
                Topics
              </h3>
              <TagCloud tags={tags} />
            </div>
          )}

          {/* AI Badge */}
          <div style={{
            marginTop: 24, padding: '20px 24px',
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
