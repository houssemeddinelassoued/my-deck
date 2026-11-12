# Annexe A · Session, Chat et raccourcis

## Les quatre réglages d’une session

| Liste | Ce que c’est | Valeurs |
|---|---|---|
| **Session · harnais** | qui fait tourner la boucle de l’agent : outils, contexte, permissions | Copilot (défaut), Local (déprécié), Claude, Codex, Cloud |
| **Rôle** | ce qu’on demande à l’agent d’être | Ask (répond), Plan (planifie, ne modifie rien), Agent (agit), vos agents |
| **Modèle** | le cerveau : change la qualité et le coût, **jamais les droits** | Auto, modèles rapides, modèles de raisonnement |
| **Environnement** | où s’exécutent les commandes, où vont les modifications | votre poste, une copie de travail, le cloud |

Réglages de la journée : session **Copilot**, permissions **manuelles**, modèle **fixé** pendant les mesures (TP 1), Auto ensuite.

## Quel rôle pour quel besoin ?

| Besoin | Rôle |
|---|---|
| Comprendre, expliquer, diagnostiquer sans rien toucher | Ask |
| Découper une tâche multi-fichiers en lots vérifiables | Plan |
| Exécuter **un** lot validé : fichiers, commandes, tests | Agent |
| Un rôle récurrent avec ses outils et ses interdits | votre agent personnalisé |
| Une ligne évidente, un motif répétitif | suggestions inline (Tab) |

## Raccourcis (macOS : Cmd et Option)

| Raccourci | Action |
|---|---|
| <kbd>Ctrl+Alt+I</kbd> | vue Chat |
| <kbd>Ctrl+I</kbd> | chat en ligne : modifier la sélection sur place |
| <kbd>Ctrl+N</kbd> (dans la vue Chat) | nouvelle session : contexte propre |
| <kbd>Tab</kbd> / <kbd>Échap</kbd> | accepter / refuser la suggestion |
| <kbd>Ctrl+→</kbd> | accepter mot par mot |
| <kbd>Alt+]</kbd> <kbd>Alt+[</kbd> | suggestion suivante / précédente |
| <kbd>Alt+\</kbd> | déclencher une suggestion |
| <kbd>Ctrl+Maj+P</kbd> › « Chat: Open Customizations » | voir ce que la session charge |


<!-- col -->

## Les leviers du Chat

| Levier | Sert à | Exemples |
|---|---|---|
| `#` | choisir ce que le modèle lit | `#file` `#selection` `#codebase` `#changes` `#problems` `#fetch` |
| `@` | choisir qui répond | `@vscode` `@terminal` `@github` |
| `/` | lancer une intention prête, ou **vos skills** | `/explain` `/fix` `/tests` `/doc` `/compact` `/init` `/nom-de-skill` |

Peu de fichiers bien choisis valent mieux que tout le dépôt.

## Ce que Copilot voit

- **Inline** : le code avant et après le curseur, des extraits des onglets ouverts. **Pas** vos fichiers d’instructions : montrez-lui un fichier exemplaire et un commentaire structuré.
- **Chat et agent** : prompt système et outils, vos instructions, vos références `#`, l’historique de la session (erreurs comprises), les résultats d’outils… et votre message.

## Réflexes de session

- Une tâche, une session. Session longue et confuse ? `/compact`, ou repartir d’une session neuve avec le plan validé.
- Sous chaque réponse : dépliez **Références**. Vos instructions et skills doivent y figurer.
- Permissions manuelles : lisez chaque commande avant de l’approuver (`rm`, `curl … | sh`, `git push --force`, installation de paquet).
- Un sous-agent apparaît replié dans le Chat avec son nom : dépliez-le pour voir ce qu’il a lu et rendu.
- Un raccourci ne répond pas ? <kbd>Ctrl+K</kbd> <kbd>Ctrl+S</kbd> pour le retrouver ou le réattribuer.
- Les noms de commandes, de rôles et de modèles évoluent chaque mois : la documentation de votre version de VS Code fait foi.
