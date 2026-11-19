"""Stockage SQLite (sqlite3, bibliothèque standard). Les colonnes suivent le contrat : un champ ajouté au
schéma devient une colonne au prochain enregistrement. Requêtes toujours paramétrées.
"""

from __future__ import annotations

import re
import sqlite3
import threading
from datetime import datetime, timezone
from typing import Any

from guichet.contrat import charger_schema

COEUR = {
    "id": "TEXT PRIMARY KEY",
    "cle": "TEXT",
    "cree_le": "TEXT NOT NULL",
    "statut": "TEXT NOT NULL DEFAULT 'ouverte'",
    "client_id": "TEXT",
    "message": "TEXT",
    "date_souhaitee": "TEXT",
    "budget_montant": "REAL",
    "budget_devise": "TEXT",
}


def _type_sql(d: dict[str, Any]) -> str:
    t = d.get("type", "string")
    t = [t] if isinstance(t, str) else t
    return "INTEGER" if ("integer" in t or "boolean" in t) else "REAL" if "number" in t else "TEXT"


class DepotSqlite:
    def __init__(self, fichier: str) -> None:
        self.db = sqlite3.connect(fichier, check_same_thread=False)
        self.db.row_factory = sqlite3.Row
        self.verrou = threading.Lock()
        self.booleens: set[str] = set()
        colonnes = ", ".join(f"{c} {t}" for c, t in COEUR.items())
        self.db.execute("".join(["CREATE TABLE IF NOT EXISTS demandes (", colonnes, ")"]))
        self._migrer()

    def _migrer(self) -> set[str]:
        """Ajoute les colonnes des champs du contrat qui n'existent pas encore."""
        existantes = {r["name"] for r in self.db.execute("PRAGMA table_info(demandes)")}
        for champ, d in charger_schema().get("properties", {}).items():
            types = d.get("type", [])
            if "boolean" in ([types] if isinstance(types, str) else types):
                self.booleens.add(champ)
            if champ not in existantes and re.fullmatch(r"[a-z_][a-z0-9_]*", champ):
                self.db.execute(" ".join(["ALTER TABLE demandes ADD COLUMN", champ, _type_sql(d)]))
                existantes.add(champ)
        return existantes

    def _vers_demande(self, ligne: sqlite3.Row | None) -> dict[str, Any] | None:
        if ligne is None:
            return None
        d = dict(ligne)
        for b in self.booleens:
            if d.get(b) is not None:
                d[b] = bool(d[b])
        return d

    def _prochain_id(self) -> str:
        n = self.db.execute("SELECT MAX(CAST(SUBSTR(id, 3) AS INTEGER)) FROM demandes WHERE id LIKE 'D-%'").fetchone()[0]
        return f"D-{(n or 2000) + 1}"

    def inserer(self, demande: dict[str, Any]) -> dict[str, Any]:
        with self.verrou:
            colonnes = self._migrer()
            ligne = {**demande, "id": self._prochain_id(), "cree_le": datetime.now(timezone.utc).isoformat(), "statut": "ouverte"}
            champs = [c for c in ligne if c in colonnes]
            valeurs = [int(ligne[c]) if isinstance(ligne[c], bool) else ligne[c] for c in champs]
            # Noms de colonnes issus du contrat (jamais du client) ; valeurs toujours passées en paramètres.
            sql = "".join(["INSERT INTO demandes (", ", ".join(champs), ") VALUES (", ", ".join("?" for _ in champs), ")"])
            self.db.execute(sql, valeurs)
            self.db.commit()
            return self._vers_demande(self.db.execute("SELECT * FROM demandes WHERE id = ?", (ligne["id"],)).fetchone()) or {}

    def lister(self) -> list[dict[str, Any]]:
        with self.verrou:
            return [self._vers_demande(r) or {} for r in self.db.execute("SELECT * FROM demandes ORDER BY cree_le DESC, id DESC")]

    def par_cle(self, cle: str) -> dict[str, Any] | None:
        # A3.5 : idempotence à faire. Pour l'instant, une demande est toujours considérée comme nouvelle.
        del cle
        return None
