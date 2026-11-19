// Contrôle formateur : pour chaque étape X, l'état « début de X » échoue à `verifier X`
// et l'état « fin de X » le réussit. Passe aussi la reprise réelle (paquets) sur l'énoncé.
//   node .cla-labs/verifier-etapes.mjs <ts|python|java|dotnet> [étapes…]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { appliquer, copier, DEPOT, ETAPES } from './solution.mjs';

const [stack, ...choix] = process.argv.slice(2);
const etapes = choix.length ? choix : ETAPES;
const base = fs.mkdtempSync(path.join(os.tmpdir(), `guichet-${stack}-`));

function etat(nom, jusqua) {
  const dir = path.join(base, nom);
  fs.rmSync(dir, { recursive: true, force: true });
  copier(DEPOT, dir);
  if (jusqua) appliquer(dir, jusqua);
  // Dépendances déjà installées dans le dépôt source : liens plutôt que réinstallation.
  for (const [src, dst] of [
    ['ts/node_modules', 'ts/node_modules'],
    ['python/.venv', 'python/.venv'],
  ]) {
    if (fs.existsSync(path.join(DEPOT, src)) && !fs.existsSync(path.join(dir, dst))) fs.symlinkSync(path.join(DEPOT, src), path.join(dir, dst), 'junction');
  }
  fs.writeFileSync(path.join(dir, '.guichet-stack'), `${stack}\n`);
  return dir;
}
const verifier = (dir, e) => spawnSync(process.execPath, ['guichet.mjs', 'verifier', e], { cwd: dir, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });

let erreurs = 0;
for (const e of etapes) {
  const i = ETAPES.indexOf(e);
  const avant = verifier(etat('avant', i > 0 ? ETAPES[i - 1] : null), e);
  const apres = verifier(etat('apres', e), e);
  const ok = avant.status !== 0 && apres.status === 0;
  if (!ok) erreurs++;
  console.log(`${ok ? '✓' : '✗'} ${e.padEnd(5)} début : ${avant.status === 0 ? 'RÉUSSIT (anormal)' : 'échoue'} · fin : ${apres.status === 0 ? 'réussit' : 'ÉCHOUE'}`);
  if (!ok) console.log((apres.status !== 0 ? apres.stdout : avant.stdout).replace(/\x1b\[\d+m/g, '').split('\n').filter((l) => /✗|✓/.test(l)).join('\n'));
}

// Reprise réelle depuis l'énoncé, avec les paquets du dépôt.
const reel = etat('reprise', null);
const r = spawnSync(process.execPath, ['guichet.mjs', 'reprise', 'A3.5'], { cwd: reel, encoding: 'utf8' });
const v = verifier(reel, 'A3.5');
console.log(`${r.status === 0 && v.status === 0 ? '✓' : '✗'} reprise A3.5 depuis l’énoncé, puis verifier A3.5`);
if (r.status !== 0 || v.status !== 0) erreurs++;
fs.rmSync(base, { recursive: true, force: true });
console.log(erreurs ? `${erreurs} problème(s)` : `Toutes les étapes sont cohérentes pour ${stack}.`);
process.exitCode = erreurs ? 1 : 0;
