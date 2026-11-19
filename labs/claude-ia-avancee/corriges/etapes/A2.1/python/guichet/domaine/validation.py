"""Atelier 2, étape A2.1 · validation stricte par le contrat (sous-ensemble de JSON Schema).

Renvoie la liste des écarts : vide = conforme. Ne lève jamais d'exception pour une donnée invalide.
"""

from __future__ import annotations

from typing import Any


def type_json(v: Any) -> str:
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "boolean"
    if isinstance(v, int):
        return "integer"
    if isinstance(v, float):
        return "integer" if v.is_integer() else "number"
    if isinstance(v, str):
        return "string"
    if isinstance(v, list):
        return "array"
    if isinstance(v, dict):
        return "object"
    return type(v).__name__


def valider_demande(objet: Any, schema: dict[str, Any]) -> list[str]:
    if type_json(objet) != "object":
        return ["la sortie n’est pas un objet JSON"]
    props: dict[str, Any] = schema.get("properties", {})
    erreurs: list[str] = [f"{r} : champ requis manquant" for r in schema.get("required", []) if r not in objet]

    if schema.get("additionalProperties") is False:
        for k in objet:
            if k not in props:
                erreurs.append(f"{k} : champ non prévu par le contrat")

    for k, d in props.items():
        if k not in objet:
            continue
        v = objet[k]
        types = d.get("type")
        if types is not None:
            types = [types] if isinstance(types, str) else types
            t = type_json(v)
            if not any(x == t or (x == "number" and t == "integer") for x in types):
                erreurs.append(f"{k} : type {t} au lieu de {' | '.join(types)}")
        if "enum" in d and v not in d["enum"]:
            erreurs.append(f"{k} : valeur « {v} » hors liste ({', '.join(map(str, d['enum']))})")
        if isinstance(v, str) and "minLength" in d and len(v) < d["minLength"]:
            erreurs.append(f"{k} : trop court (minimum {d['minLength']})")
        if isinstance(v, str) and "maxLength" in d and len(v) > d["maxLength"]:
            erreurs.append(f"{k} : trop long (maximum {d['maxLength']})")
    return erreurs
