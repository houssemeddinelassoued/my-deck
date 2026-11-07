// Atelier 6 · Relances, version moderne et corrigée (corrigé)

import { ErreurParafo } from './erreurs.js';

const UN_JOUR = 86_400_000;
const FORMAT_JOUR = /^\d{4}-\d{2}-\d{2}$/;

const versTexte = (date) => date.toISOString().slice(0, 10);

function versDate(jour) {
  if (typeof jour !== 'string' || !FORMAT_JOUR.test(jour)) {
    throw new ErreurParafo('DATE_INVALIDE', `Date attendue au format AAAA-MM-JJ : ${jour}`);
  }
  const date = new Date(`${jour}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || versTexte(date) !== jour) {
    throw new ErreurParafo('DATE_INVALIDE', `Date impossible : ${jour}`);
  }
  return date;
}

function estOuvre(date, feries) {
  const jourSemaine = date.getUTCDay();
  return jourSemaine !== 0 && jourSemaine !== 6 && !feries.has(versTexte(date));
}

/**
 * La date située n jours ouvrés après `date` (le jour de départ ne compte pas).
 * @param {string} date 'AAAA-MM-JJ'
 * @param {number} n entier ≥ 0
 * @param {string[]} [feries] jours fériés 'AAAA-MM-JJ' (non modifié)
 * @returns {string}
 * @throws {ErreurParafo} DELAI_INVALIDE, DATE_INVALIDE
 */
export function ajouterJoursOuvres(date, n, feries = []) {
  if (!Number.isInteger(n) || n < 0) {
    throw new ErreurParafo('DELAI_INVALIDE', 'Le délai doit être un entier positif ou nul.');
  }
  const jours = new Set(feries);
  let courante = versDate(date);
  let comptes = 0;
  while (comptes < n) {
    courante = new Date(courante.getTime() + UN_JOUR);
    if (estOuvre(courante, jours)) comptes++;
  }
  return versTexte(courante);
}

/** Date d'expiration : delaiJours jours ouvrés après l'envoi. */
export function dateExpiration(envoyeLe, delaiJours, feries = []) {
  return ajouterJoursOuvres(envoyeLe, delaiJours, feries);
}

/**
 * Dates de relance, tous les `intervalle` jours ouvrés, strictement avant l'expiration.
 * @throws {ErreurParafo} INTERVALLE_INVALIDE (en plus de ajouterJoursOuvres)
 */
export function datesRelance(envoyeLe, delaiJours, feries = [], intervalle = 3) {
  if (!Number.isInteger(intervalle) || intervalle < 1) {
    throw new ErreurParafo('INTERVALLE_INVALIDE', 'L’intervalle doit être un entier ≥ 1.');
  }
  dateExpiration(envoyeLe, delaiJours, feries); // valide les paramètres
  const relances = [];
  for (let k = intervalle; k < delaiJours; k += intervalle) {
    relances.push(ajouterJoursOuvres(envoyeLe, k, feries));
  }
  return relances;
}

/** Vrai si `aujourdhui` est strictement après la date d'expiration. */
export function estExpire(envoyeLe, delaiJours, aujourdhui, feries = []) {
  versDate(aujourdhui);
  return aujourdhui > dateExpiration(envoyeLe, delaiJours, feries);
}
