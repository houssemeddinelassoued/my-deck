"""[A4.2] Le champ site_web (ajouté au contrat par la Skill) va du formulaire à la base."""

from conftest import dependances, reference
from guichet.pipeline.traiter import traiter


def test_A4_2_site_web_enregistre():
    deps = dependances()
    demande, _ = traiter({**reference(6), "site_web": "https://djerba-sante.tn"}, deps)
    assert demande.get("site_web") == "https://djerba-sante.tn"
    assert deps.depot.lister()[0].get("site_web") == "https://djerba-sante.tn"
