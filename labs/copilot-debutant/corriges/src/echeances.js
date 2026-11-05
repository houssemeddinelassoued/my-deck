// TaskFlow · src/echeances.js — CORRIGÉ (Atelier 9)

const FORMAT = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Convertit une date AAAA-MM-JJ en numéro de jour (UTC : aucun effet des changements d'heure).
 * @param {string} jour
 * @returns {number}
 * @throws {Error} « Échéance invalide : <valeur> »
 */
function numeroDeJour(jour) {
  if (typeof jour !== 'string' || !FORMAT.test(jour)) throw new Error(`Échéance invalide : ${jour}`);
  const [a, m, j] = jour.split('-').map(Number);
  const ms = Date.UTC(a, m - 1, j);
  if (new Date(ms).getUTCDate() !== j) throw new Error(`Échéance invalide : ${jour}`);
  return ms / 86_400_000;
}

/**
 * Un ticket est en retard si son échéance est passée et qu'il n'est pas terminé.
 * L'échéance du jour même n'est pas un retard.
 * @param {{ echeance?: string, statut: string }} ticket
 * @param {string} aujourdHui date du jour AAAA-MM-JJ (injectée)
 * @returns {boolean}
 */
export function estEnRetard(ticket, aujourdHui) {
  if (ticket.echeance === undefined || ticket.echeance === null) return false;
  const echeance = numeroDeJour(ticket.echeance);
  if (ticket.statut === 'termine') return false;
  return echeance < numeroDeJour(aujourdHui);
}

/**
 * Nombre de jours calendaires de retard (0 si le ticket est à l'heure).
 * @param {{ echeance?: string, statut: string }} ticket
 * @param {string} aujourdHui
 * @returns {number}
 */
export function joursDeRetard(ticket, aujourdHui) {
  if (!estEnRetard(ticket, aujourdHui)) return 0;
  return numeroDeJour(aujourdHui) - numeroDeJour(/** @type {string} */ (ticket.echeance));
}

/**
 * Les tickets en retard, les plus en retard d'abord, puis par priorité (1 = haute).
 * Ne modifie pas la liste reçue.
 * @param {Array<{ echeance?: string, statut: string, priorite: number }>} tickets
 * @param {string} aujourdHui
 * @returns {Array<object>}
 */
export function ticketsEnRetard(tickets, aujourdHui) {
  return tickets
    .filter((t) => estEnRetard(t, aujourdHui))
    .map((t) => ({ t, jours: joursDeRetard(t, aujourdHui) }))
    .sort((a, b) => b.jours - a.jours || a.t.priorite - b.t.priorite)
    .map(({ t }) => t);
}
