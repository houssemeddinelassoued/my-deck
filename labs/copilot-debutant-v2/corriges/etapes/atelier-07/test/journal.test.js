// Atelier 7 · Tests du journal d'audit (corrigé : généré avec la skill tests-node, puis complété)

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GENESE, TYPES, calculerEmpreinte, creerJournal, verifierChaine } from '../src/journal.js';

const horlogeFixe = (iso = '2026-11-10T08:00:00.000Z') => () => new Date(iso);
const evenement = (champs = {}) => ({ type: 'depot', documentId: 'DOC-3f9a1c07', acteur: 'claire.dumas@parafo.example', ...champs });

function journalDeTrois() {
  const journal = creerJournal({ horloge: horlogeFixe() });
  journal.ajouter(evenement());
  journal.ajouter(evenement({ type: 'envoi' }));
  journal.ajouter(evenement({ type: 'signature', acteur: 'karim.benali@parafo.example' }));
  return journal;
}

describe('creerJournal · ajouter', () => {
  it('crée une première entrée chaînée à la genèse (64 zéros)', () => {
    const journal = creerJournal({ horloge: horlogeFixe() });

    const entree = journal.ajouter(evenement());

    assert.equal(entree.index, 0);
    assert.equal(entree.precedente, '0'.repeat(64));
    assert.equal(GENESE, '0'.repeat(64));
  });

  it('horodate avec l’horloge injectée', () => {
    const journal = creerJournal({ horloge: horlogeFixe('2026-01-02T03:04:05.000Z') });

    const entree = journal.ajouter(evenement());

    assert.equal(entree.horodatage, '2026-01-02T03:04:05.000Z');
  });

  it('chaîne chaque entrée à l’empreinte de la précédente', () => {
    const [premiere, deuxieme] = journalDeTrois().lister();

    assert.equal(deuxieme.precedente, premiere.empreinte);
    assert.equal(deuxieme.index, 1);
  });

  it('calcule une empreinte SHA-256 cohérente avec calculerEmpreinte', () => {
    const entree = creerJournal({ horloge: horlogeFixe() }).ajouter(evenement());

    assert.match(entree.empreinte, /^[0-9a-f]{64}$/);
    assert.equal(entree.empreinte, calculerEmpreinte(entree));
  });

  it('fige l’entrée renvoyée', () => {
    const entree = creerJournal({ horloge: horlogeFixe() }).ajouter(evenement());

    assert.ok(Object.isFrozen(entree));
  });

  it('accepte tous les types connus', () => {
    const journal = creerJournal({ horloge: horlogeFixe() });

    for (const type of TYPES) journal.ajouter(evenement({ type }));

    assert.equal(journal.taille, TYPES.length);
  });

  for (const [champs, code] of [
    [{ type: 'archivage' }, 'TYPE_INCONNU'],
    [{ type: undefined }, 'TYPE_INCONNU'],
    [{ documentId: '' }, 'DOCUMENT_MANQUANT'],
    [{ documentId: '   ' }, 'DOCUMENT_MANQUANT'],
    [{ acteur: undefined }, 'ACTEUR_MANQUANT'],
  ]) {
    it(`refuse ${JSON.stringify(champs)} (${code})`, () => {
      const journal = creerJournal({ horloge: horlogeFixe() });

      assert.throws(() => journal.ajouter(evenement(champs)), (e) => e.code === code);
      assert.equal(journal.taille, 0);
    });
  }
});

describe('lister · parDocument · taille', () => {
  it('lister renvoie une copie : la modifier ne change pas le journal', () => {
    const journal = journalDeTrois();

    const liste = journal.lister();
    liste.length = 0;

    assert.equal(journal.taille, 3);
    assert.equal(journal.lister().length, 3);
  });

  it('parDocument ne renvoie que les entrées du document demandé', () => {
    const journal = creerJournal({ horloge: horlogeFixe() });
    journal.ajouter(evenement({ documentId: 'DOC-aaaaaaaa' }));
    journal.ajouter(evenement({ documentId: 'DOC-bbbbbbbb' }));
    journal.ajouter(evenement({ documentId: 'DOC-aaaaaaaa', type: 'envoi' }));

    const entrees = journal.parDocument('DOC-aaaaaaaa');

    assert.deepEqual(entrees.map((e) => e.index), [0, 2]);
  });
});

describe('verifier · verifierChaine', () => {
  it('un journal intact est valide', () => {
    assert.deepEqual(journalDeTrois().verifier(), { valide: true, indexCorrompu: null });
  });

  it('un journal vide est valide', () => {
    assert.deepEqual(verifierChaine([]), { valide: true, indexCorrompu: null });
  });

  it('détecte une entrée falsifiée au milieu', () => {
    const entrees = journalDeTrois().lister();
    entrees[1] = { ...entrees[1], acteur: 'pirate@exemple.invalid' };

    assert.deepEqual(verifierChaine(entrees), { valide: false, indexCorrompu: 1 });
  });

  it('détecte une falsification de la DERNIÈRE entrée', () => {
    const entrees = journalDeTrois().lister();
    entrees[2] = { ...entrees[2], type: 'refus' };

    assert.deepEqual(verifierChaine(entrees), { valide: false, indexCorrompu: 2 });
  });

  it('détecte un chaînage cassé même si l’empreinte de l’entrée a été recalculée', () => {
    const entrees = journalDeTrois().lister();
    const falsifiee = { ...entrees[1], acteur: 'pirate@exemple.invalid' };
    falsifiee.empreinte = calculerEmpreinte(falsifiee);
    entrees[1] = falsifiee;

    assert.deepEqual(verifierChaine(entrees), { valide: false, indexCorrompu: 2 });
  });

  it('détecte une première entrée qui ne part pas de la genèse', () => {
    const entrees = journalDeTrois().lister();
    const premiere = { ...entrees[0], precedente: 'f'.repeat(64) };
    premiere.empreinte = calculerEmpreinte(premiere);

    assert.equal(verifierChaine([premiere]).valide, false);
  });
});
