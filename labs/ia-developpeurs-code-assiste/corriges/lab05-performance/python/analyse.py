"""Lab 05 — Analyse d'une liste de diffusion (corrigé optimisé, O(n))."""

from collections import Counter


def normaliser(courriel: str) -> str:
    return courriel.strip().lower()


def dedoublonner(courriels: list[str]) -> list[str]:
    """Courriels uniques, normalisés, dans l'ordre de leur PREMIÈRE apparition."""
    # dict conserve l'ordre d'insertion (Python 3.7+) : O(n) au lieu de O(n²).
    # Piège : list(set(...)) serait aussi rapide mais perdrait l'ordre.
    return list(dict.fromkeys(normaliser(c) for c in courriels))


def top_domaines(courriels: list[str], n: int = 3) -> list[tuple[str, int]]:
    """Les n domaines les plus fréquents : (domaine, nombre), par nombre décroissant puis par nom."""
    comptes = Counter(normaliser(c).split("@")[1] for c in courriels)
    # most_common() départage les égalités par ordre d'apparition, pas par nom : on trie nous-mêmes.
    return sorted(comptes.items(), key=lambda x: (-x[1], x[0]))[:n]


def communs(liste_a: list[str], liste_b: list[str]) -> list[str]:
    """Courriels présents dans les deux listes, sans doublon, dans l'ordre de liste_a."""
    b = {normaliser(c) for c in liste_b}  # recherche O(1) dans un ensemble
    return [c for c in dedoublonner(liste_a) if c in b]
