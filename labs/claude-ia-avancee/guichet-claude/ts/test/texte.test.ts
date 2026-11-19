// [BOUCLE] Tâche de la boucle : tronquerResume (donnees/texte-cas.json).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cas } from './commun.ts';
import { tronquerResume } from '../src/domaine/texte.ts';

const { cas: liste } = cas<{ cas: { texte: string; max: number; attendu: string }[] }>('texte-cas.json');

for (const c of liste) {
  test(`[BOUCLE] « ${c.texte} » (max ${c.max})`, () => {
    const r = tronquerResume(c.texte, c.max);
    assert.equal(r, c.attendu);
    assert.ok(r.length <= c.max);
  });
}
