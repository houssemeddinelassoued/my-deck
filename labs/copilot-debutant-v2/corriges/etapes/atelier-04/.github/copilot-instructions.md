# Parafo · instructions pour Copilot

Parafo est un parapheur numérique FICTIF (formation) : des documents circulent pour être signés.
JavaScript, modules ES (`import`/`export`), Node.js 22 ou plus.

## Règles maison

- Aucune dépendance npm : uniquement les modules intégrés de Node, importés avec le préfixe `node:` (`node:crypto`, `node:fs`…).
- Toute donnée invalide lève une `ErreurParafo` (`src/erreurs.js`) avec un code en MAJUSCULES_AVEC_SOULIGNÉS, par exemple `TITRE_INVALIDE`. Jamais `throw new Error`, jamais de `null` silencieux.
- Messages d'erreur, JSDoc et commentaires en français.
- Fonctions pures : ne modifiez jamais un objet ou un tableau reçu en paramètre, renvoyez-en une copie.
- Valider les types explicitement : `Number.isInteger`, `typeof x === 'string'`. Un texte « 42 » n'est pas un nombre.
- Dates échangées en ISO 8601 (`toISOString()`), jours au format `AAAA-MM-JJ`, calculs en UTC.
- Affichage pour l'utilisateur : virgule décimale (`12,5 Ko`), unités o / Ko / Mo avec 1 Ko = 1024 o, guillemets français `« … »`.
- Chaque fonction exportée a une JSDoc : rôle, `@param`, `@returns`, `@throws` avec les codes d'erreur.

## Tests

- `node:test` et `node:assert/strict`, lancés par `npm test` ou `npm run test:atelierN`.
- Ne modifiez jamais `test/acceptance/` : c'est le contrat. Si un test échoue, corrigez le code.

## À ne pas lire

- `reprises/` : points de reprise de la formation, hors sujet pour vos réponses.
