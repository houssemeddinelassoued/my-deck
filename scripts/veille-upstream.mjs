#!/usr/bin/env node
// Veille du dépôt officiel open-slide, SANS toucher à ce projet.
//
//   node scripts/veille-upstream.mjs            # met à jour le miroir + écrit le rapport
//   node scripts/veille-upstream.mjs --no-fetch # rapport depuis le miroir local tel quel
//
// What it does:
//  1. keeps a read-only mirror at ../open-slide-upstream (clone/fetch, outside my-deck);
//  2. lists the @open-slide/core releases newer than the pinned one, plus the unreleased commits on main;
//  3. downloads the latest published @open-slide/core into a TEMP folder and tries our patch on it
//     (git apply --reject), to show which files would conflict on an upgrade;
//  4. writes docs/idees-plateforme/veille-upstream.md.
// node_modules, package.json and the patch are only READ, never modified.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIRROR = join(ROOT, '..', 'open-slide-upstream');
const REPO = 'https://github.com/open-slide/open-slide.git';
const REPORT = join(ROOT, 'docs', 'idees-plateforme', 'veille-upstream.md');
const PATCH = readdirSync(join(ROOT, 'patches')).find((f) => f.startsWith('open-slide-core-') && f.endsWith('.patch'));
const PINNED = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).dependencies['@open-slide/core'].replace(/^[\^~]/, '');
const win = process.platform === 'win32';

const run = (cmd, args, opts = {}) => {
  const o = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts };
  // npm is npm.cmd on Windows and needs a shell; pass one command string (args here are fixed, safe values).
  return win && cmd === 'npm' ? execFileSync([cmd, ...args].join(' '), { ...o, shell: true }) : execFileSync(cmd, args, o);
};
const git = (...args) => run('git', ['-C', MIRROR, ...args]).trim();
const semver = (v) => v.split(/[.-]/).map((x) => (/^\d+$/.test(x) ? Number(x) : x));
const newer = (a, b) => {
  const [x, y] = [semver(a), semver(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
};

// 1. Mirror
if (!existsSync(MIRROR)) {
  console.log(`Clonage du dépôt officiel dans ${MIRROR}…`);
  run('git', ['clone', '--quiet', REPO, MIRROR]);
} else if (!process.argv.includes('--no-fetch')) {
  console.log('Mise à jour du miroir…');
  git('fetch', '--quiet', '--tags', 'origin');
  git('reset', '--quiet', '--hard', 'origin/HEAD');
}

// 2. Releases + unreleased commits
const tags = git('tag', '--list', '@open-slide/core@*')
  .split('\n')
  .map((t) => t.replace('@open-slide/core@', ''))
  .filter((v) => v && !v.includes('-'));
const newVersions = tags.filter((v) => newer(v, PINNED)).sort((a, b) => (newer(a, b) ? -1 : 1));
const latest = newVersions[0] ?? PINNED;

const changelog = readFileSync(join(MIRROR, 'packages', 'core', 'CHANGELOG.md'), 'utf8');
const sections = changelog.split(/^## /m).slice(1);
const notes = sections
  .filter((s) => newVersions.includes(s.split('\n')[0].trim()))
  .map((s) => {
    const [head, ...body] = s.split('\n');
    const items = body
      .filter((l) => l.startsWith('- '))
      .map((l) => l.replace(/^- \[#(\d+)\]\([^)]*\) \[`\w+`\]\([^)]*\) Thanks \[@[^\]]+\]\([^)]*\)! - /, '- #$1 '));
    return `### ${head.trim()}\n\n${items.join('\n')}`;
  });
const unreleased = git('log', '--oneline', `@open-slide/core@${latest}..HEAD`)
  .split('\n')
  .filter((l) => l && !/chore\(deps|chore\(deps-dev/.test(l));

// 3. Patch compatibility on the latest release (temp folder only)
let compat = '_Aucune version plus récente : test du patch inutile._';
if (latest !== PINNED) {
  const tmp = mkdtempSync(join(tmpdir(), 'open-slide-veille-'));
  try {
    console.log(`Test du patch sur @open-slide/core@${latest} (dossier temporaire)…`);
    run('npm', ['pack', `@open-slide/core@${latest}`, '--silent'], { cwd: tmp });
    run('tar', ['xzf', `open-slide-core-${latest}.tgz`], { cwd: tmp });
    const pkg = join(tmp, 'package');
    run('git', ['init', '-q'], { cwd: pkg });
    let out = '';
    try {
      out = run('git', ['-c', 'core.autocrlf=false', 'apply', '-p1', '--reject', '--verbose', join(ROOT, 'patches', PATCH)], { cwd: pkg });
    } catch (err) {
      out = `${err.stdout ?? ''}${err.stderr ?? ''}`;
    }
    const clean = [...out.matchAll(/Applied patch (\S+) cleanly/g)].map((m) => m[1]);
    const rejected = [...out.matchAll(/Applying patch (\S+) with (\d+) reject/g)].map((m) => `${m[1]} (${m[2]} bloc·s)`);
    const missing = [...out.matchAll(/error: (\S+): No such file or directory/g)].map((m) => m[1]);
    compat = [
      `Patch \`${PATCH}\` testé sur **${latest}** :`,
      '',
      `- ✅ s'appliquent proprement : **${clean.length}** fichiers`,
      `- ⚠️ en conflit : **${rejected.length}** fichiers${rejected.length ? '\n' + rejected.map((r) => `  - \`${r}\``).join('\n') : ''}`,
      `- ❌ fichiers absents dans la nouvelle version : **${missing.length}**${missing.length ? '\n' + missing.map((r) => `  - \`${r}\``).join('\n') : ''}`,
    ].join('\n');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// 4. Report
const report = `# Veille du dépôt officiel open-slide

> Généré le ${new Date().toISOString().slice(0, 10)} par \`node scripts/veille-upstream.mjs\`. Miroir : \`../open-slide-upstream\` (hors du projet).
> Le projet n'est pas modifié : \`node_modules\`, \`package.json\` et le patch sont seulement lus.

- Version épinglée ici : **${PINNED}** (patchée localement)
- Dernière version publiée : **${latest}**
- Versions plus récentes : ${newVersions.length ? newVersions.join(', ') : 'aucune'}

## Nouveautés publiées depuis ${PINNED}

${notes.join('\n\n') || '_Rien de nouveau._'}

## Pas encore publié (branche main, hors dépendances)

${unreleased.map((l) => `- ${l}`).join('\n') || '_Rien._'}

## Compatibilité de notre patch

${compat}
`;
writeFileSync(REPORT, report);
console.log(`Rapport : ${REPORT}`);
