"""Atelier 4, étape A4.5 · filtre du tableau de bord par client (GET /api/demandes?client=…)."""

from __future__ import annotations

from typing import Any


def filtrer_par_client(demandes: list[dict[str, Any]], client: str | None) -> list[dict[str, Any]]:
    # Pas encore de filtre : toutes les demandes sont renvoyées.
    del client
    return demandes
