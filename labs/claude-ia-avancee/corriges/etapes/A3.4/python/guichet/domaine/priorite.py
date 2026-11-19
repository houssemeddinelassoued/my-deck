"""Atelier 3, étape A3.4 · la priorité est une règle métier : c'est le code qui décide, pas le modèle.

Règle : hors incident → P3 ; incident avec panne totale ou au moins 20 utilisateurs touchés → P1 ;
sinon P1 pour un contrat « or », P2 pour les autres.
"""

from __future__ import annotations

from typing import Any


def calculer_priorite(faits: dict[str, Any], contrat: str | None) -> str:
    if faits.get("type") != "incident":
        return "P3"
    if faits.get("panne_totale") or (faits.get("utilisateurs_touches") or 0) >= 20:
        return "P1"
    return "P1" if contrat == "or" else "P2"
