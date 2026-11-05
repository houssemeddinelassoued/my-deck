# GitHub Copilot · Débutant — notes formateur (ne pas distribuer)

Formation Docaposte Institute, 2 jours (14 h), classe virtuelle, ateliers individuels.
Support : deck open-slide `copilot-debutant` (128 pages, notes orateur complètes).

## Contenu de ce dossier

| Élément | Rôle | Distribué ? |
|---|---|---|
| `taskflow-copilot/` | dépôt starter des participants (8 ateliers, katas, tests d'acceptation, guide PDF) ; publié sur https://github.com/houssemeddinelassoued/taskflow-copilot (public) | oui (GitHub + zip « Labs ») |
| `Guide-des-ateliers-Copilot-Debutant.pdf` | guide participant, généré depuis les README | oui (zip « Labs ») |
| `corriges/` | solutions complètes + `verifier.mjs` | **non** |
| `corriges-Copilot-Debutant.zip` | les corrigés zippés | **non** |

## Avant la session

1. `node labs/copilot-debutant/corriges/verifier.mjs` : l'énoncé doit être rouge, le corrigé vert (≈ 20 s).
2. Si un README d'atelier change : `node .cpd-labs/guide.mjs` (PDF) puis `python .cpd-labs/pack.py` (zips).
3. Envoyer la veille le lien du dépôt (https://github.com/houssemeddinelassoued/taskflow-copilot) ou le zip du bouton « Labs » : Node 22+, VS Code à jour, compte GitHub.
4. Si le dépôt change : `node .cpd-labs/guide.mjs` (recopie le PDF dans le dépôt), puis dans `taskflow-copilot/` : `git add -A && git commit && git push`. Ne jamais y copier `corriges/`.

## Déroulé et minutage

| Jour | Heure | Séquence | Atelier |
|---|---|---|---|
| J1 | 9:00 | Ouverture, tour de table, auto-positionnement, kit | — |
| J1 | 9:30 | M1 Introduction (histoire de l’IA, sous le capot : neurones, entraînement, tokens, Transformer, génération, hallucinations, agents, prompt/contexte/harnais ; écosystème, offres, nouveautés oct. 2026) | A1 · 20 min (10:30) |
| J1 | 11:10 | M2 Installation et configuration | A2 · 30 min (11:45) |
| J1 | 12:15 | M3 Comprendre les suggestions (déjeuner 12:30 – 14:00 au milieu) | A3 · 35 min (14:15) |
| J1 | 14:55 | M4 Génération de code simple | A4 · 55 min (15:55) |
| J1 | 16:55 | Bilan, restitution, billet de sortie (fin 17:15) | — |
| J2 | 9:00 | Reprise : quiz, points flous | — |
| J2 | 9:15 | M5 Fonctions et blocs de code | A5 · 50 min |
| J2 | 11:00 | M6 Refactoring | A6 · 45 min |
| J2 | 14:00 | M7 Tests unitaires | A7 · 40 min (14:30) |
| J2 | 15:15 | M8 Bonnes pratiques et vérification (restitution réduite à 2 volontaires) | A8 · 30 min (16:00) |
| J2 | 16:40 | M9 Les agents dans Copilot (agents, Skills, simulation d’orchestration) | A9 · 30 min (16:50) |
| J2 | 17:20 | 10 clés, auto-positionnement, évaluation (fin vers 17:35) | — |

## Pièges fréquents par atelier (et réponses)

- **A4** : `points > 0 && points <= 13` (4 accepté) ; `trim()` sur `undefined` ; tests modifiés au lieu du code.
- **A5** : `sort` sur place ; `toLowerCase` sans `normalize('NFD')` ; `split(',')` ; numéro de ligne décalé ; `NaN` sur liste vide.
- **A6** : « améliore ce code » → refactoring + correction mêlés, 3 tests rouges ; `===` dans le legacy (casse « "1" trouve 1 »).
- **A7** : tests tautologiques ; `assert.equal` sur objets ; mutation non détectée faute de test « 3 en cours → 4e refusé ».
- **A8** : défauts les plus manqués : 07 (dates UTC / changement d'heure) et 06 (O(n²)) ; 05 cumule 3 failles.
- **A9** : le Développeur modifie `test/echeances.test.js` (refuser, renforcer sa règle) ; skill jamais chargée (description sans les mots de la demande, ou dossier ≠ `name`) ; bouton de relais absent (nom de l'agent cible mal orthographié, ou relais non pris en charge par le harnais choisi : changer d'agent à la main). Corrigés complets dans `corriges/ateliers/atelier-09-agents/.github/` (+ bonus Chef d'orchestre), à coller dans le clavardage en cas de blocage.

## Points de reprise

`taskflow-copilot/reprises/` contient l'état de fin des ateliers 4, 5 et 6, pour qu'aucun retard ne bloque l'atelier suivant.
Les corrigés des ateliers 7 et 8 ne sont **que** dans `corriges/`.

## Sources des pages « actualité » (consultées le 4 novembre 2026)

- Offres et crédits IA : https://github.com/features/copilot/plans
- Nouveautés VS Code, GitHub Universe (28 oct. 2026) : https://github.blog/changelog/2026-10-28-github-copilot-in-vs-code-universe-releases/
- Raccourcis et fonctionnalités : https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features
- Chiffre de 45 % : Veracode, *2025 GenAI Code Security Report*.
- Agents personnalisés (consulté le 5 novembre 2026) : https://code.visualstudio.com/docs/copilot/customization/custom-agents et la référence https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference
- Skills : https://code.visualstudio.com/docs/copilot/customization/agent-skills · Sous-agents : https://code.visualstudio.com/docs/copilot/agents/subagents

Revérifier ces pages avant chaque session : offres, montants et préversions évoluent tous les mois.
