import { getCoverClass, getKicker, getReadTime, formatDate, toPublicUrl } from '@/lib/utils';

/* Cover div — CSS art pattern, real image layered on top if available */
function Cover({ post, height, index = 0 }) {
  const coverClass = getCoverClass(post, index);
  const kicker = getKicker(post);
  const imgSrc = toPublicUrl(post.featured_image_url);

  return (
    <div className={`cover ${coverClass}`} style={{ height }}>
      {imgSrc && (
        <img src={imgSrc} alt="" loading="lazy" />
      )}
      <span className="cover__tag">{kicker}</span>
    </div>
  );
}

function CardMeta({ post }) {
  return (
    <div className="card__meta">
      <span>{getReadTime(post)} min</span>
      <span className="dot-sep" />
      <span>{formatDate(post.published_at)}</span>
    </div>
  );
}

/* ── LARGE: 1.6fr column or featured bento slot ──────────────────────── */
export function PostCardLarge({ post, index = 0 }) {
  return (
    <article className="card">
      <Cover post={post} height={230} index={index} />
      <div className="card__body">
        <div className="card__tags">
          {(post.tags || []).slice(0, 3).map(tag => (
            <a key={tag} href={`/tag/${tag.toLowerCase()}`} className="chip">{tag}</a>
          ))}
        </div>
        <h3 className="card__title" style={{ fontSize: '1.4rem' }}>
          <a className="card__link" href={`/post/${post.slug}`}>{post.title}</a>
        </h3>
        <p className="card__excerpt">{post.excerpt?.slice(0, 160)}…</p>
        <CardMeta post={post} />
      </div>
    </article>
  );
}

/* ── MEDIUM: 1fr column ───────────────────────────────────────────────── */
export function PostCardMedium({ post, index = 0 }) {
  return (
    <article className="card">
      <Cover post={post} height={180} index={index} />
      <div className="card__body">
        <div className="card__tags">
          {(post.tags || []).slice(0, 2).map(tag => (
            <a key={tag} href={`/tag/${tag.toLowerCase()}`} className="chip">{tag}</a>
          ))}
        </div>
        <h3 className="card__title" style={{ fontSize: '1.05rem' }}>
          <a className="card__link" href={`/post/${post.slug}`}>{post.title}</a>
        </h3>
        <CardMeta post={post} />
      </div>
    </article>
  );
}

/* ── COMPACT: bottom-row small card ──────────────────────────────────── */
export function PostCardCompact({ post, index = 0 }) {
  return (
    <article className="card">
      <Cover post={post} height={120} index={index} />
      <div className="card__body" style={{ padding: '16px 18px', gap: 9 }}>
        <div className="card__tags">
          {(post.tags || []).slice(0, 1).map(tag => (
            <a key={tag} href={`/tag/${tag.toLowerCase()}`} className="chip">{tag}</a>
          ))}
        </div>
        <h3 className="card__title" style={{ fontSize: '0.96rem' }}>
          <a className="card__link" href={`/post/${post.slug}`}>{post.title}</a>
        </h3>
        <CardMeta post={post} />
      </div>
    </article>
  );
}

export default PostCardCompact;
