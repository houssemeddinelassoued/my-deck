"""Atelier 1 · version de référence (corrigé). En atelier, ce fichier est généré par Claude à partir du prompt v3."""

from __future__ import annotations

import re
from datetime import date, timedelta

from guichet.domaine.demande import Budget, DemandeBrute, DemandeNormalisee


def _vide(s: str | None) -> bool:
    return not s or not s.strip()


def _espaces(s: str) -> str:
    return s.replace(" ", " ").replace(" ", " ")


def normaliser_telephone(brut: str | None) -> str | None:
    if _vide(brut):
        return None
    t = re.sub(r"[\s.\-()]", "", _espaces(brut or "").replace("(0)", ""))
    if m := re.fullmatch(r"(?:\+|00)216(\d{8})", t):
        return f"+216{m.group(1)}"
    if re.fullmatch(r"[2-9]\d{7}", t):
        return f"+216{t}"
    if m := re.fullmatch(r"(?:\+|00)33(\d{9})", t):
        return f"+33{m.group(1)}"
    if m := re.fullmatch(r"0(\d{9})", t):
        return f"+33{m.group(1)}"
    return None


def normaliser_email(brut: str | None) -> str | None:
    if _vide(brut):
        return None
    e = re.sub(r"\s+", "", _espaces(brut or "")).lower()
    return e if re.fullmatch(r"[^@\s]+@[^@\s]+\.[a-z]{2,}", e) else None


def _iso(a: int, m: int, j: int) -> str | None:
    try:
        return date(a, m, j).isoformat()
    except ValueError:
        return None


def normaliser_date(brut: str | None, aujourdhui: str) -> str | None:
    if _vide(brut):
        return None
    t = _espaces(brut or "").strip().lower()
    ref = date.fromisoformat(aujourdhui)
    relatifs = {"aujourd'hui": 0, "aujourd’hui": 0, "demain": 1, "hier": -1}
    if t in relatifs:
        return (ref + timedelta(days=relatifs[t])).isoformat()
    if m := re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", t):
        return _iso(int(m[1]), int(m[2]), int(m[3]))
    if m := re.fullmatch(r"(\d{1,2})/(\d{1,2})/(\d{4})", t):
        return _iso(int(m[3]), int(m[2]), int(m[1]))
    if m := re.fullmatch(r"(\d{1,2})/(\d{1,2})", t):
        return _iso(ref.year, int(m[2]), int(m[1]))
    return None


def normaliser_budget(brut: str | None) -> Budget | None:
    if _vide(brut):
        return None
    t = _espaces(brut or "").lower()
    if re.search(r"\b(dt|tnd|dinars?)\b", t):
        devise = "TND"
    elif re.search(r"€|\beur\b|\beuros?\b", t):
        devise = "EUR"
    else:
        return None
    n = re.search(r"\d[\d\s.,]*", t)
    if not n:
        return None
    s = re.sub(r"\s+", "", n.group(0).strip())
    if "." in s and "," in s:
        s = s.replace(".", "").replace(",", ".")
    elif "," in s:
        s = s.replace(",", ".")
    try:
        montant = float(s)
    except ValueError:
        return None
    return {"montant": int(montant) if montant.is_integer() else montant, "devise": devise}


def normaliser_demande(brute: DemandeBrute, aujourdhui: str) -> DemandeNormalisee:
    return {
        "email": normaliser_email(brute.get("email")),
        "telephone": normaliser_telephone(brute.get("telephone")),
        "date_souhaitee": normaliser_date(brute.get("date_souhaitee"), aujourdhui),
        "budget": normaliser_budget(brute.get("budget")),
    }
