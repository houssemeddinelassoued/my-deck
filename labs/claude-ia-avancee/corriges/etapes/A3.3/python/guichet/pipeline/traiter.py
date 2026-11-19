"""Atelier 3, étape A3.3 · le pipeline : formulaire → normalisation → Claude (boucle d'outils) → base."""

from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass
from typing import Any

from guichet.config import aujourdhui as date_du_jour
from guichet.contrat import charger_schema
from guichet.domaine.normaliser import normaliser_demande
from guichet.pipeline.erreurs import ErreurPipeline
from guichet.pipeline.extraire import extraire
from guichet.pipeline.outils import Contexte, chercher_client, definitions_outils, executer_outil
from guichet.prompts.gabarit import rendre_extraction

SYSTEME = (
    "Tu enregistres les demandes clients du portail Guichet d’Oasis Digital. Utilise chercher_client pour retrouver le client, "
    "puis enregistrer_demande une seule fois avec les faits extraits. Termine par une phrase courte qui confirme l’enregistrement."
)
MAX_TOURS = 6


@dataclass
class Dependances:
    moteur: Any
    depot: Any
    clients: list[dict[str, Any]]
    aujourdhui: str | None = None


def cle_idempotence(email: str | None, message: str) -> str:
    """Clé d'idempotence : la même demande (e-mail + texte) donne toujours la même clé."""
    texte = re.sub(r"\s+", " ", (message or "").strip().lower())
    return hashlib.sha256(f"{(email or '').lower()}|{texte}".encode()).hexdigest()


def _bloc(b: Any) -> dict[str, Any]:
    return b.model_dump(exclude_none=True) if hasattr(b, "model_dump") else dict(b)


def traiter(formulaire: dict[str, Any], deps: Dependances) -> tuple[dict[str, Any], bool]:
    normalisee = normaliser_demande(formulaire, deps.aujourdhui or date_du_jour())
    cle = cle_idempotence(normalisee["email"] or formulaire.get("email"), formulaire.get("message", ""))
    deja = deps.depot.par_cle(cle)
    if deja:
        return deja, False

    ctx = Contexte(formulaire=formulaire, normalisee=dict(normalisee), cle=cle, schema=charger_schema(), depot=deps.depot, clients=deps.clients)

    # Moteur sans boucle d'outils (claude-cli) : extraction structurée, puis les mêmes outils côté code.
    if not getattr(deps.moteur, "converser", None):
        faits = extraire(deps.moteur, formulaire)
        client = chercher_client(deps.clients, faits["client"], normalisee["email"])
        executer_outil("enregistrer_demande", {"client_id": client.get("id"), **faits}, ctx)
        return ctx.resultat, True

    system = [{"type": "text", "text": SYSTEME, "cache_control": {"type": "ephemeral"}}]
    tools = definitions_outils(ctx.schema)
    messages: list[dict[str, Any]] = [{"role": "user", "content": rendre_extraction(formulaire)}]

    for _ in range(MAX_TOURS):
        rep = deps.moteur.converser(system=system, tools=tools, messages=messages)
        if rep.stop_reason == "end_turn":
            break
        if rep.stop_reason != "tool_use":
            raise ErreurPipeline(f"Arrêt inattendu du modèle : {rep.stop_reason}")
        # Tous les blocs de la réponse (texte, réflexion, tool_use) retournent dans l'historique.
        messages.append({"role": "assistant", "content": [_bloc(b) for b in rep.content]})

        resultats: list[dict[str, Any]] = []
        for appel in (b for b in rep.content if b.type == "tool_use"):
            try:
                sortie = executer_outil(appel.name, dict(appel.input), ctx)
                resultats.append({"type": "tool_result", "tool_use_id": appel.id, "content": json.dumps(sortie, ensure_ascii=False)})
            except Exception as e:  # noqa: BLE001 — l'erreur est signalée au modèle, qui peut corriger son appel
                ctx.derniere_erreur = e
                resultats.append({"type": "tool_result", "tool_use_id": appel.id, "is_error": True, "content": str(e)})
        # Tous les résultats dans UN seul message user.
        messages.append({"role": "user", "content": resultats})

    if not ctx.resultat:
        raise ctx.derniere_erreur or ErreurPipeline("Le modèle n’a enregistré aucune demande.")
    return ctx.resultat, True
