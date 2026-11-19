import { describe, it, expect } from 'vitest';
import { overlaps } from '../../src/domain/overlap.js';
import type { Slot } from '../../src/domain/types.js';

// Date fixe : jamais l'heure réelle.
const h = (hh: number, mm = 0): Date => new Date(Date.UTC(2026, 10, 12, hh, mm));
const slot = (start: Date, end: Date): Slot => ({ start, end });

describe('overlaps', () => {
  it.each([
    ['créneaux identiques', slot(h(10), h(11)), slot(h(10), h(11)), true],
    ['chevauchement partiel', slot(h(10), h(11)), slot(h(10, 30), h(11, 30)), true],
    ['inclusion', slot(h(9), h(12)), slot(h(10), h(11)), true],
    ['une minute de recouvrement', slot(h(10), h(11)), slot(h(10, 59), h(12)), true],
    ['bout à bout (borne exclue)', slot(h(10), h(11)), slot(h(11), h(12)), false],
    ['bout à bout inversé', slot(h(11), h(12)), slot(h(10), h(11)), false],
    ['disjoints', slot(h(8), h(9)), slot(h(14), h(15)), false],
    ['une minute d’écart', slot(h(10), h(11)), slot(h(11, 1), h(12)), false],
  ])('%s', (_nom, a, b, attendu) => {
    expect(overlaps(a, b)).toBe(attendu);
  });

  it('est symétrique', () => {
    const a = slot(h(10), h(11));
    const b = slot(h(10, 30), h(12));
    expect(overlaps(a, b)).toBe(overlaps(b, a));
  });

  it('ne modifie pas ses paramètres', () => {
    const a = Object.freeze(slot(h(10), h(11)));
    const b = Object.freeze(slot(h(10, 30), h(11, 30)));
    expect(() => overlaps(a, b)).not.toThrow();
    expect(a.start.getTime()).toBe(h(10).getTime());
  });
});
