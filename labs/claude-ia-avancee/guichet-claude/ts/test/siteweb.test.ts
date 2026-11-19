// [A4.2] Le champ site_web (ajouté au contrat par la Skill) va du formulaire à la base.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reference } from './commun.ts';
import { dependances } from './integration.ts';
import { traiter } from '../src/pipeline/traiter.ts';

test('[A4.2] site_web est enregistré avec la demande', async () => {
  const deps = dependances();
  const formulaire = { ...reference(6).formulaire, site_web: 'https://djerba-sante.tn' };
  const { demande } = await traiter(formulaire as never, deps);
  assert.equal(demande.site_web, 'https://djerba-sante.tn');
  assert.equal(deps.depot.lister()[0].site_web, 'https://djerba-sante.tn');
});
