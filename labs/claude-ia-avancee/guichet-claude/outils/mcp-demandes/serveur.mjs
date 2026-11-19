// Serveur MCP « demandes » (Atelier 4, étape A4.4) — lecture seule de la base Guichet.
//
// Transport stdio : un message JSON-RPC 2.0 par ligne sur l'entrée et la sortie
// standard. Aucune dépendance : Node 22.18+ (module node:sqlite).
//
//   claude mcp add --scope project demandes -- node outils/mcp-demandes/serveur.mjs
//
// Base lue : variable GUICHET_DB, sinon donnees/guichet.db à la racine du dépôt.
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE = process.env.GUICHET_DB || path.join(RACINE, 'donnees', 'guichet.db');

const OUTILS = [
  {
    name: 'lister_demandes',
    description:
      'Liste les demandes clients de Guichet, les plus récentes d’abord. Filtres facultatifs : priorité (P1, P2, P3), client (nom, recherche partielle), statut (ouverte, close) et ancienneté minimale en heures (ouvertes_depuis_heures). Lecture seule.',
    inputSchema: {
      type: 'object',
      properties: {
        priorite: { type: 'string', enum: ['P1', 'P2', 'P3'] },
        client: { type: 'string' },
        statut: { type: 'string', enum: ['ouverte', 'close'] },
        ouvertes_depuis_heures: { type: 'number', description: 'ne garder que les demandes reçues il y a au moins N heures' },
        limite: { type: 'integer', default: 50 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'compter_par_priorite',
    description: 'Compte les demandes ouvertes par priorité et par type. Lecture seule.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

function ouvrir() {
  return new DatabaseSync(BASE, { readOnly: true });
}

function colonnes(db) {
  return new Set(db.prepare('PRAGMA table_info(demandes)').all().map((c) => c.name));
}

function lister(args) {
  const db = ouvrir();
  try {
    const cols = colonnes(db);
    if (!cols.size) return [];
    const conditions = [];
    const valeurs = [];
    if (args.priorite && cols.has('priorite')) {
      conditions.push('priorite = ?');
      valeurs.push(args.priorite);
    }
    if (args.client && cols.has('client')) {
      conditions.push('LOWER(client) LIKE ?');
      valeurs.push(`%${String(args.client).toLowerCase()}%`);
    }
    if (args.statut) {
      conditions.push('statut = ?');
      valeurs.push(args.statut);
    }
    if (typeof args.ouvertes_depuis_heures === 'number') {
      conditions.push('cree_le <= ?');
      valeurs.push(new Date(Date.now() - args.ouvertes_depuis_heures * 3600_000).toISOString());
    }
    const limite = Math.min(Math.max(Number(args.limite) || 50, 1), 200);
    const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
    return db.prepare(['SELECT * FROM demandes', where, ' ORDER BY cree_le DESC LIMIT ?'].join('')).all(...valeurs, limite);
  } finally {
    db.close();
  }
}

function compter() {
  const db = ouvrir();
  try {
    if (!colonnes(db).has('priorite')) return [];
    return db.prepare("SELECT priorite, type, COUNT(*) AS nombre FROM demandes WHERE statut = 'ouverte' GROUP BY priorite, type ORDER BY priorite, type").all();
  } finally {
    db.close();
  }
}

const envoyer = (message) => process.stdout.write(`${JSON.stringify(message)}\n`);
const reponse = (id, result) => envoyer({ jsonrpc: '2.0', id, result });
const echec = (id, code, message) => envoyer({ jsonrpc: '2.0', id, error: { code, message } });

function traiter(msg) {
  const { id, method, params } = msg;
  switch (method) {
    case 'initialize':
      return reponse(id, {
        protocolVersion: params?.protocolVersion ?? '2025-06-18',
        capabilities: { tools: {} },
        serverInfo: { name: 'mcp-demandes', version: '1.0.0' },
        instructions: 'Base des demandes clients Guichet, en lecture seule.',
      });
    case 'notifications/initialized':
    case 'notifications/cancelled':
      return undefined;
    case 'ping':
      return reponse(id, {});
    case 'tools/list':
      return reponse(id, { tools: OUTILS });
    case 'tools/call': {
      const nom = params?.name;
      const args = params?.arguments ?? {};
      try {
        const donnees = nom === 'lister_demandes' ? lister(args) : nom === 'compter_par_priorite' ? compter() : null;
        if (donnees === null) return reponse(id, { isError: true, content: [{ type: 'text', text: `Outil inconnu : ${nom}` }] });
        return reponse(id, { content: [{ type: 'text', text: JSON.stringify(donnees, null, 2) }] });
      } catch (e) {
        return reponse(id, { isError: true, content: [{ type: 'text', text: `Base illisible (${BASE}) : ${e.message}` }] });
      }
    }
    default:
      if (id !== undefined) return echec(id, -32601, `Méthode non prise en charge : ${method}`);
      return undefined;
  }
}

const lignes = readline.createInterface({ input: process.stdin });
lignes.on('line', (ligne) => {
  if (!ligne.trim()) return;
  try {
    traiter(JSON.parse(ligne));
  } catch {
    echec(null, -32700, 'JSON invalide');
  }
});
