/** Créneau [start, end[ : la fin est exclue. */
export interface Slot {
  readonly start: Date;
  readonly end: Date;
}

export type Role = 'membre' | 'admin';

export interface User {
  readonly id: string;
  readonly name: string;
  readonly role: Role;
}

export interface Room {
  readonly id: string;
  readonly name: string;
  /** Nombre de places, au moins 1. */
  readonly capacity: number;
  readonly equipment: readonly string[];
}

export interface Booking extends Slot {
  readonly id: string;
  readonly roomId: string;
  readonly ownerId: string;
  readonly subject: string;
}
