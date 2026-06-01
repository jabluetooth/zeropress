export const metadata = {
  title: 'About',
  description: 'How ZeroPress works — the AI pipeline behind the posts, the editorial policy, and the tech stack.',
};

export default function AboutPage() {
  return (
    <div className="home">

      {/* Header */}
      <header className="tag-head fade-up">
        <a className="tag-head__back" href="/">← All posts</a>
        <h1>About ZeroPress</h1>
        <div className="tag-head__sub">
          <span className="tag-head__desc" style={{ maxWidth: '52ch' }}>
            An AI-powered publishing pipeline for applied machine learning — researched, drafted,
            and published automatically, with a human in the loop.
          </span>
        </div>
      </header>

      <div className="main" style={{ marginTop: 0 }}>

        {/* Main content */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* What is it */}
          <div className="card" style={{ padding: '36px 40px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>What this is</span>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 16 }}>
              A blog written by a pipeline
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: 1.75, marginBottom: 14 }}>
              ZeroPress is an experiment in automated publishing. Every post starts as a signal — a trending
              paper, a shipping announcement, a shift in how practitioners are talking about a topic — and
              an n8n workflow picks it up, researches it, and drafts a full article using Claude.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: 1.75 }}>
              The goal is depth without the bottleneck of a solo writer. The pipeline handles the
              research load; a human editor checks claims, trims filler, and keeps the voice honest.
            </p>
          </div>

          {/* How the pipeline works */}
          <div className="card" style={{ padding: '36px 40px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>The pipeline</span>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 24 }}>
              How a post gets made
            </h2>

            {[
              { n: '01', title: 'Signal detection', body: 'The workflow monitors sources — arXiv, Hacker News, GitHub trending, and curated RSS feeds — scoring items by relevance and novelty against the topics this blog covers.' },
              { n: '02', title: 'Research pass', body: 'For high-scoring items, Claude pulls related context: prior work, implementation details, community reception. The goal is enough depth to say something non-obvious.' },
              { n: '03', title: 'Drafting', body: 'The draft is written to a brief: a clear thesis, concrete examples, honest trade-offs. Long-form, not a summary. The pipeline targets 1,000–2,000 words per piece.' },
              { n: '04', title: 'Review & publish', body: 'A human editor reads the draft for factual errors, weasel words, and slop. Approved posts are published directly to Supabase and appear here within minutes.' },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '0.72rem', fontWeight: 600,
                  color: 'var(--accent-bright)', background: 'var(--accent-tint)',
                  border: '1px solid var(--accent)', borderRadius: 8,
                  padding: '4px 8px', height: 'fit-content', flexShrink: 0, marginTop: 2,
                }}>{n}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.05rem', letterSpacing: '-0.01em', marginBottom: 6 }}>{title}</h3>
                  <p style={{ color: 'var(--ink-2)', lineHeight: 1.7, fontSize: '0.95rem' }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Editorial policy */}
          <div className="card" style={{ padding: '36px 40px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>Editorial policy</span>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 16 }}>
              What the pipeline won&apos;t do
            </h2>
            <ul style={{ color: 'var(--ink-2)', lineHeight: 1.8, paddingLeft: 20, fontSize: '0.95rem' }}>
              <li style={{ marginBottom: 10 }}>Publish without a human review pass — every post is read before it goes live.</li>
              <li style={{ marginBottom: 10 }}>Fabricate citations — all references are verified or removed.</li>
              <li style={{ marginBottom: 10 }}>Chase engagement with low-effort takes — the pipeline scores for novelty, not virality.</li>
              <li>Pretend to be a human author — posts are clearly labelled as pipeline-generated.</li>
            </ul>
          </div>

        </section>

        {/* Sidebar */}
        <aside className="sidebar">

          {/* Stack */}
          <div className="panel">
            <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>Tech stack</span>
            {[
              { label: 'Orchestration', value: 'n8n' },
              { label: 'AI model', value: 'Claude (Anthropic)' },
              { label: 'Database', value: 'Supabase (Postgres)' },
              { label: 'Frontend', value: 'Next.js 15 (App Router)' },
              { label: 'Hosting', value: 'Vercel' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '10px 0', borderBottom: '1px solid var(--line)',
                fontSize: '0.88rem',
              }}>
                <span style={{ color: 'var(--ink-3)' }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Topics */}
          <div className="panel">
            <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>Topics covered</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Models', 'Inference', 'Agents', 'Evals', 'Retrieval', 'Prompting', 'Architecture', 'Safety', 'Ops'].map(t => (
                <a key={t} href={`/tag/${t.toLowerCase()}`} className="chip">{t}</a>
              ))}
            </div>
          </div>

          <p className="pipeline-note">This page was written by a human.</p>
        </aside>
      </div>
    </div>
  );
}
