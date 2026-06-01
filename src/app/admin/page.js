'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed]     = useState(false);
  const [authErr, setAuthErr]   = useState('');
  const [running, setRunning]   = useState(false);
  const [result, setResult]     = useState(null);
  const timerRef                = useRef(null);
  const router                  = useRouter();

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setAuthErr('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
      });
      if (res.status === 401) { setAuthErr('Wrong password.'); return; }
      if (!res.ok) { setAuthErr('Server error — check the console.'); return; }
      setAuthed(true);
    } catch {
      setAuthErr('Network error — is the dev server running?');
    }
  }

  async function handleTrigger() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch('/api/trigger-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify({ action: 'generate-post', timestamp: new Date().toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult({ ok: true, message: 'n8n received the trigger — workflow is running. Check your n8n execution history.' });
      timerRef.current = setTimeout(() => router.refresh(), 20000);
    } catch (err) {
      setResult({ ok: false, message: `Failed: ${err.message}` });
    } finally {
      setRunning(false);
    }
  }

  // ── Login gate ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 380 }}>
          <div className="card" style={{ padding: '40px 36px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 10 }}>Admin</span>
            <h1 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 24 }}>
              Pipeline control
            </h1>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ink-3)', marginBottom: 8 }}>
              API secret key
            </label>
            <input
              type="password"
              className="nl-input"
              style={{ width: '100%', marginBottom: 12 }}
              placeholder="Enter API_SECRET_KEY"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              required
            />
            {authErr && (
              <p style={{ fontSize: '0.82rem', color: 'var(--red)', marginBottom: 12 }}>{authErr}</p>
            )}
            <button type="submit" className="btn btn--primary btn--block">
              Unlock
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── Admin panel ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div className="card" style={{ padding: '40px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="eyebrow">Admin</span>
            <span className="ai-badge" style={{ marginLeft: 'auto' }}>
              <span className="dot" />
              Authenticated
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Pipeline control
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: '0.88rem', marginBottom: 28 }}>
            Trigger an on-demand run. n8n will pick a trending AI topic, write a post,
            generate a cover image, and publish it here automatically.
          </p>

          <button
            onClick={handleTrigger}
            disabled={running}
            className="btn btn--primary btn--block"
            style={{ opacity: running ? 0.65 : 1, cursor: running ? 'not-allowed' : 'pointer' }}
          >
            {running ? 'Triggering…' : '⚡ Generate new post'}
          </button>

          {result && (
            <div style={{
              marginTop: 16, padding: '14px 16px', borderRadius: 'var(--r-sm)',
              background: result.ok ? 'var(--accent-tint)' : '#fef2f2',
              border: `1px solid ${result.ok ? 'var(--accent)' : 'var(--red)'}`,
              fontSize: '0.85rem',
              color: result.ok ? 'var(--accent)' : 'var(--red)',
            }}>
              {result.message}
            </div>
          )}
        </div>

        <p className="pipeline-note" style={{ justifyContent: 'center', marginTop: 20 }}>
          Not linked from the public site
        </p>
      </div>
    </div>
  );
}
