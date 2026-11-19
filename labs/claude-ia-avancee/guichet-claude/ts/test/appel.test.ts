// [A3.1] Premier appel par le SDK officiel (sur le simulateur : ANTHROPIC_BASE_URL).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MoteurApi } from '../src/moteurs/api.ts';

test('[A3.1] appelSimple renvoie le texte de la réponse', async () => {
  const texte = await new MoteurApi().appelSimple('Bonjour, ici Guichet');
  assert.equal(typeof texte, 'string');
  assert.ok(texte.length > 0, 'réponse vide');
  assert.match(texte, /Guichet/);
});
