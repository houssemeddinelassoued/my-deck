// Atelier 3 · Le document à signer (corrigé)

import { createHash } from 'node:crypto';
import { ErreurParafo } from './erreurs.js';

/** Taille maximale d'un document : 10 Mo. */
export const TAILLE_MAX = 10 * 1024 * 1024;

/** États possibles d'un document. */
export const ETATS = Object.freeze(['brouillon', 'en_circulation', 'signe', 'refuse', 'expire', 'annule']);

/** Transitions autorisées depuis chaque état (un état terminal n'en a aucune). */
export const TRANSITIONS = Object.freeze({
  brouillon: Object.freeze(['en_circulation', 'annule']),
  en_circulation: Object.freeze(['signe', 'refuse', 'expire', 'annule']),
  signe: Object.freeze([]),
  refuse: Object.freeze([]),
  expire: Object.freeze([]),
  annule: Object.freeze([]),
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Empreinte SHA-256 d'un contenu.
 * @param {string | Uint8Array} contenu
 * @returns {string} 64 caractères hexadécimaux
 */
export function empreinteSha256(contenu) {
  return createHash('sha256').update(contenu).digest('hex');
}

/**
 * Crée un document à l'état brouillon.
 * @param {{ titre: string, contenu: string | Uint8Array, auteur: string, maintenant?: Date }} donnees
 * @returns {object} le document
 * @throws {ErreurParafo} TITRE_INVALIDE, CONTENU_INVALIDE, DOCUMENT_TROP_VOLUMINEUX, AUTEUR_INVALIDE
 */
export function creerDocument({ titre, contenu, auteur, maintenant = new Date() } = {}) {
  const titrePropre = typeof titre === 'string' ? titre.trim() : '';
  if (titrePropre.length < 3 || titrePropre.length > 120) {
    throw new ErreurParafo('TITRE_INVALIDE', 'Le titre doit contenir entre 3 et 120 caractères.');
  }

  const estTexte = typeof contenu === 'string';
  if (!(estTexte || contenu instanceof Uint8Array) || contenu.length === 0) {
    throw new ErreurParafo('CONTENU_INVALIDE', 'Le contenu doit être un texte ou des octets non vides.');
  }
  const taille = estTexte ? Buffer.byteLength(contenu, 'utf8') : contenu.byteLength;
  if (taille > TAILLE_MAX) {
    throw new ErreurParafo('DOCUMENT_TROP_VOLUMINEUX', 'Le document dépasse 10 Mo.');
  }

  const auteurPropre = typeof auteur === 'string' ? auteur.trim().toLowerCase() : '';
  if (!EMAIL.test(auteurPropre)) {
    throw new ErreurParafo('AUTEUR_INVALIDE', 'L’auteur doit être une adresse e-mail valide.');
  }

  const empreinte = empreinteSha256(contenu);
  const le = maintenant.toISOString();
  return {
    id: `DOC-${empreinte.slice(0, 8)}`,
    titre: titrePropre,
    auteur: auteurPropre,
    empreinte,
    taille,
    etat: 'brouillon',
    creeLe: le,
    historique: [{ etat: 'brouillon', le }],
  };
}

/**
 * Change l'état d'un document, sans modifier l'original.
 * @throws {ErreurParafo} ETAT_INCONNU, TRANSITION_INTERDITE
 */
export function changerEtat(document, nouvelEtat, maintenant = new Date()) {
  if (!ETATS.includes(nouvelEtat)) {
    throw new ErreurParafo('ETAT_INCONNU', `État inconnu : ${nouvelEtat}`);
  }
  if (!(TRANSITIONS[document.etat] ?? []).includes(nouvelEtat)) {
    throw new ErreurParafo('TRANSITION_INTERDITE', `Passage ${document.etat} → ${nouvelEtat} interdit.`);
  }
  const le = maintenant.toISOString();
  return { ...document, etat: nouvelEtat, historique: [...document.historique, { etat: nouvelEtat, le }] };
}

/**
 * Le document a-t-il atteint un état terminal ?
 * @throws {ErreurParafo} ETAT_INCONNU
 */
export function estTermine(document) {
  const suivants = TRANSITIONS[document?.etat];
  if (!suivants) throw new ErreurParafo('ETAT_INCONNU', `État inconnu : ${document?.etat}`);
  return suivants.length === 0;
}
