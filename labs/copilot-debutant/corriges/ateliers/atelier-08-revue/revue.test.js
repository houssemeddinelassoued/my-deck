// CORRIGÉ Atelier 8 · un describe par défaut. Chaque test échoue sur la suggestion d'origine.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { trierParPriorite } from './suggestions/01-trier-par-priorite.js';
import { moyennePoints } from './suggestions/02-moyenne-points.js';
import { rechercher } from './suggestions/03-rechercher.js';
import { htmlCarte } from './suggestions/04-afficher-carte.js';
import { listerTickets } from './suggestions/05-client-api.js';
import { dedoublonner } from './suggestions/06-dedoublonner.js';
import { joursRestants } from './suggestions/07-jours-restants.js';

describe('Revue · 01 trierParPriorite', () => {
  it('trie sans modifier l’original', () => {
    const t = [{ priorite: 3 }, { priorite: 1 }];
    assert.deepEqual(trierParPriorite(t), [{ priorite: 1 }, { priorite: 3 }]);
    assert.deepEqual(t, [{ priorite: 3 }, { priorite: 1 }]);
  });
});

describe('Revue · 02 moyennePoints', () => {
  it('ignore les tickets non estimés', () => {
    assert.equal(moyennePoints([{ points: 3 }, { points: null }, { points: 5 }]), 4);
  });
  it('renvoie 0 pour une liste vide (et pas NaN)', () => {
    assert.equal(moyennePoints([]), 0);
  });
});

describe('Revue · 03 rechercher', () => {
  it('accepte les caractères spéciaux sans planter', () => {
    assert.equal(rechercher([{ titre: 'Migrer le module C++' }], 'c++').length, 1);
    assert.doesNotThrow(() => rechercher([{ titre: 'x' }], '(urgent'));
  });
  it('ne traite pas la saisie comme un motif', () => {
    assert.equal(rechercher([{ titre: 'abc' }], '.*').length, 0);
  });
});

describe('Revue · 04 htmlCarte', () => {
  it('échappe le titre', () => {
    const html = htmlCarte({ titre: '<img src=x onerror=alert(1)>', points: 3 });
    assert.ok(!html.includes('<img'));
  });
});

describe('Revue · 05 listerTickets', () => {
  it('n’envoie pas le jeton dans l’URL et utilise HTTPS', async () => {
    let appel;
    const fetchFn = async (url, init) => {
      appel = { url, init };
      return { ok: true, status: 200, json: async () => [] };
    };
    await listerTickets(fetchFn, 'jeton-de-test');
    assert.ok(appel.url.startsWith('https://'));
    assert.ok(!appel.url.includes('token'));
    assert.equal(appel.init?.headers?.Authorization, 'Bearer jeton-de-test');
  });
});

describe('Revue · 06 dedoublonner', () => {
  it('reste rapide sur 50 000 tickets', () => {
    const t = Array.from({ length: 50_000 }, (_, i) => ({ titre: `T${i % 25_000}` }));
    const debut = performance.now();
    assert.equal(dedoublonner(t).length, 25_000);
    assert.ok(performance.now() - debut < 500);
  });
});

describe('Revue · 07 joursRestants', () => {
  it('compte 1 jour pour une échéance demain', () => {
    assert.equal(joursRestants('2026-11-05', '2026-11-04'), 1);
  });
  it('traverse le changement d’heure', () => {
    assert.equal(joursRestants('2026-10-26', '2026-10-24'), 2);
  });
});
