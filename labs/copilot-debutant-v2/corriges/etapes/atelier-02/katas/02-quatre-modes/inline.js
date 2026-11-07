// Atelier 2 · Corrigé (identique pour les quatre modes : seul le chemin pour y arriver change)

import { ErreurParafo } from '../../src/erreurs.js';

const invalide = () => new ErreurParafo('EMAIL_INVALIDE', 'Adresse e-mail invalide.');

export function normaliserEmail(email) {
  if (typeof email !== 'string') throw invalide();
  const propre = email.trim().toLowerCase();
  const morceaux = propre.split('@');
  if (morceaux.length !== 2) throw invalide();
  const [locale, domaine] = morceaux;
  if (locale === '' || domaine === '' || /\s/.test(propre)) throw invalide();
  if (!domaine.includes('.') || domaine.startsWith('.') || domaine.endsWith('.')) throw invalide();
  const sansAlias = locale.split('+')[0];
  if (sansAlias === '') throw invalide();
  return `${sansAlias}@${domaine}`;
}
