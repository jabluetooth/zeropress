export const metadata = {
  title: 'About',
  description: 'How ZeroPress works — the n8n pipeline behind every post, from trend detection to newsletter delivery.',
};

export default function AboutPage() {
  return (
    <div className="home">

      {/* Header */}
      <header className="tag-head fade-up">
        <a className="tag-head__back" href="/">← All posts</a>
        <h1>About ZeroPress</h1>
        <div className="tag-head__sub">
          <span className="tag-head__desc" style={{ maxWidth: '56ch' }}>
            A zero-touch AI publishing platform — 37 nodes, 4 data sources, 3 AI models,
            and 6 integrations that research, write, illustrate, publish, and distribute
            every post with no human in the loop.
          </span>
        </div>
      </header>

      <div className="main" style={{ marginTop: 0 }}>

        {/* Main content */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* What it is */}
          <div className="card" style={{ padding: '36px 40px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>What this is</span>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 16 }}>
              A blog run entirely by a pipeline
            </h2>
            <p style={{ color: 'var(--ink-2)', lineHeight: 1.75, marginBottom: 14 }}>
              ZeroPress is an end-to-end automated publishing system built in n8n. Every six hours it
              scans four independent data sources, scores trending topics in AI, picks the best one,
              researches it with live Google Search, writes a 1,500–2,500 word article, generates a
              cover image, publishes it here, emails subscribers, and logs the run to a spreadsheet —
              automatically.
            </p>
            <p style={{ color: 'var(--ink-2)', lineHeight: 1.75 }}>
              The entire stack runs on free tiers. Total infrastructure cost: $0/month.
            </p>
          </div>

          {/* Pipeline stages */}
          <div className="card" style={{ padding: '36px 40px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>The pipeline</span>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 28 }}>
              9 stages, start to finish
            </h2>

            {[
              {
                n: '01',
                title: 'Trigger & configuration',
                body: 'A webhook fires on-demand or the schedule trigger runs every 6 hours. A single config node sets the niche, brand voice, audience, source feeds, and quality thresholds — changing it here propagates to every downstream prompt automatically.',
              },
              {
                n: '02',
                title: 'Multi-source intelligence gathering',
                body: '4 parallel branches collect signals simultaneously: RSS feeds (TechCrunch AI, Ars Technica, Synced Review, Import AI), Reddit hot posts (r/LocalLLaMA, r/MachineLearning, r/singularity), Google Trends via SerpAPI, and the Mastodon #ai public timeline. Each source is normalized to a common schema.',
              },
              {
                n: '03',
                title: 'Deduplication & ranking',
                body: 'All branches merge into a single stream. Fuzzy deduplication by normalized title removes cross-source overlaps, then a composite score (raw signal + capped engagement bonus) ranks the survivors. The top 15 topics move forward.',
              },
              {
                n: '04',
                title: 'AI topic selection & safety gate',
                body: 'Groq (Llama 3.3 70B) evaluates all 15 candidates and returns structured JSON: selected topic, unique angle, search queries, SEO keywords, interest score, and a safety classification. An IF node enforces two hard gates — brand_safety ≠ "unsafe" and interest_score ≥ 40 — before anything continues.',
              },
              {
                n: '05',
                title: 'Live SERP research',
                body: '3 parallel SerpAPI Google queries run using the AI-generated search terms. Organic results and "People Also Ask" questions are deduplicated and aggregated into up to 20 unique research items that ground the article in real data.',
              },
              {
                n: '06',
                title: 'Content generation — 3 parallel tracks',
                body: 'Track A: Groq writes a 1,500–2,500 word SEO article in HTML, grounded in the SERP research. Track B: Groq generates a Twitter thread, LinkedIn post, Instagram caption, newsletter subject, and newsletter body — with [LINK] placeholders. Track C: Hugging Face FLUX.1-schnell generates the cover image from a keyword-derived prompt in 4 inference steps.',
              },
              {
                n: '07',
                title: 'Duplicate check & publishing',
                body: 'Before publishing, the pipeline checks Supabase for an existing post with the same slug. If new, it POSTs to the ZeroPress API (Next.js on Vercel) with Bearer token auth. The API returns the live URL, which is immediately injected into all [LINK] placeholders across the social content.',
              },
              {
                n: '08',
                title: 'Newsletter distribution',
                body: 'Active subscribers are fetched from Supabase. If the list is non-empty, Brevo\'s transactional API delivers an HTML email with the headline, summary, and a CTA button linking to the published post. Skipped automatically if there are no subscribers yet.',
              },
              {
                n: '09',
                title: 'Analytics & logging',
                body: 'Every execution — successful or skipped — appends a row to a Google Sheet: run_id, timestamp, topic, headline, slug, post URL, Brevo message ID, and status. Both the publish path and the duplicate-skip path feed into this node, so no run goes untracked.',
              },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '0.72rem', fontWeight: 600,
                  color: 'var(--accent-bright)', background: 'var(--accent-tint)',
                  border: '1px solid var(--accent)', borderRadius: 8,
                  padding: '4px 8px', height: 'fit-content', flexShrink: 0, marginTop: 2,
                }}>{n}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.02rem', letterSpacing: '-0.01em', marginBottom: 6 }}>{title}</h3>
                  <p style={{ color: 'var(--ink-2)', lineHeight: 1.7, fontSize: '0.93rem' }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Editorial policy */}
          <div className="card" style={{ padding: '36px 40px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>Editorial policy</span>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 16 }}>
              What the pipeline won&apos;t publish
            </h2>
            <ul style={{ color: 'var(--ink-2)', lineHeight: 1.8, paddingLeft: 20, fontSize: '0.95rem' }}>
              <li style={{ marginBottom: 10 }}>Topics flagged as <code style={{ fontFamily: 'var(--mono)', fontSize: '0.85em', background: 'var(--paper-2)', padding: '1px 5px', borderRadius: 4 }}>unsafe</code> by the AI safety gate — these are dropped before any content is generated.</li>
              <li style={{ marginBottom: 10 }}>Topics scoring below the interest threshold — low-signal items are silently skipped and logged.</li>
              <li style={{ marginBottom: 10 }}>Duplicate slugs — the pipeline checks Supabase before publishing and skips if the article already exists.</li>
              <li>Posts without a generated image — FLUX runs before publish; the pipeline waits for all three content tracks to merge before continuing.</li>
            </ul>
          </div>

        </section>

        {/* Sidebar */}
        <aside className="sidebar">

          {/* Stats */}
          <div className="panel panel--ink">
            <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>Pipeline stats</span>
            {[
              { label: 'n8n nodes', value: '37' },
              { label: 'Data sources', value: '4' },
              { label: 'AI models', value: '3' },
              { label: 'Integrations', value: '6' },
              { label: 'Cadence', value: 'Every 6 hours' },
              { label: 'Cost', value: '$0 / month' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.88rem',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-bright)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div className="panel">
            <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>Tech stack</span>
            {[
              { label: 'Orchestration', value: 'n8n' },
              { label: 'LLM', value: 'Groq · Llama 3.3 70B' },
              { label: 'Image gen', value: 'FLUX.1-schnell (HF)' },
              { label: 'Research', value: 'SerpAPI' },
              { label: 'Database', value: 'Supabase (Postgres)' },
              { label: 'Frontend', value: 'Next.js · Vercel' },
              { label: 'Email', value: 'Brevo' },
              { label: 'Logging', value: 'Google Sheets' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '10px 0', borderBottom: '1px solid var(--line)',
                fontSize: '0.88rem',
              }}>
                <span style={{ color: 'var(--ink-3)' }}>{label}</span>
                <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Data sources */}
          <div className="panel">
            <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>Data sources</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['RSS feeds', 'Reddit', 'Google Trends', 'Mastodon'].map(s => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>

          <p className="pipeline-note">This page was written by a human.</p>

        </aside>
      </div>
    </div>
  );
}
