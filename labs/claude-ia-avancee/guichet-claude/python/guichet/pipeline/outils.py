"""Atelier 3, étape A3.3 · les outils que Claude peut DEMANDER. C'est ce code qui les exécute.

Moindre privilège : chercher, consulter un contrat, enregistrer. Rien pour modifier ou supprimer.
"""

from __future__ import annotations

import unicodedata
from dataclasses import dataclass, field
from typing import Any

from guichet.contrat import champs_de_source, contrat_modele, schema_pour_modele
from guichet.domaine.enrichissement import enrichir
from guichet.domaine.priorite import calculer_priorite
from guichet.domaine.texte import tronquer_resume
from guichet.domaine.validation import valider_demande
from guichet.pipeline.erreurs import ErreurValidation


@dataclass
class Contexte:
    formulaire: dict[str, Any]
    normalisee: dict[str, Any]
    cle: str
    schema: dict[str, Any]
    depot: Any
    clients: list[dict[str, Any]]
    resultat: dict[str, Any] | None = None
    derniere_erreur: Exception | None = field(default=None)


def definitions_outils(schema: dict[str, Any]) -> list[dict[str, Any]]:
    modele = schema_pour_modele(schema)
    return [
        {
            "name": "chercher_client",
            "description": "Retrouve un client d’Oasis Digital par le nom de son entreprise ou par son e-mail. À appeler en premier, avant enregistrer_demande, pour obtenir son identifiant (client_id) et son niveau de contrat.",
            "strict": True,
            "input_schema": {"type": "object", "properties": {"recherche": {"type": "string", "description": "nom de l’entreprise ou e-mail"}}, "required": ["recherche"], "additionalProperties": False},
        },
        {
            "name": "verifier_contrat",
            "description": "Donne le niveau de contrat (bronze, argent, or) d’un client à partir de son client_id.",
            "strict": True,
            "input_schema": {"type": "object", "properties": {"client_id": {"type": "string"}}, "required": ["client_id"], "additionalProperties": False},
        },
        {
            "name": "enregistrer_demande",
            "description": "Enregistre la demande qualifiée. À appeler une seule fois, après chercher_client, avec les faits extraits du message et le client_id trouvé (null si le client est inconnu). La priorité définitive est recalculée par le système.",
            "strict": True,
            "input_schema": {
                "type": "object",
                "properties": {"client_id": {"type": ["string", "null"]}, **modele["properties"]},
                "required": ["client_id", *modele.get("required", [])],
                "additionalProperties": False,
            },
        },
    ]


def _sans_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s or "") if not unicodedata.combining(c)).lower().strip()


def chercher_client(clients: list[dict[str, Any]], recherche: str, email: str | None) -> dict[str, Any]:
    r = _sans_accents(recherche)
    par_nom = next((c for c in clients if r and (_sans_accents(c["nom"]) in r or r in _sans_accents(c["nom"]))), None)
    par_email = next((c for c in clients if email and email.endswith(f"@{c['domaine']}")), None)
    c = par_nom or par_email
    return {"id": c["id"], "nom": c["nom"], "contrat": c["contrat"]} if c else {"id": None, "trouve": False, "message": "Aucun client ne correspond."}


def _enregistrer(entree: dict[str, Any], ctx: Contexte) -> dict[str, Any]:
    faits = {k: v for k, v in entree.items() if k != "client_id"}
    erreurs = valider_demande(faits, contrat_modele(ctx.schema))
    if erreurs:
        raise ErreurValidation(erreurs)
    client = next((c for c in ctx.clients if c["id"] == entree.get("client_id")), None)
    budget = ctx.normalisee.get("budget") or {}
    demande: dict[str, Any] = {
        **faits,
        "client_id": client["id"] if client else None,
        "priorite": calculer_priorite(faits, client["contrat"] if client else None),
        "resume": tronquer_resume(faits["resume"], 280),
        "email": faits.get("email") or ctx.normalisee.get("email"),
        "telephone": faits.get("telephone") or ctx.normalisee.get("telephone"),
        "cle": ctx.cle,
        "message": ctx.formulaire.get("message"),
        "date_souhaitee": ctx.normalisee.get("date_souhaitee"),
        "budget_montant": budget.get("montant"),
        "budget_devise": budget.get("devise"),
    }
    # Champs « formulaire » du contrat : recopiés tels quels (A4.2 : site_web…).
    for champ in champs_de_source(ctx.schema, "formulaire"):
        v = (ctx.formulaire.get(champ) or "").strip()
        demande[champ] = v or None
    ctx.resultat = ctx.depot.inserer(enrichir(demande))
    return {"demande": ctx.resultat["id"], "priorite": ctx.resultat["priorite"]}


def executer_outil(nom: str, entree: dict[str, Any], ctx: Contexte) -> Any:
    if nom == "chercher_client":
        return chercher_client(ctx.clients, str(entree.get("recherche") or ""), ctx.normalisee.get("email"))
    if nom == "verifier_contrat":
        c = next((x for x in ctx.clients if x["id"] == entree.get("client_id")), None)
        if not c:
            raise ValueError(f"client_id inconnu : {entree.get('client_id')}")
        return {"client_id": c["id"], "contrat": c["contrat"]}
    if nom == "enregistrer_demande":
        return _enregistrer(entree, ctx)
    raise ValueError(f"Outil inconnu : {nom}")
