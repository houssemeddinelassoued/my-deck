---
name: refactoring-sur
description: Méthode de refactoring sûr pour du code JavaScript hérité de Parafo. Utiliser pour refactorer, nettoyer, renommer ou extraire des fonctions sans changer le comportement, sous tests de caractérisation.
---

# Refactoring sûr

## Avant de toucher au code

1. Des **tests de caractérisation** figent le comportement actuel, défauts compris. S'il n'y en a pas, écris-les d'abord et fais-les passer sur le code tel quel.
2. Lance-les : tout doit être vert avant le premier geste.

## Les gestes, un seul à la fois

| Geste | Exemple |
|---|---|
| Renommer | `d`, `n`, `f`, `t` → `dateEnvoi`, `delai`, `feries`, `type` |
| Remplacer `var` | `const` par défaut, `let` si la variable change |
| Extraire une fonction | `estOuvre(date, feries)`, `lendemain(date)` |
| Nommer une constante | `86400000` → `UN_JOUR` |
| Simplifier un test | `for` de recherche → `includes` (même résultat) |

Après chaque geste : tests. Rouge → annuler, refaire plus petit.

## Ce qui n'est PAS un refactoring

- Remplacer `==` par `===`, valider un paramètre, arrêter de modifier un tableau reçu : ce sont des **changements de comportement**. Ils vont dans un commit `fix : …` séparé, avec un test qui les justifie.

## Fin

- `git diff` relu : chaque changement est un geste de la liste.
- Commit `refactor : <ce qui est plus lisible>`, puis, à part, les corrections.
