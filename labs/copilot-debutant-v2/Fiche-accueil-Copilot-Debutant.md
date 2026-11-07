# GitHub Copilot · Débutant · Fiche d'accueil

**Docaposte Institute · 2 jours en classe virtuelle · 9 h – 17 h 30**
À lire et à faire **au moins une semaine avant** la formation (15 minutes). La partie 4 est à
transmettre à votre service informatique.

## 1. Votre poste de travail

| Élément | Attendu |
|---|---|
| Ordinateur | Windows 10/11, macOS ou Linux, droit d'installer des logiciels (ou installés par votre service informatique) |
| Écrans | **Deux écrans** de préférence : la classe virtuelle sur l'un, VS Code sur l'autre |
| Son et image | Micro-casque, caméra si possible |
| Connexion | Stable, assez pour une visioconférence et GitHub en même temps |
| Classe virtuelle | Le lien Teams ou Zoom de votre convocation, testé la veille |

## 2. Logiciels à installer

| Logiciel | Version | Vérification |
|---|---|---|
| Node.js | 22 LTS ou plus récent (https://nodejs.org) | `node --version` |
| Git | récent (https://git-scm.com) | `git --version` |
| VS Code | à jour (Aide › Rechercher les mises à jour). GitHub Copilot y est intégré | menu Aide › À propos |
| Python 3.10+ ou JDK 21+ | facultatif (bonus de l'Atelier 4) | `python --version`, `java -version` |
| App GitHub Copilot | facultatif (démonstration et reprise de session) | s'ouvre et vous connecte |

Aucune autre dépendance : le dépôt de la formation n'utilise que Node.js.

## 3. Votre compte

- Un **compte GitHub** à votre nom, avec **GitHub Copilot** : le plan **Copilot Free** suffit pour tous les ateliers.
  Si votre entreprise vous fournit une licence Copilot Business ou Enterprise, connectez-vous avec ce compte.
- Depuis juin 2026, le chat et les agents consomment des **crédits IA** ; les suggestions inline n'en consomment pas.
  Les ateliers sont conçus pour rester dans les limites du plan Free.

## 4. À faire vérifier par votre service informatique

| Point | Pourquoi |
|---|---|
| Accès réseau à `github.com`, `api.github.com`, `*.githubusercontent.com`, `*.githubcopilot.com`, `default.exp-tas.com` (liste complète : « Copilot allowlist reference » dans la documentation GitHub) | Copilot ne fonctionne pas derrière un proxy qui les bloque |
| Copilot activé pour votre compte, et les politiques **agents**, **serveurs MCP** et **agent plugins** autorisées (Business / Enterprise) | Ateliers 5 à 9 |
| Politique **Copilot app** activée (Business / Enterprise) | Démonstration de reprise de session |
| Lancer `node` et un petit serveur local (port 3000) sans blocage par l'antivirus | Ateliers 8 et 9 |
| Clonage de dépôts publics GitHub autorisé | Récupérer le dépôt de la formation |

Si une fonction est bloquée par votre organisation, la formation reste possible : le formateur la montre
en démonstration et un point de reprise vous permet de continuer.

## 5. Le test du poste (5 minutes)

1. Récupérez le dépôt de la formation : **Use this template** sur
   https://github.com/houssemeddinelassoued/parafo-copilot (ou **Code › Download ZIP**), dans un dossier simple
   et **non synchronisé** (pas OneDrive), par exemple `C:\formation\parafo-copilot`.
2. Ouvrez ce dossier dans VS Code, puis dans le terminal intégré :

   ```
   npm run verifier-poste
   ```

3. Dans la vue Chat de VS Code, cible de session **Copilot**, demandez : « Explique ce dépôt en 3 phrases. »
4. **Répondez au mail de convocation** en collant le résumé affiché par `verifier-poste`
   (« poste prêt » ou la liste des points à corriger). Le formateur vous recontacte si besoin.

## 6. Le jour J

- Connexion **10 minutes avant** 9 h : vérification du son, de la caméra et du partage d'écran.
- Micro coupé hors des échanges, caméra si possible.
- Tous les ateliers sont **individuels**, sur votre poste, guidés pas à pas. Les textes à copier sont collés dans le Chat.
- Les données de la formation sont **fictives** : n'utilisez ni code ni donnée de votre entreprise.
