import { supabase } from '@/lib/supabase';
import { parseHeadings } from '@/lib/parseHeadings';
import { getCoverClass, getKicker, getReadTime, formatDate, toPublicUrl } from '@/lib/utils';
import TableOfContents from '@/components/TableOfContents';
import ReadingProgress from '@/components/ReadingProgress';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from('posts')
    .select('title, meta_description, excerpt, featured_image_url')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !post) notFound();

  const { headings, modifiedHtml } = parseHeadings(post.body_html || '');

  const readTime = getReadTime(post);
  const date = formatDate(post.published_at);
  const coverClass = getCoverClass(post);
  const kicker = getKicker(post);
  const imgSrc = toPublicUrl(post.featured_image_url);

  // Related posts: same tag, different slug
  const { data: relatedRaw } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, tags, featured_image_url, published_at, reading_time, word_count')
    .eq('status', 'published')
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(20);

  const postTags = post.tags || [];
  const related = (relatedRaw || [])
    .filter(p => (p.tags || []).some(t => postTags.includes(t)))
    .slice(0, 3);
  const relPosts = related.length >= 3 ? related : (relatedRaw || []).slice(0, 3);

  return (
    <>
      <ReadingProgress />

      <article className="art fade-up">
        {/* Header */}
        <header className="art__head">
          <div className="art__tags">
            {(post.tags || []).map(tag => (
              <a key={tag} href={`/tag/${tag.toLowerCase()}`} className="chip">{tag}</a>
            ))}
          </div>
          <h1 className="art__title">{post.title}</h1>
          {post.excerpt && (
            <p className="art__dek">{post.excerpt}</p>
          )}
          <div className="byline">
            <span className="who">
              <span className="av">Z</span>
              ZeroPress Pipeline
            </span>
            <span className="dot-sep" />
            <span>{date}</span>
            <span className="dot-sep" />
            <span>{readTime} min read</span>
            {post.word_count > 0 && (
              <>
                <span className="dot-sep" />
                <span>{post.word_count?.toLocaleString()} words</span>
              </>
            )}
          </div>
        </header>

        {/* Cover art */}
        <div className={`cover ${coverClass} art__cover`}>
          {imgSrc && <img src={imgSrc} alt={post.title} />}
          <span className="cover__tag">{kicker}</span>
        </div>

        {/* Article grid: prose + TOC */}
        <div className={headings.length ? 'art__grid' : undefined}>
          <div className="prose-custom" dangerouslySetInnerHTML={{ __html: modifiedHtml }} />
          {headings.length > 0 && <TableOfContents headings={headings} />}
        </div>

        {/* Pipeline attribution */}
        <p className="pipeline-note">AI-drafted · human-edited</p>

        {/* End bar */}
        <div className="endbar">
          <div className="endbar__tags">
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.74rem', color: 'var(--ink-3)', marginRight: 4 }}>
              Filed under
            </span>
            {(post.tags || []).map(tag => (
              <a key={tag} href={`/tag/${tag.toLowerCase()}`} className="chip chip--accent">{tag}</a>
            ))}
          </div>
          <a className="btn btn--ghost" href="/">← All posts</a>
        </div>
      </article>

      {/* Related */}
      {relPosts.length > 0 && (
        <section className="related">
          <div className="related__inner">
            <div className="section-head" style={{ borderColor: 'var(--line-2)' }}>
              <span className="eyebrow">Keep reading</span>
              <span className="count">related by topic</span>
            </div>
            <div className="rel-grid">
              {relPosts.map((p, i) => {
                const rc = getCoverClass(p, i);
                const ri = toPublicUrl(p.featured_image_url);
                return (
                  <article key={p.id} className="card">
                    <div className={`cover ${rc}`} style={{ height: 150 }}>
                      {ri && <img src={ri} alt="" loading="lazy" />}
                      <span className="cover__tag">{getKicker(p)}</span>
                    </div>
                    <div className="card__body">
                      <div className="card__tags">
                        {(p.tags || []).slice(0, 2).map(t => (
                          <a key={t} href={`/tag/${t.toLowerCase()}`} className="chip">{t}</a>
                        ))}
                      </div>
                      <h3 className="card__title" style={{ fontSize: '1.05rem' }}>
                        <a className="card__link" href={`/post/${p.slug}`}>{p.title}</a>
                      </h3>
                      <div className="card__meta">
                        <span>{getReadTime(p)} min</span>
                        <span className="dot-sep" />
                        <span>{formatDate(p.published_at)}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
