import { describe, it, expect } from 'vitest';
import { overlaps } from '../../src/domain/overlap.js';

const h = (hh: number, mm = 0) => new Date(Date.UTC(2026, 10, 12, hh, mm));
const slot = (start: Date, end: Date) => ({ start, end });

describe('acceptance · overlaps', () => {
  it.each([
    ['créneaux identiques', slot(h(10), h(11)), slot(h(10), h(11)), true],
    ['chevauchement partiel', slot(h(10), h(11)), slot(h(10, 30), h(11, 30)), true],
    ['inclusion', slot(h(9), h(12)), slot(h(10), h(11)), true],
    ['bout à bout (borne)', slot(h(10), h(11)), slot(h(11), h(12)), false],
    ['bout à bout inversé (borne)', slot(h(11), h(12)), slot(h(10), h(11)), false],
    ['disjoints', slot(h(8), h(9)), slot(h(14), h(15)), false],
  ])('%s', (_nom, a, b, attendu) => {
    expect(overlaps(a, b)).toBe(attendu);
  });
});
