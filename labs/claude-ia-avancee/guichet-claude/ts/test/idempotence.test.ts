// [A3.5] Idempotence : la même demande soumise deux fois n'est enregistrée qu'une fois.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reference } from './commun.ts';
import { dependances } from './integration.ts';
import { traiter } from '../src/pipeline/traiter.ts';

test('[A3.5] deuxième envoi : même demande, pas de nouvelle ligne', async () => {
  const deps = dependances();
  const premier = await traiter(reference(2).formulaire as never, deps);
  const second = await traiter(reference(2).formulaire as never, deps);
  assert.equal(second.nouvelle, false);
  assert.equal(second.demande.id, premier.demande.id);
  assert.equal(deps.depot.lister().length, 1);
});
