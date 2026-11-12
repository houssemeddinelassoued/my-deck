# Annexe B · Prompts avancés : la boîte à outils

## Le prompt structuré : cinq composants

| Composant | Question | Exemple SalleLibre |
|---|---|---|
| **Contexte** | où, avec quoi ? | « Dans `src/domain`, types `Booking` de `#file:types.ts`. » |
| **Tâche bornée** | quoi, et seulement quoi ? | « Écris `overlaps(a, b)`, rien d’autre. » |
| **Contraintes** | quelles règles ? | « Intervalles `[début, fin[`, fonction pure, aucune dépendance. » |
| **Exemples attendus** | quels cas tranchent ? | « 10h–11h et 11h–12h → false ; 10h–11h et 10h30–11h30 → true. » |
| **Critère de fin** | quand est-ce fini ? | « Arrête-toi quand ces exemples sont des tests verts. » |

Les exemples attendus sont la contrainte la plus forte : ils deviennent les tests.

## Le multi-étapes : pas d’étape sans preuve

1. **Clarifier** : « Avant d’écrire, pose-moi les questions qui manquent. »
2. **Planifier** (rôle Plan) : lots de 1 à 3 fichiers, chacun avec le test qui le valide. Pas de code.
3. **Exécuter un lot** (rôle Agent) : « Lot 1 seulement. Arrête-toi quand ses tests passent. »
4. **Relire** : « Relis ton diff : oublis, cas limites, écarts au plan. » Puis commit.

## Comparer deux prompts

- Même tâche, **même modèle**, session neuve, au moins 2 à 3 essais par version.
- Grille décidée **avant** les essais : critères binaires ou comptables (compile, tests verts, bornes, allers-retours).
- Un seul changement entre deux versions.

## Le commentaire structuré (inline)

Signature typée + JSDoc / docstring / Javadoc / XML doc : entrée, sortie, règle, exemple (dont un cas refusé), exception. Le meilleur prompt pour l’inline… et il reste dans le code.

<!-- col -->

## Prompts prêts à copier

```
Clarifier
Je veux [objectif]. Avant d’écrire du code, pose-moi au plus
5 questions sur ce qui est ambigu (règles, bornes, erreurs).
```

```
Plan en lots (rôle Plan)
Propose un plan pour [fonctionnalité] en lots de 1 à 3 fichiers.
Pour chaque lot : fichiers, interfaces, test qui le valide.
Respecte PLAN.md. Aucun code.
```

```
Un lot (rôle Agent)
Exécute uniquement le lot [n] du plan validé. Tests d’abord.
Arrête-toi dès que ses tests passent et résume le diff.
```

```
Revue du diff
Relis #changes comme un relecteur exigeant : bugs, cas limites,
écarts à PLAN.md et aux instructions, tests affaiblis.
Liste les problèmes, ne corrige rien.
```

```
Générer à l’image de l’existant
Crée RoomService exactement sur le modèle de #file:BookingService,
tests compris. Demande avant de t’écarter du modèle.
```

```
Comparer trois implémentations
Propose trois implémentations de [fonction] aux compromis différents.
Pour chacune : complexité, avantages, risques.
Ne choisis pas : présente un tableau.
```

```
Rétro-prompt
Voici l’implémentation attendue : #selection.
Quel prompt l’aurait produite du premier coup ?
```
