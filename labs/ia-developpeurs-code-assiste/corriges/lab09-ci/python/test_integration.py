"""Tests d'intégration (corrigé) : un vrai serveur HTTP, de vraies requêtes."""

import json
import threading
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

import pytest

from api import creer_serveur


class SansRedirection(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


ouvrir = urllib.request.build_opener(SansRedirection).open


@pytest.fixture(scope="module")
def serveur():
    srv = creer_serveur()
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{srv.server_address[1]}"
    srv.shutdown()


def requete(base, methode, chemin, corps=None, brut=None):
    donnees = brut if brut is not None else (json.dumps(corps).encode() if corps is not None else None)
    req = urllib.request.Request(base + chemin, data=donnees, method=methode, headers={"Content-Type": "application/json"})
    try:
        with ouvrir(req, timeout=5) as r:
            contenu = r.read()
            return r.status, r.headers, json.loads(contenu) if contenu else None
    except urllib.error.HTTPError as e:
        contenu = e.read()
        return e.code, e.headers, json.loads(contenu) if contenu else None


def creer(base, url="https://technologia.com"):
    statut, _, corps = requete(base, "POST", "/liens", {"url": url})
    assert statut == 201
    return corps["code"]


def test_sante(serveur):
    assert requete(serveur, "GET", "/sante")[::2] == (200, {"statut": "ok"})


def test_creer_puis_suivre_un_lien(serveur):
    code = creer(serveur, "https://exemple.ca/page")
    statut, entetes, _ = requete(serveur, "GET", f"/l/{code}")
    assert statut == 302
    assert entetes["Location"] == "https://exemple.ca/page"


def test_statistiques_apres_trois_visites(serveur):
    code = creer(serveur)
    for _ in range(3):
        requete(serveur, "GET", f"/l/{code}")
    assert requete(serveur, "GET", f"/stats/{code}")[2]["clics"] == 3


@pytest.mark.parametrize("corps", [{"url": "ftp://x.ca"}, {"url": ""}, {}, ["https://x.ca"]])
def test_url_invalide(serveur, corps):
    assert requete(serveur, "POST", "/liens", corps)[0] == 400


def test_json_invalide(serveur):
    assert requete(serveur, "POST", "/liens", brut=b"{pas du json")[0] == 400


@pytest.mark.parametrize("chemin", ["/l/inconnu", "/stats/inconnu", "/nimporte"])
def test_introuvable(serveur, chemin):
    assert requete(serveur, "GET", chemin)[0] == 404


def test_post_sur_une_route_inconnue(serveur):
    assert requete(serveur, "POST", "/autre", {"url": "https://x.ca"})[0] == 404


def test_creations_concurrentes_codes_uniques(serveur):
    with ThreadPoolExecutor(20) as pool:
        codes = list(pool.map(lambda i: creer(serveur, f"https://exemple.ca/{i}"), range(200)))
    assert len(set(codes)) == 200
