import { supabase } from '@/lib/supabase';
import { parseHeadings } from '@/lib/parseHeadings';
import TableOfContents from '@/components/TableOfContents';
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

  const readTime = post.reading_time || Math.ceil((post.word_count || 0) / 250);
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const { headings, modifiedHtml } = parseHeadings(post.body_html || '');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }} className="fade-in">
      <div style={{
        display: 'grid',
        gridTemplateColumns: headings.length ? '1fr 220px' : '1fr',
        gap: 48,
        alignItems: 'start',
      }}>

        {/* Main article */}
        <article>
          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {(post.tags || []).map(tag => (
              <a key={tag} href={`/tag/${tag}`} className="tag">{tag}</a>
            ))}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            lineHeight: 1.15, marginBottom: 20,
            color: 'var(--text-primary)',
          }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            fontSize: '0.85rem', color: 'var(--text-muted)',
            marginBottom: 32, paddingBottom: 32,
            borderBottom: '1px solid var(--border)',
          }}>
            <span>{date}</span>
            <span>&middot;</span>
            <span>{readTime} min read</span>
            <span>&middot;</span>
            <span>{post.word_count?.toLocaleString()} words</span>
          </div>

          {/* Featured image */}
          {post.featured_image_url && (
            <div style={{
              width: '100%', height: 400, borderRadius: 12, marginBottom: 40,
              backgroundImage: `url(${post.featured_image_url})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: '1px solid var(--border)',
            }} />
          )}

          {/* Body */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: modifiedHtml }}
          />

          {/* Bottom nav */}
          <div style={{
            marginTop: 64, paddingTop: 32,
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <a href="/" className="btn-primary">
              ← Back to all posts
            </a>
          </div>
        </article>

        {/* TOC sidebar */}
        {headings.length > 0 && <TableOfContents headings={headings} />}
      </div>
    </div>
  );
}
