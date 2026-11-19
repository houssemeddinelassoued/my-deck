"""Atelier 3, étape A3.4 · comment le texte du client est présenté au modèle."""

from __future__ import annotations

from guichet.domaine.demande import DemandeBrute

CHAMPS = ("nom", "entreprise", "email", "telephone", "message")


def construire_message(formulaire: DemandeBrute) -> str:
    # Provisoire : le texte du client est posé tel quel, au milieu de nos consignes.
    return "\n".join(f"{c}: {formulaire.get(c, '') or ''}" for c in CHAMPS)
