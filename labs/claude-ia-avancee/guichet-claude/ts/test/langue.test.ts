// [A5] Défi final : langue détectée et équipe de routage, de bout en bout.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cas, reference } from './commun.ts';
import { dependances } from './integration.ts';
import { detecterLangue, equipePour } from '../src/domaine/langue.ts';
import { traiter } from '../src/pipeline/traiter.ts';

const { cas: liste } = cas<{ cas: { texte: string; langue: 'fr' | 'en'; equipe: string }[] }>('langue-cas.json');
liste.forEach((c, i) => {
  test(`[A5] cas ${i + 1} → ${c.langue} / ${c.equipe}`, () => {
    const l = detecterLangue(c.texte);
    assert.equal(l, c.langue);
    assert.equal(equipePour(l), c.equipe);
  });
});

test('[A5] la demande n° 5 (anglais) est routée vers l’équipe Europe', async () => {
  const { demande } = await traiter(reference(5).formulaire as never, dependances());
  assert.equal(demande.langue, 'en');
  assert.equal(demande.equipe, 'Europe');
});
