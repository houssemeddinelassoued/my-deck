"""[A3.3] Boucle d'outils : chercher_client puis enregistrer_demande, jusqu'à end_turn."""

from conftest import dependances, reference
from guichet.pipeline.traiter import traiter


def test_A3_3_atlas_industrie():
    deps = dependances()
    demande, nouvelle = traiter(reference(1), deps)
    assert nouvelle is True
    assert demande["client_id"] == "C-0142"
    assert demande["type"] == "incident"
    assert len(deps.depot.lister()) == 1


def test_A3_3_baltic_freight():
    demande, _ = traiter(reference(8), dependances())
    assert demande["client_id"] == "C-0302"
    assert demande["type"] == "devis"
