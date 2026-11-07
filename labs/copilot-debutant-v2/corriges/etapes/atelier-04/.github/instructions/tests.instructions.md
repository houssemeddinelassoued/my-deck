---
applyTo: "test/**/*.test.js"
description: Conventions des tests de Parafo
---

# Tests de Parafo

- `import { describe, it } from 'node:test';` et `import assert from 'node:assert/strict';`
- Un `describe` par fonction, des noms de tests en français qui décrivent le comportement attendu.
- Schéma Arrange / Act / Assert : préparer, agir, vérifier, séparés par une ligne vide.
- Comparer les objets avec `assert.deepEqual`, les erreurs avec `assert.throws(fn, (e) => e.code === 'CODE')`.
- Pas d'heure réelle : injectez une date fixe (`new Date('2026-11-09T09:00:00.000Z')`) ou une horloge.
- Un test = un comportement. Pas de logique (boucle, condition) dans le corps d'un test, sauf tableau de cas.
- Ne jamais modifier `test/acceptance/`.
