"""Serveur HTTP de Guichet : l'API et l'interface web (dossier web/ à la racine du dépôt).

    node guichet.mjs lancer   (ou : uv run python -m guichet.serveur, avec GUICHET_RACINE défini)
"""

from __future__ import annotations

import json
import mimetypes
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import parse_qs, urlparse

from guichet.config import NonImplemente, chemin, lire_json
from guichet.depot.filtre import filtrer_par_client
from guichet.depot.notion import DepotNotion
from guichet.depot.sqlite import DepotSqlite
from guichet.moteurs.moteur import choisir_moteur
from guichet.pipeline.erreurs import ErreurValidation
from guichet.pipeline.traiter import Dependances, traiter

PORT = int(os.environ.get("PORT", "3000"))
MOTEUR = choisir_moteur()
LOCAL = DepotSqlite(os.environ.get("GUICHET_DB") or str(chemin("donnees", "guichet.db")))
DEPOT: Any = DepotNotion(LOCAL) if os.environ.get("STOCKAGE") == "notion" else LOCAL
CLIENTS = lire_json("donnees", "clients.json")
WEB = chemin("web").resolve()


class Gestionnaire(BaseHTTPRequestHandler):
    def log_message(self, *args: Any) -> None:  # journal silencieux
        pass

    def _json(self, statut: int, corps: Any) -> None:
        donnees = json.dumps(corps, ensure_ascii=False).encode()
        self.send_response(statut)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(donnees)))
        self.end_headers()
        self.wfile.write(donnees)

    def do_GET(self) -> None:  # noqa: N802
        url = urlparse(self.path)
        if url.path == "/api/demandes":
            client = parse_qs(url.query).get("client", [None])[0]
            return self._json(200, filtrer_par_client(DEPOT.lister(), client))
        if url.path == "/api/references":
            return self._json(200, lire_json("donnees", "demandes.json"))
        relatif = "index.html" if url.path == "/" else url.path.lstrip("/")
        fichier = (WEB / relatif).resolve()
        if not str(fichier).startswith(str(WEB)) or not fichier.is_file():
            return self._json(404, {"erreur": "introuvable"})
        donnees = fichier.read_bytes()
        self.send_response(200)
        self.send_header("content-type", (mimetypes.guess_type(fichier.name)[0] or "application/octet-stream") + "; charset=utf-8")
        self.send_header("content-length", str(len(donnees)))
        self.end_headers()
        self.wfile.write(donnees)

    def do_POST(self) -> None:  # noqa: N802
        if urlparse(self.path).path != "/api/demandes":
            return self._json(405, {"erreur": "méthode non prise en charge"})
        longueur = int(self.headers.get("content-length") or 0)
        formulaire = json.loads(self.rfile.read(longueur) or b"{}")
        if not str(formulaire.get("message") or "").strip():
            return self._json(422, {"erreur": "Le message est obligatoire."})
        try:
            demande, nouvelle = traiter(formulaire, Dependances(moteur=MOTEUR, depot=DEPOT, clients=CLIENTS))
            self._json(201, {"demande": demande, "nouvelle": nouvelle})
        except ErreurValidation as e:
            self._json(422, {"erreur": str(e)})
        except NonImplemente as e:
            # Atelier 3 en cours : on montre au moins la réponse brute du moteur (A3.1).
            try:
                brute = MOTEUR.appel_simple(formulaire["message"])
            except Exception as e2:  # noqa: BLE001
                brute = str(e2)
            self._json(501, {"erreur": str(e), "reponse_brute": brute})
        except Exception as e:  # noqa: BLE001
            print(f"Erreur : {e!r}")
            self._json(502, {"erreur": str(e)})


def main() -> None:
    print(f"Guichet (Python, moteur {MOTEUR.nom}) : http://localhost:{PORT}", flush=True)
    ThreadingHTTPServer(("", PORT), Gestionnaire).serve_forever()


if __name__ == "__main__":
    main()
