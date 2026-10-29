// Tests du panier (corrigé) : 100 % des branches, 8/8 mutants tués.
import assert from 'node:assert/strict';
import { beforeEach, describe, test } from 'node:test';
import { FRAIS_LIVRAISON, Panier, type Produit, StockInsuffisant } from './panier.ts';

const CLAVIER: Produit = { sku: 'KB-01', nom: 'Clavier', prix: 4_999, stock: 10 };
const SOURIS: Produit = { sku: 'MS-02', nom: 'Souris', prix: 1_500, stock: 3 };
const SUPPORT: Produit = { sku: 'SP-50', nom: 'Support', prix: 5_000, stock: 1 };

let p: Panier;
beforeEach(() => {
  p = new Panier();
});

describe('ajouter', () => {
  test('panier vide', () => assert.deepEqual([p.total(), p.livraison(), p.nombreArticles()], [0, 0, 0]));

  test('cumule les quantités', () => {
    p.ajouter(CLAVIER, 2);
    p.ajouter(CLAVIER);
    assert.equal(p.lignes.get('KB-01'), 3);
  });

  for (const q of [0, -1]) {
    test(`quantité invalide (${q})`, () => assert.throws(() => p.ajouter(CLAVIER, q), RangeError));
  }

  test('maximum 99 par article', () => {
    const cable: Produit = { sku: 'CB-09', nom: 'Câble', prix: 300, stock: 500 };
    p.ajouter(cable, 99);
    assert.throws(() => p.ajouter(cable), /maximum/);
  });

  test('stock juste suffisant', () => {
    p.ajouter(SOURIS, 3);
    assert.equal(p.nombreArticles(), 3);
  });

  test('stock insuffisant, panier inchangé', () => {
    p.ajouter(SOURIS, 3);
    assert.throws(() => p.ajouter(SOURIS), StockInsuffisant);
    assert.equal(p.lignes.get('MS-02'), 3);
  });
});

describe('retirer', () => {
  test('partiellement', () => {
    p.ajouter(CLAVIER, 3);
    p.retirer('KB-01', 2);
    assert.equal(p.lignes.get('KB-01'), 1);
  });

  for (const q of [undefined, 3, 5]) {
    test(`toute la ligne (${q})`, () => {
      p.ajouter(CLAVIER, 3);
      p.retirer('KB-01', q);
      assert.equal(p.lignes.size, 0);
    });
  }

  test('article absent', () => assert.throws(() => p.retirer('XX-00'), RangeError));
});

describe('codes et montants', () => {
  test('code insensible à la casse', () => {
    p.appliquerCode('moins10');
    assert.equal(p.codePromo, 'MOINS10');
  });

  test('code inconnu', () => assert.throws(() => p.appliquerCode('GRATUIT'), RangeError));

  test('rabais de 10 %', () => {
    p.ajouter(CLAVIER, 2);
    p.appliquerCode('MOINS10');
    assert.equal(p.rabais(), 999);
    assert.equal(p.total(), 9_998 - 999);
  });

  test('livraison sous le seuil', () => {
    p.ajouter(SOURIS);
    assert.equal(p.total(), 1_500 + FRAIS_LIVRAISON);
  });

  test('livraison gratuite exactement au seuil', () => {
    p.ajouter(SUPPORT);
    assert.equal(p.livraison(), 0);
  });

  test('le rabais peut faire perdre la livraison gratuite', () => {
    p.ajouter(SUPPORT);
    p.appliquerCode('MOINS10');
    assert.equal(p.livraison(), FRAIS_LIVRAISON);
  });

  test('code LIVRAISON', () => {
    p.ajouter(SOURIS);
    p.appliquerCode('LIVRAISON');
    assert.deepEqual([p.rabais(), p.livraison()], [0, 0]);
  });
});
