'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
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
        setMessage('You\u2019re in! Check your inbox.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Try again.');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ padding: '16px 0', textAlign: 'center' }}>
        <span style={{ fontSize: '1.5rem' }}>\u2705</span>
        <p style={{ fontSize: '0.875rem', color: 'var(--green)', marginTop: 8, fontWeight: 500 }}>{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="newsletter-input"
        required
      />
      <button
        type="submit"
        className="btn-primary"
        disabled={status === 'loading'}
        style={{ justifyContent: 'center', width: '100%', opacity: status === 'loading' ? 0.7 : 1 }}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p style={{ fontSize: '0.8rem', color: 'var(--rose)' }}>{message}</p>
      )}
    </form>
  );
}
