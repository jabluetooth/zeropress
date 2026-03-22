'use client';

const PLACEHOLDER_GRADIENT = 'linear-gradient(135deg, #12121a 0%, #1e1e2a 100%)';

const SUPABASE_URL = 'https://qvhlprtppakttxseqkgh.supabase.co';

function toPublicUrl(url) {
  if (!url) return null;
  // Already a full public URL
  if (url.startsWith('http') && url.includes('/object/public/')) return url;
  // Full URL but missing /public/
  if (url.startsWith('http') && url.includes('/storage/v1/object/')) {
    return url.replace('/storage/v1/object/', '/storage/v1/object/public/');
  }
  // Just a path like "post-images/filename.jpg"
  if (!url.startsWith('http')) {
    return `${SUPABASE_URL}/storage/v1/object/public/${url}`;
  }
  return url;
}

function CardImage({ url, height = 200 }) {
  const src = toPublicUrl(url);
  if (!src) {
    return (
      <div style={{
        width: '100%', height,
        background: PLACEHOLDER_GRADIENT,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '2rem', opacity: 0.15 }}>◎</span>
      </div>
    );
  }
  return (
    <div style={{ width: '100%', height, overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
      <img
        src={src}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { e.currentTarget.parentElement.style.background = PLACEHOLDER_GRADIENT; e.currentTarget.remove(); }}
      />
    </div>
  );
}

function Meta({ post }) {
  const readTime = post.reading_time || Math.ceil((post.word_count || 0) / 250);
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
      <span>{readTime} min read</span>
      {date && <><span>&middot;</span><span>{date}</span></>}
    </div>
  );
}

/* ── LARGE: top-left hero card ─────────────────────────────── */
export function PostCardLarge({ post }) {
  return (
    <a href={`/post/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <article className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <CardImage url={post.featured_image_url} height={260} />
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', flex: 1, gap: 12 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {post.title}
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(post.tags || []).slice(0, 3).map(tag => <span className="tag" key={tag}>{tag}</span>)}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1 }}>
            {post.excerpt?.substring(0, 200)}
          </p>
          <Meta post={post} />
        </div>
      </article>
    </a>
  );
}

/* ── MEDIUM: right column / second row ─────────────────────── */
export function PostCardMedium({ post }) {
  return (
    <a href={`/post/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <article className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <CardImage url={post.featured_image_url} height={180} />
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.35 }}>
            {post.title}
          </h3>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(post.tags || []).slice(0, 2).map(tag => <span className="tag" key={tag}>{tag}</span>)}
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
            {post.excerpt?.substring(0, 110)}
          </p>
          <Meta post={post} />
        </div>
      </article>
    </a>
  );
}

/* ── COMPACT: bottom row small cards ────────────────────────── */
export function PostCardCompact({ post }) {
  return (
    <a href={`/post/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', height: '100%' }}>
      <article className="card" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <CardImage url={post.featured_image_url} height={130} />
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1, gap: 8 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.35, flex: 1 }}>
            {post.title}
          </h3>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(post.tags || []).slice(0, 2).map(tag => <span className="tag" key={tag}>{tag}</span>)}
          </div>
          <Meta post={post} />
        </div>
      </article>
    </a>
  );
}

/* ── default export (legacy / fallback) ─────────────────────── */
export default function PostCard({ post }) {
  return <PostCardCompact post={post} />;
}
