// TaskFlow · src/backlog.js — CORRIGÉ (Atelier 5)
import { STATUTS, creerTicket } from './tickets.js';

/** Minuscules, sans accents : « Sécurité » → « securite ». */
const sansAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Trie le backlog : priorité croissante, puis points croissants (non estimés en bas), puis id.
 * @param {Array<{ id: number, priorite: number, points: number | null }>} tickets
 * @returns {Array} un nouveau tableau ; l'original n'est pas modifié
 */
export function trierBacklog(tickets) {
  const pts = (t) => (t.points === null ? Number.POSITIVE_INFINITY : t.points);
  return [...tickets].sort((a, b) => a.priorite - b.priorite || pts(a) - pts(b) || a.id - b.id);
}

/**
 * Filtre sur trois critères cumulés.
 * @param {Array<{ titre: string, type: string, priorite: number }>} tickets
 * @param {{ texte?: string, type?: string | null, priorite?: number | null }} [filtres]
 * @returns {Array} les tickets qui respectent tous les critères
 */
export function filtrerBacklog(tickets, { texte = '', type = null, priorite = null } = {}) {
  const cherche = sansAccents(texte.trim());
  return tickets.filter(
    (t) =>
      (cherche === '' || sansAccents(t.titre).includes(cherche)) &&
      (type === null || t.type === type) &&
      (priorite === null || t.priorite === priorite),
  );
}

/**
 * Indicateurs du backlog.
 * @param {Array<{ points: number | null, statut: string }>} tickets
 * @returns {{ nombre: number, totalPoints: number, nonEstimes: number, parStatut: Record<string, number>, avancement: number }}
 */
export function statistiques(tickets) {
  const parStatut = Object.fromEntries(STATUTS.map((s) => [s, 0]));
  let totalPoints = 0;
  let pointsTermines = 0;
  let nonEstimes = 0;
  for (const t of tickets) {
    parStatut[t.statut] += 1;
    if (t.points === null) nonEstimes += 1;
    else {
      totalPoints += t.points;
      if (t.statut === 'termine') pointsTermines += t.points;
    }
  }
  const avancement = totalPoints === 0 ? 0 : Math.round((pointsTermines / totalPoints) * 100);
  return { nombre: tickets.length, totalPoints, nonEstimes, parStatut, avancement };
}

/** Un backlog : une liste de tickets et ses opérations. */
export class Backlog {
  #tickets;
  #aujourdHui;

  /**
   * @param {Array} [tickets] copiés à la construction
   * @param {{ aujourdHui: string }} contexte date du jour AAAA-MM-JJ
   */
  constructor(tickets = [], { aujourdHui }) {
    this.#tickets = tickets.map((t) => ({ ...t }));
    this.#aujourdHui = aujourdHui;
  }

  /**
   * Ajoute un ticket (id suivant).
   * @param {object} donnees
   * @returns {object} le ticket créé
   */
  ajouter(donnees) {
    const id = this.#tickets.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    const ticket = creerTicket(donnees, { id, aujourdHui: this.#aujourdHui });
    this.#tickets.push(ticket);
    return ticket;
  }

  /**
   * @param {number} id
   * @returns {boolean} vrai si un ticket a été retiré
   */
  supprimer(id) {
    const avant = this.#tickets.length;
    this.#tickets = this.#tickets.filter((t) => t.id !== id);
    return this.#tickets.length < avant;
  }

  /** @param {number} id */
  trouver(id) {
    return this.#tickets.find((t) => t.id === id);
  }

  /** @param {Parameters<typeof filtrerBacklog>[1]} [filtres] */
  lister(filtres) {
    return trierBacklog(filtrerBacklog(this.#tickets, filtres));
  }

  get stats() {
    return statistiques(this.#tickets);
  }
}
