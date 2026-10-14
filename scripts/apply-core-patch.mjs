#!/usr/bin/env node
// Re-applies this project's customisations of @open-slide/core (folder
// password protection, always-visible "New folder", create-a-folder from the
// Move dialog). node_modules is rebuilt by every `npm install` / `npm ci`, so
// run this afterwards:
//
//   node scripts/apply-core-patch.mjs
//
// Safe to run twice: an already-applied patch is detected and skipped.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG_DIR = 'node_modules/@open-slide/core';
const PATCH = 'patches/open-slide-core-2.0.1-folders.patch';
const EXPECTED_VERSION = '2.0.1';

const { version } = JSON.parse(readFileSync(join(ROOT, PKG_DIR, 'package.json'), 'utf8'));
if (version !== EXPECTED_VERSION) {
  console.error(
    `@open-slide/core is ${version}, but ${PATCH} was made for ${EXPECTED_VERSION}.\n` +
      'Re-create the patch for the new version (or pin the old one) before building.',
  );
  process.exit(1);
}

const gitApply = (...args) =>
  // autocrlf off: npm ships LF files, so keep them LF on Windows too.
  execFileSync(
    'git',
    ['-c', 'core.autocrlf=false', 'apply', '-p1', `--directory=${PKG_DIR}`, ...args, PATCH],
    { cwd: ROOT, stdio: 'pipe' },
  );

try {
  gitApply('--reverse', '--check');
  console.log('open-slide core patch: already applied.');
  process.exit(0);
} catch {}

try {
  gitApply();
  console.log('open-slide core patch: applied.');
} catch (err) {
  console.error('open-slide core patch: failed to apply.\n' + String(err.stderr ?? err));
  process.exit(1);
}
