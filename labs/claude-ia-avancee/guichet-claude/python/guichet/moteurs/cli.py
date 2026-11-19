"""Moteur « claude-cli » : le vrai modèle, via Claude Code en mode non interactif (claude -p) et votre licence.

Lancé depuis un dossier temporaire : ni CLAUDE.md, ni hooks, ni accès aux fichiers du dépôt.
Pas de boucle d'outils ici : le pipeline passe alors par l'extraction structurée.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
from typing import Any


def _lancer(args: list[str], entree: str) -> dict[str, Any]:
    exe = shutil.which("claude")
    if not exe:
        raise RuntimeError("claude introuvable : installez Claude Code et connectez-vous (claude, puis /login).")
    r = subprocess.run([exe, *args], input=entree, capture_output=True, text=True, encoding="utf-8", cwd=tempfile.gettempdir(), timeout=300)
    if r.returncode != 0:
        raise RuntimeError(f"claude -p a échoué : {(r.stderr or r.stdout)[:300]}")
    sortie = json.loads(r.stdout)
    if sortie.get("is_error"):
        raise RuntimeError(f"claude -p : {sortie.get('result')}")
    return sortie


class MoteurCli:
    nom = "claude-cli"
    converser = None  # pas de boucle d'outils

    def __init__(self) -> None:
        self.modele = os.environ.get("GUICHET_MODELE_CLI")  # alias Claude Code : haiku, sonnet, opus… (facultatif)

    def _args(self, extra: list[str]) -> list[str]:
        return ["-p", "--output-format", "json", *(["--model", self.modele] if self.modele else []), *extra]

    def appel_simple(self, texte: str) -> str:
        return str(_lancer(self._args([]), texte).get("result", ""))

    def extraire(self, prompt: str, schema: dict[str, Any]) -> Any:
        s = _lancer(self._args(["--json-schema", json.dumps(schema, ensure_ascii=False)]), prompt)
        return s.get("structured_output") if s.get("structured_output") is not None else json.loads(s.get("result") or "null")
