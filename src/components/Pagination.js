'use client';

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

  const btnBase = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)',
    background: 'transparent', cursor: 'pointer', fontSize: '0.875rem',
    fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.15s',
    color: 'var(--text-secondary)', padding: '0 6px',
  };

  const activeBtn = {
    ...btnBase,
    background: 'var(--accent)', color: 'var(--bg-primary)',
    border: '1px solid var(--accent)', fontWeight: 700,
  };

  const disabledBtn = {
    ...btnBase, opacity: 0.3, cursor: 'not-allowed',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 24 }}>

      {/* Previous */}
      <button
        style={page === 1 ? disabledBtn : btnBase}
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
      >
        ‹
      </button>

      {/* Page numbers */}
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} style={{ ...btnBase, border: 'none', cursor: 'default', color: 'var(--text-muted)' }}>
            …
          </span>
        ) : (
          <button
            key={p}
            style={p === page ? activeBtn : btnBase}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        style={page === totalPages ? disabledBtn : btnBase}
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        ›
      </button>

    </div>
  );
}
