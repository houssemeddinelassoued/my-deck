"""Atelier 4 · Bonus : la même règle métier en Python (corrigé)."""


class ErreurParafo(ValueError):
    """Erreur métier : porte un code stable."""

    def __init__(self, code: str, message: str = "") -> None:
        super().__init__(message or code)
        self.code = code


def formater_reference(numero: int, annee: int) -> str:
    """formater_reference(42, 2026) → 'PAR-2026-0042'.

    Lève ErreurParafo NUMERO_INVALIDE ou ANNEE_INVALIDE.
    """
    if type(numero) is not int or not 1 <= numero <= 9999:
        raise ErreurParafo("NUMERO_INVALIDE", "Le numéro doit être un entier de 1 à 9999.")
    if type(annee) is not int or not 2000 <= annee <= 2099:
        raise ErreurParafo("ANNEE_INVALIDE", "L'année doit être un entier de 2000 à 2099.")
    return f"PAR-{annee}-{numero:04d}"
