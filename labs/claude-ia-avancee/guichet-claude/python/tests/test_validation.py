"""[A2.1] Validation par le contrat : chaque cas de donnees/validation-cas.json."""

import pytest

from conftest import cas
from guichet.contrat import charger_schema
from guichet.domaine.validation import valider_demande

DONNEES = cas("validation-cas.json")


@pytest.mark.parametrize("c", DONNEES["cas"], ids=lambda c: c["nom"])
def test_A2_1_validation(c):
    objet = {**DONNEES["base"], **c.get("modifs", {})}
    for k in c.get("supprimer", []):
        objet.pop(k, None)
    erreurs = valider_demande(objet, charger_schema())
    assert (len(erreurs) == 0) == c["valide"], f"écarts trouvés : {erreurs}"
