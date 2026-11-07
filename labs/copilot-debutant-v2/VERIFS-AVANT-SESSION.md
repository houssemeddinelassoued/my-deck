# Vérifications avant chaque session · Copilot Débutant v2 (formateur)

Copilot change chaque mois. À faire **la semaine précédente** (≈ 45 min), puis la veille pour les points ★.

## Outils et statuts (dernière vérification : 7 novembre 2026)

| Point | Statut au 7 nov. 2026 | Où vérifier | Impact si changé |
|---|---|---|---|
| Harnais Copilot par défaut des nouvelles sessions | GA, défaut depuis le 28 oct. 2026 | changelog GitHub « VS Code Universe releases » | A3 à A9 |
| Champs des agents (`description`, `tools`, `skills`, `model`) ; `handoffs` et `agents` ignorés par le harnais Copilot | doc « Custom agent file reference » | https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference | test `a6-personnalisation` |
| Skills : `name` = dossier, `description` ≤ 1024, `user-invocable`, `disable-model-invocation` | doc « Agent Skills » | https://code.visualstudio.com/docs/agent-customization/agent-skills | A6, A7 |
| `chat.tools.terminal.autoApprove`, `chat.permissions.default`, `chat.tools.global.autoApprove` | doc « Approvals and Permissions » | https://code.visualstudio.com/docs/agents/run/approvals | test `a5-harnais` |
| Bac à sable : `chat.agent.sandbox.enabled` ; Windows **expérimental** (builds de sept. 2026) | doc « Agent Sandboxing » | https://code.visualstudio.com/docs/agents/run/agent-sandboxing | A5 étape 4 |
| Outils du harnais Copilot réglés dans **Customizations › Tools** | doc « Tools » | https://code.visualstudio.com/docs/agents/run/tools | A5 étape 2 |
| `.vscode/mcp.json` (`servers`, `type: stdio`) | doc « MCP configuration » | https://code.visualstudio.com/docs/agents/reference/mcp-configuration | A8 |
| Agent Plugins 1.0 : `plugin.json` + `$schema`, `skills/`, `mcp.json` portable, `com.github.copilot/agents/` ; installation **Chat: Install Plugin Source** | GA depuis août 2026 | https://code.visualstudio.com/docs/agents/reference/agent-plugin-reference | test `a8-mcp-plugin` |
| Agents window, **New Worktree** | GA | https://code.visualstudio.com/docs/agents/run/agents-window | A8 étape 2 |
| Agent Debug Logs (menu `…` › Show Agent Debug Logs) | doc « Agent Debug Logs » | https://code.visualstudio.com/docs/agents/agent-troubleshooting/chat-debug-view | A5 étape 6 |
| Copilot intégré à VS Code (plus d'extension à installer) | constaté sur VS Code 1.145 | doc « Set up GitHub Copilot » | fiche d'accueil, `verifier-poste` |
| Crédits IA, plan Free | depuis juin 2026 | https://github.com/features/copilot/plans | ★ M1, M2, fiche d'accueil |
| Comparaison de modèles | **Préview**, démo formateur | doc « Compare Model Results » | M8 (démo) |
| Copilot connectors | **Préview**, démo formateur | doc « Copilot Connectors » | M8 (démo) |
| Hooks, Customization Marketplace | non traités (décision du 7 nov. 2026) | — | — |
| ★ Capture benchlm.ai | à refaire | https://benchlm.ai | M2 |

## Dépôt et corrigés

1. `node .cpd2-labs/paquets.mjs` (si un corrigé ou un test a changé), puis
   `node labs/copilot-debutant-v2/corriges/verifier.mjs` : **tout conforme** attendu (≈ 40 s).
2. ★ Jouer au moins **un atelier du jour 2** sur un compte **Copilot Free**, modèle Auto : temps et crédits notés
   dans `LISEZMOI-formateur.md` (§ Mesures).
3. Vérifier que le dépôt template public est à jour (après le OK de publication) et que **Use this template** fonctionne.
4. Envoyer la fiche d'accueil **une semaine avant**, relancer la veille ceux qui n'ont pas répondu.
