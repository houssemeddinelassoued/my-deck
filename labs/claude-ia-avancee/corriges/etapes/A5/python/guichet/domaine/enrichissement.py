"""Point d'extension : calcule les champs « code » du contrat (x-source: code) avant l'enregistrement.

A5 : langue du message et équipe de routage.
"""

from __future__ import annotations

from typing import Any

from guichet.domaine.langue import detecter_langue, equipe_pour


def enrichir(demande: dict[str, Any]) -> dict[str, Any]:
    langue = detecter_langue(str(demande.get("message") or ""))
    return {**demande, "langue": langue, "equipe": equipe_pour(langue)}
