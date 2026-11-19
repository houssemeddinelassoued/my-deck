// [A2.3] Boucle générer → vérifier → corriger, avec un générateur et un vérificateur simulés.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boucle } from '../src/outils/boucle.ts';

test('[A2.3] s’arrête au premier tour vert', async () => {
  let tours = 0;
  const r = await boucle(
    't',
    async () => {
      tours++;
    },
    async () => ({ ok: tours === 2, sortie: `sortie ${tours}` }),
  );
  assert.equal(r.ok, true);
  assert.equal(r.tour, 2);
});

test('[A2.3] renvoie la sortie exacte de la vérification au tour suivant', async () => {
  const recus: string[] = [];
  let n = 0;
  await boucle(
    't',
    async (_t, retours) => {
      recus.push(retours);
    },
    async () => ({ ok: ++n === 3, sortie: `✗ sql-concatene ligne ${n}` }),
  );
  assert.deepEqual(recus, ['', '✗ sql-concatene ligne 1', '✗ sql-concatene ligne 2']);
});

test('[A2.3] échoue après 3 tours avec l’historique complet', async () => {
  const r = await boucle(
    't',
    async () => {},
    async () => ({ ok: false, sortie: 'rouge' }),
  );
  assert.equal(r.ok, false);
  assert.equal(r.historique.length, 3);
});
