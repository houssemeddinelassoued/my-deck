"""Atelier 3, étape A3.4 · comment le texte du client est présenté au modèle.

Le texte du formulaire est une DONNÉE non fiable : il est délimité, et le prompt le dit.
"""

from __future__ import annotations

import re

from guichet.domaine.demande import DemandeBrute

CHAMPS = ("nom", "entreprise", "email", "telephone", "message")


def _propre(s: str | None) -> str:
    # On retire toute balise que le client aurait glissée pour « sortir » du bloc.
    return re.sub(r"</?demande_client>", "", s or "", flags=re.IGNORECASE)


def construire_message(formulaire: DemandeBrute) -> str:
    lignes = [f"{c}: {_propre(formulaire.get(c))}" for c in CHAMPS]
    return "\n".join(["<demande_client>", *lignes, "</demande_client>"])
