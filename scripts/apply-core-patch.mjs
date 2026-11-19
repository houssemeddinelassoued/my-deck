#!/usr/bin/env node
// Re-applies this project's customisations of @open-slide/core (folder
// password protection, a site-wide password gate, always-visible "New
// folder", create-a-folder from the Move dialog, resizable/arrangeable
// presenter-view panes, laser pointer and slide clicks mirrored between the
// projection and presenter windows, colour-coded speaker notes — DIRE /
// ANIMATION / INTERACTION sections, with the current « Clic N » tracked,
// read-only share links /v/<code>, a « Labs » download button for decks
// whose meta declares `labs`, and the presenter's « Minuteurs » panel: re-time
// the deck's countdown timers, or recalibrate them on the real time left;
// extra Design-panel colours (any `design.palette` key → --osd-<key>) and
// footer-logo switches (`design.logos` → --osd-logo-<key>), and in-slide
// navigation via the window event `open-slide:goto`). node_modules is rebuilt by every
// `npm install` / `npm ci`, so run this afterwards:
//
//   node scripts/apply-core-patch.mjs
//
// Safe to run twice: an already-applied patch is detected and skipped.
import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync } from 'node:fs';
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
} catch {
  try {
    gitApply();
    console.log('open-slide core patch: applied.');
  } catch (err) {
    console.error('open-slide core patch: failed to apply.\n' + String(err.stderr ?? err));
    process.exit(1);
  }
}

// Binary logo swap (the patch is text-only): the project's open-slides logo
// replaces the core's sidebar icon and favicon. Copied on every run, so a
// fresh `npm install` gets it back.
const LOGO_COPIES = [
  ['assets/logo-open-slides-icon-square.png', 'src/app/assets/open-slide.png'],
  ['assets/logo-open-slides.ico', 'src/app/favicon.ico'],
];
for (const [from, to] of LOGO_COPIES) {
  copyFileSync(join(ROOT, from), join(ROOT, PKG_DIR, to));
}
console.log('open-slide core logo: replaced (sidebar icon + favicon).');
