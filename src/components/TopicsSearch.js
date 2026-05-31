'use client';
import { useState } from 'react';

export default function TopicsSearch({ tags }) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? tags.filter(([tag]) => tag.toLowerCase().includes(query.toLowerCase()))
    : tags;

  return (
    <div>
      <input
        type="text"
        placeholder="Filter topics…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          width: '100%', height: 36, padding: '0 12px',
          borderRadius: 'var(--r-pill)', border: '1px solid var(--line)',
          background: 'var(--surface-2)', fontFamily: 'var(--font)', fontSize: '0.85rem',
          color: 'var(--ink)', outline: 'none', marginBottom: 14,
          transition: 'border-color .18s, box-shadow .18s',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-tint)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.boxShadow = 'none'; }}
      />
      <div className="topics" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {filtered.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>No topics found.</p>
        ) : (
          filtered.map(([tag, count]) => (
            <a key={tag} href={`/tag/${tag.toLowerCase()}`} className="chip">
              {tag}
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--ink-3)' }}>
                {count}
              </span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
