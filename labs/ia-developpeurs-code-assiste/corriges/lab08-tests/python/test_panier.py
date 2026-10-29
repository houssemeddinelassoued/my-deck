"""Tests du panier (corrigé) : 100 % des branches, 8/8 mutants tués."""

import pytest

from panier import FRAIS_LIVRAISON, Panier, Produit, StockInsuffisant


@pytest.fixture
def clavier():
    return Produit("KB-01", "Clavier", 4_999, stock=10)


@pytest.fixture
def souris():
    return Produit("MS-02", "Souris", 1_500, stock=3)


@pytest.fixture
def panier():
    return Panier()


# ── Ajouter ────────────────────────────────────────────────────────────────
def test_panier_vide(panier):
    assert (panier.total(), panier.livraison(), panier.nombre_articles()) == (0, 0, 0)


def test_ajouter_cumule_les_quantites(panier, clavier):
    panier.ajouter(clavier, 2)
    panier.ajouter(clavier)
    assert panier.lignes == {"KB-01": 3}


@pytest.mark.parametrize("quantite", [0, -1])
def test_quantite_invalide(panier, clavier, quantite):
    with pytest.raises(ValueError, match="quantité"):
        panier.ajouter(clavier, quantite)


def test_maximum_99_par_article(panier):
    beaucoup = Produit("CB-09", "Câble", 300, stock=500)
    panier.ajouter(beaucoup, 99)
    with pytest.raises(ValueError, match="maximum"):
        panier.ajouter(beaucoup)


def test_stock_juste_suffisant(panier, souris):
    panier.ajouter(souris, 3)
    assert panier.nombre_articles() == 3


def test_stock_insuffisant(panier, souris):
    panier.ajouter(souris, 3)
    with pytest.raises(StockInsuffisant):
        panier.ajouter(souris)
    assert panier.lignes == {"MS-02": 3}, "un ajout refusé ne doit rien modifier"


# ── Retirer ────────────────────────────────────────────────────────────────
def test_retirer_partiellement(panier, clavier):
    panier.ajouter(clavier, 3)
    panier.retirer("KB-01", 2)
    assert panier.lignes == {"KB-01": 1}


@pytest.mark.parametrize("quantite", [None, 3, 5])
def test_retirer_toute_la_ligne(panier, clavier, quantite):
    panier.ajouter(clavier, 3)
    panier.retirer("KB-01", quantite)
    assert panier.lignes == {}


def test_retirer_article_absent(panier):
    with pytest.raises(KeyError):
        panier.retirer("XX-00")


# ── Codes et montants ──────────────────────────────────────────────────────
def test_code_insensible_a_la_casse(panier):
    panier.appliquer_code("moins10")
    assert panier.code_promo == "MOINS10"


def test_code_inconnu(panier):
    with pytest.raises(ValueError):
        panier.appliquer_code("GRATUIT")


def test_rabais_de_10_pour_cent(panier, clavier):
    panier.ajouter(clavier, 2)  # 99,98 $
    panier.appliquer_code("MOINS10")
    assert panier.rabais() == 999
    assert panier.total() == 9_998 - 999


def test_livraison_sous_le_seuil(panier, souris):
    panier.ajouter(souris)
    assert panier.livraison() == FRAIS_LIVRAISON
    assert panier.total() == 1_500 + FRAIS_LIVRAISON


def test_livraison_gratuite_exactement_au_seuil(panier):
    panier.ajouter(Produit("SP-50", "Support", 5_000, stock=1))
    assert panier.livraison() == 0


def test_le_rabais_peut_faire_perdre_la_livraison_gratuite(panier):
    panier.ajouter(Produit("SP-50", "Support", 5_000, stock=1))
    panier.appliquer_code("MOINS10")
    assert panier.livraison() == FRAIS_LIVRAISON


def test_code_livraison(panier, souris):
    panier.ajouter(souris)
    panier.appliquer_code("LIVRAISON")
    assert (panier.rabais(), panier.livraison()) == (0, 0)
