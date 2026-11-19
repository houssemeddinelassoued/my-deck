# Idées d’amélioration de la plateforme

> Fichier généré par `node scripts/idees.mjs`, ne pas l'éditer à la main. Source : `idees.json`. Mis à jour le 2026-11-16.

| ID | Idée | Catégorie | Statut | Prio | Effort |
|---|---|---|---|---|---|
| IDEE-004 | Tiroir de cartes / slides à la demande | presentation | 💡 Idée | haute | M |
| IDEE-005 | Configuration du deck au démarrage (chapitres inclus/exclus) | preparation | 💡 Idée | haute | L |
| IDEE-003 | Panneau latéral de dessin assisté | presentation | 💡 Idée | moyenne | L |
| IDEE-007 | Évaluer le passage de core 2.0.1 à 2.3.1 | upstream | 🔍 À étudier | moyenne | L |
| IDEE-006 | Boîte de sites favoris utiles | ressources | 🛠️ En cours | moyenne | M |
| IDEE-001 | Boîte à outils dans le deck | presentation | ✅ Fait | haute | M |
| IDEE-002 | Boîte de prise de notes | presentation | ✅ Fait | haute | M |
| IDEE-008 | Design des decks : couleurs, logos de pied de page et modules cliquables | presentation | ✅ Fait | haute | M |

## 💡 Idée

### IDEE-004 · Tiroir de cartes / slides à la demande

*Pendant l'animation (mode présentation / présentateur)* · priorité **haute** · effort **M** · créée le 2026-11-07

Tiroir accessible depuis n'importe quelle slide qui contient des cartes ou des slides de réserve (glossaire, rappel de syntaxe, slide « bonus », réponse à une question fréquente). On l'ouvre en superposition, on le referme et on reprend là où on était, sans casser la progression des reveals.

**Pistes techniques**

- Convention côté deck : export `drawer` (tableau de pages) à côté de `default` et `notes`
- Rendu en overlay dans le player, sans changer l'index de page courant
- Le tiroir doit aussi s'ouvrir côté présentateur et s'afficher côté projection
- Réutilisable entre decks : cartes globales sous assets/ ou une bibliothèque (voir docs/bibliotheque-chapitres.md)

### IDEE-005 · Configuration du deck au démarrage (chapitres inclus/exclus)

*Avant la session (configuration, préparation du deck)* · priorité **haute** · effort **L** · créée le 2026-11-07

Écran de configuration avant de présenter : cocher ou décocher les chapitres ou modules, choisir la durée (1 j / 2 j), le public, le fil rouge. Le deck devient dynamique : la navigation, la numérotation et le sommaire suivent la sélection.

**Pistes techniques**

- Les decks déclarent leurs chapitres : export `chapters` = [{id, titre, pages:[début,fin], optionnel}]
- Sélection mémorisée par deck (localStorage), avec des profils nommés (ex. « Lessard 1 j », « Inter 2 j »)
- La sélection doit valoir aussi pour les speaker notes (index alignés), l'export PDF et les liens de partage /v/<code>
- Lien avec les builds .xxx-build/ : aujourd'hui les variantes sont des copies de decks ; ceci pourrait les remplacer

### IDEE-003 · Panneau latéral de dessin assisté

*Pendant l'animation (mode présentation / présentateur)* · priorité **moyenne** · effort **L** · créée le 2026-11-07

Calque d'annotation par-dessus la slide : stylo, surligneur, formes, gomme, effacer tout. « Assisté » : lissage du trait, reconnaissance de formes (trait à main levée → flèche, cercle, rectangle propre), aimantation sur les éléments de la slide.

**Pistes techniques**

- Canvas en coordonnées 1920×1080 pour rester juste quelle que soit la mise à l'échelle
- Dessins synchronisés projection ↔ présentateur, sur le même modèle que le laser
- Annotations éphémères par défaut, avec une option pour les conserver par slide
- Pointer Events + reconnaissance de formes simple (pas de dépendance : interdite par CLAUDE.md)

## 🔍 À étudier

### IDEE-007 · Évaluer le passage de core 2.0.1 à 2.3.1

*Nouveautés du dépôt officiel open-slide à évaluer* · priorité **moyenne** · effort **L** · créée le 2026-11-07

Le dépôt officiel a publié 2.1.0, 2.2.0, 2.3.0 et 2.3.1 (panneau agent intégré, mode commentaire dans la barre d'outils, route /preview, espagnol, undo/redo amélioré). Le patch local ne s'applique plus proprement (9 fichiers sur 29 en conflit). Détail dans veille-upstream.md.

**Pistes techniques**

- Faire la migration dans une copie ou un worktree séparé, jamais dans my-deck directement
- Avant de migrer, réduire la surface de conflit : déplacer le code patché dans de nouveaux fichiers et ne garder que des points d'accroche courts dans app.tsx, home.tsx, presenter.tsx, slide.tsx et les locales
- Les idées 001 à 006 vont agrandir le patch : mieux vaut décider de la migration AVANT de les développer

**Journal**

- 2026-11-16 : 2026-11-16 : le patch local est passé de 36 à 41 fichiers (boîte à outils, notes, langue française, route d'écriture des notes) ; les nouveaux fichiers toolbox.* ne posent pas de conflit, mais player.tsx, presenter.tsx, slide.tsx, overview-grid.tsx, locale-store.ts et les 5 locales gagnent des points d'accroche : à compter dans la décision de migration.

## 🛠️ En cours

### IDEE-006 · Boîte de sites favoris utiles

*Contenus et liens mis à disposition* · priorité **moyenne** · effort **M** · créée le 2026-11-07

Liste de liens utiles (outils de démo, documentation, dépôt des labs, formulaire d'évaluation), par deck et globale, ouvrable depuis la barre d'outils comme le bouton « Labs ». Optionnel : afficher un QR code / lien court côté projection pour le partager dans le Chat.

**Pistes techniques**

- Étendre la mécanique `meta.labs` déjà patchée : `meta.links` = [{label, url, groupe}]
- Liens globaux dans un fichier partagé (assets/ ou config), fusionnés avec ceux du deck
- Bouton « Copier pour le Chat » pour coller le lien dans Teams/Zoom (formation en distanciel)

**Journal**

- 2026-11-16 : statut : idee → en-cours
- 2026-11-16 : 2026-11-16 : codée (sans QR code, refusé). Listes dans slides/.liens.json (global, 9 liens : outils IA, BenchLM, skills.sh, Awesome Copilot) et slides/<deck>/liens.json (dépôts de labs : copilot-debutant, copilot-debutant-v2, ia-developpeurs-code-assiste). Onglet « Liens » du panneau présentateur (copier pour le Chat, ouvrir, afficher en grand en projection, ajouter/modifier/supprimer) + bouton « Liens » dans la barre de l'éditeur (menu + fenêtre « Gérer les liens »). Route d'écriture PUT /__links (serveur de dev). Aucun deck à régénérer. À valider après redémarrage du serveur.

## ✅ Fait

### IDEE-001 · Boîte à outils dans le deck

*Pendant l'animation (mode présentation / présentateur)* · priorité **haute** · effort **M** · créée le 2026-11-07

Bouton flottant, disponible depuis n'importe quelle slide en présentation, qui ouvre des outils pour le formateur : minuteur d'atelier (visible côté projection), chronomètre, tirage au sort d'un volontaire (2–3 personnes pour la restitution), compte à rebours de pause.

**Pistes techniques**

- Dans le patch core (player + presenter), pas deck par deck : sinon il faut copier le code dans chaque deck
- Synchroniser l'état projection ↔ présentateur via use-presenter-channel.ts (déjà patché pour le laser)
- Mettre le composant dans un NOUVEAU fichier (components/present/toolbox.tsx) : les nouveaux fichiers du patch s'appliquent sans conflit lors des montées de version
- Livré : panneau dans la vue présentateur seulement (jamais dans la fenêtre partagée en visio) ; projection = badge dans 4 coins au choix, écran de pause, résultat du tirage ; état partagé par un BroadcastChannel propre (open-slide:toolbox:<deck>) + localStorage, sans toucher use-presenter-channel.ts

**Journal**

- 2026-11-15 : statut : idee → en-cours
- 2026-11-15 : Codé le 2026-11-15 (touche T / bouton 🧰) : minuteur, pause plein écran, chrono, tirage ; fichiers lib/toolbox.ts + components/present/toolbox.tsx, patch régénéré. À vérifier dans le navigateur (non testé : verrou du site).
- 2026-11-15 : 2026-11-15, 2e version (propositions validées 1-5, 7-11) : panneau dans la vue présentateur seulement ; projection = badge (4 coins, barre de progression, orange à 2 min), pause plein écran (heure de fin, message de reprise), tirage animé ; fin effacée au bout de 2 min ; état de la veille effacé ; bips optionnels ; durée du TP de la slide préremplie ; textes en 5 langues ; raccourcis T/N dans l'aide (H). Vérifié dans le navigateur, sauf : préremplissage depuis les minuteurs, bouton « Slide suivante », bips, synchro entre deux vraies fenêtres.
- 2026-11-15 : 2026-11-15 : interface en français (choix Français dans le menu de langue, par défaut si le navigateur est en français) ; minuteur ou pause terminés : un clic en projection les ferme ; « Pause jusqu'à » limitée à 1 h 30.
- 2026-11-16 : 2026-11-16 : « Mode présentateur » (menu, touche P, palette) n'ouvre plus que la fenêtre présentateur ; la projection se lance à part (Présenter, F ou Entrée) et la rejoint toute seule. Le plein écran se demande alors depuis le clic sur Présenter (demander le plein écran juste avant ou après window.open était refusé ou bloquait la fenêtre). Interface en français = langue du navigateur ou menu de langue. Reste à valider en vrai : bips, préremplissage depuis les minuteurs de TP, synchro entre deux vraies fenêtres, deux écrans.
- 2026-11-16 : statut : en-cours → fait
- 2026-11-16 : 2026-11-16 : validée par l'utilisateur après essais (bips, TP, deux fenêtres, deux écrans compris).

### IDEE-002 · Boîte de prise de notes

*Pendant l'animation (mode présentation / présentateur)* · priorité **haute** · effort **M** · créée le 2026-11-07

Panneau de notes libres pendant la session (questions posées, points à revoir, idées d'amélioration du deck), rattachées à la slide en cours, conservées par deck et par session, exportables en Markdown.

**Pistes techniques**

- Stockage localStorage par clé deck + date de session ; export .md en fin de journée
- Côté présentateur uniquement (jamais projeté)
- Ne pas confondre avec les speaker notes (`notes` export) : ici ce sont des notes prises en direct
- Option : convertir une note en marqueur @slide-comment pour la retravailler ensuite avec apply-comments
- Livré : notes par jour dans localStorage osd-notes:<deck>:<jour>, 4 catégories, modification, export .md groupé par catégorie avec titres de slides tirés des speaker notes, pastille dans l'aperçu (touche O)

**Journal**

- 2026-11-15 : statut : idee → en-cours
- 2026-11-15 : Codé le 2026-11-15 (touche N dans le présentateur) : notes par slide, par jour, export .md ; même fichier toolbox.tsx. À vérifier dans le navigateur. Non fait : conversion en @slide-comment.
- 2026-11-15 : 2026-11-15, 2e version (propositions validées 14-16, 18) : catégories (Note, Question, À revoir, Idée pour le deck), modification, titres de slides dans l'export, liste « Slides avec des notes » cliquable, pastille dans l'aperçu (O), copie fichier dans docs/sessions/<deck>/<jour>.md (serveur de dev). Vérifié dans le navigateur.
- 2026-11-16 : 2026-11-16 : fichiers de session écrits par le serveur de dev dans docs/sessions/<deck>/<jour>.md (route PUT /__session-notes, ajoutée dans dist/config-hT1o6Jct.js, donc dans le patch). Rejeté lors de la validation : notes comme 4e volet rangeable, conversion en @slide-comment. Reste à valider en vrai en formation.
- 2026-11-16 : statut : en-cours → fait
- 2026-11-16 : 2026-11-16 : validée par l'utilisateur après essais.

### IDEE-008 · Design des decks : couleurs, logos de pied de page et modules cliquables

*Pendant l'animation (mode présentation / présentateur)* · priorité **haute** · effort **M** · créée le 2026-11-15

Dans le panneau Design (touche D) : toutes les couleurs du kit sont réglables (14 à 18 selon le deck, teintes et dégradés suivent), et une liste de logos de pied de page à cocher (client final, mon client, National Quantum, plusieurs à la fois). Dans l'en-tête, les pastilles M1…Mn affichent le nom du module au survol et ouvrent sa page d'ouverture au clic (éditeur et présentation). Appliqué à tous les decks de formation à modules.

**Pistes techniques**

- Outil commun scripts/deck-features.mjs : « kit » transforme un kit, « deck » un deck autonome ; writeDeck() dans chaque build.mjs garde le design enregistré depuis le panneau, branche le logo client et calcule MOD_START.
- Côté core (patch) : couleurs supplémentaires de design.palette → --osd-<clé>, design.logos → --osd-logo-<clé>, libellés design.labels, événement open-slide:goto pour naviguer depuis une slide.

**Journal**

- 2026-11-15 : statut : idee → fait
- 2026-11-15 : Livré le 2026-11-15 sur 17 decks : claude-ia-avancee-developpeurs, copilot-avance, copilot-debutant, copilot-debutant-v2, docaposte-dev-ia, ia-agentique-feuille-de-route, ia-assistant-administratif, ia-avancee-automatisation, ia-developpeurs-code-assiste, ia-gestion-de-projet-lessard, ia-gestion-de-projet-lefleuve-ca, ia-marketing-communication, ia-pour-les-rh, ia-product-owner, ia-relation-client, ia-support-infrastructure, outils-ia-gain-de-temps. Vérifié : 0 erreur TypeScript, minuteurs identiques, un clic par deck testé dans le navigateur, et la page cible de chaque pastille M1…Mn vérifiée (toutes tombent sur l’intercalaire du module).
- 2026-11-15 : Logo « client final » : il n'existe pour l'instant que dans le deck Claude (Wevioo). Pour un autre deck, déposer slides/<id>/assets/logos/logo-client.png (ou .svg/.jpg/.webp) puis relancer son build : la case apparaît toute seule.
- 2026-11-15 : Hors périmètre : les 8 decks autonomes sans modules (ai-history-*, fenetre-de-contexte, getting-started, llm-explique, meet-my-classmates, ml-explique, vibe-coding-docaposte) ont une autre structure.
