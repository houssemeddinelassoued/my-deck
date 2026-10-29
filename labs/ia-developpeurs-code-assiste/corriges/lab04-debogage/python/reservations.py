"""Lab 04 — Réservation de salles de réunion (corrigé)."""

from dataclasses import dataclass
from datetime import datetime
from decimal import ROUND_HALF_UP, Decimal


@dataclass
class Reservation:
    salle: str
    debut: datetime
    fin: datetime
    tarif_horaire: float  # en dollars


def duree_heures(r: Reservation) -> float:
    """Durée de la réservation, en heures."""
    # INC-105 : .seconds ignore les jours entiers ; total_seconds() les compte.
    return (r.fin - r.debut).total_seconds() / 3600


def se_chevauchent(a: Reservation, b: Reservation) -> bool:
    """Vrai si les deux réservations occupent la même salle au même moment."""
    # INC-103 : intervalles semi-ouverts [début, fin[ : une fin à 10 h libère la salle à 10 h.
    return a.salle == b.salle and a.debut < b.fin and b.debut < a.fin


def peut_reserver(existantes: list[Reservation], nouvelle: Reservation) -> bool:
    return not any(se_chevauchent(r, nouvelle) for r in existantes)


def cout(r: Reservation) -> float:
    """Coût de la réservation en dollars, arrondi au cent (la moitié vers le haut)."""
    # INC-104 : 31,15 × 1,5 vaut 46,72499… en binaire ; Decimal calcule en base 10.
    montant = Decimal(str(r.tarif_horaire)) * Decimal(str(duree_heures(r)))
    return float(montant.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def paginer(items: list, page: int, taille: int = 10) -> list:
    """Retourne la page `page` (1 = première page) de `taille` éléments."""
    debut = (page - 1) * taille
    # INC-102 : la borne de fin d'une tranche est exclue, pas de + 1.
    return items[debut : debut + taille]


def taux_occupation(reservations: list[Reservation], salle: str, heures_ouvertes: int = 10) -> float:
    """Part des heures d'ouverture occupées pour une salle, sur les jours où elle est réservée."""
    de_la_salle = [r for r in reservations if r.salle == salle]
    # INC-101 : aucune réservation → aucun jour → division par zéro.
    if not de_la_salle:
        return 0.0
    jours = {r.debut.date() for r in de_la_salle}
    heures = sum(duree_heures(r) for r in de_la_salle)
    return round(heures / (heures_ouvertes * len(jours)), 2)
