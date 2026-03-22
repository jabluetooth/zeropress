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
        placeholder="Search topics..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="newsletter-input"
        style={{ marginBottom: 14 }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {filtered.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No topics found.</p>
        ) : (
          filtered.map(([tag, count]) => (
            <a key={tag} href={`/tag/${tag}`} className="tag" style={{ textDecoration: 'none' }}>
              {tag}
              <span style={{ opacity: 0.5, marginLeft: 4, fontSize: '0.7em' }}>{count}</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
