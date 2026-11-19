"""[A3.2] Extraction structurée : sorties conformes au contrat, refus des demandes incomplètes."""

import pytest

from conftest import reference
from guichet.moteurs.api import MoteurApi
from guichet.pipeline.erreurs import ErreurValidation
from guichet.pipeline.extraire import extraire


def test_A3_2_devis_sahel():
    faits = extraire(MoteurApi(), reference(3))
    assert faits["type"] == "devis"
    assert faits["client"] == "Sahel Logistique"


def test_A3_2_demande_incomplete_refusee():
    with pytest.raises(ErreurValidation):
        extraire(MoteurApi(), reference(12))
