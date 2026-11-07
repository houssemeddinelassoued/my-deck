---
applyTo: "**/*.py"
description: Conventions Python des katas Parafo (bonus de l'Atelier 4)
---

- Python 3.10 ou plus, bibliothèque standard uniquement, annotations de type.
- Donnée invalide : lever `ErreurParafo(code, message)` avec un code en MAJUSCULES, jamais `ValueError` nu.
- Valider les types avec `type(x) is int` (un booléen n'est pas un numéro).
- Docstrings et messages en français. Tests avec `unittest`.
