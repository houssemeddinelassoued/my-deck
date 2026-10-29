"""Construit le paquet des labs IA132 distribué aux participants (bouton « Labs » du deck).

    python .ia132-labs/pack.py

Contenu : le dépôt ia132-labs/ (sans caches) + le guide PDF. Les corrigés ne sont JAMAIS inclus.
Produit aussi corriges-IA132.zip (réservé au formateur) à côté des labs.
"""

import zipfile
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
LABS = RACINE / "labs" / "ia-developpeurs-code-assiste"
PAQUET = RACINE / "slides" / "ia-developpeurs-code-assiste" / "assets" / "labs-ia132.zip"
EXCLUS = {".git", "__pycache__", ".pytest_cache", ".ruff_cache", "node_modules", ".venv"}


def ajouter(z: zipfile.ZipFile, dossier: Path, prefixe: str) -> int:
    n = 0
    for f in sorted(dossier.rglob("*")):
        if f.is_file() and not EXCLUS.intersection(f.relative_to(dossier).parts):
            z.write(f, f"{prefixe}/{f.relative_to(dossier).as_posix()}")
            n += 1
    return n


def main() -> None:
    PAQUET.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(PAQUET, "w", zipfile.ZIP_DEFLATED) as z:
        n = ajouter(z, LABS / "ia132-labs", "ia132-labs")
        z.write(LABS / "Guide-des-ateliers-IA132.pdf", "Guide-des-ateliers-IA132.pdf")
    print(f"{PAQUET.relative_to(RACINE)} : {n + 1} fichiers, {PAQUET.stat().st_size // 1024} Ko")
    corriges = LABS / "corriges-IA132.zip"
    with zipfile.ZipFile(corriges, "w", zipfile.ZIP_DEFLATED) as z:
        n = ajouter(z, LABS / "corriges", "corriges")
    print(f"{corriges.relative_to(RACINE)} : {n} fichiers (formateur uniquement)")


if __name__ == "__main__":
    main()
