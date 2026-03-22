export function parseHeadings(html) {
  const headings = [];
  const idCount = {};

  const modifiedHtml = html.replace(/<h([1-6])([^>]*?)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, content) => {
    const lvl = parseInt(level);
    if (lvl < 2 || lvl > 4) return match;

    const text = content.replace(/<[^>]+>/g, '').trim();
    if (!text) return match;

    let id = text
      .toLowerCase()
      .replace(/&[a-z]+;/g, ' ')       // strip HTML entities like &amp;
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      || `heading-${headings.length}`;

    if (idCount[id] !== undefined) {
      idCount[id]++;
      id = `${id}-${idCount[id]}`;
    } else {
      idCount[id] = 0;
    }

    // Strip any existing id attribute so ours takes effect
    const cleanAttrs = attrs
      .replace(/\s+id="[^"]*"/gi, '')
      .replace(/\s+id='[^']*'/gi, '');

    headings.push({ id, text, level: lvl });
    return `<h${level}${cleanAttrs} id="${id}">${content}</h${level}>`;
  });

  return { headings, modifiedHtml };
}
