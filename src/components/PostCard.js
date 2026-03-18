'use client';

export default function PostCard({ post }) {
  const readTime = post.reading_time || Math.ceil((post.word_count || 0) / 250);
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  return (
    <a href={`/post/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article className="card fade-in" style={{ padding: '24px 28px', display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            {(post.tags || []).slice(0, 3).map(tag => (
              <span className="tag" key={tag}>{tag}</span>
            ))}
          </div>
          <h3 style={{
            fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)',
            marginBottom: 8, letterSpacing: '-0.01em', lineHeight: 1.35,
          }}>
            {post.title}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
            {post.excerpt?.substring(0, 160)}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{readTime} min read</span>
            {date && <><span>&middot;</span><span>{date}</span></>}
          </div>
        </div>
        {post.featured_image_url && (
          <div style={{
            width: 140, height: 100, borderRadius: 8, flexShrink: 0,
            backgroundImage: `url(${post.featured_image_url})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
        )}
      </article>
    </a>
  );
}
