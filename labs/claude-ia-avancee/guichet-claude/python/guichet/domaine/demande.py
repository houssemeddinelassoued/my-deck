"""Types du domaine Guichet. Le contrat de référence est contrats/demande.schema.json."""

from __future__ import annotations

from typing import Any, Literal, NotRequired, TypedDict

TypeDemande = Literal["incident", "evolution", "devis", "question"]
Priorite = Literal["P1", "P2", "P3"]
Contrat = Literal["bronze", "argent", "or"]


class DemandeBrute(TypedDict, total=False):
    """Ce que le client saisit dans le formulaire web (tout est texte libre)."""

    nom: str
    entreprise: str
    email: str
    telephone: str
    date_souhaitee: str
    budget: str
    message: str


class Budget(TypedDict):
    montant: float
    devise: Literal["TND", "EUR"]


class DemandeNormalisee(TypedDict):
    """Résultat de normaliser_demande : chaque champ est propre, ou None s'il est illisible."""

    email: str | None
    telephone: str | None  # E.164 : +216XXXXXXXX ou +33XXXXXXXXX
    date_souhaitee: str | None  # AAAA-MM-JJ
    budget: Budget | None


class Faits(TypedDict):
    """Ce que Claude extrait d'une demande (champs « modèle » du contrat)."""

    type: TypeDemande
    priorite: NotRequired[Priorite]
    client: str
    contact: str | None
    email: str | None
    telephone: str | None
    utilisateurs_touches: int | None
    panne_totale: bool
    resume: str


class Client(TypedDict):
    id: str
    nom: str
    domaine: str
    contrat: Contrat


# Une demande enregistrée : faits + priorité calculée + champs du formulaire et du code.
Demande = dict[str, Any]
