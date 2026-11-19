"""Erreurs métier du pipeline, traduites en codes HTTP par le serveur."""

from __future__ import annotations


class ErreurValidation(Exception):
    """La sortie du modèle (ou du formulaire) ne respecte pas le contrat → 422."""

    def __init__(self, erreurs: list[str]) -> None:
        super().__init__(f"Demande non conforme au contrat : {' ; '.join(erreurs)}")
        self.erreurs = erreurs


class ErreurPipeline(Exception):
    """Le dialogue avec le modèle n'a pas abouti (arrêt inattendu, trop de tours…) → 502."""
