// TP 1 · protocole de mesure sans interférence entre essais (TypeScript · Vitest).
//
//   node essai.mjs init ../sallelibre-mesures     → dépôt de départ (tag « socle »)
//   node essai.mjs start p1-v1-1                  → branche propre pour l'essai (tâche p1|p2|p3, version v1|v2, n° d'essai)
//   … nouvelle session de Chat (Ctrl+N), un seul prompt, Agent, modèle fixé …
//   node essai.mjs mesure                         → compile, tests d'acceptation, hors sujet ; commit de l'essai
//
// Les tests d'acceptation (acceptance/) ne sont copiés dans le dépôt qu'APRÈS l'essai :
// l'agent ne les voit jamais. Les allers-retours se comptent à la main.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ICI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const REF = path.join(ICI, 'reference');
const ACC = path.join(ICI, 'acceptance');

// Point de départ de chaque tâche : ce qu'on retire du socle, ce qu'on attend en retour.
const TACHES = {
  p1: { retire: ['src/domain/overlap.ts'], attendus: ['src/domain/overlap.ts', 'tests/domain/overlap.test.ts'], acceptance: 'overlap.acceptance.test.ts' },
  p2: { retire: ['src/domain/overlap.ts', 'src/domain/types.ts'], attendus: ['src/domain/types.ts'], acceptance: 'types.acceptance.test.ts' },
  p3: { retire: [], attendus: ['src/domain/availability.ts', 'tests/domain/availability.test.ts'], acceptance: 'availability.acceptance.test.ts' },
};

const sh = (cmd, opts = {}) => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });
const ok = (cmd) => {
  try {
    sh(cmd);
    return true;
  } catch {
    return false;
  }
};
const copie = (de, vers) => {
  fs.mkdirSync(path.dirname(vers), { recursive: true });
  fs.copyFileSync(de, vers);
};

const [cmd, arg] = process.argv.slice(2);

if (cmd === 'init') {
  if (!arg) throw new Error('usage : node essai.mjs init <dossier>');
  const dest = path.resolve(arg);
  fs.mkdirSync(dest, { recursive: true });
  for (const f of ['package.json', 'tsconfig.json', '.gitignore', 'src/index.ts', 'src/domain/types.ts', 'src/domain/overlap.ts']) copie(path.join(REF, f), path.join(dest, f));
  sh('git init -q -b main', { cwd: dest });
  sh('npm install --silent --no-audit --no-fund', { cwd: dest });
  sh('git add -A && git commit -q -m "socle" && git tag socle', { cwd: dest });
  console.log(`Socle prêt : ${dest}\nEnsuite, dans ce dossier : node ${path.join(ICI, 'essai.mjs')} start p1-v1-1`);
} else if (cmd === 'start') {
  const m = /^(p[123])-(v[12])-(\d+)$/.exec(arg ?? '');
  if (!m) throw new Error('usage : node essai.mjs start p1-v1-1  (p1|p2|p3 · v1|v2 · n° d’essai)');
  if (sh('git status --porcelain').trim()) throw new Error('Modifications non commitées : commitez ou annulez avant de lancer un essai.');
  sh(`git switch -c essai-${arg} socle`);
  const t = TACHES[m[1]];
  for (const f of t.retire) fs.rmSync(f, { force: true });
  if (t.retire.length) sh(`git add -A && git commit -q -m "départ ${arg}"`);
  console.log(`Branche essai-${arg} prête (identique au socle${t.retire.length ? `, sans ${t.retire.join(' ni ')}` : ''}).\n→ Fermez tous les onglets, Ctrl+N dans le Chat, collez UN prompt, rôle Agent, modèle fixé.`);
} else if (cmd === 'mesure') {
  const branche = sh('git branch --show-current').trim();
  const m = /^essai-(p[123])-(v[12])-(\d+)$/.exec(branche);
  if (!m) throw new Error(`Branche « ${branche} » : lancez d'abord « start ».`);
  const t = TACHES[m[1]];

  // 1. Hors sujet : fichiers touchés en dehors de ceux attendus, dépendances ajoutées.
  const touches = sh('git status --porcelain -uall').split('\n').filter(Boolean).map((l) => l.slice(3).trim());
  const horsFichiers = touches.filter((f) => !t.attendus.includes(f) && !f.startsWith('node_modules'));
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const pkg0 = JSON.parse(sh('git show socle:package.json'));
  const dep = (p) => Object.keys({ ...p.dependencies, ...p.devDependencies });
  const horsDeps = dep(pkg).filter((d) => !dep(pkg0).includes(d));
  const hors = horsFichiers.length + horsDeps.length;

  // 2. Compile : le code de l'agent, avant les tests d'acceptation.
  const compile = ok('npx tsc --noEmit');

  // 3. Tests d'acceptation, copiés maintenant.
  copie(path.join(ACC, t.acceptance), path.join('tests', 'acceptance', t.acceptance));
  let tests = false;
  let bornes = 'n/a';
  if (m[1] === 'p2') {
    tests = ok('npx tsc --noEmit');
  } else {
    try {
      sh('npx vitest run tests/acceptance --reporter=json --outputFile=.mesure.json');
    } catch {
      /* échec de tests : le JSON est tout de même écrit */
    }
    if (fs.existsSync('.mesure.json')) {
      const res = JSON.parse(fs.readFileSync('.mesure.json', 'utf8'));
      const cas = res.testResults.flatMap((r) => r.assertionResults);
      tests = cas.length > 0 && cas.every((c) => c.status === 'passed');
      const b = cas.filter((c) => /borne/.test(c.fullName));
      bornes = b.length ? (b.every((c) => c.status === 'passed') ? '1' : '0') : 'n/a';
      fs.rmSync('.mesure.json');
    }
  }
  const n = (v) => (v ? '1' : '0');
  const ligne = `| ${m[1].toUpperCase()} | ${m[2].toUpperCase()} | ${m[3]} | ${n(compile)} | ${n(tests)} | ${bornes} | ? | ${hors} |`;
  sh(`git add -A && git commit -q -m "essai ${m[1]} ${m[2]} #${m[3]} : compile=${n(compile)} tests=${n(tests)} bornes=${bornes} hors-sujet=${hors}"`);
  console.log('| Tâche | Version | Essai | Compile | Tests | Bornes | Allers-retours | Hors sujet |\n|---|---|---|---|---|---|---|---|\n' + ligne);
  if (hors) console.log(`Hors sujet : ${[...horsFichiers, ...horsDeps.map((d) => `dépendance ${d}`)].join(', ')}`);
  console.log('→ Remplacez « ? » par le nombre d’allers-retours (messages supplémentaires), puis : node essai.mjs start <essai suivant>');
  sh('git switch main');
} else {
  console.log('Commandes : init <dossier> · start p1-v1-1 · mesure');
}
