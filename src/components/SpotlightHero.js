'use client';

import { useRef, useEffect, useState } from 'react';
import { AuroraText } from './AuroraText';

export default function SpotlightHero() {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: '30%', y: '-20%' });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPos({ x: `${x}%`, y: `${y}%` });
    };

    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        marginBottom: 48,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        background: 'var(--bg-primary)',
      }}
      className="fade-in"
    >
      {/* Gridlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
      }} />

      {/* Mouse-tracking spotlight */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: `radial-gradient(600px circle at ${pos.x} ${pos.y}, rgba(0,0,0,0.07), transparent 70%)`,
        transition: 'background 0.05s ease',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '56px 48px' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          ⚡ AI-Curated Tech Insights
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
          <AuroraText>Research. Write. Publish.</AuroraText>
          <br />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.6em' }}>
            Automated content pipeline powered by AI
          </span>
        </h1>
      </div>
    </section>
  );
}
