"""L'interface MoteurClaude isole la dépendance au modèle : le pipeline ne sait pas qui lui répond.

    MOTEUR=simu        MoteurApi pointé sur le simulateur local (ANTHROPIC_BASE_URL)
    MOTEUR=claude-cli  MoteurCli : claude -p, avec votre licence Claude (pas de boucle d'outils)
    MOTEUR=api         MoteurApi sur l'API réelle (ANTHROPIC_API_KEY)
"""

from __future__ import annotations

import os
from typing import Any, Protocol


class MoteurClaude(Protocol):
    nom: str
    # Un tour de conversation avec outils ; None pour claude-cli.
    converser: Any

    def appel_simple(self, texte: str) -> str:
        """Un appel minimal : un texte en entrée, le texte de la réponse en sortie."""
        ...

    def extraire(self, prompt: str, schema: dict[str, Any]) -> Any:
        """Sortie structurée : un objet JSON conforme au schéma fourni."""
        ...


def choisir_moteur() -> MoteurClaude:
    if os.environ.get("MOTEUR", "simu") == "claude-cli":
        from guichet.moteurs.cli import MoteurCli

        return MoteurCli()
    from guichet.moteurs.api import MoteurApi

    return MoteurApi()
