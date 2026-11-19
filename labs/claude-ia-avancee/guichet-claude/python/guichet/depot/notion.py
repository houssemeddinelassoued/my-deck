"""Option STOCKAGE=notion : la base SQLite reste la référence (lecture, idempotence), et chaque nouvelle
demande est recopiée dans une base Notion. Prérequis (annexe B du guide) : une intégration interne
(NOTION_TOKEN) partagée avec une base (NOTION_BASE) qui a les propriétés : Nom (titre), Priorité (sélection),
Type (sélection), Client (texte), Résumé (texte).
"""

from __future__ import annotations

import json
import os
import threading
import urllib.request
from typing import Any


def _texte(v: Any) -> dict[str, Any]:
    return {"rich_text": [{"text": {"content": str(v or "")[:1900]}}]}


class DepotNotion:
    def __init__(self, local: Any) -> None:
        self.local = local
        self.jeton = os.environ.get("NOTION_TOKEN", "")
        self.base = os.environ.get("NOTION_BASE", "")
        if not self.jeton or not self.base:
            raise RuntimeError("STOCKAGE=notion : NOTION_TOKEN et NOTION_BASE doivent être définis (fichier .env).")

    def inserer(self, demande: dict[str, Any]) -> dict[str, Any]:
        d = self.local.inserer(demande)
        threading.Thread(target=self._copier, args=(d,), daemon=True).start()
        return d

    def lister(self) -> list[dict[str, Any]]:
        return self.local.lister()

    def par_cle(self, cle: str) -> dict[str, Any] | None:
        return self.local.par_cle(cle)

    def _copier(self, d: dict[str, Any]) -> None:
        corps = {
            "parent": {"database_id": self.base},
            "properties": {
                "Nom": {"title": [{"text": {"content": f"{d['id']} · {d.get('client') or ''}"}}]},
                "Priorité": {"select": {"name": d.get("priorite") or "P3"}},
                "Type": {"select": {"name": d.get("type") or "question"}},
                "Client": _texte(d.get("client")),
                "Résumé": _texte(d.get("resume")),
            },
        }
        req = urllib.request.Request(
            "https://api.notion.com/v1/pages",
            data=json.dumps(corps).encode(),
            headers={"Authorization": f"Bearer {self.jeton}", "Notion-Version": "2022-06-28", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            urllib.request.urlopen(req, timeout=20).read()
        except Exception as e:  # noqa: BLE001 — la copie Notion ne doit pas casser l'enregistrement
            print(f"Copie Notion de {d['id']} impossible : {e}")
