"""Outils partagés par les tests : les cas viennent de donnees/, communs aux 4 stacks."""

from __future__ import annotations

from typing import Any

from guichet.config import lire_json


def cas(fichier: str) -> Any:
    return lire_json("donnees", fichier)


def reference(id_: int) -> dict[str, Any]:
    return dict(next(d for d in cas("demandes.json") if d["id"] == id_)["formulaire"])


def dependances() -> Any:
    from guichet.depot.sqlite import DepotSqlite
    from guichet.moteurs.api import MoteurApi
    from guichet.pipeline.traiter import Dependances

    return Dependances(moteur=MoteurApi(), depot=DepotSqlite(":memory:"), clients=cas("clients.json"), aujourdhui="2026-11-14")
