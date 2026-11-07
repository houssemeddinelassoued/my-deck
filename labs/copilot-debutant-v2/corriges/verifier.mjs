// Vérification formateur du dépôt parafo-copilot (Copilot Débutant v2). NE PAS DISTRIBUER.
//
//   node labs/copilot-debutant-v2/corriges/verifier.mjs
//
// Pour chaque atelier N (2 à 9), sur une copie temporaire du dépôt :
//   · l'énoncé doit être ROUGE  (npm run test:atelierN échoue) ;
//   · après application des corrigés 2..N, il doit être VERT.
// Puis : npm test complet vert, npm run garde vert (et rouge si un test d'acceptation est modifié),
// npm run reprise -- 8 sur une copie neuve rend les ateliers 3 à 8 verts, kata Python vert.

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const depot = join(ici, '..', 'parafo-copilot');
const etapes = join(ici, 'etapes');
const ATELIERS = [2, 3, 4, 5, 6, 7, 8, 9];
const surWindows = process.platform === 'win32';
let erreurs = 0;

function copieNeuve(nom) {
  const cible = mkdtempSync(join(tmpdir(), `parafo-${nom}-`));
  cpSync(depot, cible, { recursive: true, filter: (s) => !/[\\/](\.git|node_modules|\.reprises-sauvegardes)([\\/]|$)/.test(s) });
  return cible;
}

function npm(dossier, ...args) {
  const r = spawnSync(`npm run --silent ${args.join(' ')}`, { cwd: dossier, encoding: 'utf8', shell: true, timeout: 180_000 });
  return { ok: r.status === 0, sortie: `${r.stdout}\n${r.stderr}` };
}

function appliquer(dossier, n) {
  const source = join(etapes, `atelier-${String(n).padStart(2, '0')}`);
  if (!existsSync(source)) return;
  cpSync(source, dossier, { recursive: true });
  if (n === 2) {
    // un seul corrigé pour les quatre modes
    const corrige = readFileSync(join(dossier, 'katas', '02-quatre-modes', 'inline.js'), 'utf8');
    for (const mode of ['ask', 'plan', 'agent']) writeFileSync(join(dossier, 'katas', '02-quatre-modes', `${mode}.js`), corrige);
  }
}

function attendre(condition, message, sortie = '') {
  console.log(`  ${condition ? '✔' : '✖'} ${message}`);
  if (!condition) {
    erreurs++;
    console.log(sortie.split('\n').filter((l) => /✖|not ok|Error|error|SURVIT/.test(l)).slice(0, 12).map((l) => `      ${l}`).join('\n'));
  }
}

const debut = Date.now();

console.log('1. Énoncé rouge, corrigé vert, atelier par atelier');
const travail = copieNeuve('corrige');
for (const n of ATELIERS) {
  const enonce = npm(travail, `test:atelier${n}`);
  attendre(!enonce.ok, `Atelier ${n} : énoncé rouge`, enonce.sortie);
  appliquer(travail, n);
  const corrige = npm(travail, `test:atelier${n}`);
  attendre(corrige.ok, `Atelier ${n} : corrigé vert`, corrige.sortie);
}

console.log('2. Ensemble');
const tout = npm(travail, 'test');
attendre(tout.ok, 'npm test : tout vert avec les corrigés', tout.sortie);
const garde = npm(travail, 'garde');
attendre(garde.ok, 'npm run garde : vert', garde.sortie);
appendFileSync(join(travail, 'test', 'acceptance', 'a3-document.test.js'), '\n// modifié\n');
attendre(!npm(travail, 'garde').ok, 'npm run garde : rouge si un test d’acceptation est modifié');
rmSync(travail, { recursive: true, force: true });

console.log('3. Points de reprise');
const reprise = copieNeuve('reprise');
const r8 = npm(reprise, 'reprise', '--', '8');
attendre(r8.ok, 'npm run reprise -- 8 s’applique', r8.sortie);
for (const n of [3, 4, 5, 6, 7, 8]) {
  const r = npm(reprise, `test:atelier${n}`);
  attendre(r.ok, `après reprise 8 : Atelier ${n} vert`, r.sortie);
}
const r3 = npm(reprise, 'reprise', '--', '3');
attendre(r3.ok, 'reprise rejouée sur des fichiers déjà à jour : sans erreur', r3.sortie);
rmSync(reprise, { recursive: true, force: true });

console.log('4. Bonus Python et Java (Atelier 4)');
const py = copieNeuve('python');
appliquer(py, 4);
const python = spawnSync(surWindows ? 'python' : 'python3', ['-m', 'unittest', 'discover', '-s', 'katas/python'], { cwd: py, encoding: 'utf8' });
if (python.error) console.log('  – Python absent : bonus non vérifié');
else attendre(python.status === 0, 'kata Python corrigé vert', python.stderr);
const java = spawnSync('java', ['katas/java/Reference.java'], { cwd: py, encoding: 'utf8' });
if (java.error) console.log('  – Java absent : bonus non vérifié');
else attendre(java.status === 0, 'kata Java corrigé vert', java.stderr);
rmSync(py, { recursive: true, force: true });

console.log(`\n${erreurs === 0 ? '✔ Tout est conforme' : `✖ ${erreurs} écart(s)`} (${Math.round((Date.now() - debut) / 1000)} s)`);
process.exitCode = erreurs === 0 ? 0 : 1;
