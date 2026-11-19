// Test de bout en bout d'une stack Guichet : simulateur + application, puis l'API web.
//   node .cla-labs/e2e.mjs <dossier-du-depot> <ts|python|java|dotnet>
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [depot, stack] = process.argv.slice(2);
const SIMU = 18700 + Math.floor(Math.random() * 100);
const APP = 18800 + Math.floor(Math.random() * 100);
const base = `http://localhost:${APP}`;
fs.writeFileSync(path.join(depot, '.guichet-stack'), `${stack}\n`);
const db = path.join(depot, 'donnees', `e2e-${stack}.db`);
fs.rmSync(db, { force: true });

const env = { ...process.env, SIMU_PORT: String(SIMU), PORT: String(APP), GUICHET_DB: db, MOTEUR: 'simu' };
const lancer = (args) => spawn(process.execPath, [path.join(depot, 'guichet.mjs'), ...args], { cwd: depot, env, stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32' });
const simu = lancer(['simu']);
const app = lancer(['lancer']);
let journal = '';
app.stdout.on('data', (d) => (journal += d));
app.stderr.on('data', (d) => (journal += d));

const attendre = async (url, ms) => {
  const fin = Date.now() + ms;
  while (Date.now() < fin) {
    try {
      if ((await fetch(url)).status < 500) return true;
    } catch {
      /* pas encore */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
};

const tuer = (p) => {
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(p.pid), '/T', '/F'], { stdio: 'ignore' });
  else process.kill(-p.pid);
};

let ok = true;
const verifier = (cond, txt) => {
  console.log(`${cond ? '✓' : '✗'} ${txt}`);
  ok &&= cond;
};
try {
  if (!(await attendre(`${base}/api/demandes`, 240_000))) throw new Error(`l'application ne répond pas :\n${journal.slice(-2000)}`);
  const refs = JSON.parse(fs.readFileSync(path.join(depot, 'donnees', 'demandes.json'), 'utf8'));
  const post = async (id, extra = {}) => {
    const r = await fetch(`${base}/api/demandes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...refs.find((d) => d.id === id).formulaire, ...extra }) });
    return [r.status, await r.json()];
  };
  let [s, j] = await post(1);
  verifier(s === 201 && j.demande.priorite === 'P1' && j.demande.client_id === 'C-0142' && j.nouvelle === true, `n° 1 → ${s} ${j.demande?.id} ${j.demande?.priorite}`);
  [s, j] = await post(11);
  verifier(s === 201 && j.demande.type === 'question' && j.demande.priorite === 'P3', `n° 11 (injection) → ${j.demande?.type} ${j.demande?.priorite}`);
  [s, j] = await post(12);
  verifier(s === 422, `n° 12 (incomplète) → ${s} ${j.erreur?.slice(0, 70)}`);
  [s, j] = await post(1);
  verifier(s === 201 && j.nouvelle === false, `n° 1 renvoyée → nouvelle=${j.nouvelle}`);
  [s, j] = await post(5, { site_web: 'https://nordicparts.eu' });
  verifier(s === 201 && j.demande.equipe === 'Europe' && j.demande.site_web === 'https://nordicparts.eu', `n° 5 → ${j.demande?.langue} ${j.demande?.equipe} ${j.demande?.site_web}`);
  const toutes = await (await fetch(`${base}/api/demandes`)).json();
  verifier(toutes.length === 3, `tableau de bord : ${toutes.length} demandes`);
  const atlas = await (await fetch(`${base}/api/demandes?client=atlas`)).json();
  verifier(atlas.length === 1, `filtre « atlas » : ${atlas.length}`);
  const html = await (await fetch(`${base}/`)).text();
  verifier(html.includes('Guichet'), 'interface web servie');
  const refsWeb = await (await fetch(`${base}/api/references`)).json();
  verifier(refsWeb.length === 12, 'demandes de référence servies');
} catch (e) {
  ok = false;
  console.log(`✗ ${e.message}`);
} finally {
  tuer(app);
  tuer(simu);
  setTimeout(() => fs.rmSync(db, { force: true }), 1500);
}
console.log(ok ? `E2E ${stack} : OK` : `E2E ${stack} : ÉCHEC`);
process.exitCode = ok ? 0 : 1;
