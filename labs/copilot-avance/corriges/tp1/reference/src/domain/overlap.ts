import type { Slot } from './types.js';

/**
 * Indique si deux créneaux se chevauchent.
 *
 * Les créneaux sont des intervalles [start, end[ : la fin est exclue, donc
 * 10h–11h et 11h–12h ne se chevauchent pas, alors que 10h–11h et
 * 10h30–11h30 se chevauchent. Fonction pure, symétrique, sans effet de bord.
 *
 * La validité d'un créneau (fin > début) est vérifiée par le service
 * appelant, pas ici.
 *
 * @example
 * overlaps(slot(10, 11), slot(11, 12)); // false
 * overlaps(slot(10, 11), slot(10.5, 11.5)); // true
 */
export function overlaps(a: Slot, b: Slot): boolean {
  return a.start < b.end && b.start < a.end;
}
