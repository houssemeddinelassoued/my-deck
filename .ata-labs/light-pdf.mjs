// Version light d’IA135 en PDF, à envoyer aux participants avant la formation.
//   1. node .ata-build/build.mjs     (produit slides/automatisation-taches-ia-light, sans QCM, exercices, ateliers ni notes)
//   2. le serveur de développement tourne (npm run dev, http://localhost:5173)
//   3. node .ata-labs/light-pdf.mjs  → labs/automatisation-taches-ia/IA135-Version-light.pdf
// Raccourci vers l’exporteur générique scripts/light-pdf.mjs (mêmes options : --last <n>, PW_BASE, PORT).
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const r = spawnSync(
  process.execPath,
  [path.join(RACINE, 'scripts', 'light-pdf.mjs'), 'automatisation-taches-ia-light', 'labs/automatisation-taches-ia/IA135-Version-light.pdf', ...process.argv.slice(2)],
  { cwd: RACINE, stdio: 'inherit' },
);
process.exitCode = r.status ?? 1;
