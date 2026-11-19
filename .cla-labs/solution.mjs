// Reconstitue un état du dépôt Guichet : énoncé + surcouches des corrigés jusqu'à une étape.
//
//   node .cla-labs/solution.mjs <dossier-cible> [étape]     (défaut : A5, la solution complète)
//
// Les surcouches vivent dans labs/claude-ia-avancee/corriges/etapes/<étape>/ (arborescence du dépôt).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DEPOT = path.join(ROOT, 'labs', 'claude-ia-avancee', 'guichet-claude');
export const CORRIGES = path.join(ROOT, 'labs', 'claude-ia-avancee', 'corriges', 'etapes');
export const ETAPES = ['A1.1', 'A1.2', 'A1.3', 'A1.4', 'A2.1', 'A2.2', 'A2.3', 'A2.4', 'A2.5', 'A3.1', 'A3.2', 'A3.3', 'A3.4', 'A3.5', 'A4.1', 'A4.2', 'A4.3', 'A4.4', 'A4.5', 'A5'];
const EXCLUS = new Set(['node_modules', '.venv', 'target', 'bin', 'obj', '__pycache__', '.pytest_cache', '.git', 'generations']);

export function copier(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (EXCLUS.has(e.name)) continue;
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) copier(s, d);
    else fs.copyFileSync(s, d);
  }
}

export function fichiersDe(dossier, base = dossier) {
  if (!fs.existsSync(dossier)) return [];
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dossier, e.name);
    return e.isDirectory() ? fichiersDe(p, base) : [path.relative(base, p).replace(/\\/g, '/')];
  });
}

export function appliquer(cible, jusqua = 'A5') {
  const idx = ETAPES.indexOf(jusqua);
  if (idx < 0) throw new Error(`étape inconnue : ${jusqua}`);
  for (const e of ETAPES.slice(0, idx + 1)) {
    const dir = path.join(CORRIGES, e);
    for (const rel of fichiersDe(dir)) {
      fs.mkdirSync(path.dirname(path.join(cible, rel)), { recursive: true });
      fs.copyFileSync(path.join(dir, rel), path.join(cible, rel));
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cible, etape = 'A5'] = process.argv.slice(2);
  if (!cible) {
    console.error('usage : node .cla-labs/solution.mjs <dossier-cible> [étape]');
    process.exit(1);
  }
  fs.rmSync(cible, { recursive: true, force: true });
  copier(DEPOT, cible);
  appliquer(cible, etape);
  console.log(`état ${etape} reconstitué dans ${cible}`);
}
