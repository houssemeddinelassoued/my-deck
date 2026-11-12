# Annexe E · Tests et refactoring

## La matrice de cas, avant tout test

| Nominal | Limites | Négatifs | Sécurité |
|---|---|---|---|
| réservation valide → 201 | 10h–11h puis 11h–12h : accepté | chevauchement → 409 | sans jeton → 401 |
| recherche avec résultats | créneau à la minute de fermeture | `fin ≤ début` → 400 | réservation d’autrui → 403 |
| annulation par le propriétaire | capacité exactement égale | salle inexistante → 404 | membre qui crée une salle → 403 |

Au moins deux cas par colonne. Les « ? » se tranchent **avant** la génération.

## Un bon test généré

- Un nom qui dit la règle : « refuse un créneau qui chevauche une réservation existante ».
- **Arrange / Act / Assert**, une raison d’échouer.
- Une horloge **fixe**, jamais la vraie date du jour.
- Paramétré : une règle, une table de cas (`test.each`, `@pytest.mark.parametrize`, `@ParameterizedTest`, `[Theory]`).
- Vérifie un **état** (le résultat) plutôt qu’une interaction (quelle méthode a été appelée).
- Doubles aux **frontières** que vous possédez (persistance, horloge, notifications), jamais le domaine.

## Cinq pièges des tests générés

| Piège | Symptôme |
|---|---|
| Nom vague | « test 1 », « should work » |
| Vraie date | test vert aujourd’hui, rouge demain |
| Assertion faible | `toBeDefined()`, `assert result` |
| Sur-mock | le test vérifie le mock, pas le code |
| Test désactivé | `skip`, assertion commentée, « pour passer la suite » |

## Couverture et mutation

- **Couverture** = ce qui a été **exécuté**, pas ce qui a été vérifié.
- **Mutation** = changez `<` en `<=` : si aucun test ne casse, vos tests ne protègent pas cette ligne.

<!-- col -->

## Refactoring : un principe par demande

```
[Symptôme] BookingService valide, calcule les prix et envoie des mails.
[Principe] Responsabilité unique.
[Cible] Extrais l’envoi de mail dans NotificationService, injecté.
[Contraintes] Comportement identique, aucun test modifié,
lance les tests avant et après, un seul refactoring.
```

| Symptôme | Principe | Geste |
|---|---|---|
| une classe fait trois métiers | S | extraire une classe |
| `switch` sur le type de salle | O | polymorphisme, stratégie |
| sous-classe qui lève « non supporté » | L | revoir la hiérarchie |
| interface fourre-tout | I | séparer les interfaces |
| `new` du repository dans le service | D | injecter l’interface |

## La discipline

1. Tests verts **avant**.
2. Un refactoring, un diff relisible.
3. Tests verts **après**, aucun fichier de test modifié.
4. Un commit `refactor : …`. Le bug trouvé au passage : un commit `fix : …` séparé.

## Optimiser

- **Mesurer d’abord** : un benchmark reproductible, des volumes réalistes.
- Donnez la mesure et la cible : « 120 ms pour 500 salles et 10 000 réservations, cible < 20 ms, même résultat. »
- Mesurer après. Le plus malin n’est pas toujours le plus rapide.

## Moderniser du legacy

1. Faire expliquer (`/explain`, glossaire, diagramme) sans rien toucher.
2. Figer le comportement : tests de caractérisation, y compris les bizarreries.
3. Refactorer par petits pas sous ces tests.
4. Corriger les bugs ensuite, chacun avec son test.
