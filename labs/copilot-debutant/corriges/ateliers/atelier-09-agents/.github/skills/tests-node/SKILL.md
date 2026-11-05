---
name: tests-node
description: Écrire et lancer des tests unitaires node:test pour TaskFlow (structure AAA, assert/strict, cas limites, dates fixes). À utiliser pour ajouter ou vérifier des tests dans test/.
---
# Tests node:test pour TaskFlow

## Où et comment
- Fichiers `test/<module>.test.js` ; les tests ajoutés par un agent vont dans `test/<module>-qa.test.js`.
- `import { describe, it } from 'node:test'` et `import assert from 'node:assert/strict'`.
- Lancer un fichier : `node --test test/<fichier>.test.js` · tout lancer : `npm test`.
- Modèle à copier : [modele.test.js](./modele.test.js).

## Structure de chaque test
1. **Arrange** : des données minimales, fabriquées par une petite fonction (`t(...)`).
2. **Act** : un seul appel à la fonction testée.
3. **Assert** : `assert.equal` pour une valeur, `assert.deepEqual` pour un objet ou un tableau, `assert.throws(fn, /message/)` pour une erreur.

## Cas limites à toujours essayer
- Liste vide, valeur absente (`undefined`), valeur au mauvais format.
- Bornes : le jour même, la veille, le lendemain.
- Changement de mois, d'année, année bissextile (29 février), changement d'heure (fin octobre).
- La donnée reçue n'est pas modifiée (`structuredClone` avant, `deepEqual` après).

## Interdits
- `new Date()` sans argument : un test doit donner le même résultat demain.
- Un test sans assertion, ou qui recopie l'implémentation.
- Affaiblir un test qui échoue pour le faire passer.
