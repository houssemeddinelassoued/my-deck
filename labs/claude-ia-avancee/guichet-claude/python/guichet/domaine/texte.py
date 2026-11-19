"""Tâche de la boucle (Atelier 2, étape A2.3) : ce fichier est écrit par Claude via
node guichet.mjs boucle taches/tronquer-resume.md
"""

from __future__ import annotations

from guichet.config import a_completer


def tronquer_resume(texte: str, max: int = 280) -> str:
    a_completer(f"BOUCLE : tronquer_resume ({len(texte or '')} caractères, max {max})")
