// [A3.3] Boucle d'outils : chercher_client puis enregistrer_demande, jusqu'à end_turn.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reference } from './commun.ts';
import { dependances } from './integration.ts';
import { traiter } from '../src/pipeline/traiter.ts';

test('[A3.3] la demande n° 1 est enregistrée pour Atlas Industrie', async () => {
  const deps = dependances();
  const { demande, nouvelle } = await traiter(reference(1).formulaire as never, deps);
  assert.equal(nouvelle, true);
  assert.equal(demande.client_id, 'C-0142');
  assert.equal(demande.type, 'incident');
  assert.equal(deps.depot.lister().length, 1);
});

test('[A3.3] la demande n° 8 est rattachée à Baltic Freight', async () => {
  const { demande } = await traiter(reference(8).formulaire as never, dependances());
  assert.equal(demande.client_id, 'C-0302');
  assert.equal(demande.type, 'devis');
});
