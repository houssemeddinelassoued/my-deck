# IA132 · matériel formateur

| Fichier | Rôle | À partager ? |
| --- | --- | --- |
| `ia132-labs/` | Dépôt des labs (copie locale du dépôt GitHub `houssemeddinelassoued/ia132-labs`) | Oui, public |
| `Guide-des-ateliers-IA132.pdf` | Guide PDF des ateliers (30 pages) | Oui |
| `corriges/` et `corriges-IA132.zip` | Corrigés des 12 labs, Python et TypeScript | **Non** : après la formation seulement |
| `corriges/verifier.py` | Vérifie que chaque énoncé échoue comme prévu et que chaque corrigé passe | Non |

## Commandes

```bash
python labs/ia-developpeurs-code-assiste/corriges/verifier.py          # tous les labs
python labs/ia-developpeurs-code-assiste/corriges/verifier.py lab04    # un seul
python .ia132-labs/guide.py && node .ia132-labs/render.mjs             # regénère le guide PDF
python .ia132-labs/pack.py                                             # paquet du bouton « Labs » + corriges-IA132.zip
node .ia132-build/build.mjs                                            # regénère le deck
```

Prérequis du vérificateur : `pytest`, Node 22.18+. Les corrigés et les énoncés sont comparés dans un dossier temporaire.

## Avant chaque session

- Lancer `pip-audit` sur `lab10-architecture/dependances` : les chiffres de la page « Dépendances et risques » du deck datent du 29 octobre 2026.
- Si vous modifiez un lab : mettre à jour son `README.md` (c'est la source du guide PDF), relancer le vérificateur, régénérer le guide, puis pousser le dépôt.
