"""Atelier 3, étape A3.4 · la priorité est une règle métier : c'est le code qui décide, pas le modèle.

Règle : hors incident → P3 ; incident avec panne totale ou au moins 20 utilisateurs touchés → P1 ;
sinon P1 pour un contrat « or », P2 pour les autres.
"""

from __future__ import annotations

from typing import Any


def calculer_priorite(faits: dict[str, Any], contrat: str | None) -> str:
    # Provisoire : on fait confiance à l'avis du modèle. À remplacer par la règle ci-dessus (A3.4).
    del contrat
    return faits.get("priorite") or "P2"
