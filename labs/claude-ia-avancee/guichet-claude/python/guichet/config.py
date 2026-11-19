"""Chemins et réglages communs. GUICHET_RACINE est fourni par node guichet.mjs."""

from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any, NoReturn
from zoneinfo import ZoneInfo

RACINE = Path(os.environ.get("GUICHET_RACINE") or Path(__file__).resolve().parents[2])
MODELE = os.environ.get("GUICHET_MODELE", "claude-sonnet-5-5")


def chemin(*parties: str) -> Path:
    return RACINE.joinpath(*parties)


def lire_texte(*parties: str) -> str:
    return chemin(*parties).read_text(encoding="utf-8")


def lire_json(*parties: str) -> Any:
    return json.loads(lire_texte(*parties))


def aujourdhui() -> str:
    """Date du jour à Tunis, au format AAAA-MM-JJ."""
    try:
        return datetime.now(ZoneInfo("Africa/Tunis")).date().isoformat()
    except Exception:  # base des fuseaux absente (Windows sans tzdata)
        return datetime.now().date().isoformat()


class NonImplemente(Exception):
    """Un trou de l'énoncé n'est pas encore complété."""


def a_completer(quoi: str) -> NoReturn:
    """Marque un trou de l'énoncé : le code tourne, mais lève une erreur claire ici."""
    raise NonImplemente(f"À compléter · {quoi}")
