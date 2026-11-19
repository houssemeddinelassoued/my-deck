// [A3.2] Extraction structurée : sorties conformes au contrat, refus des demandes incomplètes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reference } from './commun.ts';
import { MoteurApi } from '../src/moteurs/api.ts';
import { ErreurValidation } from '../src/pipeline/erreurs.ts';
import { extraire } from '../src/pipeline/extraire.ts';

test('[A3.2] la demande n° 3 est un devis de Sahel Logistique', async () => {
  const faits = await extraire(new MoteurApi(), reference(3).formulaire as never);
  assert.equal(faits.type, 'devis');
  assert.equal(faits.client, 'Sahel Logistique');
});

test('[A3.2] la demande n° 12 (incomplète) est refusée par le contrat', async () => {
  await assert.rejects(extraire(new MoteurApi(), reference(12).formulaire as never), ErreurValidation);
});
