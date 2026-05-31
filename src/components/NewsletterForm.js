'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('✓ You’re in. Check your inbox to confirm.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-bright)', display: 'inline-block' }} />
        <span className="eyebrow">The dispatch</span>
      </div>
      <h3 style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '1.18rem', letterSpacing: '-0.02em', lineHeight: 1.2, color: '#fff', marginBottom: 8 }}>
        One good read a week.
      </h3>
      <p style={{ fontSize: '0.86rem', marginBottom: 14, lineHeight: 1.6 }}>
        New posts, distilled. No noise, unsubscribe in one click.
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="nl-input"
          type="email"
          required
          placeholder="you@work.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className="btn btn--primary"
          disabled={status === 'loading'}
          style={{ opacity: status === 'loading' ? 0.7 : 1, whiteSpace: 'nowrap' }}
        >
          {status === 'loading' ? '…' : 'Subscribe'}
        </button>
      </div>

      {message && (
        <p className="nl-msg" style={{ color: status === 'error' ? 'var(--red)' : 'var(--accent-bright)' }}>
          {message}
        </p>
      )}
    </form>
  );
}
