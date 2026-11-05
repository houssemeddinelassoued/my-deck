// TaskFlow · src/kanban.js — CORRIGÉ (Atelier 6)
import { STATUTS } from './tickets.js';

/** Nombre maximal de tickets « encours ». */
export const LIMITE_WIP = 3;
/** Colonnes du tableau, dans l'ordre. */
export const COLONNES = STATUTS;

/**
 * Déplace un ticket vers un statut en appliquant les règles R1–R4.
 * @param {Array<{ id: number, statut: string, points: number | null }>} tickets
 * @param {number} id
 * @param {string} versStatut
 * @param {{ aujourdHui?: string }} [contexte] date du jour AAAA-MM-JJ (pour termineLe)
 * @returns {{ ok: true, tickets: Array } | { ok: false, erreur: string }}
 */
export function deplacerTicket(tickets, id, versStatut, { aujourdHui } = {}) {
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return { ok: false, erreur: 'Ticket introuvable' };
  if (!COLONNES.includes(versStatut)) return { ok: false, erreur: `Statut inconnu : ${versStatut}` };
  if (ticket.statut === 'backlog' && versStatut !== 'backlog' && ticket.points === null) {
    return { ok: false, erreur: 'Ticket non estimé' };
  }
  if (versStatut === 'encours' && ticket.statut !== 'encours') {
    const enCours = tickets.filter((t) => t.statut === 'encours').length;
    if (enCours >= LIMITE_WIP) return { ok: false, erreur: `WIP atteint (${enCours}/${LIMITE_WIP})` };
  }
  if (versStatut === 'termine' && ticket.statut !== 'encours') {
    return { ok: false, erreur: 'Seul un ticket en cours peut être terminé' };
  }
  const deplace = { ...ticket, statut: versStatut, ...(versStatut === 'termine' ? { termineLe: aujourdHui } : {}) };
  return { ok: true, tickets: tickets.map((t) => (t.id === id ? deplace : t)) };
}
