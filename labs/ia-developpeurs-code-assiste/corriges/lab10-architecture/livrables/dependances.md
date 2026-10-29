# Analyse des dépendances du prototype 2019

Analyse proposée par l’IA, puis **vérifiée** le 2026-10-29 avec `pip-audit --disable-pip --no-deps -r requirements-legacy.txt` (139 vulnérabilités connues, dans les 7 paquets) et `npm audit` (15 alertes, base GitHub Advisory). Les identifiants ci-dessous viennent des outils, pas de l’IA : deux identifiants proposés par l’IA ont été retirés car introuvables ou retirés de la base (ex. CVE-2022-23529 pour jsonwebtoken, retirée par son éditeur).

## Python (pip-audit)

| Paquet | Version | Constat de l’outil | Action |
| --- | --- | --- | --- |
| Django | 2.2.0 | 43 vulnérabilités (ex. PYSEC-2019-13) ; branche en fin de vie depuis avril 2022 | Migrer vers la version LTS courante |
| requests | 2.19.1 | 5 vulnérabilités (ex. PYSEC-2018-28 : en-tête Authorization renvoyé après redirection vers HTTP) | Dernière version |
| urllib3 | 1.24.1 | 13 vulnérabilités (ex. PYSEC-2019-133) | Suit la mise à jour de requests |
| PyYAML | 5.3 | 2 vulnérabilités (ex. PYSEC-2021-142 : exécution de code via `full_load`) | ≥ 5.4, et `safe_load` uniquement |
| Jinja2 | 2.10 | 6 vulnérabilités (ex. PYSEC-2019-217 : évasion du bac à sable) | Version 3.x |
| Pillow | 8.0.0 | 69 vulnérabilités (ex. PYSEC-2021-137), décodage d’images | Dernière version |
| celery | 4.3.0 | 1 vulnérabilité ; branche non maintenue | 5.x, ou retirer si la file de messages suffit |

## JavaScript (npm audit)

| Paquet | Version | Constat de l’outil | Action |
| --- | --- | --- | --- |
| lodash | 4.17.15 | Élevé, 6 avis (ex. GHSA-p6mc-m468-83gw : pollution de prototype) | Dernière 4.17.x, ou méthodes natives |
| axios | 0.21.0 | Élevé, nombreux avis (ex. GHSA-4w2v-q235-vp99 : SSRF) | 1.x |
| jsonwebtoken | 8.5.1 | Élevé, 3 avis (ex. GHSA-8cf7-32gw-wr33, GHSA-hjrf-2m68-5959) | ≥ 9 |
| moment | 2.29.1 | Élevé, 2 avis (ex. GHSA-8hfj-j24r-96c4 : traversée de répertoire) ; bibliothèque en maintenance | `Intl` / `Temporal`, ou date-fns |
| express | 4.16.0 | Élevé, 2 avis directs (ex. GHSA-qw6h-vgh9-j6wx) + dépendances transitives | Dernière 4.x ou 5.x |
| request | 2.88.0 | Critique (GHSA-p8p7-x288-28g6) ; paquet abandonné en 2020 | `fetch` natif |

## Recommandation

Ne pas réutiliser ces fichiers : repartir des versions courantes et ajouter `pip-audit` et `npm audit --audit-level=high` au pipeline CI pour bloquer toute régression. Les chiffres augmentent avec le temps : relancez l’audit le jour de la formation.
