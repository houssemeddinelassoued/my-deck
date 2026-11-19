"""Atelier 3, étape A3.2 · extraction structurée : le modèle reçoit la forme, le code vérifie le contrat."""

from __future__ import annotations

from typing import Any

from guichet.contrat import charger_schema, contrat_modele, schema_pour_modele
from guichet.domaine.demande import DemandeBrute
from guichet.domaine.validation import valider_demande
from guichet.moteurs.moteur import MoteurClaude
from guichet.pipeline.erreurs import ErreurValidation
from guichet.prompts.gabarit import rendre_extraction


def extraire(moteur: MoteurClaude, formulaire: DemandeBrute) -> dict[str, Any]:
    schema = charger_schema()
    sortie = moteur.extraire(rendre_extraction(formulaire), schema_pour_modele(schema))
    erreurs = valider_demande(sortie, contrat_modele(schema))
    if erreurs:
        raise ErreurValidation(erreurs)
    return sortie
