"""Lecture et écriture du fichier JSON des tâches."""

import json
from pathlib import Path

from taches.modele import Tache


class TacheIntrouvable(KeyError):
    pass


class Depot:
    def __init__(self, fichier: Path):
        self.fichier = fichier
        donnees = json.loads(fichier.read_text(encoding="utf-8")) if fichier.exists() else {}
        self.dernier_id: int = donnees.get("dernier_id", 0)
        self.taches = [Tache.depuis_dict(t) for t in donnees.get("taches", [])]

    def enregistrer(self) -> None:
        donnees = {"dernier_id": self.dernier_id, "taches": [t.vers_dict() for t in self.taches]}
        self.fichier.write_text(json.dumps(donnees, ensure_ascii=False, indent=2), encoding="utf-8")

    def ajouter(self, **champs) -> Tache:
        self.dernier_id += 1  # jamais réutilisé, même après suppression
        tache = Tache(id=self.dernier_id, **champs)
        self.taches.append(tache)
        return tache

    def trouver(self, ident: int) -> Tache:
        for t in self.taches:
            if t.id == ident:
                return t
        raise TacheIntrouvable(ident)

    def supprimer(self, ident: int) -> None:
        self.taches.remove(self.trouver(ident))
