import { describe, it, expect } from 'vitest';
import { findAvailableRooms } from '../../src/domain/availability.js';

const h = (hh: number, mm = 0) => new Date(Date.UTC(2026, 10, 12, hh, mm));
const slot = (start: Date, end: Date) => ({ start, end });
const room = (id: string, name: string, capacity: number) => ({ id, name, capacity, equipment: [] as string[] });
const booking = (roomId: string, start: Date, end: Date) => ({ id: `b-${roomId}`, roomId, ownerId: 'alice', subject: 'x', start, end });
const rooms = [room('d', 'Delta', 20), room('a', 'Atlas', 4), room('b', 'Borée', 8), room('c', 'Cyprès', 12)];

describe('acceptance · findAvailableRooms', () => {
  it('sans réservation : capacité suffisante, tri croissant', () => {
    expect(findAvailableRooms(rooms, [], slot(h(10), h(11)), 8).map((r) => r.name)).toEqual(['Borée', 'Cyprès', 'Delta']);
  });
  it('salle libre à 11h après 10h–11h (borne)', () => {
    const noms = findAvailableRooms(rooms, [booking('a', h(10), h(11))], slot(h(11), h(12)), 1).map((r) => r.name);
    expect(noms).toContain('Atlas');
  });
  it('salle exclue de 10h30 à 11h30', () => {
    const noms = findAvailableRooms(rooms, [booking('a', h(10), h(11))], slot(h(10, 30), h(11, 30)), 1).map((r) => r.name);
    expect(noms).not.toContain('Atlas');
  });
  it('réservation d’une autre salle ignorée', () => {
    const noms = findAvailableRooms(rooms, [booking('b', h(10), h(11))], slot(h(10), h(11)), 4).map((r) => r.name);
    expect(noms).toEqual(['Atlas', 'Cyprès', 'Delta']);
  });
});
