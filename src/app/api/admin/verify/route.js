import { NextResponse } from 'next/server';
import { timingSafeEqual, createHash } from 'crypto';

// Simple in-memory rate limiter — max 5 attempts per IP per 15 min window
const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function getRateLimit(ip) {
  const now = Date.now();
  const entry = attempts.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + WINDOW_MS; }
  return entry;
}

function safeCompare(a, b) {
  try {
    const ha = createHash('sha256').update(a).digest();
    const hb = createHash('sha256').update(b).digest();
    return timingSafeEqual(ha, hb);
  } catch {
    return false;
  }
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const entry = getRateLimit(ip);

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} min.` },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') ?? '';

  if (!safeCompare(token, adminSecret)) {
    entry.count++;
    attempts.set(ip, entry);
    const remaining = MAX_ATTEMPTS - entry.count;
    return NextResponse.json(
      { error: `Wrong password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` },
      { status: 401 }
    );
  }

  // Success — reset counter
  attempts.delete(ip);
  return NextResponse.json({ ok: true });
}
