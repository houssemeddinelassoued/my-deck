"""Tâche de la boucle (Atelier 2, étape A2.3) : écrit par Claude via
node guichet.mjs boucle taches/tronquer-resume.md
"""

from __future__ import annotations


def tronquer_resume(texte: str, max: int = 280) -> str:
    t = (texte or "").strip()
    if len(t) <= max:
        return t
    coupe = t[: max - 1]
    espace = coupe.rfind(" ")
    if espace > 0:
        coupe = coupe[:espace]
    return f"{coupe.rstrip()}…"
