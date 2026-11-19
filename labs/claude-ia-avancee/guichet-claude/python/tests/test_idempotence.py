"""[A3.5] Idempotence : la même demande soumise deux fois n'est enregistrée qu'une fois."""

from conftest import dependances, reference
from guichet.pipeline.traiter import traiter


def test_A3_5_deuxieme_envoi():
    deps = dependances()
    premier, _ = traiter(reference(2), deps)
    second, nouvelle = traiter(reference(2), deps)
    assert nouvelle is False
    assert second["id"] == premier["id"]
    assert len(deps.depot.lister()) == 1
