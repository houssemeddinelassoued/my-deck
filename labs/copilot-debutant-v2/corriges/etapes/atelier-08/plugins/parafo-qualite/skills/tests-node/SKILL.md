---
name: tests-node
description: Écrire ou compléter des tests unitaires node:test pour Parafo, puis vérifier qu'ils protègent vraiment le code (couverture, mutation, garde). Utiliser pour générer des tests, tester une fonction ou un module, ou vérifier une suite de tests.
argument-hint: "[fichier à tester]"
---

# Tests node:test pour Parafo

## Écrire

- Fichier `test/<module>.test.js`, `import { describe, it } from 'node:test'` et `import assert from 'node:assert/strict'`.
- Un `describe` par fonction exportée, un `it` par comportement, nom en français : « refuse un type inconnu (TYPE_INCONNU) ».
- Schéma **Arrange / Act / Assert** : préparer les données, appeler une fois, vérifier.
- Jamais l'heure réelle : injecter une **horloge** fixe, par exemple `() => new Date('2026-11-10T08:00:00.000Z')`.
- Erreurs : `assert.throws(() => …, (e) => e.code === 'CODE')`.
- Couvrir : cas nominal, chaque code d'erreur, bornes, immuabilité (modifier ce qui est renvoyé ne change pas l'état interne), et pour un journal chaîné : la genèse, une falsification au milieu ET à la fin, un chaînage cassé avec empreinte recalculée.
- Ne jamais modifier le code testé pour faire passer un test : signaler le défaut.

## Vérifier

1. `node --test test/<module>.test.js` : tout vert sur le code d'origine.
2. `npm run couverture` : relire les lignes non couvertes de `src/<module>.js`.
3. `npm run mutation` : chaque mutant doit être détecté ; un survivant = un test manquant, à ajouter.

## Définition de fini

Le travail n'est terminé que si TOUT est vrai :

- [ ] les tests du module passent : `node --test test/<module>.test.js` ;
- [ ] `npm run mutation` : tous les mutants détectés ;
- [ ] `npm run garde` : aucun fichier protégé modifié (tests d'acceptation, `src/journal.js`) ;
- [ ] la couverture de `src/<module>.js` a été relue, les lignes non couvertes sont justifiées ;
- [ ] le résumé final liste les tests ajoutés et les commandes lancées, avec leur résultat.
