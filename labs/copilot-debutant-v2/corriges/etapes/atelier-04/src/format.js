// Atelier 4 · Affichage des documents (corrigé, version AVEC instructions)

import { ErreurParafo } from './erreurs.js';

const LIBELLES = Object.freeze({
  brouillon: 'brouillon',
  en_circulation: 'en circulation',
  signe: 'signé',
  refuse: 'refusé',
  expire: 'expiré',
  annule: 'annulé',
});

/**
 * Référence lisible d'un document : PAR-AAAA-NNNN.
 * @param {number} numero entier de 1 à 9999
 * @param {number} annee entier de 2000 à 2099
 * @returns {string}
 * @throws {ErreurParafo} NUMERO_INVALIDE, ANNEE_INVALIDE
 */
export function formaterReference(numero, annee) {
  if (!Number.isInteger(numero) || numero < 1 || numero > 9999) {
    throw new ErreurParafo('NUMERO_INVALIDE', 'Le numéro doit être un entier de 1 à 9999.');
  }
  if (!Number.isInteger(annee) || annee < 2000 || annee > 2099) {
    throw new ErreurParafo('ANNEE_INVALIDE', 'L’année doit être un entier de 2000 à 2099.');
  }
  return `PAR-${annee}-${String(numero).padStart(4, '0')}`;
}

/**
 * Taille lisible : o, Ko ou Mo (1 Ko = 1024 o), une décimale, virgule.
 * @param {number} octets entier ≥ 0
 * @returns {string}
 * @throws {ErreurParafo} TAILLE_INVALIDE
 */
export function formaterTaille(octets) {
  if (!Number.isInteger(octets) || octets < 0) {
    throw new ErreurParafo('TAILLE_INVALIDE', 'La taille doit être un entier positif ou nul.');
  }
  const virgule = (valeur) => valeur.toFixed(1).replace('.', ',');
  if (octets < 1024) return `${octets} o`;
  if (octets < 1024 * 1024) return `${virgule(octets / 1024)} Ko`;
  return `${virgule(octets / (1024 * 1024))} Mo`;
}

/**
 * Résumé d'un document sur une ligne.
 * @param {{ id: string, titre: string, etat: string, taille: number }} document
 * @returns {string} « titre » · état · taille · id
 * @throws {ErreurParafo} DOCUMENT_INVALIDE
 */
export function resumerDocument(document) {
  const { id, titre, etat, taille } = document ?? {};
  if (typeof id !== 'string' || typeof titre !== 'string' || !(etat in LIBELLES) || !Number.isInteger(taille)) {
    throw new ErreurParafo('DOCUMENT_INVALIDE', 'Document incomplet ou état inconnu.');
  }
  return `« ${titre} » · ${LIBELLES[etat]} · ${formaterTaille(taille)} · ${id}`;
}
