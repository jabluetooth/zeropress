'use client';

import { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

export default function EncryptedText({ text, className, style, speed = 30, revealDelay = 5 }) {
  const [displayed, setDisplayed] = useState(text);
  const intervalRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    const chars = text.split('');

    intervalRef.current = setInterval(() => {
      frame++;
      const resolved = Math.floor(frame / revealDelay);
      const next = chars.map((char, i) => {
        if (char === ' ') return ' ';
        if (i < resolved) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });
      setDisplayed(next.join(''));

      if (resolved >= chars.length) {
        clearInterval(intervalRef.current);
        setDisplayed(text);
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text, speed, revealDelay]);

  return (
    <span className={className} style={{ fontFamily: 'inherit', ...style }}>
      {displayed}
    </span>
  );
}
