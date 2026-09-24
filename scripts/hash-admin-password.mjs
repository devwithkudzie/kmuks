#!/usr/bin/env node
// Generates a value for ADMIN_PASSWORD_HASH.
// Usage: node scripts/hash-admin-password.mjs "your-password-here"

import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "your-password-here"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log(`scrypt:${salt}:${hash}`);
