// Lance la boucle sur une tâche : node guichet.mjs boucle taches/tronquer-resume.md
// Générer = claude -p écrit le fichier cible ; vérifier = garde + tests de la tâche (tag BOUCLE).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chemin, RACINE } from '../src/config.ts';
import { boucle, type Verification } from '../src/outils/boucle.ts';

const fichierTache = process.argv[2];
if (!fichierTache) {
  console.error('usage : node scripts/boucle.ts <tache.md>');
  process.exit(1);
}
const tache = fs.readFileSync(fichierTache, 'utf8');
const cible = (tache.match(/^fichier-ts:\s*(.+)$/m) ?? [])[1]?.trim();
if (!cible) {
  console.error('La tâche ne précise pas de « fichier-ts: ».');
  process.exit(1);
}

function claude(prompt: string): string {
  const options = { cwd: os.tmpdir(), input: prompt, encoding: 'utf8' as const, timeout: 300_000, maxBuffer: 32 * 1024 * 1024 };
  let r = spawnSync('claude', ['-p', '--output-format', 'json'], options);
  if (process.platform === 'win32' && (r.error as NodeJS.ErrnoException | undefined)?.code === 'ENOENT') r = spawnSync('claude -p --output-format json', [], { ...options, shell: true });
  if (r.status !== 0) throw new Error(`claude -p a échoué : ${(r.stderr || r.stdout || String(r.error)).slice(0, 300)}`);
  return String(JSON.parse(r.stdout).result ?? '');
}

async function generer(t: string, retours: string): Promise<void> {
  const actuel = fs.readFileSync(chemin(cible!), 'utf8');
  const prompt = [
    '<tache>',
    t,
    '</tache>',
    `<fichier_actuel chemin="${cible}">`,
    actuel,
    '</fichier_actuel>',
    retours ? `<retours_de_verification>\n${retours}\n</retours_de_verification>\nCorrige le fichier pour que ces vérifications passent.` : '',
    'Réponds uniquement avec le contenu complet du fichier, dans un seul bloc de code TypeScript.',
  ].join('\n');
  const reponse = claude(prompt);
  const code = [...reponse.matchAll(/```[\w-]*\r?\n([\s\S]*?)```/g)].map((m) => m[1]).sort((a, b) => b.length - a.length)[0] ?? reponse;
  fs.writeFileSync(chemin(cible!), code);
  console.log(`  → ${cible} réécrit (${code.split('\n').length} lignes)`);
}

async function verifier(): Promise<Verification> {
  const lancer = (args: string[]) => spawnSync(process.execPath, [path.join(RACINE, 'guichet.mjs'), ...args], { cwd: RACINE, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });
  const garde = lancer(['garde']);
  const tests = lancer(['tests', '--tag', 'BOUCLE', '--detail']);
  const sortie = `${garde.stdout}${garde.stderr}\n${tests.stdout}${tests.stderr}`.replace(/\x1b\[\d+m/g, '').slice(-6000);
  return { ok: garde.status === 0 && tests.status === 0, sortie };
}

let tour = 0;
const res = await boucle(
  tache,
  async (t, retours) => {
    tour++;
    console.log(`Tour ${tour} : génération${retours ? ' avec les retours du tour précédent' : ''}…`);
    await generer(t, retours);
  },
  async () => {
    const v = await verifier();
    console.log(`  → vérification : ${v.ok ? 'OK' : 'échec'}`);
    return v;
  },
);
if (res.ok) console.log(`Réussi en ${res.tour} tour(s).`);
else {
  console.log(`Échec après ${res.tour} tours : à vous de regarder. Dernière vérification :\n${res.historique.at(-1)?.sortie ?? ''}`);
  process.exitCode = 1;
}
