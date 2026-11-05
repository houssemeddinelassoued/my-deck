// Modèle de fichier de tests TaskFlow (référencé par la skill tests-node).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { maFonction } from '../src/mon-module.js';

// Arrange : une fabrique de données minimales.
const t = (surcharges = {}) => ({ id: 1, titre: 'Ticket', type: 'tache', priorite: 2, points: 3, statut: 'encours', creeLe: '2026-10-01', ...surcharges });

describe('maFonction', () => {
  it('cas nominal : décrit le comportement attendu', () => {
    const resultat = maFonction(t(), '2026-11-05'); // Act : un seul appel
    assert.equal(resultat, true); // Assert
  });

  it('cas limite : valeur au mauvais format → erreur explicite', () => {
    assert.throws(() => maFonction(t({ echeance: '05/11/2026' }), '2026-11-05'), /invalide/);
  });

  it('ne modifie pas la donnée reçue', () => {
    const donnee = t();
    const copie = structuredClone(donnee);
    maFonction(donnee, '2026-11-05');
    assert.deepEqual(donnee, copie);
  });
});
