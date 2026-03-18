export default function TagCloud({ tags }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tags.map(([tag, count]) => (
        <a key={tag} href={`/tag/${tag}`} className="tag" style={{ textDecoration: 'none' }}>
          {tag} <span style={{ opacity: 0.6, marginLeft: 4 }}>{count}</span>
        </a>
      ))}
    </div>
  );
}
