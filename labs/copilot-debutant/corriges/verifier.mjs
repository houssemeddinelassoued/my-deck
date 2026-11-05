// Vérifie les ateliers : l'énoncé ÉCHOUE là où il doit échouer, le corrigé PASSE partout.
//   node labs/copilot-debutant/corriges/verifier.mjs
// Copie le dépôt dans un dossier temporaire, lance les tests, puis superpose les corrigés.
import { execSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = fileURLToPath(new URL('.', import.meta.url));
const DEPOT = join(ICI, '..', 'taskflow-copilot');
const tmp = mkdtempSync(join(tmpdir(), 'taskflow-'));
cpSync(DEPOT, tmp, { recursive: true, filter: (s) => !/[\\/](\.git|node_modules)([\\/]|$)/.test(s) });

const lancer = (cmd) => {
  try {
    execSync(cmd, { cwd: tmp, stdio: 'pipe', timeout: 120_000 });
    return true;
  } catch {
    return false;
  }
};

const CAS = [
  ['Atelier 4 · tickets', 'npm run test:atelier4 --silent'],
  ['Atelier 5 · backlog + CSV', 'npm run test:atelier5 --silent'],
  ['Atelier 6 · legacy + contrat', 'npm run test:atelier6 --silent'],
  ['Atelier 7 · kanban + api (tests du corrigé)', 'node --test test/kanban.test.js test/api-charger.test.js'],
  ['Atelier 8 · revue', 'npm run test:revue --silent'],
  ['Atelier 9 · échéances (agents)', 'npm run test:atelier9 --silent'],
  ['Atelier 9 · tests du Testeur QA + export (bonus)', 'node --test test/echeances-qa.test.js test/export.test.js'],
  ['Variante Python', 'python -m unittest katas/python/test_tickets.py'],
  ['Variante Java', 'java katas/java/Ticket.java'],
];

let ko = 0;
const verifier = (phase, attendu) => {
  console.log(`\n── ${phase} (attendu : ${attendu ? 'vert' : 'rouge'})`);
  for (const [nom, cmd] of CAS) {
    if (!attendu && (nom.startsWith('Atelier 7') || nom.includes('Testeur QA'))) continue; // ces tests n'existent que dans le corrigé
    let ok = lancer(cmd);
    if (nom === 'Variante Java' && ok) ok = execSync(cmd, { cwd: tmp, encoding: 'utf8' }).includes('6/6 OK');
    const bon = ok === attendu;
    if (!bon) ko += 1;
    console.log(`${bon ? '✓' : '✗'} ${nom} : ${ok ? 'vert' : 'rouge'}`);
  }
};

verifier('Énoncé', false);
cpSync(ICI, tmp, { recursive: true, filter: (s) => !/verifier\.mjs$|LISEZMOI/.test(s) });
verifier('Corrigé', true);
const fin = (nom, ok) => {
  if (!ok) ko += 1;
  console.log(`── ${nom} : ${ok ? '✓ vert' : '✗ rouge'}`);
};
console.log('');
fin('Tests de caractérisation sur le legacy refactoré', lancer('node --test test/kanban-legacy.test.js'));
fin('Suite complète npm test', lancer('npm test --silent'));
rmSync(tmp, { recursive: true, force: true });
console.log(ko ? `\n${ko} écart(s)` : '\nTout est conforme.');
process.exitCode = ko ? 1 : 0;
