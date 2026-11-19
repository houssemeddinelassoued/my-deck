"""[A3.1] Premier appel par le SDK officiel (sur le simulateur : ANTHROPIC_BASE_URL)."""

from guichet.moteurs.api import MoteurApi


def test_A3_1_appel_simple():
    texte = MoteurApi().appel_simple("Bonjour, ici Guichet")
    assert isinstance(texte, str) and texte
    assert "Guichet" in texte
