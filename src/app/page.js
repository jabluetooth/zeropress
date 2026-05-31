import { supabase } from '@/lib/supabase';
import { getCoverClass, getKicker, getReadTime, formatDate, toPublicUrl } from '@/lib/utils';
import PostGrid from '@/components/PostGrid';
import NewsletterForm from '@/components/NewsletterForm';
import TopicsSearch from '@/components/TopicsSearch';

export const revalidate = 60;

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
  const raw = await getPosts();

  const seen = new Set();
  const posts = raw.filter(p => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true; });

  const [featured, ...rest] = posts;

  const tagCounts = {};
  posts.forEach(p => (p.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  const featuredCover = featured ? getCoverClass(featured, 0) : 'cover--1 p-arc';
  const featuredKicker = featured ? getKicker(featured) : '';
  const featuredImg = featured ? toPublicUrl(featured.featured_image_url) : null;

  return (
    <div className="home">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="hero fade-up">
        <div className="hero__eyebrow">
          <span className="eyebrow">ZeroPress · Dispatches on applied AI</span>
        </div>
        <h1>What&apos;s actually <em>shipping</em> in machine learning.</h1>
        <p className="hero__sub">
          Deep dives, field notes, and honest analysis on models, inference, and the
          craft of building with them — researched and drafted by a pipeline, edited for taste.
        </p>
        <div className="hero__rule">
          <a className="btn btn--primary" href="#latest">Read the latest</a>
          <div className="hero__stats">
            <span>{posts.length} posts</span>
            <span className="dot-sep" />
            <span>updated weekly</span>
          </div>
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────────────────── */}
      {featured && (
        <section style={{ marginBottom: 8 }}>
          <div className="section-head">
            <span className="eyebrow" style={{ color: 'var(--amber)' }}>★ Featured</span>
          </div>
          <article className="card featured" style={{ padding: 0 }}>
            {/* Cover side */}
            <div className={`cover ${featuredCover}`} style={{ display: 'block' }}>
              {featuredImg && <img src={featuredImg} alt="" loading="lazy" />}
              <span className="cover__tag">{featuredKicker}</span>
            </div>

            {/* Content side */}
            <div className="featured__content">
              <div className="card__tags">
                {(featured.tags || []).slice(0, 3).map(tag => (
                  <a key={tag} href={`/tag/${tag.toLowerCase()}`} className="chip">{tag}</a>
                ))}
              </div>
              <h2>
                <a href={`/post/${featured.slug}`} style={{ color: 'inherit' }}>{featured.title}</a>
              </h2>
              <p style={{ color: 'var(--ink-2)', fontSize: '0.98rem', lineHeight: 1.65 }}>
                {featured.excerpt}
              </p>
              <div className="card__meta">
                <span>{getReadTime(featured)} min</span>
                <span className="dot-sep" />
                <span>{formatDate(featured.published_at)}</span>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* ── MAIN: bento + sidebar ────────────────────────────────── */}
      <div className="main" id="latest">

        {/* Bento grid */}
        <section>
          <div className="section-head">
            <span className="eyebrow">Latest posts</span>
            <span className="count">{rest.length} articles</span>
          </div>

          {rest.length === 0 ? (
            <div className="card" style={{ padding: '64px 40px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, margin: '0 auto 22px', borderRadius: 18, background: 'var(--ink)', display: 'grid', placeItems: 'center' }}>
                <span style={{ fontFamily: 'var(--display)', color: 'var(--accent-bright)', fontSize: 26, fontWeight: 700 }}>Z</span>
              </div>
              <h3 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
                Nothing here yet.
              </h3>
              <p style={{ color: 'var(--ink-2)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '44ch', margin: '12px auto 0' }}>
                The AI pipeline publishes here automatically. The first post lands the moment it clears editorial review.
              </p>
            </div>
          ) : (
            <PostGrid posts={rest} />
          )}

          {rest.length > 0 && (
            <div className="loadmore">
              <button className="btn btn--ghost">Load older posts</button>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Newsletter */}
          <div className="panel panel--ink">
            <NewsletterForm />
          </div>

          {/* Topics */}
          <div className="panel">
            <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>Browse topics</span>
            <TopicsSearch tags={sortedTags} />
          </div>
        </aside>
      </div>
    </div>
  );
}
