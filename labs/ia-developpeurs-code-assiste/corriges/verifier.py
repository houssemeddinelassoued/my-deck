"""Vérifie les labs IA132 : énoncé (tests attendus en échec) puis corrigé (tests verts).

    python corriges/verifier.py            # tous les labs
    python corriges/verifier.py lab04      # un seul lab

Le dépôt ia132-labs/ est copié dans un dossier temporaire ; chaque corrigé est
superposé à sa copie de l'énoncé, puis pytest et node --test sont lancés.
Ce dossier « corriges/ » est réservé au formateur : ne le publiez pas avec le dépôt.
"""

import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ICI = Path(__file__).resolve().parent
DEPOT = ICI.parent / "ia132-labs"
NODE = ["node", "--disable-warning=ExperimentalWarning", "--test"]


def compte(sortie: str, motif: str) -> int:
    m = re.findall(motif, sortie)
    return int(m[-1]) if m else 0


def pytest(dossier: Path) -> tuple[int, int]:
    if not any(dossier.rglob("test_*.py")):
        return (0, 0)
    out = subprocess.run(
        [sys.executable, "-m", "pytest", "-q", "-o", "addopts=", "-p", "no:cacheprovider", str(dossier)],
        capture_output=True, text=True, cwd=dossier, encoding="utf-8", errors="replace",
    ).stdout
    return compte(out, r"(\d+) passed"), compte(out, r"(\d+) failed") + compte(out, r"(\d+) errors?")


def node(dossier: Path) -> tuple[int, int]:
    if not any(dossier.rglob("*.test.ts")):
        return (0, 0)
    out = subprocess.run(
        [*NODE, str(dossier).replace("\\", "/") + "/**/*.test.ts"],
        capture_output=True, text=True, encoding="utf-8", errors="replace", shell=sys.platform == "win32",
    ).stdout
    return compte(out, r"ℹ pass (\d+)"), compte(out, r"ℹ fail (\d+)")


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    filtre = sys.argv[1] if len(sys.argv) > 1 else ""
    erreurs = 0
    with tempfile.TemporaryDirectory() as tmp:
        avant = Path(tmp) / "enonce"
        apres = Path(tmp) / "corrige"
        ignore = shutil.ignore_patterns("__pycache__", ".pytest_cache", "node_modules", ".venv")
        shutil.copytree(DEPOT, avant, ignore=ignore)
        shutil.copytree(DEPOT, apres, ignore=ignore)
        for lab in sorted((DEPOT / "labs").iterdir()):
            if filtre not in lab.name:
                continue
            corrige = ICI / lab.name
            if corrige.exists():
                ignore_racine = shutil.ignore_patterns("__pycache__", "_racine")
                shutil.copytree(corrige, apres / "labs" / lab.name, dirs_exist_ok=True, ignore=ignore_racine)
                if (corrige / "_racine").exists():  # fichiers à la racine du dépôt (ex. .github/workflows)
                    shutil.copytree(corrige / "_racine", apres, dirs_exist_ok=True)
            for langue, lancer in (("python", pytest), ("typescript", node)):
                e_ok, e_ko = lancer(avant / "labs" / lab.name / langue)
                c_ok, c_ko = lancer(apres / "labs" / lab.name / langue)
                if e_ok + e_ko + c_ok + c_ko == 0:
                    continue
                statut = "OK " if c_ko == 0 and c_ok > 0 else "KO "
                erreurs += statut == "KO "
                print(f"{statut} {lab.name:<26} {langue:<10} énoncé {e_ok:>2} ✓ {e_ko:>2} ✗   corrigé {c_ok:>2} ✓ {c_ko:>2} ✗")
    print("\nTous les corrigés passent." if not erreurs else f"\n{erreurs} corrigé(s) en échec.")
    return 1 if erreurs else 0


if __name__ == "__main__":
    sys.exit(main())
