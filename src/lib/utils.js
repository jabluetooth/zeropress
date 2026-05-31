export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qvhlprtppakttxseqkgh.supabase.co';

export function toPublicUrl(url) {
  if (!url) return null;
  if (url.startsWith('http') && url.includes('/object/public/')) return url;
  if (url.startsWith('http') && url.includes('/storage/v1/object/')) {
    return url.replace('/storage/v1/object/', '/storage/v1/object/public/');
  }
  if (!url.startsWith('http')) {
    return `${SUPABASE_URL}/storage/v1/object/public/${url}`;
  }
  return url;
}

const COVER_COLORS = [
  'cover--1', 'cover--2', 'cover--3', 'cover--4',
  'cover--5', 'cover--6', 'cover--7', 'cover--8',
];
const COVER_PATTERNS = [
  'p-arc', 'p-dots', 'p-hatch', 'p-grid',
  'p-topo', 'p-bars', 'p-arc', 'p-dots',
];

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getCoverClass(post, fallbackIndex = 0) {
  const i = post?.slug ? hashStr(post.slug) % 8 : fallbackIndex % 8;
  return `${COVER_COLORS[i]} ${COVER_PATTERNS[i]}`;
}

const KICKER_MAP = {
  models: 'Field notes', inference: 'Deep dive', architecture: 'Analysis',
  cost: 'Analysis', ux: 'Essay', culture: 'Essay', agents: 'Opinion',
  evals: 'Guide', retrieval: 'Deep dive', prompting: 'Opinion',
  safety: 'Opinion', design: 'Essay', systems: 'Analysis', ops: 'Analysis',
};

export function getKicker(post) {
  if (!post.tags?.length) return 'Article';
  return KICKER_MAP[post.tags[0]?.toLowerCase()] || 'Article';
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function getReadTime(post) {
  return post.reading_time || Math.ceil((post.word_count || 0) / 250) || 5;
}
