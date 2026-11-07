# Plan de migration · GitHub Copilot Débutant v2 (Docaposte Institute)

> Version du 7 novembre 2026 (points ouverts tranchés, § 10). **Plan validé le 7 novembre 2026.**
> Avancement : phase 1 (labs) faite → `labs/copilot-debutant-v2/` ; phase 2 (deck) faite → `slides/copilot-debutant-v2` (141 pages, `node .cpd2-build/build.mjs`). Écarts acceptés : voir `labs/copilot-debutant-v2/LISEZMOI-formateur.md` § Écarts. Phase 3 faite en local le 7 novembre (guide et fiche d'accueil en PDF, zip Labs branché sur `meta.labs`, zip des corrigés : `node .cpd2-labs/guide.mjs && python .cpd2-labs/pack.py`). Reste : publication du template `parafo-copilot` sur GitHub (accord explicite), phase 4 (répétition sur compte Free, mesures).
> Deck actuel : `slides/copilot-debutant` (v1, 128 pages, 9 ateliers TaskFlow) **conservé tel quel**.
> Nouveau deck : `slides/copilot-debutant-v2`, généré depuis `.cpd2-build/` (copie du kit `.cpd-build/`).

## 0. Décisions prises (questionnaires du 6 et du 7 novembre 2026)

| Sujet | Décision |
|---|---|
| Durée | 2 jours, classe virtuelle, ateliers individuels (skill `formation-virtuelle`) |
| Effectif | **8 à 12 participants** par session en général |
| Objectifs | Les 6 objectifs officiels restent couverts mot pour mot, avec des moyens agentiques, **plus 2 objectifs complémentaires** affichés à part (§ 5) |
| Équilibre | **Progressif** : J1 = bases compressées, prompting, fichiers Markdown ; J2 = harnais, agents, skills, tests, MCP et plugins, vérification |
| Bloc M1 « sous le capot » | **Gardé tel quel** (≈ 1 h 40 : frise, LLM, tokens, attention, hallucinations, boucle agentique) |
| Harnais | **Concept + configuration** : boucle, outils, contexte, permissions, sandbox, MCP, observation des journaux |
| Fonctions en préview | **Ni hooks ni marketplace.** Connecteurs en **démo formateur** seulement. Par cohérence : comparaison de modèles (préview) en démo formateur, `/rubber-duck` (expérimental) en simple mention |
| Surfaces pratiquées | **VS Code** (Chat, Agents window, Agent Host) et **app GitHub Copilot** ; CLI et agent cloud en mention ou démo seulement |
| Licences | **Inconnues ou mixtes** : tout atelier doit tenir avec Copilot Free ; les fonctions payantes passent en bonus |
| Fil rouge | **Nouveau projet « Parafo »** : circuit de signature électronique fictif, **JavaScript / Node 22**, `node:test`, zéro dépendance |
| Dépôt | **Template GitHub public `parafo-copilot`** (« Use this template ») + zip de secours via le bouton Labs du deck |
| Fiche d'accueil | **Oui** : prérequis et vérification du poste, envoyée une semaine avant chaque session |
| Deck | **Nouveau deck v2** à côté de la v1 |
| benchlm.ai | **Capture annotée + démo en direct** (le site interdit l'iframe : `X-Frame-Options: SAMEORIGIN`, `frame-ancestors 'self'`) |

---

## 1. Diagnostic de la v1

### 1.1 Répartition du temps (notes `⏱` des parts `.cpd-build/`)

| Bloc v1 | Temps | Dominante |
|---|---|---|
| Ouverture | 30 min | — |
| M1 Introduction (frise, LLM, écosystème, offres) | ≈ 1 h 40 | Culture IA |
| M2 Installation, M3 Suggestions, M4 Génération simple, M5 Fonctions | ≈ 6 h | **Inline, NES, Ask, commentaires guides** |
| M6 Refactoring, M7 Tests, M8 Vérification | ≈ 4 h | Chat, un peu d'instructions |
| M9 Agents et Skills | **44 min** | Agentique |

La personnalisation et l'agentique (agents, skills, instructions) pèsent **moins de 10 %**. Les hooks, plugins, MCP, le harnais et l'Agents window n'ont **aucune pratique**.

### 1.2 Contenus v1 devenus faux ou fragiles avec le harnais Copilot

Depuis Universe (28 octobre 2026), **le harnais Copilot est le défaut des nouvelles sessions** dans l'éditeur et l'Agents window. L'ancien moteur de VS Code s'appelle désormais le harnais « Local ».

| Élément v1 | Problème avec le harnais Copilot | Traitement v2 |
|---|---|---|
| Atelier 9 : relais « Confier au Développeur » (`handoffs`) | `handoffs` n'existe que dans le harnais Local ; Copilot l'ignore | Orchestration par **sous-agents** ou relais manuel |
| Prompt files `.prompt.md` (si mentionnés) | Ne sont **pas chargés** par le harnais Copilot | Présentés comme ancien format ; **conversion en skills** (`disable-model-invocation: true` pour un appel explicite `/nom`) |
| Page « Ask, Plan, Agent… » (M2) | Il manque le sélecteur **Session Target** (Copilot, Local, Claude, Codex, Cloud) et l'Agents window | Réécrite |
| Pages « Nouveautés » et « Offres » (M1) | Datées du 4 novembre 2026 | Re-vérifiées avant chaque session |
| `copilot-instructions.md` en fin de J2 (M8) | Arrive trop tard | Avancé au J1 (M4) |

---

## 2. État de GitHub Copilot au 6 novembre 2026 (ce que la v2 doit refléter)

Statut indiqué : **GA** (disponible pour tous), **Préview** ou **Expérimental**. Toujours re-vérifier avant une session (§ 9).

**Harnais et sessions**
- **Harnais Copilot** (construit sur le Copilot SDK), défaut depuis le 28 octobre. Il est partagé par VS Code, Copilot CLI et l'app Copilot : même comportement, même format de hooks. *(GA)*
- **Session Target** : Copilot, Local, Claude, Codex ou Cloud. Le harnais n'est ni le modèle, ni le rôle (Ask, Plan, Agent, agent personnalisé), ni l'environnement d'exécution (doc VS Code « Understand agent harnesses »).
- **Agents window** : sessions parallèles, revue des changements, finalisation en PR. **Agent Host** : les sessions continuent après la fermeture de la fenêtre. *(GA)*
- **Continuité** : une même session se reprend dans VS Code, l'app Copilot, GitHub Mobile, github.com ou le CLI.
- **Comparaison de modèles** côte à côte, avec un modèle « juge » et « Synthesize ». *(Préview)*
- `/rubber-duck` (un second modèle relit le travail) *(Expérimental)* ; `/btw` (conversation parallèle) ; consommation de tokens par modèle visible au survol.
- **Approbations et permissions**, auto-approbation des commandes du terminal, **sandbox** de l'agent (fichiers, réseau).
- **Mémoire** : Copilot Memory côté cloud, ou mémoire locale au dépôt.
- *Computer use* *(Expérimental)* et automations planifiées : mention seulement.

**Personnalisation** (dans le harnais Copilot)
- Instructions de projet : `.github/copilot-instructions.md` ou `AGENTS.md`. Instructions ciblées : `.github/instructions/**/*.instructions.md` (`applyTo`) ou `AGENTS.md` imbriqués. Instructions personnelles : `~/.copilot/copilot-instructions.md`.
- **Agents personnalisés** : `.github/agents/*.agent.md` (utilisateur : `~/.copilot/agents`). Champs Copilot : `tools`, `model`, `skills`, `mcp-servers`… (pas de `handoffs`).
- **Agent Skills** (standard ouvert agentskills.io) : `.github/skills/<nom>/SKILL.md`. Chargement progressif d'après la `description`, appel direct par `/nom`.
- **Hooks** *(Préview dans VS Code)* : `.github/hooks/*.json`, format `{ "version": 1, "hooks": { … } }`. Événements : `sessionStart`, `userPromptSubmitted`, `preToolUse` (peut bloquer), `postToolUse`, `permissionRequest`, `agentStop` / `subagentStop` (peut refuser l'arrêt), `preCompact`, `errorOccurred`, `sessionEnd`… Raccourcis `/hooks` et `/create-hook`. → **Non traités dans la v2** (décision du 7 novembre 2026).
- **MCP** : `.vscode/mcp.json`. **Copilot connectors** (Slack, Notion, Microsoft Learn… sans serveur MCP) *(Préview, tous les plans, autorisation admin requise en Business/Enterprise)*. → **Démo formateur seulement** dans la v2.
- **Agent Plugins 1.0** *(GA depuis août)* : `plugin.json` + `skills/` + `mcp.json` (portables) + `com.github.copilot/` (agents, hooks…). **Customization Marketplace** (« Chat: Open Customizations » › Browse) *(Préview)* → **non traitée dans la v2**. Valeurs par défaut du dépôt : `.github/copilot/settings.json`.

**Offres**
- Depuis juin 2026, le chat et les agents consomment des **crédits IA**. Les suggestions inline n'en consomment pas.
- L'**app GitHub Copilot** est disponible sur **tous les plans**, Free compris. En Business/Enterprise, la politique « Copilot app » doit rester activée.

Sources : [VS Code Universe releases](https://github.blog/changelog/2026-10-28-github-copilot-in-vs-code-universe-releases/) · [VS Code août 2026](https://github.blog/changelog/2026-08-31-github-copilot-in-vs-code-august-2026-releases/) · [Agent Plugins 1.0](https://github.blog/changelog/2026-08-12-agent-plugins-1-0-in-vs-code-copilot-cli-and-the-copilot-app/) · [Agent harnesses](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses) · [Hooks VS Code](https://code.visualstudio.com/docs/agent-customization/hooks) · [Hooks reference GitHub](https://docs.github.com/en/copilot/reference/hooks-reference) · [Custom agent file reference](https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference) · [Migrate customizations](https://code.visualstudio.com/docs/agent-customization/migrate-customizations) · [Plugin reference](https://code.visualstudio.com/docs/agents/reference/agent-plugin-reference) · [Quickstart app Copilot](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app) · [Optimize AI credit usage](https://code.visualstudio.com/docs/agents/guides/optimize-usage)

---

## 3. Nouveau fil rouge : « Parafo » (dépôt template `parafo-copilot`)

Un **parapheur numérique fictif** : une entreprise imaginaire fait circuler des documents à signer. Le domaine est proche des métiers de la confiance numérique, sans nommer de produit réel. Il est riche en règles métier testables : états, ordre, délais, preuve.

| Fichier livré | Atelier | Règles métier |
|---|---|---|
| `src/document.js` | A3 | Création, validation (titre, empreinte SHA-256, taille), machine à états : brouillon → en circulation → signé, refusé, expiré ou annulé |
| `src/circuit.js` | A5 | Signataires ordonnés, mode séquentiel ou parallèle, prochain signataire, signer ou refuser, fin du circuit |
| `src/legacy/relances-2019.js` → `src/relances.js` | A6 | Code hérité volontairement mal écrit : relances, expiration, jours ouvrés et fériés |
| `src/journal.js` | A7 | Journal d'audit chaîné (chaque entrée porte l'empreinte de la précédente), horloge injectée, détection de falsification |
| `mcp/annuaire.mjs` (fourni) + `data/annuaire.json` | A8 | Petit serveur MCP stdio sans dépendance : `rechercher_signataire` |
| `src/export.js`, `scripts/serveur.js` | A8 | Deux tickets en sessions parallèles : export CSV du registre, `GET /documents/:id/statut` |
| `ateliers/atelier-09-revue/` | A9 | Diff à relire avec défauts plantés : traversée de chemin, comparaison d'empreintes non constante, API `crypto` inventée, extrait sous licence, erreur de borne sur l'expiration |

**Structure du dépôt** : `src/`, `test/` (tests d'acceptation par atelier, `npm run test:atelierN`), `ateliers/atelier-0N-*/README.md` (source unique du guide PDF), `reprises/fin-atelier-0N/`, `data/`, `mcp/`, `scripts/`, `JOURNAL.md`. Corrigés réservés au formateur dans `corriges/` avec `verifier.mjs` (énoncé rouge, corrigé vert), jamais publiés.

**Fichiers Markdown et configuration construits au fil des ateliers**

| Atelier | Fichiers |
|---|---|
| A2 | `.vscode/settings.json` |
| A4 | `.github/copilot-instructions.md`, `.github/instructions/tests.instructions.md` (+ `AGENTS.md` comparé) |
| A5 | Règles d'auto-approbation, sandbox |
| A6 | `.github/agents/refactoreur.agent.md`, `.github/skills/refactoring-sur/SKILL.md` |
| A7 | `.github/skills/tests-node/SKILL.md` (avec sa « définition de fini ») |
| A8 | `.vscode/mcp.json`, `plugins/parafo-qualite/plugin.json` (agent + skills + MCP), `.github/copilot/settings.json` |
| A9 | `.github/agents/relecteur.agent.md` (outils en lecture seule) |

Les scripts fournis sont en **Node** pour fonctionner sous PowerShell comme sous bash : `npm run reprise -- N`, `npm run garde` (vérifie que `test/acceptance/**` n'a pas été modifié), `npm run verifier-poste` (Node 22, Git, npm, accès GitHub).

**Reprises** : un dossier `reprises/fin-atelier-0N/` après **chaque** atelier qui produit du code (A3 à A8), et la commande `npm run reprise -- 5`. C'est un script Node multiplateforme qui copie l'état « fin de l'Atelier 5 » ; plus besoin de copier des fichiers à la main.

---

## 4. Déroulé horaire v2

### Jour 1 · Découvrir, configurer, guider

| Heure | Module | Contenu | Atelier |
|---|---|---|---|
| 9:00 | Ouverture (30 min) | Classe virtuelle ; sondage et tour de table express (8 à 12 participants : 30 s chacun) ; 6 objectifs officiels et 2 objectifs complémentaires ; programme ; fil rouge Parafo ; dépôt template `parafo-copilot` ; vérification du poste, préparée par la fiche d'accueil (`npm run verifier-poste`, app Copilot, Session Target = Copilot) | — |
| 9:30 | **M1** Introduction à GitHub Copilot (≈ 1 h 40, **inchangé**) | Frise 1943→2026, IA/ML/DL, neurone, gradient, tokens, attention, génération, hallucinations, boucle agentique, prompt/contexte/harnais, écosystème, offres, nouveautés, vrai/faux, QCM, pause | **A1** (20 min) Premier contact avec Parafo : faire expliquer le dépôt, première suggestion inline, observer contexte et tokens |
| 11:10 | **M2** Installer, configurer, choisir son mode et son modèle (80 min) | Installation, licence et crédits, réglages, confidentialité ; **raccourcis essentiels sur 1 page** (Tab, Échap, Ctrl+→, Alt+], NES, Ctrl+I) ; les 4 façons de travailler (inline/NES, Ask, Plan, Agent) ; Session Target et harnais ; Agents window et app Copilot (découverte) ; **choisir son modèle** (Auto, sélecteur, coût) ; **page benchlm.ai** ; être économe en crédits | **A2** (30 min) Réglages + « un même besoin, quatre modes » : la même petite fonction en inline, Ask, Plan puis Agent ; noter dans `JOURNAL.md` les écarts et le coût |
| 12:30 | Déjeuner | | |
| 13:30 | **M3** Prompting et contexte (85 min) | Anatomie d'un prompt (objectif, contexte, contraintes, critères d'acceptation, format) ; références de contexte (`#file`, `#codebase`, sélection…) ; fenêtre de contexte ; commentaire guide et JSDoc ; **Plan → spécification → Agent** ; lire avant d'accepter | **A3** (35 min) D'un brief à `src/document.js` : Plan, puis Agent, tests d'acceptation fournis, JSDoc en français |
| 14:55 | Pause | | |
| 15:10 | **M4** Les fichiers Markdown qui guident Copilot (100 min) | `copilot-instructions.md` vs `AGENTS.md` ; instructions ciblées `applyTo` ; portée et priorité ; instructions personnelles ; mémoire ; prompt files (ancien format Local) vs skills ; éditeur Agent Customizations ; garder les fichiers courts (ils occupent le contexte) | **A4** (45 min) Écrire les instructions de Parafo puis les tester en A/B : régénérer une fonction avec et sans, mesurer l'écart. Bonus : `applyTo: "**/*.py"` sur les katas Python/Java hérités de la v1 |
| 16:50 | Bilan J1 (20 min) | Récap, billet de sortie au micro | — |

### Jour 2 · Déléguer, outiller, vérifier

| Heure | Module | Contenu | Atelier |
|---|---|---|---|
| 9:00 | Reprise (15 min) | Quiz J1, `npm run reprise -- 4` si besoin | — |
| 9:15 | **M5** Le harnais : boucle, outils, permissions (80 min) | Un tour de boucle dans le harnais ; modèle, harnais, rôle et environnement ; outils (intégrés, MCP, extensions) et sélecteur d'outils ; approbations, niveaux de permission, auto-approbation du terminal ; sandbox ; compaction du contexte ; **observer** (journaux de chat, tokens par modèle, crédits) | **A5** (35 min) Régler le harnais puis livrer `src/circuit.js` : outils restreints, seule `npm test` en auto-approbation, sandbox activée ; compter les appels d'outils dans les journaux |
| 10:35 | Pause | | |
| 10:50 | **M6** Agents personnalisés et Skills : premier refactoring (100 min) | Anatomie `.agent.md` (champs Copilot), sous-agents ; skills (chargement progressif, `/nom`, `disable-model-invocation`) ; quel fichier pour quel besoin ; odeurs de code, gestes de refactoring, tests de caractérisation d'abord | **A6** (50 min) Créer l'agent « Refactoreur » et la skill « refactoring-sûr », puis refactorer `relances-2019.js` sous tests de contrat |
| 12:30 | Déjeuner | | |
| 13:30 | **M7** Tests unitaires : générer, mesurer, verrouiller (85 min) | AAA ; matrice de cas avant de générer ; générer des tests avec une skill ; organiser ; assertions utiles ; mocks (horloge injectée) ; **couverture** (`node --test --experimental-test-coverage`) ; **mutation à la main** (casser le code : un test doit tomber) ; **définition de fini** écrite dans la skill : tests verts, tests d'acceptation intacts (`npm run garde`), couverture relue | **A7** (45 min) Suite de tests de `journal.js` via la skill `tests-node` : matrice de cas en Plan, génération par l'agent, couverture mesurée, une mutation de la chaîne d'empreintes détectée ; ajouter la définition de fini à la skill et la faire appliquer par l'agent |
| 14:55 | Pause | | |
| 15:10 | **M8** Étendre et paralléliser : MCP, connecteurs, plugins, sessions (70 min) | MCP (`.vscode/mcp.json`, confiance, outils exposés) ; connecteurs (**démo formateur**) ; Agent Plugins 1.0, installés depuis un dossier local (sans marketplace) ; `.github/copilot/settings.json` ; Agents window : sessions parallèles ; comparaison de modèles (**démo formateur**) ; app Copilot : reprendre une session | **A8** (35 min) Brancher l'annuaire MCP ; empaqueter agent + skills + MCP en plugin `parafo-qualite` ; lancer 2 tickets en sessions parallèles (Agents window ou app) |
| 16:20 | **M9** Vérifier et valider (60 min) | Confiance mesurée, checklist (logique, performance, sécurité, API inventée, licence), hallucinations, injection de prompt (fichiers, MCP), secrets, droits ; revue par un agent relecteur, `/rubber-duck` (mention), revue de PR Copilot (offres payantes) | **A9** (30 min) Revue du diff piégé : d'abord sans outil, puis avec l'agent relecteur ; corriger, tout au vert, commit sur sa copie du template. Restitution : 2 ou 3 volontaires en partage d'écran (5 min) |
| 17:20 | Clôture (15 min) | Points clés, plan d'action, évaluation, ressources | — |

### Équilibre obtenu

- **Ateliers** : 5 h 25 (v1 : 5 h 35). **QCM, votes et restitutions** : ≈ 1 h 15. Le chiffre « ≈ 60 % de pratique » de la page Objectifs est à recalculer en phase 4.
- **Inline et Ask « purs »** : ≈ 45 min, soit environ 5 % (v1 : environ 45 %).
- **Agentique et personnalisation** (Plan/Agent de M3, puis M4 à M9) : ≈ 65 % (v1 : moins de 10 %).

---

## 5. Couverture des 6 objectifs officiels

| Objectif officiel | Où | Preuve observable |
|---|---|---|
| 1. Découvrir Copilot et comprendre son fonctionnement | M1, M5 | QCM M1 et M5 ; tour de boucle expliqué ; journaux lus en A5 |
| 2. Installer et configurer Copilot dans VS Code | M2, M4, M5 | `settings.json`, instructions, permissions et sandbox réglées (A2, A4, A5) |
| 3. Générer blocs de code, fonctions et commentaires | M2, M3, M4 | `document.js` + JSDoc (A3) ; génération A/B guidée par les instructions (A4) ; 3 langages en bonus via `applyTo` |
| 4. Effectuer un premier refactoring assisté | M6 | `relances.js` vert sur les tests de contrat (A6) |
| 5. Initier la génération de tests unitaires | M7 | Suite `journal.test.js` générée via la skill, couverture mesurée, mutation détectée (A7) |
| 6. Vérifier et valider le code généré | M7, M9 | Définition de fini appliquée par l'agent : tests verts, `npm run garde`, couverture relue (A7) ; défauts trouvés dans `REVUE.md` (A9) |

**Objectifs complémentaires** (décision du 7 novembre 2026) : affichés dans un encadré distinct, sous les 6 objectifs officiels, sans les modifier.

| Objectif complémentaire | Où | Preuve observable |
|---|---|---|
| A. Personnaliser Copilot pour son projet : instructions, agents personnalisés, skills | M4, M6, M7 | Instructions testées en A/B (A4) ; agent Refactoreur et skill (A6) ; skill `tests-node` avec définition de fini (A7) |
| B. Encadrer et outiller l'agent : harnais, permissions, MCP, plugins | M5, M8 | Outils et auto-approbation réglés (A5) ; annuaire MCP branché et plugin `parafo-qualite` installé (A8) |

---

## 6. Correspondance v1 → v2

| v1 | Sort en v2 |
|---|---|
| `00-open` | Gardé, adapté : Objectifs, Programme, FilRouge (Parafo), Dépôt (bouton « Use this template »), Setup (Session Target, app Copilot) |
| `10/11/12-m1` | **Gardés tels quels**. Mis à jour : `M1_Offres`, `M1_Nouveautes`, `M1_Ecosysteme` (CLI, app, harnais), `M1_Demo` et `M1_Lab` (Parafo) |
| M2 v1 (Installer, Licence, Paramètres, Confidentialité) | Gardés. `M2_Raccourcis` et `M2_Navigation` fusionnés en 1 page. `M2_PanneauChat` et `M2_Agents` réécrits (4 façons, Session Target, Agents window). Nouveau : ChoisirModele, **BenchLM**, Crédits |
| M3 v1 (Contexte, Fenêtre, InlineVsChat, ChoisirOutil, Simulateur, Lire) | Contexte, Fenêtre, Simulateur et Lire gardés ; InlineVsChat et ChoisirOutil fusionnés ; nouveau : Anatomie du prompt, Références de contexte, Plan → spec |
| M4 v1 (Structures, NomFonction, Commentaire, Langages, Patterns, Comportements) | Commentaire + NomFonction condensés dans M3 ; Langages devient `applyTo` en M4 ; le reste passe en annexe |
| M5 v1 (Fonction, Oublis, Classe, Fichier, HTTP, Parseurs, Doc) | Doc → M3 ; Oublis → checklist M9 ; HTTP et CSV → tickets A8 ; le reste est retiré |
| M6 v1 Refactoring | → **M6 v2** (Odeurs, Formuler, Gestes, Comparer, Legacy gardés ; « Chat » devient Plan + agent Refactoreur) |
| M7 v1 Tests | → **M7 v2** (AAA, Organiser, Assertions, Mutation, Mocks gardés ; Générer passe par une skill) + pages Couverture et Définition de fini |
| Hooks, Customization Marketplace | **Non traités** (décision du 7 novembre 2026) : ni pages, ni démo, ni atelier. Une ligne au plus sur la page Nouveautés (M1) |
| M8 v1 Vérification | → **M9 v2** (Confiance, Checklist, Hallucinations, Sécurité, Droits, Revue) ; `M8_Instructions` → M4 |
| M9 v1 Agents | → **M6 v2** (Anatomie, Créer, Skills, QuelFichier mis à jour pour le harnais Copilot ; Orchestration sans `handoffs` : sous-agents ; Potentiel, Attention gardés) |
| `90-close` | Gardé ; Clés, Plan d'action et Ressources (liens docs v2) mis à jour |
| `O_AutoPos`, `C_AutoPos` | **Retirées** (pas d'auto-positionnement, décision du 6 novembre 2026) |

Volume estimé : 135 à 145 pages.

---

## 7. Slide benchlm.ai (M2, juste après « Choisir son modèle »)

- **Titre** : « Lire un classement de modèles : benchlm.ai ».
- **Capture** du classement Coding ou Agentique, prise au build avec playwright (`ia134pw`) et rangée dans `slides/copilot-debutant-v2/assets/benchlm/`. Date de capture affichée sous l'image.
- **4 repères annotés**, révélés un clic à la fois : ① score et rang ② prix par million de tokens ③ fenêtre de contexte ④ date et niveau de preuve du benchmark.
- **Boutons** « Ouvrir benchlm.ai ↗ » (nouvel onglet, pour la démo en direct) et « Copier le lien ».
- **Message clé** : « Le classement oriente, votre test sur Parafo décide. Dans Copilot, commencez par Auto ; un modèle avancé pour une longue session coûte beaucoup plus de crédits. »
- **Notes formateur** (3 min) : démo dans le navigateur. Filtrer Coding, comparer deux modèles présents dans le sélecteur Copilot, ouvrir la page « GitHub Copilot » (offres et limites). Vote oral : « A, B ou C : quel modèle pour générer les tests de `journal.js` ? »
- **Avertissement** : site tiers indépendant, données changeantes ; refaire la capture avant chaque session (§ 9).

---

## 8. Production : étapes et validations

| Phase | Contenu | Validation |
|---|---|---|
| **0** | Validation de ce plan (points ouverts tranchés le 7 novembre, § 10) | Votre OK |
| **1. Labs** | Dépôt `parafo-copilot`, 9 READMEs, tests d'acceptation, reprises A3–A8, scripts Node (`reprise`, `garde`, `verifier-poste`), corrigés + `verifier.mjs`, serveur MCP, plugin, diff piégé A9, **fiche d'accueil** (matériel, logiciels, comptes, politiques à faire vérifier par l'entreprise, test du poste) | `verifier.mjs` : chaque énoncé rouge, chaque corrigé vert ; chaque atelier joué dans VS Code (harnais Copilot) avec le modèle Auto, **temps et crédits mesurés** |
| **2. Deck** | `.cpd2-build/` (kit copié, préfixe CSS `cpd2`, id `copilot-debutant-v2`, dossier « Docaposte Institute », thème `docaposte-institute`), parts 00 → 90, capture benchlm, notes formateur (`⏱`, DIRE, `→ beat N`), bloc « One press = one step » identique | Captures `cpd2-shot` et `cpd2-check`, grilles en CSS grid, recherche des mots interdits de `formation-virtuelle` |
| **3. Distribution** | Guide PDF (READMEs → PDF), fiche d'accueil (PDF, à envoyer une semaine avant chaque session), zip sans corrigés (`meta.labs`), zip des corrigés, **publication du template public `parafo-copilot`** | Votre OK avant toute publication sur GitHub |
| **4. Recette** | Somme des `⏱` par module = horaire § 4 ; répétition d'un atelier sur un compte Free ; recalcul du % de pratique | Votre relecture |
| **5. Bascule** | La v2 devient la référence ; la v1 reste disponible jusqu'à la première session réussie | — |

Format de chaque atelier (identique à la v1) : Objectif · Point de départ (avec reprise) · Étapes minutées · Livrable · Critères (tests verts) · Pièges à observer · Bonus · Coincé ? Ajout v2 : un encadré **« Mode économe »** (modèle Auto, demande ciblée, contexte limité) et un **point d'étape** formateur toutes les 15 à 20 minutes.

---

## 9. Risques et parades

| Risque | Parade |
|---|---|
| Crédits Free épuisés | Tâches courtes guidées par les tests ; modèle Auto ; comparaison de modèles et revue de PR en bonus ; crédits mesurés en phase 1 ; reprises pour sauter une étape |
| Fonction bloquée par l'administrateur du client (app Copilot, serveurs MCP, plugins) | Vérification demandée dans la fiche d'accueil ; démo formateur + reprise contenant le résultat. Les connecteurs et la comparaison de modèles sont montrés sur le compte du formateur |
| Organisation forcée sur le harnais Local | Formats différents (handoffs et prompt files acceptés) : fiche de secours dans `LISEZMOI-formateur.md` |
| Postes non prêts le jour J | Fiche d'accueil et `npm run verifier-poste` une semaine avant ; vérification minutée en ouverture ; scripts Node uniquement (aucun bash requis sous Windows) |
| 12 participants, plusieurs bloqués en même temps | « Coincé ? » et indices progressifs dans le guide, reprises ; partage d'écran de 2 min, un participant à la fois ; point d'étape toutes les 15 à 20 min |
| Produit qui change chaque semaine | Pages « Actualité » datées ; check-list `VERIFS-AVANT-SESSION.md` (offres, nouveautés, statuts préview/GA, capture benchlm) à dérouler la semaine précédente |
| Serveur MCP local refusé (politique MCP) | Atelier A8 réalisable sans MCP (plugin + sessions parallèles) ; MCP en démo |

---

## 10. Points tranchés (7 novembre 2026)

| Point | Décision |
|---|---|
| Objectifs complémentaires | **Oui** : 2 objectifs dans un encadré distinct des 6 objectifs officiels (§ 5) |
| Nom du fil rouge | **« Parafo »**, dépôt template **`parafo-copilot`** |
| Fonctions en préview | **Ni hooks ni marketplace** ; **connecteurs en démo formateur** seulement. Par cohérence, la comparaison de modèles (préview) passe en démo formateur et `/rubber-duck` (expérimental) en simple mention. Les hooks sont remplacés en M7 / A7 par la couverture, la mutation et une définition de fini (`npm run garde`) |
| Fiche d'accueil | **Oui** : prérequis et `npm run verifier-poste`, envoyée une semaine avant chaque session |
| Effectif | **8 à 12 participants** : tour de table express, restitution par 2 ou 3 volontaires, partage d'écran un participant à la fois |

Plus aucun point ouvert : le plan attend votre validation pour lancer la phase 1 (labs).
