import { describe, it, expect } from 'vitest';
import { findAvailableRooms } from '../../src/domain/availability.js';
import type { Booking, Room, Slot } from '../../src/domain/types.js';

const h = (hh: number, mm = 0): Date => new Date(Date.UTC(2026, 10, 12, hh, mm));
const slot = (start: Date, end: Date): Slot => ({ start, end });
const room = (id: string, name: string, capacity: number): Room => ({ id, name, capacity, equipment: [] });
const booking = (roomId: string, start: Date, end: Date): Booking => ({ id: `b-${roomId}`, roomId, ownerId: 'alice', subject: 'réunion', start, end });

const rooms = [room('d', 'Delta', 20), room('a', 'Atlas', 4), room('b', 'Borée', 8), room('c', 'Cyprès', 12)];

describe('findAvailableRooms', () => {
  it('sans réservation : les salles assez grandes, triées par capacité croissante', () => {
    const noms = findAvailableRooms(rooms, [], slot(h(10), h(11)), 8).map((r) => r.name);
    expect(noms).toEqual(['Borée', 'Cyprès', 'Delta']);
  });

  it('une réservation 10h–11h : la salle est libre à 11h (borne)', () => {
    const res = [booking('a', h(10), h(11))];
    const noms = findAvailableRooms(rooms, res, slot(h(11), h(12)), 1).map((r) => r.name);
    expect(noms).toContain('Atlas');
  });

  it('une réservation 10h–11h : la salle est exclue de 10h30 à 11h30', () => {
    const res = [booking('a', h(10), h(11))];
    const noms = findAvailableRooms(rooms, res, slot(h(10, 30), h(11, 30)), 1).map((r) => r.name);
    expect(noms).not.toContain('Atlas');
    expect(noms).toHaveLength(3);
  });

  it('ignore les réservations des autres salles', () => {
    const res = [booking('b', h(10), h(11))];
    const noms = findAvailableRooms(rooms, res, slot(h(10), h(11)), 4).map((r) => r.name);
    expect(noms).toEqual(['Atlas', 'Cyprès', 'Delta']);
  });

  it('retourne une liste vide si aucune salle ne convient', () => {
    expect(findAvailableRooms(rooms, [], slot(h(10), h(11)), 50)).toEqual([]);
  });

  it('ne modifie pas ses paramètres', () => {
    const copie = rooms.map((r) => r.name);
    findAvailableRooms(rooms, [], slot(h(10), h(11)), 1);
    expect(rooms.map((r) => r.name)).toEqual(copie);
  });
});
