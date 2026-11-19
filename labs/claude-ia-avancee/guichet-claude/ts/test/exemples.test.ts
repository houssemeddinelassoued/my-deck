// [A1.3] Exemples dynamiques : sélection par mots-clés, un exemple par type, tri stable.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cas } from './commun.ts';
import { choisirExemples, lireExemples } from '../src/prompts/exemples.ts';

const { cas: liste } = cas<{ cas: { texte: string; k: number; attendu: string[] }[] }>('exemples-cas.json');

for (const c of liste) {
  test(`[A1.3] k=${c.k} « ${c.texte.slice(0, 40)}… »`, () => {
    assert.deepEqual(
      choisirExemples(c.texte, lireExemples(), c.k).map((e) => e.id),
      c.attendu,
    );
  });
}
