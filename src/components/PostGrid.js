'use client';

import { useState, useRef } from 'react';
import { PostCardLarge, PostCardMedium, PostCardCompact } from './PostCard';
import Pagination from './Pagination';

const PER_PAGE = 4;

export default function PostGrid({ posts }) {
  const [page, setPage] = useState(1);
  const topRef = useRef(null);

  const totalPages = Math.ceil(posts.length / PER_PAGE);
  const slice = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const [p0, p1, p2, p3, p4, p5, p6] = slice;

  const handlePageChange = (p) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div ref={topRef} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Row 1: Large (2/3) + Medium (1/3) */}
      {(p0 || p1) && (
        <div className="bento-row-1">
          {p0 && <PostCardLarge post={p0} />}
          {p1 && <PostCardMedium post={p1} />}
        </div>
      )}

      {/* Row 2: Medium (1/3) + Large (2/3) */}
      {(p2 || p3) && (
        <div className="bento-row-2">
          {p2 && <PostCardMedium post={p2} />}
          {p3 && <PostCardLarge post={p3} />}
        </div>
      )}

      {/* Row 3: Three compact cards */}
      {(p4 || p5 || p6) && (
        <div className="bento-row-3">
          {p4 && <PostCardCompact post={p4} />}
          {p5 && <PostCardCompact post={p5} />}
          {p6 && <PostCardCompact post={p6} />}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

    </div>
  );
}
