"""[A1.3] Exemples dynamiques : sélection par mots-clés, un exemple par type, tri stable."""

import pytest

from conftest import cas
from guichet.prompts.exemples import choisir_exemples, lire_exemples


@pytest.mark.parametrize("c", cas("exemples-cas.json")["cas"], ids=lambda c: f"k{c['k']}-{c['texte'][:20]}")
def test_A1_3_exemples(c):
    assert [e["id"] for e in choisir_exemples(c["texte"], lire_exemples(), c["k"])] == c["attendu"]
