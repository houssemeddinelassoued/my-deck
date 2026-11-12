# Mode d’emploi

## La journée

Pendant une journée, vous construisez **SalleLibre**, une API REST fictive de réservation de salles de réunion (salles, réservations sans chevauchement, authentification JWT et rôles, recherche de salles libres, documentation OpenAPI), avec GitHub Copilot dans VS Code. Stack au choix : TypeScript · Express, Python · FastAPI, Java · Spring Boot ou C# · ASP.NET Core.

Les six TP s’enchaînent sur **le même dépôt**. Vous connaissez déjà Copilot : on ne revient pas sur les bases. Chaque TP ajoute une brique à votre dossier `.github`, du fichier d’instructions jusqu’à une équipe d’agents orchestrée.

Les TP sont **individuels** : chacun sur son poste, minuteur affiché, points d’étape oraux toutes les 8 à 10 minutes. Bloqué plus de 5 minutes ? Dites-le au micro : partage d’écran de 2 minutes. Les textes à copier (prompts, squelettes de fichiers) sont collés dans le Chat de la classe virtuelle.

## Les 6 TP

| TP | Module | Durée | Ce que vous ajoutez |
|---|---|---|---|
| 1 · Prompts mesurés | M1 · Prompt engineering | 20 min | une grille de mesure, `overlaps` |
| 2 · API REST complète | M2 · Architectures | 30 min | `PLAN.md`, `.github/copilot-instructions.md`, l’API |
| 3 · Suite de tests | M3 · Tests | 25 min | `tests.instructions.md`, la skill `matrice-de-tests` |
| 4 · Refactoring | M4 · Refactoring | 25 min | l’agent `Refactoreur` et sa skill `refactoring-sur` |
| 5 · Audit de sécurité | M5 · Sécurité | 25 min | l’agent `Auditeur` (sous-agent), `security.instructions.md` |
| 6 · Feature orchestrée | M6 · Équipe | 25 min | l’agent `Chef d’orchestre` et ses équipiers, une PR |

## Votre dossier .github en fin de journée

```
.github/
├── copilot-instructions.md          TP 2 · les règles de la maison (≤ 40 lignes)
├── instructions/
│   ├── tests.instructions.md        TP 3 · applyTo: "tests/**"
│   └── security.instructions.md     TP 5 · applyTo: "src/api/**,src/services/**"
├── skills/
│   ├── chevauchement/SKILL.md       TP 2 bonus · /chevauchement
│   ├── matrice-de-tests/            TP 3 · SKILL.md + CASES.modele.md
│   └── refactoring-sur/SKILL.md     TP 4
└── agents/
    ├── refactoreur.agent.md         TP 4
    ├── auditeur.agent.md            TP 5 · lecture seule, sous-agent
    ├── architecte.agent.md          TP 6 · fourni
    ├── testeur.agent.md             TP 6 · fourni
    ├── documentaliste.agent.md      TP 6 · fourni
    └── chef-orchestre.agent.md      TP 6
```

## Règles du jeu

- **Session Copilot**, permissions **manuelles** : vous approuvez chaque commande de l’agent.
- **Aucune donnée réelle** dans un prompt : ni code client, ni secret, ni donnée personnelle. SalleLibre est fait pour ça.
- **Un lot, une preuve, un commit.** Pas d’étape suivante sans test vert.
- **Le diff des tests se relit avant le diff du code.** Un test supprimé, sauté ou affaibli annule le « c’est fini ».
- **Une règle ignorée se corrige dans le fichier**, pas en la répétant dans le prompt. Vérifiez la liste « Références » sous chaque réponse.
- **En retard ?** Passez au TP suivant sur votre code tel quel : chaque TP fonctionne sur une API partielle. La méthode compte plus que l’exhaustivité.

## Avant la formation

- VS Code à jour, extension GitHub Copilot connectée (Chat inclus), licence Copilot active.
- Dans le Chat : les sélecteurs **Session** (Copilot), **rôle** (Ask, Plan, Agent) et **modèle** sont visibles.
- Le runtime de votre stack (Node 22, Python 3.12, JDK 21 ou .NET 8+) et son framework de test (Vitest/Jest, pytest, JUnit 5, xUnit).
- Un dépôt Git vide `sallelibre`, premier commit poussé.
- Classe virtuelle : micro, caméra si possible, idéalement deux écrans (la formation d’un côté, VS Code de l’autre).
