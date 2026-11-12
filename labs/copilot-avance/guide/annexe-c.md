# Annexe C · Les fichiers qui guident Copilot

## Quel fichier pour quel besoin ?

| Fichier | Rôle | Chargé |
|---|---|---|
| `.github/copilot-instructions.md` | les règles de la maison | à chaque requête |
| `AGENTS.md` (racine) | idem, format partagé entre outils | à chaque requête |
| `.github/instructions/*.instructions.md` | règles pour certains fichiers | si `applyTo` correspond |
| `~/.copilot/copilot-instructions.md` | vos préférences personnelles | dans tous vos projets |
| `.github/skills/<nom>/SKILL.md` | une méthode, avec ses fichiers | si la demande s’y prête, ou `/nom` |
| `.github/agents/<nom>.agent.md` | un rôle : consignes, outils, modèle | choisi ou sollicité |
| `.vscode/mcp.json` | des outils externes pour l’agent | quand l’agent en a besoin |

Le harnais Copilot lit ces fichiers à la même place dans VS Code, le CLI et l’app. **Ignorés** par le harnais Copilot : les prompt files `.prompt.md` (convertissez-les en skills) et les `handoffs` des agents.

## Instructions ciblées

```markdown
---
applyTo: "tests/**"
description: Conventions des tests de SalleLibre
---
- Un test paramétré par règle métier.
- Une horloge fixe, jamais l’heure réelle.
```

Motifs : `tests/**`, `src/api/**,src/services/**`, `**/*.py`. `**` = autant écrire `copilot-instructions.md`.

## Skill

```markdown
---
name: matrice-de-tests          # = nom du dossier
description: Quand l’utiliser, avec les mots des demandes.
disable-model-invocation: true  # facultatif : seulement par /nom
---
La méthode, en étapes. Les fichiers : [modele](./modele.md)
```

Chargement progressif : nom + description toujours lus ; le corps si la demande correspond ; les fichiers cités si nécessaire.

<!-- col -->

## Agent personnalisé

```markdown
---
name: Auditeur          # nom affiché et délégué
description: Ce qu’il fait, quand le choisir,
  ce qu’il ne fait jamais.
tools: ['read', 'search']  # le minimum
skills: ['owasp-revue']    # facultatif
model: …                   # facultatif
user-invocable: false      # masqué de la liste
disable-model-invocation: true  # jamais délégué
---
Mission, méthode, interdits vérifiables.
```

## Écrire un bon fichier

- **Court** : chaque ligne se paie à chaque requête. 40 lignes au plus pour les instructions de dépôt.
- **Impératif et vérifiable** : « ConflictError → 409 », pas « gère bien les erreurs ».
- **Une seule source** : jamais `copilot-instructions.md` et `AGENTS.md` qui se contredisent.
- **Rien de secret** : ces fichiers partent dans les requêtes.
- **Versionné et relu en PR**, comme du code. Une règle d’équipe va dans le dépôt, pas dans vos préférences.

## Ma règle n’est pas appliquée : diagnostic

| Symptôme | À vérifier |
|---|---|
| Absent des Références | chemin et nom exacts ; Chat: Open Customizations |
| `.instructions.md` jamais chargé | motif `applyTo` (`test/**` ≠ `tests/**`) |
| Skill jamais chargée | description trop vague ; appel direct par `/nom` |
| Agent absent de la liste | extension `.agent.md`, dossier, `user-invocable` |
| Délégation ratée | nom exact (casse) ; outil `agent` dans `tools` |
| Règle appliquée une fois sur deux | règle floue, ou contredite par un autre fichier |
| Rien ne marche dans l’inline | normal : l’inline ne lit pas les instructions |
