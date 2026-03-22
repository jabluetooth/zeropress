'use client';

import { useEffect, useRef, useState } from 'react';

const NAVBAR_HEIGHT = 88;

function getDocumentTop(el) {
  return el.getBoundingClientRect().top + window.scrollY;
}

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? null);
  const suppressRef = useRef(false);

  useEffect(() => {
    if (!headings.length) return;

    const onScroll = () => {
      if (suppressRef.current) return;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;

      if (atBottom) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      const threshold = window.scrollY + NAVBAR_HEIGHT + 8;
      let current = headings[0].id;
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && getDocumentTop(el) <= threshold) {
          current = id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    suppressRef.current = true;
    setActiveId(id);
    window.scrollTo({ top: getDocumentTop(el) - NAVBAR_HEIGHT, behavior: 'smooth' });
    setTimeout(() => { suppressRef.current = false; }, 800);
  };

  if (!headings.length) return null;

  return (
    <aside style={{
      position: 'sticky',
      top: 96,
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
      padding: '20px 0',
    }}>
      <p style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 12,
        paddingLeft: 12,
      }}>
        On this page
      </p>
      <nav>
        {headings.map(({ id, text, level }) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              style={{
                display: 'block',
                paddingLeft: level === 3 ? 24 : 12,
                paddingTop: 6,
                paddingBottom: 6,
                paddingRight: 12,
                fontSize: '0.8rem',
                lineHeight: 1.4,
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                transition: 'color 0.2s, border-color 0.2s',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
