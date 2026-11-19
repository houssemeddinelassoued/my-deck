"""Atelier 1, étape A1.3 · exemples dynamiques (few-shot) choisis par le code selon la demande."""

from __future__ import annotations

import json
import re
from typing import Any, TypedDict

from guichet.config import lire_texte


class Exemple(TypedDict):
    id: str
    type: str
    texte: str
    sortie: dict[str, Any]


STOP = {"avec", "pour", "dans", "depuis", "nous", "notre", "votre", "vous", "sont", "plus", "cette", "mais", "the", "and", "with", "from", "this", "that", "have", "been", "merci", "bonjour", "pouvez", "pourriez"}


def mots_cles(texte: str) -> set[str]:
    """Mots de 4 lettres ou plus, en minuscules, sans les mots vides. Fourni."""
    return {m for m in re.split(r"[\W_]+", (texte or "").lower()) if len(m) >= 4 and m not in STOP}


def lire_exemples() -> list[Exemple]:
    return [json.loads(l) for l in lire_texte("donnees", "exemples.jsonl").strip().splitlines()]


def choisir_exemples(texte: str, tous: list[Exemple], k: int = 3) -> list[Exemple]:
    """Les k exemples les plus proches du texte, un seul par type.

    Score = nombre de mots-clés en commun ; à score égal, l'ordre du fichier est conservé.
    """
    mots = mots_cles(texte)
    notes = [(ex, len(mots_cles(ex["texte"]) & mots)) for ex in tous]
    notes.sort(key=lambda n: -n[1])  # list.sort est stable : l'ordre du fichier est gardé à égalité
    choisis: list[Exemple] = []
    for ex, _ in notes:
        if any(c["type"] == ex["type"] for c in choisis):
            continue
        choisis.append(ex)
        if len(choisis) == k:
            break
    return choisis


def rendre_exemples(exemples: list[Exemple]) -> str:
    return "\n".join(
        f"<exemple>\n<entree>{e['texte']}</entree>\n<sortie>{json.dumps(e['sortie'], ensure_ascii=False)}</sortie>\n</exemple>" for e in exemples
    )
