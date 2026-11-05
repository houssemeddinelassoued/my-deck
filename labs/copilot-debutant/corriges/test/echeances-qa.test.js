// Tests ajoutés par l'agent Testeur QA (Atelier 9), relus par un humain.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { estEnRetard, joursDeRetard } from '../src/echeances.js';

const t = (echeance, statut = 'encours') => ({ id: 1, titre: 'T', type: 'tache', priorite: 2, points: 1, statut, echeance });

describe('échéances · cas limites (Testeur QA)', () => {
  it('année bissextile : du 28 février au 1er mars 2028, deux jours', () => {
    assert.equal(joursDeRetard(t('2028-02-28'), '2028-03-01'), 2);
  });
  it('date impossible (31 avril) : erreur explicite', () => {
    assert.throws(() => estEnRetard(t('2026-04-31'), '2026-11-05'), /Échéance invalide/);
  });
  it('changement d’année', () => {
    assert.equal(joursDeRetard(t('2026-12-31'), '2027-01-02'), 2);
  });
  it('ticket au backlog en retard : compte aussi', () => {
    assert.equal(estEnRetard(t('2026-11-01', 'backlog'), '2026-11-05'), true);
  });
});
