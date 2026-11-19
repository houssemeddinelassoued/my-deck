"""[BOUCLE] Tâche de la boucle : tronquer_resume (donnees/texte-cas.json)."""

import pytest

from conftest import cas
from guichet.domaine.texte import tronquer_resume


@pytest.mark.parametrize("c", cas("texte-cas.json")["cas"], ids=lambda c: f"{c['texte'][:15]}-{c['max']}")
def test_BOUCLE_tronquer(c):
    r = tronquer_resume(c["texte"], c["max"])
    assert r == c["attendu"]
    assert len(r) <= c["max"]
