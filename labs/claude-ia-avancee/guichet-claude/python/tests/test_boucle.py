"""[A2.3] Boucle générer → vérifier → corriger, avec un générateur et un vérificateur simulés."""

from guichet.outils.boucle import Verification, boucle


def test_A2_3_arret_au_premier_tour_vert():
    tours = {"n": 0}

    def generer(_t, _r):
        tours["n"] += 1

    r = boucle("t", generer, lambda: Verification(ok=tours["n"] == 2, sortie=f"sortie {tours['n']}"))
    assert r.ok and r.tour == 2


def test_A2_3_renvoie_la_sortie_exacte():
    recus: list[str] = []
    n = {"v": 0}

    def verifier():
        n["v"] += 1
        return Verification(ok=n["v"] == 3, sortie=f"✗ sql-concatene ligne {n['v']}")

    boucle("t", lambda _t, retours: recus.append(retours), verifier)
    assert recus == ["", "✗ sql-concatene ligne 1", "✗ sql-concatene ligne 2"]


def test_A2_3_echec_apres_trois_tours():
    r = boucle("t", lambda _t, _r: None, lambda: Verification(ok=False, sortie="rouge"))
    assert not r.ok and len(r.historique) == 3
