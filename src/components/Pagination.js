'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const mouseX = useMotionValue(Infinity);

  const items = [
    { key: 'prev', label: '‹', onClick: () => page > 1 && onPageChange(page - 1), disabled: page === 1 },
    ...getPages().map((p, i) => ({
      key: p === '...' ? `ellipsis-${i}` : p,
      label: p,
      onClick: p === '...' ? null : () => onPageChange(p),
      active: p === page,
      ellipsis: p === '...',
    })),
    { key: 'next', label: '›', onClick: () => page < totalPages && onPageChange(page + 1), disabled: page === totalPages },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
      <motion.div
        onMouseMove={e => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 52 }}
      >
        {items.map(item =>
          item.ellipsis ? (
            <span key={item.key} style={{
              width: 36, height: 36, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', color: 'var(--text-muted)',
            }}>
              …
            </span>
          ) : (
            <DockItem
              key={item.key}
              mouseX={mouseX}
              label={item.label}
              onClick={item.onClick}
              disabled={item.disabled}
              active={item.active}
            />
          )
        )}
      </motion.div>
    </div>
  );
}

function DockItem({ mouseX, label, onClick, disabled, active }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, val => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(distance, [-80, 0, 80], [36, 52, 36]);
  const size = useSpring(sizeTransform, { stiffness: 300, damping: 28 });

  return (
    <motion.button
      ref={ref}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: 'none',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.875rem', fontFamily: 'inherit', fontWeight: active ? 700 : 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        background: active ? 'var(--accent)' : 'rgba(232, 232, 240, 0)',
        color: active ? '#fff' : 'var(--text-secondary)',
        flexShrink: 0,
      }}
      whileHover={!disabled && !active ? { background: 'var(--bg-elevated)' } : {}}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </motion.button>
  );
}
