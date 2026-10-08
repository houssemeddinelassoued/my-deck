# IA134 — Plan de rédaction des fragments

Formation Technologia **IA134 « Feuille de route pour l'IA agentique – Une exploration complète des agents d'IA »**, 2 jours (14 h).
Formateur : **Houssem Eddine Lassoued** (constante `AUTHOR`). Public : professionnels (gestionnaires, analystes, TI, chefs de projet) au Québec.
Deux decks open-slide générés par `.ia134-build/build.mjs` à partir de `kit.tsx` + fragments `j<jour>-<ordre>-<nom>.tsx`.

> **Fragment de référence :** `.ia134-build/j1-00-open.tsx` (déjà validé visuellement). LISEZ-LE EN ENTIER avant d'écrire : style, densité, composants locaux, format des notes.
> **API :** `.ia134-build/kit.tsx` (lisez au minimum les lignes 1–300 et les commentaires des composants que vous utilisez).

---

## 1. Règles absolues

1. Vous n'écrivez **que votre fichier fragment** dans `.ia134-build/`. Ne modifiez ni `kit.tsx`, ni `build.mjs`, ni les autres fragments, ni rien sous `slides/`, ni `package.json`.
2. Un fragment = du code de pages **sans aucun import** (tout vient du kit : React hooks, `Page`, `Steps`, `Step`, composants, `C`, `T`, `A`, `b`…), puis deux blocs marqueurs exactement :
   ```
   // @@PAGES-BEGIN
   export const __pages = [Xx_Page1, Xx_Page2];
   // @@PAGES-END

   // @@NOTES-BEGIN
   export const __notes = [
     `…notes page 1…`,
     `…notes page 2…`,
   ];
   // @@NOTES-END
   ```
   Autant de notes que de pages. Notes = template literals **sans `${}`** (ni chaînes construites).
3. **Préfixe unique** pour TOUT identifiant de haut niveau (pages, composants locaux, constantes) — voir tableau §7. Deux fragments du même jour sont concaténés dans le même fichier : une collision = erreur de compilation. Les `id` de `Timer`, `PollRow`, `CheckItem` doivent aussi être préfixés (ex. `id="m5-sel"`). Les classes CSS maison via `CSS.push` doivent utiliser `k('<prefixe>-nom')`.
4. **Validation obligatoire** : `node .ia134-build/build.mjs check .ia134-build/<votre-fichier>.tsx` doit afficher OK (tsc). Corrigez jusqu'à ce que ce soit vert.
5. **Jamais** de `node -e` / `sed` avec backticks ou `${` : utilisez les outils Write/Edit pour écrire le fichier.
6. Pas de `.map` pour des éléments visuels répétés : composant local + instances explicites (règle open-slide / inspecteur). Les `<li>` littéraux sont OK.
7. Diviseurs de module : `<Section …>` + `X_Divider.transition = BLOOM;`. Les autres pages héritent de la transition par défaut (ne rien déclarer).
8. Langue : **français du Québec** soigné — courriel, dîner, billet, rétroaction, infonuagique, clavardage, gestionnaire, « fin de semaine »… Apostrophe typographique `’` dans le JSX visible (comme la référence). Guillemets « … ».
9. Ne rien inventer sur le formateur. Faits du marché : n'utilisez que ceux du §5 (ou des faits très établis), formulés prudemment (« selon Gartner », « annoncé en »).

## 2. Canevas et grille (1920 × 1080, positions absolues)

| Zone | Valeur |
|---|---|
| En-tête (module + progression) | `top: 42`, géré par `Frame` |
| `<Title>` | top 108, 64 px (≤ 1 ligne, ~55 caractères max ; sinon `size={56}`) |
| `<Lede>` | top 192, 30 px, 1 ligne (≤ 95 caractères) |
| Zone de contenu | **x 120 → 1800**, **y ≈ 280 → 970** (sans Lede : à partir de ~230) |
| Pied de page | y 1006–1052, géré par `Frame` — **ne rien poser sous y = 975** |

- Corps de texte : 26–34 px ; légendes 20–24 px ; minimum absolu 20 px.
- **Faites le budget vertical** de chaque bloc (taille × interligne × lignes + gaps). Une boîte à hauteur fixe dont le contenu dépasse = défaut (le contrôle visuel le détecte : `VOVER`). Préférez des hauteurs auto ou calculées large.
- Une idée par page. Si ça ne rentre pas, simplifiez le texte, ne réduisez pas sous les minimums.

## 3. Animation (le cœur pédagogique)

Chaque page s'anime à son arrivée (classes `A.*`, actives seulement sur la page active) et la plupart construisent leur propos **au clic** (beats).

- **Entrées** : `className={A.in}` (+ `style={{ ...dl(200) }}` pour le délai). Variantes `A.fade/pop/left/right/down/grow/growY/draw/dot`. Échelonnez (0, 120, 240…).
- **Boucles** : `A.pulse/march/float/spin/spinBack/blink/glow` (flux de données, agent « vivant »). `A.march` sur un path SVG en `strokeDasharray="10 14"`. `FlowDot` = point qui circule sur un chemin SVG.
- **Beats** : `<Frame beats={N}>` ajoute N clics invisibles. Un élément avec `className={b.on(2)}` apparaît au 2ᵉ clic. Variantes `b.fade/pop/left/draw/grow/growY/dim/off/hi(n)` (`b.draw` : path SVG avec `pathLength={1}` ; `b.hi` : anneau bleu de mise en évidence ; `b.dim` : estompe ce qui n'est plus le sujet). Max 12 beats. `dl()` fonctionne aussi pour décaler dans un même beat.
- `useBeats()` → `[ref, count]` pour un rendu React piloté par le nombre de beats (ex. simulateur pas à pas) ; attacher `ref` à un élément de la page.
- `Arrow` SVG avec `n={beat}` : se dessine au beat n.
- ⚠️ **Ne jamais combiner `A.*` et `b.*` sur le même élément** (deux animations de transform/opacity se battent) : imbriquez deux `div`. **Pas de `transform` ni `opacity` en ligne** sur un élément qui porte une classe d'animation.
- La page doit rester complète et lisible si on y saute directement (tous les beats révélés).
- Les clics sur `button`, `[role=button]`, `[data-osd-interactive]` ne changent pas de page : tous les contrôles du kit le gèrent déjà.

## 4. Kit — ce qui est disponible (détails dans `kit.tsx`)

Constantes : `C` (ink, soft, muted, faint, rule, panel, card, blue, teal, green, yellow, amber, coral, violet), `T[tone]` {bg, bd, fg}, `Tone` = blue|teal|green|yellow|coral|violet|grey, `STRONG[tone]`, `G.blue/green/yellow` (dégradés), `display`, `body`, `mono`, `SHADOW`, `SHADOW_SM`, `EASE*`, `vars`, `dl(ms)`, `cx(...)`, `pad(n)`, `fr(x, digits)` (format nombre français), `DAY`, `AUTHOR`, `COURSE`, `MOD_TITLES`, `logoStack`, `logoWide`, `formateur` (photo), `k(name)`, `CSS.push(...)`.

Icônes (`IconName`) : user users bot brain tool database doc mail calendar search chat gear shield shieldCheck lock key cloud chart trend target bolt clock check x alert bulb flag layers link plug eye loop rocket money ticket book server cpu humanCheck route sparkles map globe code archive smile gauge org play pause reset plus arrow scale truck hand pointer star filter inbox send note puzzle.

| Composant | Usage |
|---|---|
| `Frame({mod, label?, kind?, beats?, chrome?, bg?})` | Racine de CHAQUE page. `mod` = n° de module (0 = ouverture/clôture). `kind` = qcm \| exercice \| atelier \| cas \| demo \| synthese (badge). `label` = sous-titre d'en-tête. |
| `Title({children, top?, size?, w?, cls?})` · `Lede({children, top?, w?, cls?})` | Titre / chapeau. |
| `Eyebrow({c?, size?, cls?, style?})` · `Hl` (surligneur jaune) · `Strong({c?})` | Typo. |
| `Bullet({tone?, size?, cls?, style?})` · `Num({n, tone?, size?})` · `Tag({tone?, size?})` | Listes / badges. |
| `Box({x, y, w?, h?, cls?, style?})` | Conteneur absolu. |
| `Card({tone?, icon?, title?, bar?, pad?, size?, cls?, style?})` · `Callout({title?, tone?, icon?, size?, cls?, style?})` · `Quote({by?})` | Cartes. |
| `IconTile({name, tone?, size?, solid?, style?})` · `Icon({name, size?, color?, sw?})` | Icônes. |
| `Arrow({x1,y1,x2,y2,color?,w?,n?,d?,head?,curve?,dashed?,cls?})` (dans un `<svg>`) · `FlowArrow({w?, color?, dashed?})` (HTML, flex) · `FlowDot({path, dur?, begin?, r?, color?})` | Diagrammes. |
| `Avatar({who})` · `Bubble({who: 'user'\|'agent'\|'human'\|'system', name?, size?, w?, cls?, style?})` | Conversations. |
| `Code({title?, size?, cls?, style?})` + `Jk` (clé) `Js` (chaîne) `Jn` (nombre) `Jc` (commentaire) | JSON / appels d'outils. Contenu : lignes avec `{'\n'}` ou `<div>` par ligne — voir usage dans kit. |
| `CountUp({to, dur?, delay?, digits?, prefix?, suffix?})` · `Stat({value, label, tone?, size?})` | Chiffres. |
| `Btn({onClick, tone?, ghost?, icon?, disabled?, size?, style?})` · `Toggle({on, onChange, label, tone?, size?})` · `Range({value, onChange, min?, max?, step?, w?, tone?})` · `Hint` | Interactif (avec `useState`). |
| `QcmPage({mod, n, title, q, explain, multi?})` + `<Opt ok? why="…">texte</Opt>` | QCM complet (Frame + beats=2 inclus). Clic option = rétroaction immédiate (✓ / piège + why) ; → révèle bonne(s) réponse(s), → révèle l'explication. |
| `FlipCard({front, back, w, h, flipAt?, tone?, backTone?, cls?, style?})` | Carte à retourner (clic ; ou beat `flipAt`). |
| `Drag({x, y, w?, tone?, size?})` | Pastille déplaçable (matrices, tri). Position relative au parent positionné. |
| `Timer({id, minutes, label?, compact?, cls?, style?})` | Minuteur d'atelier. |
| `Poll` + `PollRow({id, label, tone?, icon?})` | Sondage main levée. |
| `Checklist` + `CheckItem({id, w?, size?, tone?})` + `CheckScore({max, levels:[{min,text,tone}], label?})` | Grille cochable avec score. |
| `Hotspot({n, x, y, title, at?, w?, side?})` | Point cliquable « repérez la faille » (ou révélé au beat `at`). |
| `Section({n, title, sub, dur, kind?})` + `SecItem({n})` | Page diviseur de module (pas de `Frame`). |
| `Portrait({w?, x, y})` · `Squares` · `MiniSquares` | Visuels de marque. |

## 5. Contenu de référence

### Boréal Distribution inc. (fil rouge fictif, présenté en ouverture J1)
1 200 employés · sièges Québec et Montréal · 3 centres de distribution · ≈ 4 000 clients B2B · RH 300 demandes/mois · TI 1 800 billets/mois (≈ 35 % mots de passe et accès) · Service client 5 000 courriels/mois · Finance 2 500 factures fournisseurs/mois (PDF, papier numérisé, EDI) · Documentation 40 000 documents (SharePoint, Google Drive, vieux wiki) · **Mandat : feuille de route IA agentique sur 90 jours.**

**9 cas de la matrice (J2 M5)** : FAQ RH (quick win) · réinitialisation mots de passe/accès TI (quick win) · assistant documentaire RAG (stratégique, limite quick win) · tri et réponse courriels clients (stratégique) · traitement factures fournisseurs (stratégique) · négociation autonome avec fournisseurs (à éviter) · rapport de ventes hebdomadaire (quick win) · chatbot d'anniversaires/mèmes (gadget) · planification des tournées de livraison (piège : optimisation classique, pas un agent).

**Simulateur M8 (3 courriels)** : (a) « Où est ma commande #45812 ? » → réponse automatique avec lien de suivi ; (b) facture en double / demande de remboursement → note préparée + validation humaine ; (c) client en colère → escalade avec résumé. Règle : retard ET commande < 500 $ → réponse auto + crédit ; sinon, ou client mécontent → escalade.

### Faits du marché (formulation prudente)
- Gartner : 33 % des applications d'entreprise intégreront de l'IA agentique d'ici 2028 (< 1 % en 2024) ; 15 % des décisions de travail quotidiennes prises de façon autonome d'ici 2028 ; plus de 40 % des projets d'IA agentique annulés d'ici fin 2027 (coûts, valeur floue, risques) ; « agent washing » (beaucoup de fournisseurs rebaptisent des chatbots).
- Moffatt c. Air Canada (Tribunal de résolution civile de la C.-B., février 2024) : le clavardeur a inventé une politique de tarif de deuil ; Air Canada tenue responsable.
- Klarna (2024) : assistant IA traitant ≈ 2/3 des conversations, « l'équivalent de 700 agents » ; en 2025, réembauche d'humains pour la qualité.
- Chevrolet de Watsonville (déc. 2023) : chatbot amené à « accepter » un Tahoe à 1 $ par injection de prompt.
- Replit (juillet 2025) : un agent de code a supprimé une base de données de production malgré un gel des changements.
- Anthropic, « Building effective agents » (déc. 2024) : workflows vs agents, 5 patterns.
- MCP — Model Context Protocol (Anthropic, nov. 2024), « le port USB-C de l'IA » ; A2A — Agent2Agent (Google, avril 2025, confié ensuite à la Linux Foundation).
- OWASP Top 10 pour applications LLM 2025 : LLM01 injection de prompt, LLM06 agentivité excessive (excessive agency), etc.
- Loi 25 (Québec) : EFVP (évaluation des facteurs relatifs à la vie privée), consentement, information lorsqu'une décision est fondée exclusivement sur un traitement automatisé, responsable de la protection des renseignements personnels.

### Horaires
- **J1** : 9:00 Accueil · 9:30 M1 · 10:30 Pause · 10:45 M1 (suite) · 11:30 M2 · 12:00 Dîner · 13:00 M3 · 14:15 Pause · 14:30 M4 · 15:40 Synthèse · 16:00 Fin.
- **J2** : 9:00 Réactivation · 9:15 M5 · 10:30 Pause · 10:45 M6 · 12:00 Dîner · 13:00 M7 · 13:50 M8 · 14:50 Pause · 15:00 M9 · 15:30 M10 · 15:50 Clôture · 16:00 Fin.

## 6. Notes du formateur (export `notes`)

Chaque page a une note de **120 à 250 mots**, texte brut, ce que le formateur **dit** (pas un résumé de l'écran). Format (voir la référence) :

```
⏱ 4 min · TYPE DE PAGE (optionnel : repère horaire)

OBJECTIF — …

DIRE — « … » (phrases prêtes à dire, exemples concrets, Boréal)

ANIMATION / INTERACTION — quand cliquer (→ beat 1 : …), quoi demander au groupe, réponses attendues.

[RÉPONSES — pour QCM/exercices : chaque option ✓/✗, PIÈGE expliqué]

TRANSITION — « … »
```
La somme des ⏱ d'un module doit coller à l'horaire.

## 7. QCM

- 3 à 5 options (≤ 4 si `multi`), chaque option ≤ 110 caractères ; question ≤ 3 lignes à 36 px (~150 caractères).
- **Au moins un piège crédible** (idée reçue répandue), `why` ≤ 30 mots commençant par « Oui : » / « Non : » / « Piège ! ».
- `explain` ≤ 45 mots : le message clé.
- Mélangez la position des bonnes réponses.

## 8. Répartition des fragments

Chaque page : `Frame` avec le bon `mod`. Chaque module (diviseur compris) : pages listées ci-dessous dans l'ordre. Les nombres de pages sont des cibles (± 1).

### `j1-10-m1a.tsx` — préfixe `M1a` (pages `M1a_…`, composants `M1a…`) — M1 pages 1–10, `mod={1}`
1. **De l'IA qui répond à l'IA qui agit** — frise animée : 2017 Transformer · 2020 GPT-3 · nov. 2022 ChatGPT (assistant) · 2023 appels de fonctions/outils · 2024 MCP, premiers agents · 2025 agents en entreprise, A2A. Beats qui avancent le curseur.
2. **Définition** — boucle Percevoir → Raisonner (planifier) → Agir (outils) → Observer, dessinée par beats, avec un point qui circule ; définition en une phrase.
3. **Anatomie d'un agent** — cerveau LLM au centre ; 5 composants autour révélés par beats : Instructions/objectif, Mémoire, Outils (API), Données/connaissances (RAG), Garde-fous (+ humain dans la boucle).
4. **LLM classique vs agent** — tableau comparatif animé (réactif/proactif, 1 tour/plusieurs étapes, texte/actions, sans état/mémoire, connaissance figée/accès aux systèmes, risque : erreur de texte / erreur d'action).
5. **Démo « Même demande, deux mondes »** (`kind="demo"`) — demande : « Réserve la salle Laurentides jeudi 10 h et préviens l'équipe ». Gauche : LLM classique répond un texte (« Voici un modèle de courriel… »). Droite : l'agent consulte le calendrier, réserve, envoie le courriel, confirme — bulles et appels d'outils révélés par beats.
6. **Les 3 notions clés** — Objectifs · Mémoire · Capacité d'agir (+ autonomie comme résultante) ; cartes pop.
7. **Échelle d'autonomie** — 6 niveaux L0 (outil) → L5 (autonome) avec curseur `Range` interactif : affiche description + exemple Boréal + niveau de supervision. Message : la plupart des agents utiles en entreprise sont L2–L3.
8. **Objectifs : décomposer** — arbre : « Réduire de 30 % le temps de traitement des billets TI » → sous-objectifs → tâches → outils ; construit par beats.
9. **La mémoire** — court terme (fenêtre de contexte), long terme (profil, préférences, base de connaissances), épisodique (historique des actions) ; exemple concret pour chaque.
10. **La capacité d'agir : appels d'outils** — séquence de 3 appels JSON (`Code`) : `rechercher_billets` → `resumer` → `envoyer_courriel`, l'agent choisit l'outil, le système l'exécute ; beats.

### `j1-20-m1b.tsx` — préfixe `M1b` — M1 pages 11–19, `mod={1}`
11. **Simulateur ReAct pas à pas** (`kind="demo"`) — tâche : « Envoie à l'équipe un résumé des billets TI critiques de la semaine ». Pensée → Action → Observation × 3 puis Réponse finale, révélés par beats ou bouton « Étape suivante » + « Recommencer » (useState).
12. **Workflow ou agent ?** — spectre : script/RPA → workflow avec LLM → agent ; critère : qui décide du chemin (le code vs le modèle). Citer Anthropic : « commencez simple ». (Pause de 10 h 30 vers ici — mentionner dans la note.)
13. **Panorama en 3 couches** — Modèles (GPT/OpenAI, Claude/Anthropic, Gemini/Google, Mistral, Llama/Meta, Cohere – Canada) · Frameworks (LangChain/LangGraph, Microsoft Agent Framework (AutoGen + Semantic Kernel), CrewAI, LlamaIndex, OpenAI Agents SDK, Claude Agent SDK, Google ADK) · Plateformes (Microsoft Copilot Studio, Salesforce Agentforce, ServiceNow, Google Gemini Enterprise, AWS Bedrock AgentCore, n8n, Make, Zapier). Couches qui se posent par beats. Pas de logos : pastilles texte.
14. **MCP et A2A** — schéma : sans MCP, N×M intégrations ; avec MCP, un connecteur standard (« USB-C de l'IA ») hôte ↔ serveurs MCP (outils, ressources, prompts). A2A : agents qui se parlent entre eux (carte d'agent, tâches). Beats.
15. **Les chiffres à retenir** — Gartner 33 % / 2028 (CountUp), 15 % des décisions, > 40 % des projets annulés d'ici 2027, « agent washing ». Message : potentiel réel, mais discipline requise.
16. **Exercice « Agent ou pas agent ? »** (`kind="exercice"`) — 6 `FlipCard` : correcteur orthographique (non), chatbot FAQ à réponses fixes (non), assistant qui trie les courriels et crée les billets (oui), règle Outlook « déplacer si… » (non – règle), agent qui prépare la réunion : agenda, documents, invitations (oui), ChatGPT qui rédige un texte à la demande (non – LLM conversationnel). Recto : situation ; verso : verdict + pourquoi.
17. **QCM 1** — agent vs LLM (`QcmPage mod={1} n={1}`). Piège : « un agent est simplement un LLM plus puissant ».
18. **QCM 2** — mémoire et autonomie (`n={2}`, éventuellement `multi`). Piège : « plus d'autonomie = toujours mieux ».
19. **Synthèse M1** (`kind="synthese"`) — 4–5 idées clés + transition vers l'atelier.

### `j1-30-m2m3.tsx` — préfixe `M23` — M2 (`mod={2}`) puis M3 (`mod={3}`)
**M2 — Atelier · Identifier un agent (≈ 30 min, 11:30–12:00)**
1. Diviseur `Section n={2}` (`kind="atelier"`, dur « ≈ 30 min »).
2. **Consignes** (`kind="atelier"`) — 3 étapes (10 min seul : choisir un irritant de son organisation ; 10 min en duo : remplir la carte d'identité ; 10 min : 2–3 partages) + `Timer minutes={20}`.
3. **Carte d'identité d'un agent — exemple Boréal** — agent « Aide-accès TI » : objectif, utilisateurs, déclencheur, données, outils, actions autorisées / interdites, escalade, mesure de succès ; rubriques révélées par beats.
4. **Est-ce un bon candidat ?** — `Checklist` de 6–8 critères pondérés (tâche répétitive et volumineuse, données accessibles, règles claires, erreur récupérable, gain mesurable, parrain métier…) + `CheckScore` (3 niveaux).

**M3 — Typologie des agents (≈ 1 h 15, 13:00–14:15)**
5. Diviseur `Section n={3}`.
6. **Carte des familles** — axes Autonomie (x) × Intégration aux systèmes (y) : conversationnels, assistants RAG, multi-outils, autonomes, orchestrateurs multi-agents ; bulles posées par beats.
7. **Agents conversationnels** — conversation `Bubble` (FAQ RH Boréal), forces / limites.
8. **Agents autonomes** — boucle longue sur un objectif (ex. veille fournisseurs), quand / garde-fous (budget, plafond d'étapes, point de contrôle humain).
9. **Agents multi-outils** — agent central relié à 5 outils (ERP, CRM, courriel, calendrier, base de connaissances), flux animés `FlowDot`.
10. **Orchestrateurs / multi-agents** — un superviseur délègue à des spécialistes (rédacteur, vérificateur, recherche) ; coûts et complexité.
11. **Pipeline RAG** — ingestion → découpage → embeddings → base vectorielle → récupération → génération avec citations ; étapes par beats + point qui circule.
12. **5 patterns d'Anthropic** — chaînage, routage, parallélisation, orchestrateur-exécutants, évaluateur-optimiseur ; mini-schéma pour chacun.
13. **Comparatif** — tableau 5 types × (autonomie, complexité, risque, exemple Boréal) avec jauges.
14. **Exercice « Quel type d'agent ? »** (`kind="exercice"`) — 5–6 besoins Boréal en `FlipCard` → type recommandé.
15. **QCM 3 — RAG** (`mod={3} n={3}`) — piège : « le RAG ré-entraîne le modèle sur vos documents ».
16. **QCM 4 — multi-agents** (`n={4}`) — piège : « plus d'agents = meilleur résultat ».
17. **Synthèse M3**.

### `j1-40-m4close.tsx` — préfixe `M4` — M4 (`mod={4}`) + clôture J1 (`mod={0}`)
1. Diviseur `Section n={4}` (dur « ≈ 1 h 10 »).
2. **Cas RH : parcours** (`kind="cas"`) — employée demande son solde de congés + attestation d'emploi : agent RH consulte le SIRH, génère l'attestation, escalade les cas sensibles ; parcours par beats.
3. **Cas RH : architecture et garde-fous** — composants + Loi 25 (renseignements personnels, accès par rôle, journalisation, EFVP).
4. **Cas TI : flux d'un billet** — courriel/Teams → classification → mot de passe : réinitialisation après vérification d'identité (MFA) → sinon routage avec résumé ; flux animé ; gain : 35 % des 1 800 billets.
5. **Cas TI : moindre privilège** — droits accordés vs dangereux ; leçon Replit 2025 ; confirmations humaines pour actions irréversibles.
6. **Cas assistant documentaire** — RAG sur 40 000 docs + respect des permissions SharePoint, citations, « je ne sais pas » ; démo de question/réponse avec sources.
7. **Comparatif des 3 cas** — autonomie, données, risque, gain, délai.
8. **Leçons du terrain** — Klarna (gains puis réembauches), Air Canada (responsabilité), Chevrolet 1 $ (injection) : 3 cartes, leçon pour chacune.
9. **Exercice « Repérez les failles »** (`kind="exercice"`) — maquette d'un agent mal conçu (ex. agent de remboursement qui a accès complet à la base clients, aucun plafond, pas de journal, répond aux politiques de mémoire, aucun humain) + 5–6 `Hotspot` (révélés aussi par beats `at`).
10. **QCM 5 — responsabilité** (`mod={4} n={5}`) — piège : « c'est la responsabilité du fournisseur du chatbot, pas de l'entreprise ».
11. **Synthèse du Jour 1** (`mod={0}`, `kind="synthese"`) — ce que nous avons appris (4 modules).
12. **À demain !** (`mod={0}`, `chrome={false}` possible) — aperçu du Jour 2 (prioriser, cadrer, concevoir, prototyper, déployer, mesurer), devoir léger : noter 3 irritants de son équipe ; `Portrait`.

### `j2-00-open-m5.tsx` — préfixe `J2o` (ouverture, `mod={0}`) et `M5` (`mod={5}`)
Recréez votre propre couverture (inspirez-vous de `J1_Cover`, identifiants renommés — l'autre deck n'est PAS inclus). Badge « JOUR 2 · Construire la feuille de route ».
1. **Couverture J2**.
2. **Réactivation : QCM éclair** (`kind="qcm"`, 2 beats) — rappel J1 multi-réponses (agent vs LLM, RAG, garde-fous).
3. **Programme du Jour 2** — horaire §5, modules 5–10.
4. Diviseur `Section n={5}` (« Analyse de cas d'usage », dur « ≈ 1 h 15 »).
5. **Pourquoi prioriser** — Gartner > 40 % de projets annulés ; causes ; « commencer petit, mesurer ».
6. **Critères d'impact et de complexité** — impact (volume, temps gagné, valeur, risque réduit) / complexité (données, intégrations, risque, changement) ; échelle 1–5.
7. **La matrice** — construite par beats : axes, 4 quadrants (Quick wins = fort impact/faible complexité, Projets stratégiques, Gadgets, À éviter).
8. **Atelier : matrice Boréal** (`kind="atelier"`) — 9 `Drag` (cas §5) à placer ; beats révèlent la solution (marqueurs dans les quadrants).
9. **Les quick wins** — caractéristiques + 3 exemples Boréal.
10. **Choisir 3 cas** (`kind="atelier"`) — consigne + `Timer` 10 min + gabarit (cas, impact, complexité, parrain).
11. **Calculateur de ROI** — `Range` : volume/mois, minutes gagnées/tâche, taux horaire ($), coût mensuel de l'agent → heures et $ économisés/an, délai de récupération (calcul en `fr()`).
12. **QCM 6** (`mod={5} n={6}`) — piège : « le cas le plus impressionnant est le meilleur premier projet ».

### `j2-10-m6.tsx` — préfixe `M6` — `mod={6}`
1. Diviseur `Section n={6}` (« Définition du périmètre », dur « ≈ 1 h 15 »).
2. **Objectifs business mesurables** — de « améliorer le service » à « répondre à 60 % des courriels de suivi en < 5 min avec ≥ 95 % d'exactitude » ; SMART ; transformation par beats.
3. **Limites et responsabilités** — 3 colonnes : l'agent FAIT / NE FAIT PAS / ESCALADE ; + mini RACI humain-agent.
4. **Interactions** — utilisateur ↔ agent ↔ systèmes ↔ données ; points de contrôle.
5. **Hallucinations** — causes, exemples, parades (RAG + citations, sorties structurées, validation, « je ne sais pas », évaluation) ; démonstration avant/après.
6. **Sécurité** — injection de prompt (directe/indirecte, ex. courriel piégé), agentivité excessive ; OWASP LLM Top 10 2025 ; parades.
7. **Confidentialité et Loi 25** — données personnelles, EFVP, résidence des données (Canada), minimisation, journalisation, contrats fournisseurs.
8. **Canevas « Charte d'agent »** (`kind="atelier"`) — rubriques à remplir, exemple Boréal révélé par beats.
9. **QCM 7 — hallucinations** (`n={7}`) — piège : « baisser la température élimine les hallucinations ».
10. **QCM 8 — injection de prompt** (`n={8}`) — piège : « un bon prompt système suffit à bloquer les injections ».

### `j2-20-m7m8.tsx` — préfixe `M78` — M7 (`mod={7}`) puis M8 (`mod={8}`)
**M7 — Conception & choix des outils (≈ 50 min)**
1. Diviseur `Section n={7}`.
2. **Schéma fonctionnel** — construit pas à pas : canal d'entrée → orchestrateur/LLM → outils → données → garde-fous → humain → journalisation/observabilité.
3. **4 critères de choix** — compétences internes (no-code ↔ code), écosystème existant (Microsoft 365, Google, Salesforce…), contrôle/hébergement des données, coût total.
4. **Comparatif** — no-code (Copilot Studio, n8n, Make…), plateformes d'entreprise (Agentforce, ServiceNow…), frameworks (LangGraph, Agent Framework, CrewAI, SDK OpenAI/Claude/Google ADK).
5. **Sélecteur interactif** (`kind="exercice"`) — 4–5 `Toggle` (« équipe de dev ? », « Microsoft 365 ? », « données sensibles sur site ? », « besoin multi-agents ? », « budget limité ? ») → recommandation calculée (useState).
6. **Logique d'action : définir un outil** — `Code` JSON Schema de `consulter_commande(numero)` : nom, description, paramètres ; annotations par beats.
7. **Bonnes pratiques d'outils** — descriptions claires, peu d'outils, idempotence, permissions minimales, confirmation humaine pour l'irréversible, erreurs explicites.
8. **QCM 9** (`n={9}`) — piège : « plus on donne d'outils à l'agent, plus il est performant ».

**M8 — Atelier pratique · Prototyper (≈ 1 h, 13:50–14:50)**
9. Diviseur `Section n={8}` (`kind="atelier"`).
10. **Consignes** — cas : tri des courriels du service client Boréal ; équipes ; livrable ; `Timer` 40 min.
11. **Le workflow en 4 étapes** — Lire → Extraire → Décider → Agir (animé).
12. **Extraction : sortie structurée** — courriel brut → JSON (`intention`, `numero_commande`, `montant`, `sentiment`, `urgence`) par beats.
13. **Décision et action** — règle §5 en arbre de décision + humain dans la boucle.
14. **Simulateur** (`kind="demo"`) — 3 boutons de courriels (a/b/c §5) ; clic → affichage animé extraction → décision → action (useState).
15. **Canevas de prototype** — gabarit à remplir par les équipes (prompt système, outils, règles, cas de test, critères de succès).

### `j2-30-m9m10close.tsx` — préfixe `M910` — M9 (`mod={9}`), M10 (`mod={10}`), clôture (`mod={0}`)
**M9 — Plan de déploiement (≈ 30 min)**
1. Diviseur `Section n={9}`.
2. **Prototype → Pilote → Production** — jalons, durée, critères de passage, population.
3. **Checklist go/no-go** (`kind="exercice"`) — `Checklist` + `CheckScore`.
4. **Infrastructure et clés** — coffre-fort de secrets, rotation, comptes de service à moindre privilège, environnements séparés, journalisation.
5. **Calculateur de coûts en jetons** — `Range` : requêtes/jour, jetons entrée/sortie, prix par million → coût mensuel ; message : les agents multiplient les appels.
6. **Gestion du changement** — communication, formation, ambassadeurs, rétroaction, rôles qui évoluent.
7. **QCM 10** (`n={10}`) — piège : « on peut passer directement du prototype à la production si la démo est réussie ».

**M10 — Mesure de performance (≈ 20 min)**
8. Diviseur `Section n={10}`.
9. **4 familles de KPI** — qualité (exactitude, taux d'hallucination), efficacité (temps, taux d'automatisation), adoption/satisfaction (CSAT), coûts/risques (coût par tâche, incidents, escalades).
10. **Évaluer la qualité** — jeux de test « dorés », LLM-juge, évaluation humaine ; outils RAGAS, DeepEval, promptfoo.
11. **Monitoring** — traces, LangSmith, Langfuse, Arize Phoenix, OpenTelemetry GenAI ; ce qu'on journalise.
12. **Tableau de bord simulé** — KPI animés (CountUp, barres `A.grow`), une alerte.
13. **Amélioration continue** — boucle mesurer → analyser → ajuster → re-tester.
14. **QCM 11** (`n={11}`) — piège : « le taux d'automatisation suffit pour juger un agent ».

**Clôture (`mod={0}`)**
15. **Votre feuille de route 90 jours** — 0–30 j (cadrer, 1 quick win, gouvernance), 31–60 j (prototype + pilote), 61–90 j (mesure, décision, 2ᵉ cas) ; jalons animés.
16. **Synthèse des 2 jours** (`kind="synthese"`).
17. **Ressources** — Anthropic « Building effective agents », docs MCP, OWASP LLM Top 10, Commission d'accès à l'information du Québec (Loi 25), cours/frameworks.
18. **Merci !** — `Portrait`, logos, invitation à remplir l'évaluation Technologia, questions.

## 9. Avant de rendre

- [ ] `node .ia134-build/build.mjs check .ia134-build/<fichier>.tsx` → OK.
- [ ] Nombre de notes = nombre de pages ; chaque note 120–250 mots au format §6.
- [ ] Aucun texte sous y = 975, aucun bloc à hauteur fixe trop petit ; tout est dans x 100–1820.
- [ ] Pas de `A.*` + `b.*` sur le même élément ; pas de `transform`/`opacity` inline sur un élément animé.
- [ ] Préfixes respectés partout (pages, composants, ids, classes CSS).

## 10. Contrôle visuel (obligatoire après le `check` vert)

Le serveur de dev tourne déjà sur http://localhost:5173 (ne le lancez pas, ne l'arrêtez pas).

1. `node .ia134-build/build.mjs preview <fichier>.tsx` → crée un deck d'aperçu temporaire `slides/ia134-pv-<clé>/` et affiche la commande de capture.
2. Attendez ~3 s, puis lancez la commande affichée, du type :
   `cd /c/Users/ASUS/AppData/Local/Temp/ia134pw && node shot.mjs ia134-pv-<clé> pv<clé> ./<clé> 1-<N>`
   Elle enregistre `p001.jpg…` (tous les beats révélés) et signale `OUT` (hors canevas), `VOVER` (débordement vertical d'une boîte à hauteur fixe), `CLIP` (texte coupé).
3. **Regardez chaque PNG** (outil Read sur `C:/Users/ASUS/AppData/Local/Temp/ia134pw/<clé>/pNNN.jpg`) : chevauchements, textes trop proches, déséquilibres, zones vides, lisibilité. Corrigez, relancez `preview` puis la capture jusqu'à ce que tout soit propre.
4. **À la fin, supprimez l'aperçu** : `node .ia134-build/build.mjs unpreview <fichier>.tsx` (obligatoire).

Note `Code` : il est en `white-space: pre` — mettez les sauts de ligne avec `{'\n'}` ou un `<div>` par ligne.
