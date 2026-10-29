"""Calcule le total, la livraison et la priorité des commandes (corrigé refactorisé)."""

import logging
from dataclasses import dataclass

log = logging.getLogger(__name__)


@dataclass(frozen=True)
class GrilleLivraison:
    leger: float  # jusqu'à 2 kg
    moyen: float  # jusqu'à 10 kg
    par_kg_supplementaire: float  # au-delà de 10 kg


POIDS_LEGER_KG = 2
POIDS_MOYEN_KG = 10
GRILLES = {
    "QC": GrilleLivraison(leger=8, moyen=15, par_kg_supplementaire=1.5),
    "ON": GrilleLivraison(leger=10, moyen=18, par_kg_supplementaire=1.75),
}
GRILLE_AUTRES_REGIONS = GrilleLivraison(leger=14, moyen=25, par_kg_supplementaire=2.5)

SEUIL_LIVRAISON_OFFERTE_PREMIUM = 100
SEUIL_PRIORITE_HAUTE = 500
SEUIL_PRIORITE_NORMALE = 100


def sous_total(commande: dict) -> float:
    return sum(ligne["prix"] * ligne["qte"] for ligne in commande["lignes"])


def frais_livraison(poids: float, region: str) -> float:
    grille = GRILLES.get(region, GRILLE_AUTRES_REGIONS)
    if poids <= POIDS_LEGER_KG:
        return grille.leger
    if poids <= POIDS_MOYEN_KG:
        return grille.moyen
    return grille.moyen + (poids - POIDS_MOYEN_KG) * grille.par_kg_supplementaire


def appliquer_premium(frais: float, total_articles: float) -> float:
    return 0 if total_articles > SEUIL_LIVRAISON_OFFERTE_PREMIUM else frais / 2


def priorite(total_articles: float) -> str:
    if total_articles > SEUIL_PRIORITE_HAUTE:
        return "haute"
    if total_articles > SEUIL_PRIORITE_NORMALE:
        return "normale"
    return "basse"


def traiter_commande(commande: dict, region: str, premium: bool) -> dict:
    total_articles = sous_total(commande)
    frais = frais_livraison(commande["poids"], region)
    if premium:
        frais = appliquer_premium(frais, total_articles)
    return {
        "id": commande["id"],
        "total": round(total_articles + frais, 2),
        "livraison": round(frais, 2),
        "priorite": priorite(total_articles),
    }


def traiter(commandes: list[dict], region: str, premium: bool) -> list[dict]:
    resultats = []
    for commande in commandes:
        if commande["statut"] == "annulee":
            continue
        if commande["poids"] <= 0:
            log.warning("poids invalide %s", commande["id"])
            continue
        resultats.append(traiter_commande(commande, region, premium))
    return resultats
