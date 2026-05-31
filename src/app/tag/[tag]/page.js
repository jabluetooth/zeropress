import { supabase } from '@/lib/supabase';
import { getCoverClass, getKicker, getReadTime, formatDate, toPublicUrl } from '@/lib/utils';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag).trim();
  return { title: `#${tag}`, description: `Posts tagged with ${tag}` };
}

export default async function TagPage({ params }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag).trim();

  const { data: allPosts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, tags, featured_image_url, published_at, reading_time, word_count')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(100);

  const posts = (allPosts || []).filter(p =>
    (p.tags || []).some(t => t.trim().toLowerCase() === tag.toLowerCase())
  );

  // Co-occurring related tags
  const co = {};
  posts.forEach(p => (p.tags || []).forEach(t => { if (t.toLowerCase() !== tag.toLowerCase()) co[t] = (co[t] || 0) + 1; }));
  const relTags = Object.entries(co).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="home">
      {/* Tag header */}
      <header className="tag-head fade-up">
        <a className="tag-head__back" href="/">← All posts</a>
        <h1><span className="hash">#</span>{tag}</h1>
        <div className="tag-head__sub">
          <span className="tag-head__count">{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
          <span className="tag-head__desc">
            Posts tagged with <strong>{tag}</strong> — sorted by newest first.
          </span>
        </div>
      </header>

      {/* Related tags */}
      {relTags.length > 0 && (
        <div className="related-tags">
          <span className="lbl">Related</span>
          {relTags.map(([t]) => (
            <a key={t} href={`/tag/${t.toLowerCase()}`} className="chip">{t}</a>
          ))}
        </div>
      )}

      {/* Grid */}
      {posts.length === 0 ? (
        <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-3)', fontSize: '1rem' }}>No posts found for <strong>#{tag}</strong>.</p>
        </div>
      ) : (
        <section className="grid3">
          {posts.map((p, i) => {
            const cc = getCoverClass(p, i);
            const img = toPublicUrl(p.featured_image_url);
            return (
              <article key={p.id} className="card">
                <div className={`cover ${cc}`} style={{ height: 160 }}>
                  {img && <img src={img} alt="" loading="lazy" />}
                  <span className="cover__tag">{getKicker(p)}</span>
                </div>
                <div className="card__body">
                  <div className="card__tags">
                    {(p.tags || []).slice(0, 2).map(t => (
                      <a
                        key={t}
                        href={`/tag/${t.toLowerCase()}`}
                        className={`chip ${t.toLowerCase() === tag.toLowerCase() ? 'chip--accent' : ''}`}
                      >
                        {t}
                      </a>
                    ))}
                  </div>
                  <h3 className="card__title" style={{ fontSize: '1.12rem' }}>
                    <a className="card__link" href={`/post/${p.slug}`}>{p.title}</a>
                  </h3>
                  <p className="card__excerpt">{p.excerpt?.slice(0, 120)}…</p>
                  <div className="card__meta">
                    <span>{getReadTime(p)} min</span>
                    <span className="dot-sep" />
                    <span>{formatDate(p.published_at)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
