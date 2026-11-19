"""[A1.2] Normalisation : 24 cas (donnees/normalisation-cas.json), un test par cas."""

import pytest

from conftest import cas
from guichet.domaine.normaliser import normaliser_demande

DONNEES = cas("normalisation-cas.json")


@pytest.mark.parametrize("c", DONNEES["cas"], ids=lambda c: f"{c['categorie']}-{c['entree']}")
def test_A1_2_normalisation(c):
    sortie = normaliser_demande({"message": "", c["categorie"]: c["entree"]}, DONNEES["aujourdhui"])
    assert sortie[c["categorie"]] == c["attendu"]
