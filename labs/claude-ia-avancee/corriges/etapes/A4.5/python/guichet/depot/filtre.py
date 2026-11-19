"""Atelier 4, étape A4.5 · filtre du tableau de bord par client (GET /api/demandes?client=…).

Recherche partielle, insensible à la casse et aux accents ; filtre vide = tout.
"""

from __future__ import annotations

import unicodedata
from typing import Any


def _simplifier(s: Any) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", str(s or "")) if not unicodedata.combining(c)).lower().strip()


def filtrer_par_client(demandes: list[dict[str, Any]], client: str | None) -> list[dict[str, Any]]:
    cherche = _simplifier(client)
    if not cherche:
        return demandes
    return [d for d in demandes if cherche in _simplifier(d.get("client"))]
