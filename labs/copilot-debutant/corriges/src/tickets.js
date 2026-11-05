// TaskFlow · src/tickets.js — CORRIGÉ (Atelier 4)

/** Types de ticket. */
export const TYPES = Object.freeze(['story', 'bug', 'tache']);
/** Statuts, dans l'ordre du flux. */
export const STATUTS = Object.freeze(['backlog', 'afaire', 'encours', 'termine']);
/** Priorités : 1 haute, 2 moyenne, 3 basse. */
export const PRIORITES = Object.freeze([1, 2, 3]);
/** Estimations autorisées (planning poker). */
export const POINTS_VALIDES = Object.freeze([1, 2, 3, 5, 8, 13]);

/**
 * Vrai si l'estimation est autorisée : null (non estimé) ou une valeur de POINTS_VALIDES.
 * @param {unknown} points
 * @returns {boolean}
 */
export function estPointsValide(points) {
  return points === null || POINTS_VALIDES.includes(/** @type {number} */ (points));
}

/**
 * Valide un ticket et renvoie TOUTES les erreurs.
 * @param {{ titre?: unknown, type?: unknown, priorite?: unknown, points?: unknown, statut?: unknown }} ticket
 * @returns {{ ok: boolean, erreurs: string[] }}
 */
export function validerTicket(ticket) {
  const erreurs = [];
  const titre = typeof ticket.titre === 'string' ? ticket.titre.trim() : '';
  if (titre.length < 3 || titre.length > 80) erreurs.push('titre invalide');
  if (!TYPES.includes(/** @type {string} */ (ticket.type))) erreurs.push('type invalide');
  if (!PRIORITES.includes(/** @type {number} */ (ticket.priorite))) erreurs.push('priorite invalide');
  if (!estPointsValide(ticket.points)) erreurs.push('points invalides');
  if (!STATUTS.includes(/** @type {string} */ (ticket.statut))) erreurs.push('statut invalide');
  return { ok: erreurs.length === 0, erreurs };
}

/**
 * Crée un ticket complet à partir de données partielles.
 * @param {{ titre?: string, type?: string, priorite?: number, points?: number | null, statut?: string }} donnees
 * @param {{ id: number, aujourdHui: string }} contexte  date du jour au format AAAA-MM-JJ
 * @returns {{ id: number, titre: string, type: string, priorite: number, points: number | null, statut: string, creeLe: string }}
 * @throws {Error} si les données sont invalides
 */
export function creerTicket(donnees, { id, aujourdHui }) {
  const ticket = {
    id,
    titre: typeof donnees.titre === 'string' ? donnees.titre.trim() : '',
    type: donnees.type ?? 'tache',
    priorite: donnees.priorite ?? 2,
    points: donnees.points ?? null,
    statut: donnees.statut ?? 'backlog',
    creeLe: aujourdHui,
  };
  const { ok, erreurs } = validerTicket(ticket);
  if (!ok) throw new Error(`Ticket invalide : ${erreurs.join(', ')}`);
  return ticket;
}
