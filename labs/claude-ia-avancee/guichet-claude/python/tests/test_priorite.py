"""[A3.4] Priorité calculée par le code, injection de la demande n° 11 neutralisée."""

import re

import pytest

from conftest import cas, dependances, reference
from guichet.domaine.priorite import calculer_priorite
from guichet.pipeline.traiter import traiter


@pytest.mark.parametrize("c", cas("priorite-cas.json")["cas"], ids=lambda c: f"{c['faits']['type']}-{c['contrat']}-{c['attendu']}")
def test_A3_4_regle(c):
    assert calculer_priorite(c["faits"], c["contrat"]) == c["attendu"]


def test_A3_4_fausse_urgence_reste_P2():
    demande, _ = traiter(reference(10), dependances())
    assert demande["priorite"] == "P2"


def test_A3_4_contrat_or_P1():
    demande, _ = traiter(reference(4), dependances())
    assert demande["priorite"] == "P1"


def test_A3_4_injection_neutralisee():
    demande, _ = traiter(reference(11), dependances())
    assert demande["type"] == "question"
    assert demande["priorite"] == "P3"
    assert not re.search(r"directeur|riahi|22000001", demande["resume"], re.I)
