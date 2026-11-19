# Ateliers Guichet · notice formateur

Formation « Claude · IA avancée pour les développeurs » (GoMyCode × Wevioo). Ce dossier n’est **pas** distribué aux participants.

| Dossier | Contenu |
|---|---|
| `guichet-claude/` | le dépôt des participants (énoncé) : 4 stacks, outil `guichet.mjs`, simulateur, interface web, énoncés `ateliers/`, reprises compressées |
| `corriges/etapes/<étape>/` | les corrigés, en surcouches (arborescence du dépôt), **source unique** des reprises |

## Chaîne de fabrication (depuis la racine de my-deck)

```bash
node .cla-labs/corriges-communs.mjs        # régénère les corrigés communs (web/, .claude/, CLAUDE.md, décisions…)
node .cla-labs/paquets.mjs                 # corrigés → guichet-claude/reprises/*.paquet
node .cla-labs/verifier-etapes.mjs ts      # pour chaque étape : début rouge, fin verte ; + reprise réelle
node .cla-labs/solution.mjs <dossier> A5   # reconstitue un état (A5 = solution complète)
node .cla-labs/e2e.mjs <dossier> <stack>   # bout en bout : simulateur + appli + API web
```

Toute modification d’un corrigé de code se fait dans `corriges/etapes/` ; relancer ensuite `paquets.mjs`.

## État vérifié (15 novembre 2026)

| Contrôle | TypeScript | Python | Java | .NET |
|---|---|---|---|---|
| Énoncé : tous les tests rouges (sauf ce qui ne dépend d’aucun trou) | ✓ | ✓ | ✓ | ✓ |
| Solution : 13 groupes de tests verts (75 tests) | ✓ | ✓ | ✓ | ✓ |
| 20 étapes : début rouge / fin verte + reprise réelle | ✓ | ✓ | ✓ | ✓ |
| Garde sans faux positif sur le code | ✓ | ✓ | ✓ | ✓ |
| Application web de bout en bout (injection, 422, idempotence, filtre, routage) | ✓ | ✓ | ✓ | ✓ |

Moteur réel (`claude -p`) essayé sur TypeScript : extraction n° 11 conforme et injection ignorée (Haiku) ; génération mesurée v1 0 / 24, v2 23 / 24 (Haiku), v2 et v3 24 / 24 (Sonnet), 70 à 120 s par génération.

**Pas encore essayé** : `eval`, `juger` et `boucle` avec le vrai modèle ; génération réelle en Python, Java et .NET ; option Notion ; Docker (bonus) ; claude.ai/code. À faire sur un poste de la salle avant la session.

## Points d’attention en salle

- **Versions** : SDK TypeScript 1.8.0, Python `anthropic` 2.8, Java 3.8.0, .NET `Anthropic` 13.8.0 ; Node 22.18+ obligatoire (TypeScript exécuté sans compilation, `node:sqlite`). Le projet .NET cible net8.0 avec `RollForward=LatestMajor`.
- **Temps** : `claude -p` crée environ 40 000 jetons de cache à chaque appel (contexte de Claude Code) ; une génération prend 1 à 2 minutes. Prévenir les participants.
- **Simulateur** : il reconnaît les 12 demandes de référence ; pour un texte libre, il applique des heuristiques (et le dit). Il se trompe exprès de priorité sur les n° 4 et 10, et suit l’injection de la n° 11 si le texte n’est pas délimité.
- **Java / .NET** : chaque `verifier` recompile (20 à 40 s). Recommander `node guichet.mjs tests --tag …` pendant le travail, `verifier` à la fin de l’étape.
- **Windows** : `claude` installé par npm (`claude.cmd`) est géré par un repli via le shell.

## Mise à disposition (à faire, avec accord)

1. Dépôt GitHub modèle (`guichet-claude`, public, « template ») : `git init`, premier commit, publication.
2. Zip « Labs » pour le bouton du deck (sans `corriges/`), et zip des corrigés pour le formateur.
3. Guide PDF des ateliers (à partir de `guichet-claude/ateliers/*.md`) et ses annexes A à G.
