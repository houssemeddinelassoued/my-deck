"""Atelier 2, étape A2.3 · la boucle générer → vérifier → corriger, avec une limite de tours.

Lancer sur une tâche : node guichet.mjs boucle taches/tronquer-resume.md
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass, field
from typing import Callable

from guichet.config import RACINE


@dataclass
class Verification:
    ok: bool
    sortie: str  # ce qu'ont dit la garde et les tests (renvoyé tel quel au modèle)


@dataclass
class Resultat:
    ok: bool
    tour: int
    historique: list[Verification] = field(default_factory=list)  # pour l'humain, en cas d'échec


def boucle(tache: str, generer: Callable[[str, str], None], verifier: Callable[[], Verification], max_tours: int = 3) -> Resultat:
    historique: list[Verification] = []
    retours = ""
    for tour in range(1, max_tours + 1):
        generer(tache, retours)
        r = verifier()
        historique.append(r)
        if r.ok:
            return Resultat(ok=True, tour=tour, historique=historique)
        # On renvoie la sortie exacte de la garde et des tests, pas un résumé.
        retours = r.sortie
    # Après max_tours échecs : on s’arrête et on rend l’historique complet à un humain.
    return Resultat(ok=False, tour=max_tours, historique=historique)


# ─── Lanceur (fourni) ────────────────────────────────────────────────────────


def _claude(prompt: str) -> str:
    exe = shutil.which("claude")
    if not exe:
        raise RuntimeError("claude introuvable")
    r = subprocess.run([exe, "-p", "--output-format", "json"], input=prompt, capture_output=True, text=True, encoding="utf-8", cwd=tempfile.gettempdir(), timeout=300)
    if r.returncode != 0:
        raise RuntimeError(f"claude -p a échoué : {(r.stderr or r.stdout)[:300]}")
    return str(json.loads(r.stdout).get("result", ""))


def main(fichier_tache: str) -> int:
    tache = open(fichier_tache, encoding="utf-8").read()
    m = re.search(r"^fichier-python:\s*(.+)$", tache, re.M)
    if not m:
        print("La tâche ne précise pas de « fichier-python: ».")
        return 1
    cible = RACINE / m.group(1).strip()

    def generer(t: str, retours: str) -> None:
        prompt = "\n".join(
            [
                "<tache>",
                t,
                "</tache>",
                f'<fichier_actuel chemin="{m.group(1).strip()}">',
                cible.read_text(encoding="utf-8"),
                "</fichier_actuel>",
                f"<retours_de_verification>\n{retours}\n</retours_de_verification>\nCorrige le fichier pour que ces vérifications passent." if retours else "",
                "Réponds uniquement avec le contenu complet du fichier, dans un seul bloc de code Python.",
            ]
        )
        reponse = _claude(prompt)
        blocs = re.findall(r"```[\w-]*\r?\n(.*?)```", reponse, re.S)
        code = max(blocs, key=len) if blocs else reponse
        cible.write_text(code, encoding="utf-8")
        print(f"  → {cible.name} réécrit ({code.count(chr(10)) + 1} lignes)")

    def verifier() -> Verification:
        env = {**os.environ, "NO_COLOR": "1"}
        g = subprocess.run(["node", str(RACINE / "guichet.mjs"), "garde"], capture_output=True, text=True, encoding="utf-8", cwd=RACINE, env=env)
        t = subprocess.run(["node", str(RACINE / "guichet.mjs"), "tests", "--tag", "BOUCLE", "--detail"], capture_output=True, text=True, encoding="utf-8", cwd=RACINE, env=env)
        sortie = re.sub(r"\x1b\[\d+m", "", f"{g.stdout}{g.stderr}\n{t.stdout}{t.stderr}")[-6000:]
        v = Verification(ok=g.returncode == 0 and t.returncode == 0, sortie=sortie)
        print(f"  → vérification : {'OK' if v.ok else 'échec'}")
        return v

    tours = {"n": 0}

    def generer_trace(t: str, retours: str) -> None:
        tours["n"] += 1
        print(f"Tour {tours['n']} : génération{' avec les retours du tour précédent' if retours else ''}…")
        generer(t, retours)

    res = boucle(tache, generer_trace, verifier)
    if res.ok:
        print(f"Réussi en {res.tour} tour(s).")
        return 0
    print(f"Échec après {res.tour} tours : à vous de regarder. Dernière vérification :\n{res.historique[-1].sortie if res.historique else ''}")
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
