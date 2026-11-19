"""[A5] Défi final : langue détectée et équipe de routage, de bout en bout."""

import pytest

from conftest import cas, dependances, reference
from guichet.domaine.langue import detecter_langue, equipe_pour
from guichet.pipeline.traiter import traiter


@pytest.mark.parametrize("c", cas("langue-cas.json")["cas"], ids=lambda c: f"{c['langue']}-{c['texte'][:20]}")
def test_A5_langue(c):
    langue = detecter_langue(c["texte"])
    assert langue == c["langue"]
    assert equipe_pour(langue) == c["equipe"]


def test_A5_routage_de_bout_en_bout():
    demande, _ = traiter(reference(5), dependances())
    assert demande.get("langue") == "en"
    assert demande.get("equipe") == "Europe"
