// Tests écrits par l'agent Testeur QA (Atelier 9, fonctionnalité bonus), relus par un humain.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { exporterCsv, parserCsv } from '../src/api.js';

describe('exporterCsv', () => {
  const tickets = [
    { titre: 'Export PDF des factures', type: 'story', priorite: 2, points: 5 },
    { titre: 'Bug ; séparateur', type: 'bug', priorite: 1, points: null },
  ];

  it('commence par l’en-tête attendu par parserCsv', () => {
    assert.equal(exporterCsv([]), 'titre;type;priorite;points\n');
  });
  it('aller-retour : parserCsv relit exactement les tickets exportés', () => {
    const { tickets: relus, rejets } = parserCsv(exporterCsv(tickets));
    assert.deepEqual(rejets, []);
    assert.deepEqual(relus, [tickets[0], { ...tickets[1], titre: 'Bug séparateur' }]);
  });
  it('un ticket non estimé garde une colonne points vide', () => {
    assert.match(exporterCsv([tickets[1]]), /;bug;1;\n$/);
  });
});
