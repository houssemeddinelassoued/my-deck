// Atelier 8 · Ticket 1 : export CSV du registre (corrigé)

import { ErreurParafo } from './erreurs.js';

const COLONNES = Object.freeze(['id', 'titre', 'auteur', 'etat', 'creeLe']);
const DEBUT_FORMULE = /^[=+\-@\t]/;

function neutraliser(valeur) {
  const texte = valeur === undefined || valeur === null ? '' : String(valeur);
  return DEBUT_FORMULE.test(texte) ? `'${texte}` : texte;
}

function echapper(texte, separateur) {
  const aProteger = texte.includes(separateur) || /["\r\n]/.test(texte);
  return aProteger ? `"${texte.replaceAll('"', '""')}"` : texte;
}

/**
 * Exporte le registre au format CSV (Excel en français : séparateur « ; », BOM UTF-8).
 * @param {Array<object>} documents
 * @param {{ separateur?: string, bom?: boolean }} [options]
 * @returns {string}
 * @throws {ErreurParafo} REGISTRE_INVALIDE, SEPARATEUR_INVALIDE
 */
export function exporterRegistreCsv(documents, { separateur = ';', bom = true } = {}) {
  if (!Array.isArray(documents)) {
    throw new ErreurParafo('REGISTRE_INVALIDE', 'Le registre doit être un tableau de documents.');
  }
  if (typeof separateur !== 'string' || separateur.length !== 1) {
    throw new ErreurParafo('SEPARATEUR_INVALIDE', 'Le séparateur doit être un caractère unique.');
  }
  const lignes = [
    COLONNES.join(separateur),
    ...documents.map((doc) => COLONNES.map((col) => echapper(neutraliser(doc?.[col]), separateur)).join(separateur)),
  ];
  return `${bom ? '﻿' : ''}${lignes.join('\r\n')}\r\n`;
}
