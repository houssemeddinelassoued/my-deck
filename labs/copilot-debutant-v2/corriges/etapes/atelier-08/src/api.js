// API HTTP de Parafo, écrite comme une fonction pure : facile à tester sans serveur.
// Le serveur (scripts/serveur.js) ne fait que lui passer les requêtes.
// Corrigé de l'Atelier 8 (ticket 2 : GET /documents/:id/statut).

import { estTermine } from './document.js';

const ID_DOCUMENT = /^DOC-[0-9a-f]{8}$/;
const CHEMIN_STATUT = /^\/documents\/([^/]+)\/statut$/;

function json(statut, corps) {
  return {
    statut,
    entetes: { 'content-type': 'application/json; charset=utf-8' },
    corps: JSON.stringify(corps),
  };
}

/**
 * Traite une requête de l'API.
 * @param {{ methode: string, chemin: string }} requete
 * @param {Array<object>} registre les documents connus
 * @returns {{ statut: number, entetes: object, corps: string }}
 */
export function traiterRequete({ methode, chemin }, registre) {
  const { pathname } = new URL(chemin, 'http://parafo.local');

  if (pathname === '/documents') {
    if (methode !== 'GET') return json(405, { erreur: 'METHODE_NON_AUTORISEE' });
    return json(200, registre.map(({ id, titre, etat }) => ({ id, titre, etat })));
  }

  const statut = CHEMIN_STATUT.exec(pathname);
  if (statut) {
    if (methode !== 'GET') return json(405, { erreur: 'METHODE_NON_AUTORISEE' });
    const id = statut[1];
    if (!ID_DOCUMENT.test(id)) return json(400, { erreur: 'ID_INVALIDE' });
    const document = registre.find((d) => d.id === id);
    if (!document) return json(404, { erreur: 'DOCUMENT_INCONNU' });
    return json(200, { id: document.id, etat: document.etat, termine: estTermine(document) });
  }

  return json(404, { erreur: 'RESSOURCE_INCONNUE' });
}

export { estTermine };
