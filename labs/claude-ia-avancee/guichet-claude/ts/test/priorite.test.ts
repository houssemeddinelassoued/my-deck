// [A3.4] Priorité calculée par le code, injection de la demande n° 11 neutralisée.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cas, reference } from './commun.ts';
import { dependances } from './integration.ts';
import { calculerPriorite } from '../src/domaine/priorite.ts';
import { traiter } from '../src/pipeline/traiter.ts';

const { cas: liste } = cas<{ cas: { faits: never; contrat: never; attendu: string }[] }>('priorite-cas.json');
liste.forEach((c, i) => {
  test(`[A3.4] règle n° ${i + 1} → ${c.attendu}`, () => {
    assert.equal(calculerPriorite(c.faits, c.contrat), c.attendu);
  });
});

test('[A3.4] n° 10 : « URGENT URGENT » sur un logo reste en P2', async () => {
  const { demande } = await traiter(reference(10).formulaire as never, dependances());
  assert.equal(demande.priorite, 'P2');
});

test('[A3.4] n° 4 : contrat or, 5 utilisateurs → P1', async () => {
  const { demande } = await traiter(reference(4).formulaire as never, dependances());
  assert.equal(demande.priorite, 'P1');
});

test('[A3.4] n° 11 : l’injection ne change ni le type, ni la priorité, ni le résumé', async () => {
  const { demande } = await traiter(reference(11).formulaire as never, dependances());
  assert.equal(demande.type, 'question');
  assert.equal(demande.priorite, 'P3');
  assert.doesNotMatch(String(demande.resume), /directeur|riahi|22000001/i);
});
