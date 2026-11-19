// Serveur HTTP de Guichet : l'API et l'interface web (dossier web/ à la racine du dépôt).
//   node guichet.mjs lancer   (ou : node src/serveur.ts, avec GUICHET_RACINE défini)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chemin, lireJson, NonImplemente } from './config.ts';
import type { Client, DemandeBrute } from './domaine/demande.ts';
import { filtrerParClient } from './depot/filtre.ts';
import { DepotNotion } from './depot/notion.ts';
import { DepotSqlite } from './depot/sqlite.ts';
import type { Depot } from './depot/depot.ts';
import { choisirMoteur } from './moteurs/moteur.ts';
import { ErreurValidation } from './pipeline/erreurs.ts';
import { traiter } from './pipeline/traiter.ts';

const PORT = Number(process.env.PORT ?? 3000);
const moteur = choisirMoteur();
const local = new DepotSqlite(process.env.GUICHET_DB ?? chemin('donnees', 'guichet.db'));
const depot: Depot = process.env.STOCKAGE === 'notion' ? new DepotNotion(local) : local;
const clients = lireJson<Client[]>('donnees', 'clients.json');

const TYPES: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

function json(res: http.ServerResponse, statut: number, corps: unknown): void {
  res.writeHead(statut, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(corps));
}

async function lireCorps(req: http.IncomingMessage): Promise<unknown> {
  let brut = '';
  for await (const morceau of req) brut += morceau;
  return brut ? JSON.parse(brut) : {};
}

async function deposer(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const formulaire = (await lireCorps(req)) as DemandeBrute;
  if (!formulaire.message || !String(formulaire.message).trim()) return json(res, 422, { erreur: 'Le message est obligatoire.' });
  try {
    const { demande, nouvelle } = await traiter(formulaire, { moteur, depot, clients });
    json(res, 201, { demande, nouvelle });
  } catch (e) {
    if (e instanceof ErreurValidation) return json(res, 422, { erreur: e.message });
    if (e instanceof NonImplemente) {
      // Atelier 3 en cours : on montre au moins la réponse brute du moteur (A3.1).
      let reponseBrute: string;
      try {
        reponseBrute = await moteur.appelSimple(formulaire.message);
      } catch (e2) {
        reponseBrute = (e2 as Error).message;
      }
      return json(res, 501, { erreur: e.message, reponse_brute: reponseBrute });
    }
    console.error(e);
    json(res, 502, { erreur: (e as Error).message });
  }
}

function servirFichier(res: http.ServerResponse, url: string): void {
  const relatif = url === '/' ? 'index.html' : url.replace(/^\/+/, '');
  const fichier = path.normalize(chemin('web', relatif));
  if (!fichier.startsWith(chemin('web')) || !fs.existsSync(fichier)) return json(res, 404, { erreur: 'introuvable' });
  res.writeHead(200, { 'content-type': TYPES[path.extname(fichier)] ?? 'application/octet-stream' });
  fs.createReadStream(fichier).pipe(res);
}

const serveur = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (req.method === 'POST' && url.pathname === '/api/demandes') return void deposer(req, res);
  if (req.method === 'GET' && url.pathname === '/api/demandes') return json(res, 200, filtrerParClient(depot.lister(), url.searchParams.get('client')));
  if (req.method === 'GET' && url.pathname === '/api/references') return json(res, 200, lireJson('donnees', 'demandes.json'));
  if (req.method === 'GET') return servirFichier(res, url.pathname);
  json(res, 405, { erreur: 'méthode non prise en charge' });
});

serveur.listen(PORT, () => console.log(`Guichet (TypeScript, moteur ${moteur.nom}) : http://localhost:${PORT}`));
