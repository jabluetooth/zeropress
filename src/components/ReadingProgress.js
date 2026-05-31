'use client';
import { useEffect, useRef } from 'react';

export default function ReadingProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    function update() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = max > 0 ? (h.scrollTop / max * 100) + '%' : '0%';
    }

    document.addEventListener('scroll', update, { passive: true });
    update();
    return () => document.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed', top: 0, left: 0, height: 3, width: '0%',
        zIndex: 200,
        background: 'linear-gradient(90deg, var(--accent), var(--accent-bright))',
        transition: 'width .08s linear',
        pointerEvents: 'none',
      }}
    />
  );
}
