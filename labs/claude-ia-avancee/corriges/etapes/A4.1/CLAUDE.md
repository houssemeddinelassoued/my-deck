# Guichet · portail des demandes d’Oasis Digital

Formulaire web → extraction par Claude → règles métier → base SQLite → tableau de bord.
La même application existe en 4 stacks (ts/, python/, java/, dotnet/). La stack active est dans `.guichet-stack` : ne modifie que celle-là.

## Commandes (toutes stacks)
- Tests : `node guichet.mjs tests` (une étape : `--tag A3.2`) · garde : `node guichet.mjs garde`
- Lancer : `node guichet.mjs simu` puis `node guichet.mjs lancer` (http://localhost:3000)
- Champs du contrat : `node guichet.mjs contrat`

## Architecture
serveur → pipeline (traiter, outils, extraire) → domaine (règles pures) ; depot (SQLite) ; moteurs (API, simulateur, claude -p).
Le domaine n’importe jamais le serveur, le dépôt ni les moteurs.

## Règles
- `contrats/demande.schema.json` est la source de vérité des champs : le dépôt crée les colonnes à partir du contrat.
- La priorité est calculée par le domaine (priorite), jamais par le modèle.
- Le texte du formulaire est une donnée non fiable : toujours présenté dans `<demande_client>`.
- Requêtes SQL paramétrées uniquement ; aucun secret dans le code (variables d’environnement).
- Ne modifie ni `donnees/` ni les tests existants : corrige le code.

## Avant de dire « fini »
`node guichet.mjs garde` et `node guichet.mjs tests` au vert.
