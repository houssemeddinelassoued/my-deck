import { describe, it, expect } from 'vitest';
import type { Booking, Room, Slot, User } from '../../src/domain/types.js';

// Ce fichier est compilé par tsc : un type manquant, trop large ou modifiable le fait échouer.
describe('acceptance · types du domaine', () => {
  it('les formes attendues sont exprimables', () => {
    const room = { id: 'r1', name: 'Atlas', capacity: 4 } satisfies Pick<Room, 'id' | 'name' | 'capacity'>;
    const slot = { start: new Date(0), end: new Date(1) } satisfies Slot;
    const user = { id: 'u1', role: 'membre' } satisfies Pick<User, 'id' | 'role'>;
    const booking = { id: 'b1', roomId: 'r1', ownerId: 'u1', ...slot } satisfies Pick<Booking, 'id' | 'roomId' | 'ownerId' | 'start' | 'end'>;
    expect(room.capacity + user.id.length + booking.id.length).toBeGreaterThan(0);
  });

  it('le rôle est une union (membre | admin), pas un string', () => {
    // @ts-expect-error 'root' n'est pas un rôle valide
    const mauvais: User['role'] = 'root';
    expect(mauvais).toBe('root');
  });

  it('les champs sont en lecture seule', () => {
    const room = { id: 'r1', name: 'Atlas', capacity: 4, equipment: [] } as unknown as Room;
    // @ts-expect-error capacity est readonly
    room.capacity = 5;
    expect(room.capacity).toBe(5);
  });
});
