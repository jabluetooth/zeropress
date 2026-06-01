#!/usr/bin/env node
const { randomBytes } = require('crypto');

const prefix = process.argv[2] || 'zp_sk_';
const key = `${prefix}${randomBytes(24).toString('base64url')}`;

console.log(key);
