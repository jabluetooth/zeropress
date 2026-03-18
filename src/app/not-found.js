export default function NotFound() {
  return (
    <div style={{
      maxWidth: 500, margin: '0 auto', padding: '120px 24px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: 16 }} className="glow-text">
        404
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 32 }}>
        This page doesn&apos;t exist yet. Maybe the AI will write it soon.
      </p>
      <a href="/" className="btn-primary">&larr; Back to home</a>
    </div>
  );
}
