'use client';
import { useEffect, useRef, useState } from 'react';

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? null);
  const suppressRef = useRef(false);

  useEffect(() => {
    if (!headings.length) return;

    const onScroll = () => {
      if (suppressRef.current) return;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (atBottom) { setActiveId(headings[headings.length - 1].id); return; }

      const threshold = window.scrollY + 100;
      let cur = headings[0].id;
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= threshold) cur = id;
      }
      setActiveId(cur);
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
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
    setTimeout(() => { suppressRef.current = false; }, 800);
  };

  if (!headings.length) return null;

  return (
    <nav className="toc">
      <p className="toc__label">On this page</p>
      {headings.map(({ id, text, level }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => handleClick(e, id)}
          className={`${level === 3 ? 'lvl3' : ''} ${activeId === id ? 'active' : ''}`}
        >
          {text}
        </a>
      ))}
    </nav>
  );
}
