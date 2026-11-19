"""Moteur « api » : le SDK officiel. Avec MOTEUR=simu, ANTHROPIC_BASE_URL pointe sur le simulateur."""

from __future__ import annotations

import json
from typing import Any

from anthropic import Anthropic

from guichet.config import MODELE, a_completer

SYSTEME_EXTRACTION = "Tu extrais des informations factuelles de demandes clients. Tu réponds uniquement selon le schéma demandé."


def premier_texte(rep: Any) -> str:
    for bloc in rep.content:
        if bloc.type == "text":
            return bloc.text
    return ""


class MoteurApi:
    nom = "api"

    def __init__(self, base_url: str | None = None, modele: str | None = None) -> None:
        # Sans argument, le client lit ANTHROPIC_API_KEY et ANTHROPIC_BASE_URL dans l'environnement.
        self.client = Anthropic(base_url=base_url) if base_url else Anthropic()
        self.modele = modele or MODELE

    def appel_simple(self, texte: str) -> str:
        """A3.1 · premier appel : une requête minimale, puis le texte du premier bloc « text »."""
        rep = self.client.messages.create(**a_completer(f"A3.1 : paramètres de la requête (model, max_tokens, messages) pour « {texte[:30]} »"))
        a_completer(f"A3.1 : texte du premier bloc « text » de la réponse (stop_reason : {rep.stop_reason})")

    def extraire(self, prompt: str, schema: dict[str, Any]) -> Any:
        """A3.2 · sortie structurée : le contrat part dans output_config.format, la réponse est un JSON."""
        rep = self.client.messages.create(
            model=self.modele,
            max_tokens=4000,
            system=[{"type": "text", "text": SYSTEME_EXTRACTION, "cache_control": {"type": "ephemeral"}}],
            output_config=a_completer(f"A3.2 : format json_schema avec le schéma ({len(schema)} clés)"),
            messages=[{"role": "user", "content": prompt}],
        )
        if a_completer(f"A3.2 : la réponse est-elle incomplète ? (stop_reason : {rep.stop_reason})"):
            raise RuntimeError(f"Extraction interrompue : stop_reason = {rep.stop_reason}")
        return json.loads(premier_texte(rep))

    def converser(self, system: list[dict[str, Any]], tools: list[dict[str, Any]], messages: list[dict[str, Any]]) -> Any:
        """Un tour de la boucle d'outils (fourni)."""
        return self.client.messages.create(model=self.modele, max_tokens=4000, system=system, tools=tools, messages=messages)
