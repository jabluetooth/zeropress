'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_KEY = 'zp_admin_token';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed]     = useState(false);
  const [authErr, setAuthErr]   = useState('');
  const [checking, setChecking] = useState(true);
  const [running, setRunning]   = useState(false);
  const [result, setResult]     = useState(null);
  const timerRef                = useRef(null);
  const router                  = useRouter();

  // Restore session from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
    setChecking(false);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setAuthErr('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
      });
      const data = await res.json();
      if (res.status === 429) { setAuthErr(data.error); return; }
      if (!res.ok) { setAuthErr(data.error || 'Wrong password.'); return; }
      sessionStorage.setItem(SESSION_KEY, password);
      setAuthed(true);
    } catch {
      setAuthErr('Network error — is the dev server running?');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPassword('');
    setResult(null);
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
      setResult({ ok: true, message: 'Workflow triggered — n8n is running. New post lands in ~2 min.' });
      timerRef.current = setTimeout(() => router.refresh(), 20000);
    } catch (err) {
      setResult({ ok: false, message: err.message });
    } finally {
      setRunning(false);
    }
  }

  if (checking) return null;

  // ── Login gate ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <a href="/" style={{ marginBottom: 40 }}>
          <img src="/logo.svg" alt="ZeroPress" style={{ height: 32, opacity: 0.6 }} />
        </a>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400 }}>
          <div className="card" style={{ padding: '48px 40px' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 12 }}>Admin access</span>
            <h1 style={{
              fontFamily: 'var(--display)', fontWeight: 600,
              fontSize: '1.75rem', letterSpacing: '-0.03em',
              marginBottom: 32, lineHeight: 1.1,
            }}>
              Pipeline<br />control
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--ink-3)', fontWeight: 500 }}>
                Admin password
              </label>
              <input
                type="password"
                className="nl-input"
                style={{ width: '100%' }}
                placeholder="Enter ADMIN_SECRET"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>

            {authErr && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--r-sm)',
                background: '#fef2f2', border: '1px solid var(--red)',
                fontSize: '0.82rem', color: 'var(--red)', marginBottom: 20,
              }}>
                {authErr}
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--block" style={{ height: 44 }}>
              Unlock
            </button>
          </div>

          <p className="pipeline-note" style={{ justifyContent: 'center', marginTop: 20 }}>
            Not linked from the public site
          </p>
        </form>
      </div>
    );
  }

  // ── Admin panel ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <a href="/">
            <img src="/logo.svg" alt="ZeroPress" style={{ height: 28, opacity: 0.6 }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="ai-badge">
              <span className="dot" />
              Authenticated
            </span>
            <button
              onClick={handleLogout}
              className="btn btn--ghost"
              style={{ height: 34, padding: '0 14px', fontSize: '0.8rem' }}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Main card */}
        <div className="card" style={{ padding: '40px 40px 36px' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: 12 }}>Pipeline control</span>
          <h1 style={{
            fontFamily: 'var(--display)', fontWeight: 600,
            fontSize: '1.75rem', letterSpacing: '-0.03em',
            marginBottom: 12, lineHeight: 1.1,
          }}>
            Generate new post
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 36 }}>
            Triggers an on-demand n8n run — picks a trending AI topic, writes a 1,500–2,500 word
            article, generates a cover image, and publishes it here automatically.
          </p>

          <button
            onClick={handleTrigger}
            disabled={running}
            className="btn btn--primary btn--block"
            style={{ height: 48, fontSize: '0.95rem', opacity: running ? 0.65 : 1, cursor: running ? 'not-allowed' : 'pointer' }}
          >
            {running ? 'Triggering…' : '⚡  Generate new post'}
          </button>

          {result && (
            <div style={{
              marginTop: 20, padding: '14px 18px', borderRadius: 'var(--r-sm)',
              background: result.ok ? 'var(--accent-tint)' : '#fef2f2',
              border: `1px solid ${result.ok ? 'var(--accent)' : 'var(--red)'}`,
              fontSize: '0.85rem', lineHeight: 1.5,
              color: result.ok ? 'var(--accent)' : 'var(--red)',
            }}>
              {result.message}
            </div>
          )}
        </div>

        <p className="pipeline-note" style={{ justifyContent: 'center', marginTop: 24 }}>
          Not linked from the public site
        </p>
      </div>
    </div>
  );
}
