"""Le contrat (contrats/demande.schema.json) est relu à chaque appel : le modifier suffit à faire évoluer
l'application (champs extraits, colonnes de la base, champs recopiés du formulaire).
"""

from __future__ import annotations

from typing import Any

from guichet.config import lire_json


def charger_schema() -> dict[str, Any]:
    return lire_json("contrats", "demande.schema.json")


def source_de(schema: dict[str, Any], champ: str) -> str:
    """Source d'un champ : « modele » (extrait par Claude, par défaut), « formulaire » ou « code »."""
    return str(schema.get("properties", {}).get(champ, {}).get("x-source", "modele"))


def champs_de_source(schema: dict[str, Any], source: str) -> list[str]:
    return [c for c in schema.get("properties", {}) if source_de(schema, c) == source]


def schema_pour_modele(schema: dict[str, Any]) -> dict[str, Any]:
    """Ce que le modèle reçoit : la forme des champs « modele », sans les x-* ni les longueurs (vérifiées par le code)."""
    props = {}
    for champ in champs_de_source(schema, "modele"):
        d = schema["properties"][champ]
        props[champ] = {k: v for k, v in d.items() if not k.startswith("x-") and k not in ("minLength", "maxLength")}
    s: dict[str, Any] = {"type": "object", "properties": props, "required": [r for r in schema.get("required", []) if r in props]}
    if schema.get("additionalProperties") is False:
        s["additionalProperties"] = False
    return s


def contrat_modele(schema: dict[str, Any]) -> dict[str, Any]:
    """Le contrat restreint aux champs « modele » : pour valider ce que Claude a extrait."""
    garder = set(champs_de_source(schema, "modele"))
    return {
        **schema,
        "properties": {c: d for c, d in schema.get("properties", {}).items() if c in garder},
        "required": [r for r in schema.get("required", []) if r in garder],
    }
