# Idées d’amélioration de la plateforme

Petit module pour noter, organiser et suivre les fonctions à ajouter à open-slide (côté patch core ou côté decks), et pour surveiller le dépôt officiel.

| Fichier | Rôle |
|---|---|
| `idees.json` | Source de vérité : une entrée par idée (statut, priorité, effort, pistes techniques, journal) |
| `TABLEAU.md` | Vue lisible, **générée** : ne pas éditer à la main |
| `veille-upstream.md` | Rapport de veille du dépôt officiel, **généré** |

## Gérer les idées

```
node scripts/idees.mjs list                         # toutes les idées
node scripts/idees.mjs list --statut idee --prio haute
node scripts/idees.mjs show IDEE-004
node scripts/idees.mjs add "Sondage rapide" --cat presentation --prio moyenne --effort S --desc "…"
node scripts/idees.mjs statut IDEE-004 planifie     # idee → a-etudier → planifie → en-cours → fait | abandonne
node scripts/idees.mjs set IDEE-004 prio=haute effort=L
node scripts/idees.mjs note IDEE-004 "Testé en session Lessard, à revoir"
node scripts/idees.mjs piste IDEE-004 "Réutiliser le canal presenter"
```

Catégories : `presentation`, `preparation`, `ressources`, `upstream`. Chaque commande qui modifie une idée regénère `TABLEAU.md`, et un changement de statut est noté dans le journal de l'idée.

## Veille du dépôt officiel

```
node scripts/veille-upstream.mjs
```

Le script tient un miroir du dépôt officiel dans `../open-slide-upstream`, **hors du projet**. Il liste les versions publiées depuis celle épinglée ici et les commits pas encore publiés. Il teste aussi notre patch sur la dernière version, dans un dossier temporaire supprimé ensuite. Il ne modifie ni `node_modules`, ni `package.json`, ni le patch.
