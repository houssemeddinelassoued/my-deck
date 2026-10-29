"""Lab 01 — Convertisseur d'unités (corrigé)."""

import sys

ZERO_ABSOLU_C = -273.15
KM_PAR_MILE = 1.609344


def celsius_vers_fahrenheit(c: float) -> float:
    if c < ZERO_ABSOLU_C:
        raise ValueError(f"{c} °C est sous le zéro absolu")
    return c * 9 / 5 + 32


def fahrenheit_vers_celsius(f: float) -> float:
    c = (f - 32) * 5 / 9
    if c < ZERO_ABSOLU_C:
        raise ValueError(f"{f} °F est sous le zéro absolu")
    return c


def km_vers_miles(km: float) -> float:
    if km < 0:
        raise ValueError("distance négative")
    return km / KM_PAR_MILE


def miles_vers_km(miles: float) -> float:
    if miles < 0:
        raise ValueError("distance négative")
    return miles * KM_PAR_MILE


CONVERSIONS = {
    ("C", "F"): celsius_vers_fahrenheit,
    ("F", "C"): fahrenheit_vers_celsius,
    ("km", "mi"): km_vers_miles,
    ("mi", "km"): miles_vers_km,
}
UNITES = {u for paire in CONVERSIONS for u in paire}


def convertir(valeur: float, de: str, vers: str) -> float:
    if de == vers and de in UNITES:
        return valeur
    try:
        return CONVERSIONS[(de, vers)](valeur)
    except KeyError:
        raise ValueError(f"conversion {de} → {vers} non prise en charge") from None


def main(argv: list[str]) -> str:
    if len(argv) != 3:
        return "Usage : python convertisseur.py <valeur> <de> <vers>   (unités : C, F, km, mi)"
    try:
        resultat = convertir(float(argv[0]), argv[1], argv[2])
    except ValueError as e:
        return f"Erreur : {e}"
    return f"{resultat:.2f} {argv[2]}"


if __name__ == "__main__":
    print(main(sys.argv[1:]))
