// Construit les points de reprise et les empreintes du dépôt parafo-copilot (Copilot Débutant v2).
//
//   node .cpd2-labs/paquets.mjs
//
// Source unique : labs/copilot-debutant-v2/corriges/etapes/atelier-0N/ (arborescence du dépôt).
//  1. Complète l'étape 08 avec le contenu du plugin parafo-qualite (copies des skills, de l'agent,
//     du serveur MCP et de l'annuaire) : ces copies sont GÉNÉRÉES, ne pas les éditer à la main.
//  2. Écrit parafo-copilot/reprises/fin-atelier-0N.paquet (N = 3 à 8) : gzip + base64 d'un JSON
//     { atelier, fichiers: { chemin: contenu } }, illisible pour un agent qui fouille le dépôt.
//  3. Écrit parafo-copilot/scripts/empreintes.json (fichiers protégés vérifiés par npm run garde).

import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const labs = join(racine, 'labs', 'copilot-debutant-v2');
const depot = join(labs, 'parafo-copilot');
const etapes = join(labs, 'corriges', 'etapes');
const etape = (n) => join(etapes, `atelier-${String(n).padStart(2, '0')}`);

function lister(dossier) {
  const fichiers = [];
  for (const nom of readdirSync(dossier)) {
    const complet = join(dossier, nom);
    if (statSync(complet).isDirectory()) fichiers.push(...lister(complet));
    else fichiers.push(complet);
  }
  return fichiers;
}
const versPosix = (p) => p.split(sep).join('/');
const lireLf = (f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n');

// 1. Plugin parafo-qualite (étape 08)
const plugin = join(etape(8), 'plugins', 'parafo-qualite');
const copies = [
  [join(etape(6), '.github', 'skills', 'refactoring-sur'), join(plugin, 'skills', 'refactoring-sur')],
  [join(etape(7), '.github', 'skills', 'tests-node'), join(plugin, 'skills', 'tests-node')],
  [join(etape(6), '.github', 'agents', 'refactoreur.agent.md'), join(plugin, 'com.github.copilot', 'agents', 'refactoreur.agent.md')],
  [join(depot, 'mcp', 'annuaire.mjs'), join(plugin, 'mcp', 'annuaire.mjs')],
  [join(depot, 'data', 'annuaire.json'), join(plugin, 'data', 'annuaire.json')],
];
for (const [de, vers] of copies) {
  mkdirSync(dirname(vers), { recursive: true });
  cpSync(de, vers, { recursive: true });
}
console.log(`plugin parafo-qualite complété (${copies.length} copies)`);

// 2. Paquets de reprise
const dossierReprises = join(depot, 'reprises');
mkdirSync(dossierReprises, { recursive: true });
for (let n = 3; n <= 8; n++) {
  if (!existsSync(etape(n))) throw new Error(`étape manquante : ${etape(n)}`);
  const fichiers = {};
  for (const f of lister(etape(n))) fichiers[versPosix(relative(etape(n), f))] = lireLf(f);
  const brut = gzipSync(Buffer.from(JSON.stringify({ atelier: n, fichiers }), 'utf8'), { level: 9 }).toString('base64');
  const lignes = brut.match(/.{1,100}/g).join('\n');
  const nom = `fin-atelier-${String(n).padStart(2, '0')}.paquet`;
  writeFileSync(join(dossierReprises, nom), `${lignes}\n`);
  console.log(`reprises/${nom} : ${Object.keys(fichiers).length} fichier(s)`);
}

// 3. Empreintes des fichiers protégés
const proteges = [
  ...lister(join(depot, 'test', 'acceptance')),
  join(depot, 'src', 'journal.js'),
  join(depot, 'src', 'erreurs.js'),
  join(depot, 'scripts', 'mutation.js'),
  join(depot, 'ateliers', 'atelier-09-revue', 'revue.test.js'),
];
const empreintes = {};
for (const f of proteges.sort()) {
  empreintes[versPosix(relative(depot, f))] = createHash('sha256').update(lireLf(f)).digest('hex');
}
writeFileSync(join(depot, 'scripts', 'empreintes.json'), `${JSON.stringify(empreintes, null, 2)}\n`);
console.log(`scripts/empreintes.json : ${Object.keys(empreintes).length} fichiers protégés`);
