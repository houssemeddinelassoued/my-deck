// [A1.2] Normalisation : 24 cas (donnees/normalisation-cas.json), un test par cas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cas } from './commun.ts';
import { normaliserDemande } from '../src/domaine/normaliser.ts';

const { aujourdhui, cas: liste } = cas<{ aujourdhui: string; cas: { categorie: string; entree: string; attendu: unknown }[] }>('normalisation-cas.json');

for (const c of liste) {
  test(`[A1.2] ${c.categorie} « ${c.entree} »`, () => {
    const sortie = normaliserDemande({ message: '', [c.categorie]: c.entree }, aujourdhui) as unknown as Record<string, unknown>;
    assert.deepEqual(sortie[c.categorie], c.attendu);
  });
}
