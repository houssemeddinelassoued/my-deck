// [A4.5] Filtre du tableau de bord par client.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Demande } from '../src/domaine/demande.ts';
import { filtrerParClient } from '../src/depot/filtre.ts';

const d = (id: string, client: string): Demande => ({ id, client, cree_le: '2026-11-14T08:00:00Z', statut: 'ouverte' });
const demandes = [d('D-1', 'Médina Retail'), d('D-2', 'Atlas Industrie'), d('D-3', 'Médina Retail')];

test('[A4.5] recherche partielle, sans casse ni accents', () => {
  assert.deepEqual(
    filtrerParClient(demandes, 'medina').map((x) => x.id),
    ['D-1', 'D-3'],
  );
  assert.deepEqual(
    filtrerParClient(demandes, 'ATLAS').map((x) => x.id),
    ['D-2'],
  );
});

test('[A4.5] filtre vide : toutes les demandes', () => {
  assert.equal(filtrerParClient(demandes, '').length, 3);
  assert.equal(filtrerParClient(demandes, null).length, 3);
});

test('[A4.5] aucun résultat', () => {
  assert.deepEqual(filtrerParClient(demandes, 'zzz'), []);
});
