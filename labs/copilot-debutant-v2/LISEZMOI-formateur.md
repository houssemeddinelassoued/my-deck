# GitHub Copilot · Débutant v2 · notes formateur (ne pas distribuer)

Formation Docaposte Institute, 2 jours (14 h), classe virtuelle, 8 à 12 participants, ateliers individuels.
Fil rouge : **Parafo**, parapheur numérique fictif, JavaScript / Node 22, sans dépendance.
Plan de référence : `.cpd2-build/PLAN-MIGRATION.md` (validé le 7 novembre 2026). Deck : `slides/copilot-debutant-v2` (phase 2).

## Contenu de ce dossier

| Élément | Rôle | Distribué ? |
|---|---|---|
| `parafo-copilot/` | dépôt template des participants : 9 énoncés, tests d'acceptation, scripts, reprises compressées | oui (template GitHub + zip « Labs ») |
| `Fiche-accueil-Copilot-Debutant.md` | prérequis, points à faire vérifier par l'informatique, test du poste | oui, **une semaine avant** |
| `corriges/etapes/atelier-0N/` | solutions, arborescence du dépôt ; **source unique** des reprises | **non** |
| `corriges/verifier.mjs` | énoncé rouge / corrigé vert, garde, reprises, kata Python | **non** |
| `VERIFS-AVANT-SESSION.md` | ce qui change chaque mois, à revérifier | **non** |

## Construire et vérifier

```
node .cpd2-labs/paquets.mjs                       # reprises + empreintes de la garde + plugin de l'étape 08
node labs/copilot-debutant-v2/corriges/verifier.mjs   # ≈ 40 s, « Tout est conforme » attendu
```

- Modifier un corrigé → relancer `paquets.mjs` (les paquets `reprises/*.paquet` en dépendent).
- Modifier un test d'acceptation, `src/journal.js`, `src/erreurs.js`, `scripts/mutation.js` ou `revue.test.js`
  → relancer `paquets.mjs` (empreintes de `npm run garde`).
- Le contenu de `corriges/etapes/atelier-08/plugins/parafo-qualite/skills/`, `com.github.copilot/`, `mcp/`
  et `data/` est **généré** par `paquets.mjs` à partir des étapes 06 et 07 et du dépôt : ne pas l'éditer.
- Ne jamais copier `corriges/` dans `parafo-copilot/`.

## Déroulé et ateliers

| Jour | Heure | Module | Atelier | Tests |
|---|---|---|---|---|
| J1 | 9:00 | Ouverture (vérification du poste, `npm run verifier-poste`) | — | — |
| J1 | 9:30 | M1 Introduction (inchangé) | A1 · 20 min | — |
| J1 | 11:10 | M2 Installer, modes, modèle | A2 · 30 min | `test:atelier2` (44) |
| J1 | 13:30 | M3 Prompting et contexte | A3 · 35 min | `test:atelier3` (39) |
| J1 | 15:10 | M4 Fichiers Markdown | A4 · 45 min | `test:atelier4` (35) |
| J2 | 9:15 | M5 Le harnais | A5 · 35 min | `test:atelier5` (35) |
| J2 | 10:50 | M6 Agents et Skills | A6 · 50 min | `test:atelier6` (46) |
| J2 | 13:30 | M7 Tests et définition de fini | A7 · 45 min | `test:atelier7` (6 + mutation 7/7) |
| J2 | 15:10 | M8 MCP, plugins, sessions | A8 · 35 min | `test:atelier8` (40) |
| J2 | 16:20 | M9 Vérifier et valider | A9 · 30 + 5 min | `test:atelier9` (22) |

Reprises : `npm run reprise -- N` (N = 3 à 8) applique les paquets 3 à N et sauvegarde les fichiers remplacés
dans `.reprises-sauvegardes/`. Points d'étape toutes les 15 à 20 minutes : « Où en êtes-vous : étape 1, 2, 3 ? »
Restitution A9 : 2 ou 3 volontaires seulement, 2 minutes chacun.

## Pièges fréquents par atelier (et réponses)

- **A1** : explication du dépôt qui invente une commande ; `estEmailValide` accepte `a@b`.
- **A2** : regex « parfaite » du mode Ask qui accepte `alice@exemple` ; approbation « toujours » donnée trop vite en mode Agent.
- **A3** : taille en caractères au lieu d'octets (test « été ») ; `changerEtat` qui mute ; borne `>= TAILLE_MAX`.
- **A4** : essai B dans la même session que A ; instructions vagues ; `applyTo: "tests/**"`. Écart attendu de l'A/B
  (hypothèse, à confirmer en jouant l'atelier) : sans instructions, les codes `ErreurParafo`, la validation stricte des
  types et la virgule décimale manquent, donc une partie des 28 tests `a4-format` reste rouge.
- **A5** : `"npm": true` (approuve `npm install`) ; sandbox activé sur un Windows non compatible → les commandes ne se
  lancent plus : le retirer des réglages utilisateur ; ordre des contrôles de `signer`.
- **A6** : l'agent « corrige » pendant le refactoring (tri des fériés, délai texte) → test ⚠ rouge ; skill non chargée
  (nom de dossier ≠ `name`) ; `handoffs` recopié d'un tutoriel ancien (ignoré par le harnais Copilot).
- **A7** : tests tautologiques ; `new Date()` au lieu de l'horloge (mutant 2) ; falsification de la dernière entrée
  oubliée (mutant 4) ; chaînage cassé avec empreinte recalculée oublié (mutant 5) — c'est le plus souvent survivant.
- **A8** : chemin relatif dans `mcp.json` ; **injection de prompt** dans la fiche de Zoé Marchetti (à faire remarquer) ;
  CSV sans neutralisation des formules ; deux sessions qui touchent le même fichier.
- **A9** : défauts les plus manqués : comparaison non constante (3) et licence (4). Corrigé détaillé :
  `corriges/etapes/atelier-09/ateliers/atelier-09-revue/REVUE.md`.

## Si l'organisation impose le harnais Local

Le harnais Local accepte `handoffs`, `agents` et les prompt files ; il **refuse** `skills` et `mcp-servers` dans les agents.
Dans ce cas : A6, retirer `skills:` de l'agent et demander « utilise la skill refactoring-sur » dans le prompt ;
les tests `a6-personnalisation` restent valables (ils n'exigent pas `skills:`). Le reste des ateliers est inchangé.

## Écarts au plan (à valider)

| Plan | Réalisé | Raison |
|---|---|---|
| A8 : `.github/copilot/settings.json` | **non inclus** | ce fichier ne sert qu'aux places de marché de plugins (`extraKnownMarketplaces`, `enabledPlugins`), or la marketplace est exclue (décision du 7 nov.). Le plugin s'installe depuis un dossier local (**Chat: Install Plugin Source**) |
| A5 : sandbox activée | **facultative** | Windows : prise en charge expérimentale, builds de septembre 2026 ; sans prérequis, les commandes ne se lancent plus |
| Reprises en dossiers `reprises/fin-atelier-0N/` | **paquets compressés** `reprises/fin-atelier-0N.paquet` | un agent qui fouille le dépôt (`#codebase`) recopierait les solutions |
| Fiche d'accueil « extension Copilot » | **retirée** | Copilot est intégré à VS Code (constaté sur 1.145) : seule la connexion compte |

## Mesures (à remplir en jouant les ateliers, compte Free, modèle Auto)

| Atelier | Durée réelle | Crédits consommés | Remarques |
|---|---|---|---|
| A2 | | | |
| A3 | | | |
| A4 | | | |
| A5 | | | |
| A6 | | | |
| A7 | | | |
| A8 | | | |
| A9 | | | |

## Sources (consultées le 7 novembre 2026)

- Fichiers d'agents : https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference
- Skills : https://code.visualstudio.com/docs/agent-customization/agent-skills
- Instructions : https://code.visualstudio.com/docs/agent-customization/custom-instructions
- Approbations et permissions : https://code.visualstudio.com/docs/agents/run/approvals · Bac à sable : https://code.visualstudio.com/docs/agents/run/agent-sandboxing
- Outils : https://code.visualstudio.com/docs/agents/run/tools · Journaux : https://code.visualstudio.com/docs/agents/agent-troubleshooting/chat-debug-view
- MCP : https://code.visualstudio.com/docs/agents/reference/mcp-configuration · format portable : https://agent-plugins.org/plugin-authors/mcp-servers
- Agent Plugins 1.0 : https://code.visualstudio.com/docs/agents/reference/agent-plugin-reference · https://code.visualstudio.com/docs/agent-customization/agent-plugins
- Harnais : https://code.visualstudio.com/docs/agents/concepts/agent-harnesses · Agents window : https://code.visualstudio.com/docs/agents/run/agents-window
- Crédits IA : https://code.visualstudio.com/docs/agents/guides/optimize-usage · Réseau : https://docs.github.com/en/copilot/reference/allowlist-reference
