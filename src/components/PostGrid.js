import { PostCardLarge, PostCardMedium, PostCardCompact } from './PostCard';

export default function PostGrid({ posts }) {
  const [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9] = posts;

  return (
    <div className="bento stagger">
      {(p0 || p1) && (
        <div className="bento__row2">
          {p0 && <PostCardLarge post={p0} index={0} />}
          {p1 && <PostCardMedium post={p1} index={1} />}
        </div>
      )}
      {(p2 || p3) && (
        <div className="bento__row2 rev">
          {p2 && <PostCardMedium post={p2} index={2} />}
          {p3 && <PostCardLarge post={p3} index={3} />}
        </div>
      )}
      {(p4 || p5 || p6) && (
        <div className="bento__row3">
          {p4 && <PostCardCompact post={p4} index={4} />}
          {p5 && <PostCardCompact post={p5} index={5} />}
          {p6 && <PostCardCompact post={p6} index={6} />}
        </div>
      )}
      {(p7 || p8 || p9) && (
        <div className="bento__row3">
          {p7 && <PostCardCompact post={p7} index={7} />}
          {p8 && <PostCardCompact post={p8} index={8} />}
          {p9 && <PostCardCompact post={p9} index={9} />}
        </div>
      )}
    </div>
  );
}
