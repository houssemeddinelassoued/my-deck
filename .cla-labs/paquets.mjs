// Génère les paquets de reprise du dépôt Guichet à partir des corrigés.
//   node .cla-labs/paquets.mjs
// Un paquet par étape : reprises/<étape>.paquet = base64(gzip(JSON { etape, fichiers: { chemin: contenu } })).
// Compressés exprès : un agent qui fouille le dépôt ne lit pas les solutions en clair.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { CORRIGES, DEPOT, ETAPES, fichiersDe } from './solution.mjs';

const sortie = path.join(DEPOT, 'reprises');
fs.rmSync(sortie, { recursive: true, force: true });
fs.mkdirSync(sortie, { recursive: true });
let total = 0;
for (const e of ETAPES) {
  const dir = path.join(CORRIGES, e);
  const fichiers = {};
  for (const rel of fichiersDe(dir)) fichiers[rel] = fs.readFileSync(path.join(dir, rel), 'utf8');
  const n = Object.keys(fichiers).length;
  if (!n) continue;
  const paquet = zlib.gzipSync(Buffer.from(JSON.stringify({ etape: e, fichiers }), 'utf8'), { level: 9 }).toString('base64');
  fs.writeFileSync(path.join(sortie, `${e}.paquet`), `${paquet}\n`);
  total += n;
  console.log(`${e.padEnd(5)} ${String(n).padStart(3)} fichier(s)`);
}
fs.writeFileSync(
  path.join(sortie, 'LISEZMOI.md'),
  '# Points de reprise\n\nEn retard au point d’étape ? `node guichet.mjs reprise A3.2` remet votre stack (et les fichiers communs) dans l’état de **fin** de l’étape A3.2.\nCommitez avant et après : `git add -A && git commit -m "reprise A3.2"`.\n\nLes paquets sont compressés : ne les modifiez pas.\n',
);
console.log(`${total} fichiers empaquetés dans ${path.relative(process.cwd(), sortie)}`);
