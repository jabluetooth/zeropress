import { supabase } from '@/lib/supabase';
import PostGrid from '@/components/PostGrid';
import NewsletterForm from '@/components/NewsletterForm';
import TopicsSearch from '@/components/TopicsSearch';
import SpotlightHero from '@/components/SpotlightHero';
import WorkflowTrigger from '@/components/WorkflowTrigger';

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

export default async function HomePage() {
  const posts = await getPosts();

  // Deduplicate by slug just in case n8n created duplicates
  const seen = new Set();
  const unique = posts.filter(p => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  const [featured, ...gridPosts] = unique;

  // Aggregate tags with counts from all posts
  const tagCounts = {};
  unique.forEach(p => (p.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="page-wrapper">

      {/* Hero */}
      <SpotlightHero />

      {/* Featured */}
      {featured && (
        <section style={{ marginBottom: 40 }} className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>★ Featured</span>
          </div>
          <a href={`/post/${featured.slug}`} style={{ textDecoration: 'none' }}>
            <div className={`card ${featured.featured_image_url ? 'featured-card-grid' : ''}`} style={{ padding: 0, overflow: 'hidden' }}>
              {featured.featured_image_url && (
                <div style={{ minHeight: 300, overflow: 'hidden' }}>
                  <img
                    src={toPublicUrl(featured.featured_image_url)}
                    alt={featured.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
              <div className="featured-card-content">
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
      <div className="main-grid">

        {/* Bento posts */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Latest Posts</span>
          </div>
          {gridPosts.length === 0 ? (
            <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No posts yet. The AI pipeline will publish content here automatically.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>Check back soon or subscribe to get notified.</p>
            </div>
          ) : (
            <PostGrid posts={gridPosts} />
          )}
        </section>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Newsletter */}
          <div className="card-dark" style={{ padding: '28px 24px', marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
              🔔 Stay in the loop
            </h3>
            <p style={{ fontSize: '0.825rem', marginBottom: 16 }}>
              Get the latest AI insights delivered to your inbox. No spam, unsubscribe anytime.
            </p>
            <NewsletterForm />
          </div>

          {/* Workflow Trigger */}
          <div className="card-dark" style={{ padding: '28px 24px', marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
              🤖 Generate Content
            </h3>
            <p style={{ fontSize: '0.825rem', marginBottom: 16 }}>
              Trigger the AI workflow to generate a new blog post.
            </p>
            <WorkflowTrigger />
          </div>

          {/* Topics */}
          <div className="card-dark" style={{ padding: '28px 24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>
              Topics
            </h3>
            <TopicsSearch tags={sortedTags} />
          </div>

        </aside>

      </div>
    </div>
  );
}
