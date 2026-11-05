"""Construit le paquet des ateliers « GitHub Copilot · Débutant » (bouton « Labs » du deck).

    python .cpd-labs/pack.py

Contenu : le dépôt taskflow-copilot/ (sans caches) + le guide PDF. Les corrigés ne sont JAMAIS inclus.
Produit aussi corriges-Copilot-Debutant.zip (réservé au formateur) à côté des labs.
"""

import zipfile
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
LABS = RACINE / "labs" / "copilot-debutant"
PAQUET = RACINE / "slides" / "copilot-debutant" / "assets" / "labs-copilot-debutant.zip"
GUIDE = "Guide-des-ateliers-Copilot-Debutant.pdf"
EXCLUS = {".git", "__pycache__", ".pytest_cache", "node_modules", "coverage", ".venv"}


def ajouter(z: zipfile.ZipFile, dossier: Path, prefixe: str, sauf: set[str] | None = None) -> int:
    n = 0
    for f in sorted(dossier.rglob("*")):
        rel = f.relative_to(dossier)
        if f.is_file() and not EXCLUS.intersection(rel.parts) and not (sauf and rel.name in sauf) and f.suffix != ".class":
            z.write(f, f"{prefixe}/{rel.as_posix()}")
            n += 1
    return n


def main() -> None:
    PAQUET.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(PAQUET, "w", zipfile.ZIP_DEFLATED) as z:
        n = ajouter(z, LABS / "taskflow-copilot", "taskflow-copilot", sauf={GUIDE})  # le PDF va à la racine du zip
        z.write(LABS / GUIDE, GUIDE)
    print(f"{PAQUET.relative_to(RACINE)} : {n + 1} fichiers, {PAQUET.stat().st_size // 1024} Ko")
    corriges = LABS / "corriges-Copilot-Debutant.zip"
    with zipfile.ZipFile(corriges, "w", zipfile.ZIP_DEFLATED) as z:
        n = ajouter(z, LABS / "corriges", "corriges")
        z.write(LABS / "LISEZMOI-formateur.md", "LISEZMOI-formateur.md")
    print(f"{corriges.relative_to(RACINE)} : {n + 1} fichiers (formateur uniquement)")


if __name__ == "__main__":
    main()
