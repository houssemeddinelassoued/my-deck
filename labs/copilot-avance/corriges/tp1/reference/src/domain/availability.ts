import { overlaps } from './overlap.js';
import type { Booking, Room, Slot } from './types.js';

/**
 * Salles libres sur tout le créneau [start, end[, pour une capacité minimale.
 *
 * Une salle est libre si aucune de ses réservations ne chevauche le créneau.
 * Résultat trié par capacité croissante (puis par nom, pour un ordre stable).
 * Fonction pure : aucun paramètre n'est modifié.
 *
 * @example
 * // Atlas réservée 10h–11h : libre à 11h, occupée à 10h30.
 */
export function findAvailableRooms(
  rooms: readonly Room[],
  bookings: readonly Booking[],
  slot: Slot,
  minCapacity: number,
): Room[] {
  return rooms
    .filter((room) => room.capacity >= minCapacity)
    .filter((room) => !bookings.some((b) => b.roomId === room.id && overlaps(b, slot)))
    .sort((a, b) => a.capacity - b.capacity || a.name.localeCompare(b.name));
}
