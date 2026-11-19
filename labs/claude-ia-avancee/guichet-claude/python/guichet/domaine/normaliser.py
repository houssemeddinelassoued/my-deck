"""Atelier 1 · ce fichier est GÉNÉRÉ par Claude : node guichet.mjs generer normaliser v1 (puis v2, v3).

Ne l'écrivez pas à la main : améliorez le prompt.
"""

from __future__ import annotations

from guichet.config import a_completer
from guichet.domaine.demande import DemandeBrute, DemandeNormalisee


def normaliser_demande(brute: DemandeBrute, aujourdhui: str) -> DemandeNormalisee:
    a_completer(f"A1.2 : normaliser_demande ({len(brute)} champs, {aujourdhui})")
