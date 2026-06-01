'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function escapeIlike(str) {
  return str.replace(/[%_\\]/g, c => `\\${c}`);
}

export default function SearchModal() {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive]   = useState(-1);
  const inputRef  = useRef(null);
  const timerRef  = useRef(null);
  const listRef   = useRef(null);

  // ⌘K / Ctrl+K toggle, Escape close
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus & reset on open/close
  useEffect(() => {
    if (open) { inputRef.current?.focus(); }
    else       { setQuery(''); setResults([]); setActive(-1); }
  }, [open]);

  // Debounced search
  const search = useCallback((q) => {
    clearTimeout(timerRef.current);
    if (!q.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    const safe = escapeIlike(q.trim());
    timerRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, tags, reading_time')
        .eq('status', 'published')
        .or(`title.ilike.%${safe}%,excerpt.ilike.%${safe}%`)
        .order('published_at', { ascending: false })
        .limit(8);
      setResults(data || []);
      setLoading(false);
      setActive(-1);
    }, 220);
  }, []);

  useEffect(() => {
    search(query);
    return () => clearTimeout(timerRef.current);
  }, [query, search]);

  // Arrow-key navigation
  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, -1));
    } else if (e.key === 'Enter' && active >= 0 && results[active]) {
      window.location.href = `/post/${results[active].slug}`;
    }
  }

  return (
    <>
      {/* Trigger */}
      <button
        className="zp-search"
        onClick={() => setOpen(true)}
        aria-label="Open search"
      >
        Search
        <kbd>⌘K</kbd>
      </button>

      {/* Modal */}
      {open && (
        <>
          <div className="search-backdrop" onClick={() => setOpen(false)} />
          <div className="search-modal" role="dialog" aria-modal="true" aria-label="Search">
            {/* Input row */}
            <div className="search-modal__bar">
              <svg className="search-modal__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                ref={inputRef}
                className="search-modal__input"
                placeholder="Search posts…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                spellCheck={false}
              />
              <button className="search-modal__esc" onClick={() => setOpen(false)}>Esc</button>
            </div>

            {/* Results */}
            <div className="search-modal__results" ref={listRef}>
              {!query && (
                <p className="search-modal__hint">Type to search posts…</p>
              )}
              {query && loading && (
                <p className="search-modal__hint">Searching…</p>
              )}
              {query && !loading && results.length === 0 && (
                <p className="search-modal__hint">No results for &ldquo;{query}&rdquo;</p>
              )}
              {results.map((post, i) => (
                <a
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className={`search-result${i === active ? ' search-result--active' : ''}`}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActive(i)}
                >
                  <div className="search-result__title">{post.title}</div>
                  {post.excerpt && (
                    <div className="search-result__excerpt">
                      {post.excerpt.slice(0, 110)}{post.excerpt.length > 110 ? '…' : ''}
                    </div>
                  )}
                  {(post.tags || []).length > 0 && (
                    <div className="search-result__tags">
                      {post.tags.slice(0, 3).map(t => (
                        <span key={t} className="chip" style={{ fontSize: '0.68rem', padding: '2px 9px', pointerEvents: 'none' }}>{t}</span>
                      ))}
                      {post.reading_time > 0 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--ink-3)', marginLeft: 'auto' }}>
                          {post.reading_time} min
                        </span>
                      )}
                    </div>
                  )}
                </a>
              ))}
            </div>

            {results.length > 0 && (
              <div className="search-modal__footer">
                <span><kbd>↑↓</kbd> navigate</span>
                <span><kbd>↵</kbd> open</span>
                <span><kbd>Esc</kbd> close</span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
