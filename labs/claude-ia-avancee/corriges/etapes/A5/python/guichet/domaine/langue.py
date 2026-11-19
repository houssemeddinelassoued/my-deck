"""Défi final (Atelier 5) · langue de la demande et équipe de routage.

Heuristique déterministe et testable : on compte les mots-outils de chaque langue.
Voir decisions/langue.md pour les pistes écartées (appel au modèle, bibliothèque externe).
"""

from __future__ import annotations

import re

EN = {"the", "is", "are", "our", "your", "you", "we", "it", "and", "to", "of", "an", "for", "with", "has", "have", "been", "since", "could", "would", "when", "can", "please", "hello", "about", "this", "that", "not", "be", "on", "in", "at", "whole"}
FR = {"le", "la", "les", "de", "des", "du", "un", "une", "et", "est", "sont", "ne", "pas", "plus", "notre", "nos", "votre", "vous", "nous", "depuis", "pour", "avec", "sur", "dans", "merci", "bonjour", "à", "au", "aux", "ce", "cette", "qui", "que", "en"}


def detecter_langue(texte: str) -> str:
    mots = [m for m in re.split(r"[^\w]+|[\d_]+", (texte or "").lower()) if m]
    en = sum(m in EN for m in mots)
    fr = sum(m in FR for m in mots)
    return "en" if en > fr else "fr"


def equipe_pour(langue: str) -> str:
    return "Europe" if langue == "en" else "Tunis"
