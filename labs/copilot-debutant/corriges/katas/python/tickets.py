"""TaskFlow · modèle de ticket, variante Python — CORRIGÉ."""

TYPES = ("story", "bug", "tache")
STATUTS = ("backlog", "afaire", "encours", "termine")
PRIORITES = (1, 2, 3)
POINTS_VALIDES = (1, 2, 3, 5, 8, 13)


def est_points_valide(points) -> bool:
    """None (non estimé) ou valeur de POINTS_VALIDES ; les booléens sont refusés (True == 1)."""
    if points is None:
        return True
    return type(points) is int and points in POINTS_VALIDES


def valider_ticket(ticket: dict) -> tuple[bool, list[str]]:
    """Renvoie (ok, erreurs) avec toutes les erreurs, dans l'ordre."""
    erreurs = []
    titre = ticket.get("titre")
    titre = titre.strip() if isinstance(titre, str) else ""
    if not 3 <= len(titre) <= 80:
        erreurs.append("titre invalide")
    if ticket.get("type") not in TYPES:
        erreurs.append("type invalide")
    if type(ticket.get("priorite")) is not int or ticket.get("priorite") not in PRIORITES:
        erreurs.append("priorite invalide")
    if not est_points_valide(ticket.get("points")):
        erreurs.append("points invalides")
    if ticket.get("statut") not in STATUTS:
        erreurs.append("statut invalide")
    return (not erreurs, erreurs)


def creer_ticket(donnees: dict, *, id: int, aujourd_hui: str) -> dict:
    """Crée un ticket complet ; ValueError si les données sont invalides."""
    titre = donnees.get("titre")
    ticket = {
        "id": id,
        "titre": titre.strip() if isinstance(titre, str) else "",
        "type": donnees.get("type", "tache"),
        "priorite": donnees.get("priorite", 2),
        "points": donnees.get("points"),
        "statut": donnees.get("statut", "backlog"),
        "cree_le": aujourd_hui,
    }
    ok, erreurs = valider_ticket(ticket)
    if not ok:
        raise ValueError("Ticket invalide : " + ", ".join(erreurs))
    return ticket
