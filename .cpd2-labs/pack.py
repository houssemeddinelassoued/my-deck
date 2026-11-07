"""Construit le paquet des ateliers « GitHub Copilot · Débutant v2 » (bouton « Labs » du deck).

    node .cpd2-labs/paquets.mjs && node .cpd2-labs/guide.mjs && python .cpd2-labs/pack.py

Contenu : le dépôt parafo-copilot/ (sans .git, caches ni sauvegardes de reprise) + le guide PDF
+ la fiche d'accueil PDF. Les corrigés ne sont JAMAIS inclus (contrôle bloquant ci-dessous).
Produit aussi corriges-Copilot-Debutant-v2.zip (réservé au formateur) à côté des labs.
"""

import zipfile
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
LABS = RACINE / "labs" / "copilot-debutant-v2"
DEPOT = "parafo-copilot"
PAQUET = RACINE / "slides" / "copilot-debutant-v2" / "assets" / "labs-copilot-debutant-v2.zip"
GUIDE = "Guide-des-ateliers-Copilot-Debutant.pdf"
FICHE = "Fiche-accueil-Copilot-Debutant.pdf"
EXCLUS = {".git", "__pycache__", ".pytest_cache", "node_modules", "coverage", ".venv", ".reprises-sauvegardes"}


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
        n = ajouter(z, LABS / DEPOT, DEPOT, sauf={GUIDE})  # le PDF va à la racine du zip
        z.write(LABS / GUIDE, GUIDE)
        z.write(LABS / FICHE, FICHE)
        noms = z.namelist()
    fuites = [x for x in noms if "corrige" in x.lower() or "LISEZMOI-formateur" in x]
    assert not fuites, f"corrigés dans le paquet participant : {fuites}"
    print(f"{PAQUET.relative_to(RACINE)} : {n + 2} fichiers, {PAQUET.stat().st_size // 1024} Ko")

    corriges = LABS / "corriges-Copilot-Debutant-v2.zip"
    with zipfile.ZipFile(corriges, "w", zipfile.ZIP_DEFLATED) as z:
        m = ajouter(z, LABS / "corriges", "corriges")
        for doc in ("LISEZMOI-formateur.md", "VERIFS-AVANT-SESSION.md", "Fiche-accueil-Copilot-Debutant.md"):
            z.write(LABS / doc, doc)
    print(f"{corriges.relative_to(RACINE)} : {m + 3} fichiers, {corriges.stat().st_size // 1024} Ko")


if __name__ == "__main__":
    main()
