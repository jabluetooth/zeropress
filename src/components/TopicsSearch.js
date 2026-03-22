'use client';

import { useState, useEffect } from 'react';

const MOBILE_LIMIT = 3;

export default function TopicsSearch({ tags }) {
  const [query, setQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handle = (e) => setIsMobile(e.matches);
    handle(mq);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  const filtered = query.trim()
    ? tags.filter(([tag]) => tag.toLowerCase().includes(query.toLowerCase()))
    : tags;

  const visible = isMobile && !showAll ? filtered.slice(0, MOBILE_LIMIT) : filtered;
  const hasMore = isMobile && filtered.length > MOBILE_LIMIT;

  return (
    <div>
      <input
        type="text"
        placeholder="Search topics..."
        value={query}
        onChange={e => { setQuery(e.target.value); setShowAll(false); }}
        className="newsletter-input"
        style={{ marginBottom: 14 }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {filtered.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No topics found.</p>
        ) : (
          visible.map(([tag, count]) => (
            <a key={tag} href={`/tag/${encodeURIComponent(tag.toLowerCase())}`} className="tag" style={{ textDecoration: 'none' }}>
              {tag}
              <span style={{ opacity: 0.5, marginLeft: 4, fontSize: '0.7em' }}>{count}</span>
            </a>
          ))
        )}
      </div>
      {hasMore && (
        <button
          onClick={() => setShowAll(v => !v)}
          style={{
            marginTop: 10, background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'inherit', fontWeight: 500, padding: 0,
          }}
        >
          {showAll ? 'Show less' : `Show all ${filtered.length} topics`}
        </button>
      )}
    </div>
  );
}
