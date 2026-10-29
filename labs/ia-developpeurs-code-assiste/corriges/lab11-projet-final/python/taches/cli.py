"""Commandes de la ligne de commande (lancement : python -m taches lister)."""

import argparse
import csv
import io
import json
from datetime import date
from pathlib import Path

from taches.depot import Depot, TacheIntrouvable
from taches.modele import PRIORITES, Tache


class ErreurArguments(Exception):
    pass


class Analyseur(argparse.ArgumentParser):
    def error(self, message: str):  # argparse quitterait le programme : on lève plutôt
        raise ErreurArguments(message)


def date_iso(texte: str) -> date:
    try:
        return date.fromisoformat(texte)
    except ValueError:
        raise argparse.ArgumentTypeError(f"date invalide : {texte} (AAAA-MM-JJ attendu)") from None


def analyseur() -> Analyseur:
    p = Analyseur(prog="taches")
    sous = p.add_subparsers(dest="commande", required=True, parser_class=Analyseur)
    a = sous.add_parser("ajouter")
    a.add_argument("titre")
    a.add_argument("--priorite", choices=PRIORITES, default="normale")
    a.add_argument("--echeance", type=date_iso)
    a.add_argument("--etiquette", action="append", default=[])
    ls = sous.add_parser("lister")
    ls.add_argument("--toutes", action="store_true")
    ls.add_argument("--etiquette")
    ls.add_argument("--priorite", choices=PRIORITES)
    for nom in ("terminer", "supprimer"):
        sous.add_parser(nom).add_argument("id", type=int)
    r = sous.add_parser("en-retard")
    r.add_argument("--aujourdhui", type=date_iso, default=date.today())
    e = sous.add_parser("exporter")
    e.add_argument("--format", choices=("json", "csv"), required=True)
    return p


def afficher(taches: list[Tache]) -> str:
    return "\n".join(t.en_ligne() for t in sorted(taches, key=Tache.cle_de_tri)) or "Aucune tâche."


def exporter_csv(taches: list[Tache]) -> str:
    tampon = io.StringIO()
    w = csv.writer(tampon, lineterminator="\n")
    w.writerow(["id", "titre", "priorite", "echeance", "etiquettes", "terminee"])
    for t in taches:
        echeance = t.echeance.isoformat() if t.echeance else ""
        w.writerow([t.id, t.titre, t.priorite, echeance, ";".join(t.etiquettes), "oui" if t.terminee else "non"])
    return tampon.getvalue().rstrip("\n")


def executer(args: argparse.Namespace, depot: Depot) -> str:
    match args.commande:
        case "ajouter":
            if not args.titre.strip():
                raise ErreurArguments("le titre est vide")
            t = depot.ajouter(titre=args.titre.strip(), priorite=args.priorite, echeance=args.echeance,
                              etiquettes=args.etiquette)
            return f"Tâche {t.id} ajoutée : {t.titre}"
        case "lister":
            taches = [t for t in depot.taches if args.toutes or not t.terminee]
            taches = [t for t in taches if args.etiquette is None or args.etiquette in t.etiquettes]
            return afficher([t for t in taches if args.priorite is None or t.priorite == args.priorite])
        case "terminer":
            depot.trouver(args.id).terminee = True
            return f"Tâche {args.id} terminée"
        case "supprimer":
            depot.supprimer(args.id)
            return f"Tâche {args.id} supprimée"
        case "en-retard":
            return afficher([t for t in depot.taches if not t.terminee and t.echeance and t.echeance < args.aujourdhui])
        case _:  # exporter
            if args.format == "json":
                return json.dumps([t.vers_dict() for t in depot.taches], ensure_ascii=False, indent=2)
            return exporter_csv(depot.taches)


def main(argv: list[str], fichier: Path) -> tuple[int, str]:
    """Exécute une commande et retourne (code de sortie, texte à afficher)."""
    try:
        args = analyseur().parse_args(argv)
        depot = Depot(fichier)
        sortie = executer(args, depot)
    except ErreurArguments as e:
        return 2, f"Erreur : {e}"
    except TacheIntrouvable as e:
        return 1, f"Erreur : tâche {e.args[0]} introuvable"
    depot.enregistrer()
    return 0, sortie
