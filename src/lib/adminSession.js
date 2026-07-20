import { createHmac, timingSafeEqual } from 'crypto';

const TTL_MS = 30 * 60 * 1000; // 30 minutes

function sign(expiresAt, secret) {
  return createHmac('sha256', secret).update(String(expiresAt)).digest('hex');
}

// Opaque, short-lived token derived from ADMIN_SECRET — lets the browser hold
// something other than the root credential itself after login.
export function issueSessionToken(secret) {
  const expiresAt = Date.now() + TTL_MS;
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function verifySessionToken(token, secret) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [expiresAtRaw, sig] = token.split('.');
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expected = sign(expiresAt, secret);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}
