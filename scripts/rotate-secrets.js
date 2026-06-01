#!/usr/bin/env node

/**
 * rotate-secrets.js
 * Generates new cryptographically secure keys and updates .env
 *
 * Usage:
 *   npm run rotate-secrets            — rotate all keys
 *   npm run rotate-secrets:api        — rotate API_SECRET_KEY + N8N_BEARER_TOKEN only
 *   npm run rotate-secrets:admin      — rotate ADMIN_SECRET only
 *   npm run rotate-secrets:preview    — show new keys without writing anything
 */

const { randomBytes }    = require('crypto');
const { readFileSync, writeFileSync, existsSync, copyFileSync } = require('fs');
const { join }           = require('path');

const ROOT      = join(__dirname, '..');
const ENV_PATH  = join(ROOT, '.env');
const BAK_PATH  = join(ROOT, '.env.bak');

const args      = process.argv.slice(2);
const preview   = args.includes('--preview');
const apiOnly   = args.includes('--api');
const adminOnly = args.includes('--admin');
const rotateAll = !apiOnly && !adminOnly;

// ── Helpers ────────────────────────────────────────────────────────────────

function generateKey(prefix) {
  return `${prefix}${randomBytes(24).toString('base64url')}`;
}

function replaceEnvValue(content, key, newValue) {
  const regex = new RegExp(`^(${key}=).*$`, 'm');
  if (!regex.test(content)) {
    console.warn(`  ⚠  Key "${key}" not found in .env — skipping`);
    return content;
  }
  return content.replace(regex, `$1${newValue}`);
}

// ── Main ───────────────────────────────────────────────────────────────────

console.log('\n🔑  ZeroPress Secret Rotator\n');

if (!existsSync(ENV_PATH)) {
  console.error('❌  .env file not found at', ENV_PATH);
  process.exit(1);
}

const original = readFileSync(ENV_PATH, 'utf8');
let updated = original;
const changes = [];

if (rotateAll || apiOnly) {
  const newApiKey = generateKey('zp_sk_');
  changes.push({ label: 'API_SECRET_KEY',   value: newApiKey });
  changes.push({ label: 'N8N_BEARER_TOKEN', value: newApiKey });
  if (!preview) {
    updated = replaceEnvValue(updated, 'API_SECRET_KEY',   newApiKey);
    updated = replaceEnvValue(updated, 'N8N_BEARER_TOKEN', newApiKey);
  }
}

if (rotateAll || adminOnly) {
  const newAdminSecret = generateKey('zp_admin_');
  changes.push({ label: 'ADMIN_SECRET', value: newAdminSecret });
  if (!preview) {
    updated = replaceEnvValue(updated, 'ADMIN_SECRET', newAdminSecret);
  }
}

// ── Preview mode ───────────────────────────────────────────────────────────

if (preview) {
  console.log('Preview — no files will be written:\n');
  changes.forEach(({ label, value }) => console.log(`  ${label.padEnd(22)} →  ${value}`));
  console.log('\nRun without --preview to apply.\n');
  process.exit(0);
}

// ── Write ──────────────────────────────────────────────────────────────────

copyFileSync(ENV_PATH, BAK_PATH);
console.log('✓  Backed up .env → .env.bak');

writeFileSync(ENV_PATH, updated, 'utf8');
console.log('✓  .env updated\n');

console.log('New values written:');
changes.forEach(({ label, value }) => console.log(`  ${label.padEnd(22)}  ${value}`));

// ── Reminders ──────────────────────────────────────────────────────────────

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ACTION REQUIRED — update these external services:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

if (rotateAll || apiOnly) {
  console.log(`  1. n8n → Credentials → ZeroPress (Header Auth)
      Name:  Authorization
      Value: Bearer <new API_SECRET_KEY>

  2. n8n → Credentials → ZeroPress (HTTP Bearer Auth)
      Token: <new API_SECRET_KEY>

  3. Vercel → Project Settings → Environment Variables
      API_SECRET_KEY   = <new value>
      N8N_BEARER_TOKEN = <new value>
`);
}

if (rotateAll || adminOnly) {
  const num = rotateAll ? 4 : 1;
  console.log(`  ${num}. Vercel → Project Settings → Environment Variables
      ADMIN_SECRET = <new value>
`);
}

console.log('Restart your dev server for the new keys to take effect.\n');
