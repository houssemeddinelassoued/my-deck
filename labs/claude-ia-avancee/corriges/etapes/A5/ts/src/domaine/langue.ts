// Défi final (Atelier 5) · langue de la demande et équipe de routage.
// Heuristique déterministe et testable : on compte les mots-outils de chaque langue.
// Voir decisions/langue.md pour les pistes écartées (appel au modèle, bibliothèque externe).

export type Langue = 'fr' | 'en';

const EN = new Set(['the', 'is', 'are', 'our', 'your', 'you', 'we', 'it', 'and', 'to', 'of', 'an', 'for', 'with', 'has', 'have', 'been', 'since', 'could', 'would', 'when', 'can', 'please', 'hello', 'about', 'this', 'that', 'not', 'be', 'on', 'in', 'at', 'whole']);
const FR = new Set(['le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'est', 'sont', 'ne', 'pas', 'plus', 'notre', 'nos', 'votre', 'vous', 'nous', 'depuis', 'pour', 'avec', 'sur', 'dans', 'merci', 'bonjour', 'à', 'au', 'aux', 'ce', 'cette', 'qui', 'que', 'en']);

export function detecterLangue(texte: string): Langue {
  const mots = String(texte ?? '').toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);
  const en = mots.filter((m) => EN.has(m)).length;
  const fr = mots.filter((m) => FR.has(m)).length;
  return en > fr ? 'en' : 'fr';
}

export function equipePour(langue: Langue): string {
  return langue === 'en' ? 'Europe' : 'Tunis';
}
