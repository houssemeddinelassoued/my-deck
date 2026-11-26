// Guide du participant · IA135 « Automatisation des tâches avec l’IA » (Technologia, 2 jours, distanciel).
//   node .ata-labs/guide.mjs
//     → labs/automatisation-taches-ia/IA135-Guide-participant.pdf
//     → slides/automatisation-taches-ia/assets/guide-ia135.pdf (bouton « Labs » du deck : relancez node .ata-build/build.mjs)
//     + .ata-labs/html/guide.html (source imprimée)
// Contenu aligné sur le deck (.ata-build) : préparation des comptes, carnet de bord, mémos des 10 modules,
// exercices et ateliers pas à pas (Make + Gemini, offres gratuites), données fictives, modèles à remplir.
// Styles repris du guide IA114 (.eth-labs/guide.mjs). Impression : Chrome via playwright-core.
import path from 'node:path';
import {
  ANNEE, ARR, BOX, DECK, DEMANDES, EMAIL, FAQ, K, LINKEDIN, MSG6, NODE, P, PILL, PROMPT_ATELIER2, PROMPT_CLASS, QUESTIONS_C,
  SORTIE, TOOLS, blank, logo, portrait, printPdf,
} from './commun.mjs';

// ─── Corps du guide ──────────────────────────────────────────────────────────
const body = `
<section class="cover">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <img src="${logo}" alt="Technologia" style="height:34pt;mix-blend-mode:multiply">
    <span class="tag">Formation IA135 · 2 jours</span>
  </div>
  <div class="hero" style="display:flex;align-items:center;justify-content:center;background:#F4F7F9;border-radius:10pt">
    <div class="flow" style="gap:10pt">
      ${NODE('#1F78C1', '✉', 'Demande')}${ARR}${NODE('#6B57C9', '✦', 'Étape IA')}${ARR}${NODE('#22A6B3', '▤', 'Registre')}${ARR}${NODE('#E8A600', '⚑', 'Alerte')}${ARR}${NODE('#3A9F45', '✓', 'Temps gagné')}
    </div>
  </div>
  <div class="band">
    <div class="eyebrow">Formation IA135 · Intelligence artificielle · classe virtuelle</div>
    <h1>Automatisation des tâches<br>avec l’IA</h1>
    <div class="sub">Guide du participant : la préparation de votre poste, votre carnet de bord, les repères de chaque module, les exercices et ateliers pas à pas, les données fictives et les modèles à remplir.</div>
  </div>
  <div class="meta">
    <div class="card b"><h4>Format</h4>Deux jours en classe virtuelle (Teams ou Zoom). Exercices et ateliers <b>individuels</b>, chacun sur son poste.</div>
    <div class="card y"><h4>Outils gratuits</h4>Make, un compte Google, une clé Gemini (Google AI Studio), un assistant d’IA : Copilot, Gemini ou ChatGPT.</div>
    <div class="card g"><h4>Vos livrables</h4>Une tâche analysée, sa fiche de conception, un workflow avec IA testé, son gain net et sa documentation.</div>
  </div>
  <div class="foot"><span>Formateur : Houssem Eddine Lassoued · Technologia</span><span class="fict">Toutes les entreprises, personnes et données des exemples sont fictives.</span></div>
</section>

<section class="np">
  <h2>Sommaire</h2>
  <ol class="toc">
    <li>Avant la formation : préparer votre poste</li><li>Le programme des deux jours</li><li>Votre carnet de bord</li>
    <li>Module 1 · Introduction à l’automatisation</li><li>Module 2 · Identifier les processus répétitifs</li><li>Module 3 · Les outils d’automatisation</li>
    <li>Module 4 · RPA, les robots logiciels</li><li>Module 5 · Automatiser avec l’IA</li><li>Module 6 · Atelier 1 · Un premier flux</li>
    <li>Module 7 · Méthodologie de conception</li><li>Module 8 · Construire un workflow (atelier 2)</li><li>Module 9 · Atelier 3 · Un scénario complet</li>
    <li>Module 10 · Tester, optimiser, déployer</li><li>Votre plan d’action</li><li>Vocabulaire, dépannage et ressources</li>
  </ol>

  <h2 style="margin-top:14pt"><span class="n">1</span>Avant la formation : préparer votre poste</h2>
  <p>Comptez 20 minutes. Tout est gratuit. Si un compte bloque, signalez-le au formateur avant le jour 1.</p>
  <ul class="check">
    <li><b>Un navigateur récent</b> (Chrome, Edge ou Firefox) et, idéalement, <b>deux écrans</b> : la classe virtuelle sur l’un, vos outils sur l’autre.</li>
    <li><b>Un compte Google</b> (Gmail, Google Sheets). Un compte personnel convient : nous travaillerons avec des données fictives.</li>
    <li><b>Make</b> : sur <b>make.com</b>, ${K('Get started free')}, inscription avec votre compte Google (offre gratuite).</li>
    <li><b>Une clé d’API Gemini</b> : sur <b>aistudio.google.com</b>, ${K('Get API key')} › ${K('Create API key')}. Copiez-la dans un fichier personnel.</li>
    <li><b>Un assistant d’IA gratuit</b> ouvert dans un onglet : Copilot, Gemini ou ChatGPT.</li>
    <li><b>Un classeur Google Sheets</b> nommé « Demandes IA135 », avec en ligne 1 : Date · Nom · Courriel · Message · Catégorie · Priorité · Résumé.</li>
    <li><i>Bonus, sous Windows 10 ou 11</i> : Power Automate Desktop (Microsoft Store, gratuit) pour suivre la démonstration du module 4.</li>
  </ul>
  ${BOX('warn', 'Sécurité et données', `<p style="margin:0 0 4pt">Votre clé d’API donne accès à votre compte Gemini : ne la collez <b>jamais</b> dans le Chat, un courriel ou une capture partagée.</p><p style="margin:0">Les offres gratuites d’IA peuvent réutiliser ce que vous leur envoyez pour améliorer leurs produits. Pendant la formation : <b>uniquement des données fictives</b>, aucune donnée de client, d’employé ou de patient.</p>`)}
  ${BOX('tip', 'Pensez-y d’ici là', 'Une tâche répétitive de votre travail que vous aimeriez ne plus faire à la main : courriels à trier, rapport du lundi, relances, saisie de formulaires, tableau de suivi à tenir à jour… Elle sera le fil conducteur de vos deux jours.')}
</section>

<section class="np">
  <h2><span class="n">2</span>Le programme des deux jours</h2>
  <div class="grid2">
    <table class="tight"><tr><th colspan="2">Jour 1 · Repérer et comprendre</th></tr>
      <tr><td class="k">9:00</td><td>Accueil, objectifs, votre tâche réelle</td></tr>
      <tr><td class="k">9:30</td><td>01 · Introduction à l’automatisation</td></tr>
      <tr><td class="k">10:15</td><td>02 · Identifier les processus répétitifs (pause vers 10 h 40)</td></tr>
      <tr><td class="k">12:00</td><td>Dîner</td></tr>
      <tr><td class="k">13:00</td><td>03 · Les outils d’automatisation</td></tr>
      <tr><td class="k">13:50</td><td>04 · RPA, les robots logiciels</td></tr>
      <tr><td class="k">14:40</td><td>Pause</td></tr>
      <tr><td class="k">14:55</td><td>05 · Automatiser avec l’IA</td></tr>
      <tr><td class="k">15:50</td><td>Bilan du jour 1 · fin à 16 h</td></tr>
    </table>
    <table class="tight"><tr><th colspan="2">Jour 2 · Construire et déployer</th></tr>
      <tr><td class="k">9:00</td><td>Reprise et quiz éclair</td></tr>
      <tr><td class="k">9:15</td><td>06 · Atelier 1 · Un premier flux</td></tr>
      <tr><td class="k">10:15</td><td>Pause</td></tr>
      <tr><td class="k">10:30</td><td>07 · Méthodologie de conception</td></tr>
      <tr><td class="k">11:10</td><td>08 · Construire un workflow automatisé</td></tr>
      <tr><td class="k">12:00</td><td>Dîner, puis atelier 2 (guidé)</td></tr>
      <tr><td class="k">13:30</td><td>09 · Atelier 3 · Un scénario complet</td></tr>
      <tr><td class="k">14:45</td><td>Pause</td></tr>
      <tr><td class="k">15:00</td><td>10 · Tester, optimiser, déployer</td></tr>
      <tr><td class="k">15:45</td><td>Plan d’action et évaluation · fin à 16 h</td></tr>
    </table>
  </div>
  <h3>Ce que vous saurez faire</h3>
  <ul>
    <li><b>Identifier</b> les processus automatisables à partir d’une analyse structurée (SIPOC, cartographie).</li>
    <li><b>Concevoir</b> des workflows clairs avec déclencheurs, actions et gestion des données.</li>
    <li><b>Mettre en œuvre</b> des automatisations RPA pour des tâches répétitives (courriels, rapports, synchronisation).</li>
    <li><b>Intégrer</b> des capacités d’IA (classification, extraction, résumé) dans des processus métiers.</li>
    <li><b>Tester, optimiser et déployer</b> des automatisations en mesurant les gains de productivité.</li>
  </ul>
  ${BOX('note', 'Classe virtuelle', 'Caméra si possible, micro coupé hors échanges. Vous votez et répondez à voix haute ; le Chat sert à partager les textes à copier et vos captures. Les restitutions se font par deux ou trois volontaires, en partage d’écran.')}

  <div class="keep">
  <h2 style="margin-top:14pt"><span class="n">3</span>Votre carnet de bord</h2>
  <p>Un document personnel (Word, Google Docs, OneNote) qui suit <b>une tâche réelle de votre travail</b> du constat au déploiement. Cinq rubriques, complétées au fil des modules :</p>
  <table class="tight">
    <tr><th style="width:8%">#</th><th style="width:32%">Rubrique</th><th style="width:20%">Quand</th><th>Contenu</th></tr>
    <tr><td class="k">1</td><td>Mes tâches répétitives</td><td>Module 2 · ex. 1</td><td>5 tâches, fréquence, durée, outils</td></tr>
    <tr><td class="k">2</td><td>Ma tâche choisie</td><td>Module 2 · ex. 2</td><td>Notes sur 4 critères, score sur 20, gain estimé</td></tr>
    <tr><td class="k">3</td><td>Mon SIPOC et mon prompt</td><td>Modules 2 et 5</td><td>5 colonnes ; prompt de workflow testé</td></tr>
    <tr><td class="k">4</td><td>Ma fiche de conception</td><td>Module 7 · ex. 4</td><td>8 rubriques, diagramme, données</td></tr>
    <tr><td class="k">5</td><td>Mes tests et mon gain</td><td>Module 10 · ex. 5</td><td>Jeu de test, gain net, fiche d’exploitation</td></tr>
  </table>
  ${BOX('tip', 'Données sensibles ?', 'Gardez la vraie tâche pour l’analyse et la conception, mais construisez et testez avec des données inventées.')}
  </div>
</section>

<section>
  <h2 style="margin-top:16pt"><span class="n">4</span>Module 1 · Introduction à l’automatisation</h2>
  <p class="lede">Automatiser, c’est confier une suite d’actions à un système : un événement déclenche des actions selon des règles, sans intervention.</p>
  <div class="flow">${NODE('#1F78C1', '⚡', 'Quand…')}${ARR}${NODE('#E8A600', '⑂', 'Si…')}${ARR}${NODE('#3A9F45', '➤', 'Alors…')}</div>
  <p class="small muted">Ex. : <b>quand</b> un courriel arrive, <b>si</b> l’objet contient « facture », <b>alors</b> enregistrer la pièce jointe et prévenir la comptable. Une automatisation est répétable, fiable (si les règles et les données sont bonnes) et traçable.</p>
  <h3>Six niveaux d’automatisation</h3>
  <table class="tight">
    <tr><th>Niveau</th><th>Exemples</th><th>À retenir</th></tr>
    <tr><td class="k">1 · Règles et formules</td><td>Règle Outlook, formule Excel, filtre Gmail</td><td>Vous en avez déjà</td></tr>
    <tr><td class="k">2 · Macros et scripts</td><td>Macro Excel, Apps Script</td><td>Du code, souvent fragile</td></tr>
    <tr><td class="k">3 · RPA</td><td>Power Automate Desktop, UiPath</td><td>Un robot agit à l’écran</td></tr>
    <tr><td class="k">4 · Workflows sans code</td><td>Make, Zapier, n8n, Power Automate</td><td>Relient les applications</td></tr>
    <tr><td class="k">5 · Workflows + IA</td><td>Une étape IA classe, extrait, résume</td><td>Le cœur de la formation</td></tr>
    <tr><td class="k">6 · Agents IA</td><td>L’IA choisit ses étapes</td><td>Puissant, moins prévisible</td></tr>
  </table>
  <h3>Classique ou avec IA ?</h3>
  <table class="tight">
    <tr><th></th><th>Classique (règles)</th><th>Avec IA</th></tr>
    <tr><td class="k">Entrées</td><td>Structurées : formulaire, tableau</td><td>Non structurées : courriel libre, PDF, image</td></tr>
    <tr><td class="k">Logique</td><td>Règles explicites</td><td>Jugement appris</td></tr>
    <tr><td class="k">Résultat</td><td>Toujours le même</td><td>Très souvent juste, pas toujours</td></tr>
    <tr><td class="k">Quand ça rate</td><td>S’arrête ou signale une erreur</td><td>Se trompe… avec assurance</td></tr>
    <tr><td class="k">Contrôle</td><td>Tests une fois pour toutes</td><td>Tests, échantillonnage, validation humaine</td></tr>
  </table>
  ${BOX('ok', 'Le réflexe', 'On choisit toujours <b>le niveau le plus simple</b> qui fait le travail. L’IA seulement pour l’étape qui demande de lire et de comprendre.')}
</section>

<section class="np">
  <h2><span class="n">5</span>Module 2 · Identifier les processus répétitifs</h2>
  <p class="lede">Comprendre, simplifier, <b>puis</b> automatiser. Automatiser un processus confus, c’est produire des erreurs plus vite.</p>
  <h3>Le SIPOC : un processus sur une page</h3>
  <table class="tight">
    <tr><th>S · Fournisseurs</th><th>I · Entrées</th><th>P · Étapes (4 à 7)</th><th>O · Sorties</th><th>C · Clients</th></tr>
    <tr><td>Qui fournit ce qui entre ?</td><td>Qu’est-ce qui entre ?</td><td>Quelles grandes étapes, avec des verbes ?</td><td>Qu’est-ce qui sort ?</td><td>Qui le reçoit ?</td></tr>
  </table>
  <p class="small muted">Remplissez dans l’ordre <b>P, O, C, I, S</b> : on part de ce qu’on fait. La <b>cartographie</b> détaille ensuite les étapes, en couloirs (un par acteur) : chaque changement de couloir est un passage de relais… et souvent une attente.</p>
  <h3>Les six voleurs de temps</h3>
  <p>Ressaisir · copier-coller · chercher · relancer · mettre en forme · trier. Les repérer, c’est trouver vos tâches automatisables.</p>

  <div class="lab keep">
    <h3>Exercice 1 · Analyser son quotidien (10 min)</h3>
    <p>Pensez à votre dernière semaine, jour par jour. Listez au moins cinq tâches répétitives.</p>
    <table><tr><th style="width:40%">Tâche (verbe + objet)</th><th>Fréquence / semaine</th><th>Durée d’une fois</th><th>Outils</th></tr>${blank(4, 5)}</table>
  </div>
</section>

<section class="np">
  <div class="lab">
    <h3 style="margin-top:0">Exercice 2 · Choisir sa tâche et la décrire en SIPOC (25 min)</h3>
    <p><b>1.</b> Notez chaque tâche de 1 à 5 sur les quatre critères :</p>
    <table class="tight">
      <tr><th>Critère</th><th>1</th><th>5</th></tr>
      <tr><td class="k">Fréquence</td><td>Une fois par an</td><td>Plusieurs fois par jour</td></tr>
      <tr><td class="k">Volume</td><td>Un ou deux cas</td><td>Des dizaines ou des centaines</td></tr>
      <tr><td class="k">Règles claires</td><td>Jugement au cas par cas</td><td>Toujours la même logique</td></tr>
      <tr><td class="k">Outils utilisés</td><td>Logiciel fermé, papier</td><td>Applications en ligne, connecteurs</td></tr>
    </table>
    <table><tr><th style="width:36%">Tâche</th><th>Fréq.</th><th>Vol.</th><th>Règles</th><th>Outils</th><th>Total /20</th></tr>${blank(6, 5)}</table>
    <p class="small"><b>Verdict :</b> 16 et plus = excellent candidat · 12 à 15 = bon candidat · 8 à 11 = à simplifier d’abord · moins de 8 = à laisser. Règles ≤ 2 → prévoir une <b>étape IA</b> ; outils ≤ 2 → penser au <b>RPA</b>.</p>
    <p><b>2.</b> Le SIPOC de la tâche retenue :</p>
    <table><tr><th>S · Fournisseurs</th><th>I · Entrées</th><th>P · Étapes</th><th>O · Sorties</th><th>C · Clients</th></tr>${blank(5, 1, 'blank2')}${blank(5, 1, 'blank2')}</table>
    <p><b>3.</b> Le gain estimé :</p>
    ${BOX('note', 'Formule', 'Heures par an = durée (min) × fois par semaine × part automatisée × 46 semaines ÷ 60. Rentabilisé après = temps de mise en place ÷ heures gagnées par semaine.')}
    <p>Mon gain estimé : ________ h par an · rentabilisé après ________ semaines.</p>
  </div>
</section>

<section class="np">
  <h2><span class="n">6</span>Module 3 · Les outils d’automatisation</h2>
  <div class="grid2">
    <div class="card v"><h4>Plateformes sans code</h4>Make, Zapier, n8n : relient des applications en ligne par leurs connecteurs (API).</div>
    <div class="card b"><h4>Automatisation des suites</h4>Power Automate (Microsoft 365), automatisations de Google Workspace.</div>
    <div class="card t"><h4>RPA</h4>Power Automate Desktop, UiPath : un robot agit à l’écran, même sans connecteur.</div>
    <div class="card c"><h4>Assistants et agents IA</h4>Copilot, Gemini, ChatGPT : comprennent, rédigent, classent.</div>
  </div>
  <h3>Offres gratuites (vérifiées en novembre 2026)</h3>
  <table class="tight">
    <tr><th>Outil</th><th>Offre gratuite</th><th>À savoir</th></tr>
    <tr><td class="k">Make</td><td>1 000 crédits par mois, 2 scénarios actifs, exécution au plus toutes les 15 min</td><td>Chaque module exécuté consomme des crédits</td></tr>
    <tr><td class="k">Zapier</td><td>100 tâches par mois, Zaps à 2 étapes</td><td>Multi-étapes et conditions : offre payante</td></tr>
    <tr><td class="k">n8n</td><td>Gratuit en auto-hébergement (Community Edition)</td><td>Version infonuagique payante après un essai</td></tr>
    <tr><td class="k">Power Automate</td><td>Inclus dans la plupart des licences Microsoft 365</td><td>Connecteurs Premium et AI Builder payants</td></tr>
    <tr><td class="k">PA Desktop</td><td>Gratuit sous Windows 10 et 11, mode assisté</td><td>Robots planifiés : licence payante</td></tr>
    <tr><td class="k">Gemini (AI Studio)</td><td>Clé d’API gratuite, quotas limités</td><td>Données réutilisables par Google : fictives seulement</td></tr>
  </table>
  <h3>Mêmes idées, mots différents</h3>
  <table class="tight">
    <tr><th>Concept</th><th>Make</th><th>Zapier</th><th>n8n</th><th>Power Automate</th></tr>
    <tr><td class="k">L’automatisation</td><td>Scénario</td><td>Zap</td><td>Workflow</td><td>Flux</td></tr>
    <tr><td class="k">Ce qui démarre</td><td>Module déclencheur</td><td>Trigger</td><td>Nœud Trigger</td><td>Déclencheur</td></tr>
    <tr><td class="k">Une étape</td><td>Module</td><td>Action</td><td>Nœud</td><td>Action</td></tr>
    <tr><td class="k">Les conditions</td><td>Filtre, routeur</td><td>Filter, Paths</td><td>IF, Switch</td><td>Condition, Switch</td></tr>
    <tr><td class="k">L’historique</td><td>History</td><td>Zap history</td><td>Executions</td><td>Historique d’exécution</td></tr>
  </table>
  ${BOX('tip', 'Quel outil ?', 'Logiciel sans connecteur → RPA · tout dans Microsoft 365 avec licence → Power Automate · équipe technique pour héberger → n8n · un déclencheur et une action → Zapier · plusieurs étapes, conditions, IA, sans budget → Make. Et toujours : ce que votre organisation autorise.')}
</section>

<section class="np">
  <h2><span class="n">7</span>Module 4 · RPA, les robots logiciels</h2>
  <p class="lede">Un robot logiciel <b>repère</b> les éléments de l’écran (son « sélecteur »), <b>agit</b> (clique, tape, copie) et <b>enchaîne</b> (boucles, conditions, journal).</p>
  <div class="grid2">
    <div class="card t"><h4>RPA · par l’écran</h4>Fonctionne avec n’importe quel logiciel, même ancien. Plus lent, et fragile si l’interface change.</div>
    <div class="card v"><h4>Connecteur · par l’API</h4>Rapide et robuste. Seulement si l’application propose une API. <b>Connecteur d’abord, RPA en plan B.</b></div>
  </div>
  <h3>Les six briques de tout robot</h3>
  <p>Variables · boucles (« pour chaque ») · conditions · sélecteurs · gestion des erreurs · journal.</p>
  <h3>Trois cas d’usage</h3>
  <ul>
    <li><b>Extraction de données de courriels</b> : lire les demandes, saisir dans un logiciel sans API.</li>
    <li><b>Synchronisation entre fichiers</b> : renommer, ranger, mettre à jour un tableau de suivi.</li>
    <li><b>Automatisation des rapports</b> : exporter, mettre en forme, envoyer chaque lundi.</li>
  </ul>
  <h3>Pannes fréquentes et parades</h3>
  <table class="tight">
    <tr><th>Risque</th><th>Parade</th></tr>
    <tr><td>L’interface change</td><td>Sélecteurs robustes, tests après chaque mise à jour</td></tr>
    <tr><td>Une fenêtre inattendue</td><td>Prévoir le cas : fermer, réessayer ou s’arrêter proprement</td></tr>
    <tr><td>Le logiciel est lent</td><td>Attendre qu’un élément apparaisse, pas un délai fixe</td></tr>
    <tr><td>Une donnée imprévue</td><td>Vérifier avant de saisir, mettre de côté les cas douteux</td></tr>
    <tr><td>Personne ne sait ce qu’il a fait</td><td>Un journal à chaque exécution, un responsable nommé</td></tr>
  </table>
  ${BOX('note', 'Bonus · Power Automate Desktop', 'Robot de la démonstration : obtenir les fichiers du dossier « À traiter » › pour chaque fichier : renommer avec la date, déplacer vers Archives\\AAAA-MM, écrire une ligne dans journal.xlsx › afficher le nombre de fichiers traités.')}
</section>

<section class="np">
  <h2><span class="n v">8</span>Module 5 · Automatiser avec l’IA</h2>
  <p class="lede">Dans un workflow, l’IA fait <b>une seule opération précise</b> et rend un résultat exploitable : du texte libre, elle fabrique des champs que les règles savent router.</p>
  <p><b>Six opérations :</b> classer · extraire · résumer · rédiger · traduire · analyser le ton. <b>Documents :</b> l’OCR lit l’image, l’IA comprend le texte, l’humain vérifie ce qui est déduit (une échéance calculée, une année supposée).</p>
  <h3>Réponses automatiques : trois niveaux</h3>
  <table class="tight">
    <tr><th>Niveau</th><th>Risque</th><th>Quand</th></tr>
    <tr><td class="k">1 · Accusé de réception</td><td>Faible</td><td>Toujours possible, pas besoin d’IA</td></tr>
    <tr><td class="k">2 · Brouillon IA relu</td><td>Maîtrisé</td><td>Le point de départ recommandé</td></tr>
    <tr><td class="k">3 · Envoi automatique</td><td>Élevé</td><td>Questions simples, réponses validées, seuil et suivi</td></tr>
  </table>
  <p class="small">Ne part jamais seul : un engagement (prix, délai, remboursement), un sujet juridique ou médical, un client irrité.</p>
  <h3>Assistant, workflow avec IA, agent</h3>
  <p>Qui décide des étapes ? <b>Vous</b> (assistant) · <b>vous, à l’avance</b> (workflow avec IA) · <b>l’IA elle-même</b> (agent : agents Copilot, Gems Gemini, agents ChatGPT, agents Make). Pour un processus répétitif, le workflow avec IA reste le plus contrôlable.</p>
  <h3>Le prompt de workflow</h3>
  <p>Écrit une fois, exécuté mille fois : un rôle · une seule tâche · une <b>liste fermée</b> de choix · un <b>format imposé</b> (JSON) · que faire en cas de doute · la donnée en variable.</p>

  <div class="lab keep">
    <h3>Exercice 3 · Classer six messages avec votre IA (15 min)</h3>
    ${P(PROMPT_CLASS)}
    <ol class="small">${MSG6.map((m) => `<li>« ${m} »</li>`).join('')}</ol>
    <table><tr><th style="width:6%">#</th><th>Catégorie</th><th>Priorité</th><th>Confiance</th><th>Juste ?</th></tr>${MSG6.map((_, i) => `<tr><td class="k">${i + 1}</td><td></td><td></td><td></td><td></td></tr>`).join('')}</table>
    <p class="small">Puis améliorez le prompt (catégorie mieux définie, exemple ajouté) et retestez le message le plus difficile. Notez la version finale dans votre carnet.</p>
  </div>
</section>

<section class="np">
  <h2><span class="n y">9</span>Module 6 · Atelier 1 · Un premier flux (25 min)</h2>
  <p class="lede">Une nouvelle ligne dans le classeur « Demandes IA135 » déclenche un courriel qui la résume.</p>
  ${TOOLS(['make', 'googlesheets', 'gmail'])}
  <div class="flow">${NODE('#34A853', '▤', 'Sheets<br>Watch New Rows')}${ARR}${NODE('#EA4335', '✉', 'Gmail<br>Send an email')}</div>
  <ol class="steps">
    <li>${K('Scenarios')} › ${K('Create a new scenario')}, puis le grand ${K('+')}.</li>
    <li><b>Google Sheets</b> › ${K('Watch New Rows')}. Créez la connexion avec votre compte Google.</li>
    <li>Classeur « Demandes IA135 », la feuille, <i>Table contains headers</i> : Yes, limite : 5.</li>
    <li><i>Choose where to start</i> : <b>From now on</b>.</li>
    <li>${K('+')} à droite du module › <b>Gmail</b> › ${K('Send an email')}. Destinataire : votre adresse.</li>
    <li>Objet et contenu : cliquez dans le champ, puis sur les pastilles ${PILL('Nom')}, ${PILL('Message')}…</li>
    <li>${K('Save')}, puis ${K('Run once')}.</li>
    <li>Ajoutez une ligne fictive dans le classeur. Cliquez la bulle sur chaque module pour voir les données.</li>
  </ol>
  ${BOX('warn', 'Gmail refuse la connexion ?', 'Plan B : remplacez Gmail par <b>Google Sheets › Add a Row</b> dans une feuille « Journal ».')}
  <h3>Critères de réussite</h3>
  <ul class="check"><li>Le déclencheur voit la nouvelle ligne</li><li>Le courriel contient les vraies valeurs</li><li>L’historique montre une exécution réussie</li><li>La planification reste désactivée</li></ul>
  <h3>Les six pièges du premier scénario</h3>
  <table class="tight">
    <tr><th style="width:38%">Symptôme</th><th>Cause et solution</th></tr>
    <tr><td>Rien ne se passe après Run once</td><td>Point de départ « From now on » : ajoutez une ligne <b>après</b> avoir cliqué Run once</td></tr>
    <tr><td>Le courriel arrive vide</td><td>Texte tapé au lieu des pastilles : refaites le mapping</td></tr>
    <tr><td>Colonnes nommées A, B, C</td><td>« Table contains headers » à No, ou ligne 1 vide</td></tr>
    <tr><td>Erreur de connexion</td><td>Recréez-la, ou passez au plan B</td></tr>
    <tr><td>Les anciennes lignes reviennent</td><td>Point de départ « All » : remettez « From now on »</td></tr>
    <tr><td>Les crédits fondent</td><td>Planification activée trop tôt : laissez-la désactivée en test</td></tr>
  </table>
</section>

<section class="np">
  <h2><span class="n">10</span>Module 7 · Méthodologie de conception</h2>
  <p class="lede">Dix minutes de conception évitent deux heures de clics.</p>
  ${BOX('ok', 'Un besoin clair', '<b>Pour qui</b> · <b>quand</b> (déclencheur) · <b>je veux</b> (résultat) · <b>afin de</b> (bénéfice mesurable) · <b>sauf</b> (exceptions). Test : une personne qui ne connaît pas la tâche comprend quoi, quand, pourquoi et comment on saura que ça marche.')}
  <p><b>Les étapes :</b> un verbe, un outil, une règle, une exception. <b>Le diagramme :</b> le code couleur ci-dessous. <b>Les données :</b> source, format (dates en AAAA-MM-JJ), obligatoire, sensible.</p>
  <p class="legend"><span><b style="background:#1F78C1"></b>Déclencheur</span><span><b style="background:#22A6B3"></b>Données</span><span><b style="background:#E8A600"></b>Condition</span><span><b style="background:#6B57C9"></b>Étape IA</span><span><b style="background:#3A9F45"></b>Action</span><span><b style="background:#E0573D"></b>Validation humaine</span><span><b style="background:#77818A"></b>Résultat</span></p>
  <div class="lab">
    <h3>Exercice 4 · La fiche de conception de votre tâche (20 min)</h3>
    <table>
      <tr><th style="width:26%">Rubrique</th><th>Votre tâche</th></tr>
      <tr><td class="k">1 · Besoin</td><td class="blank2"></td></tr>
      <tr><td class="k">2 · Déclencheur</td><td class="blank"></td></tr>
      <tr><td class="k">3 · Étapes (verbe, outil, règle, exception)</td><td class="blank2" style="height:80pt"></td></tr>
      <tr><td class="k">4 · Diagramme</td><td class="blank2" style="height:70pt"></td></tr>
      <tr><td class="k">5 · Données (entrées, sorties, formats, sensibles)</td><td class="blank2"></td></tr>
      <tr><td class="k">6 · Étape IA (opération, prompt, seuil)</td><td class="blank2"></td></tr>
      <tr><td class="k">7 · Validation humaine</td><td class="blank"></td></tr>
      <tr><td class="k">8 · Indicateurs et responsable</td><td class="blank"></td></tr>
    </table>
  </div>
</section>

<section class="np">
  <h2><span class="n">11</span>Module 8 · Construire un workflow automatisé</h2>
  <div class="grid2">
    <div class="card b"><h4>Déclencheurs</h4><b>Événement</b> (nouvelle ligne, courriel, fichier ; par vérification ou instantané par webhook) · <b>horaire</b> (chaque lundi 7 h) · <b>condition</b> (un filtre juste après le déclencheur).</div>
    <div class="card g"><h4>Actions</h4><b>Créer</b> · <b>mettre à jour</b> · <b>extraire</b> · <b>décider</b> (filtre, routeur, classification IA avec seuil).</div>
  </div>
  <p style="margin-top:8pt"><b>Le mapping</b> relie la sortie d’un module à l’entrée du suivant : la pastille ${PILL('3. categorie')} vient du module 3. Fonctions utiles : <code>formatDate(now; "YYYY-MM-DD")</code>, <code>ifempty(…; "inconnu")</code>.</p>

  <div class="lab">
    <h3>Atelier 2 · Ajouter l’IA à votre flux (30 min)</h3>
    <div class="flow">${NODE('#34A853', '▤', '1 · Watch<br>New Rows')}${ARR}${NODE('#6B57C9', '✦', '2 · Gemini<br>Generate')}${ARR}${NODE('#22A6B3', '{ }', '3 · Parse<br>JSON')}${ARR}${NODE('#34A853', '▤', '4 · Update<br>a Row')}${ARR}${NODE('#EA4335', '✉', '5 · Gmail<br>(filtre)')}</div>
    <ol class="steps">
      <li>Clonez le scénario de l’atelier 1. Clic droit sur le lien › ${K('Add a module')} › <b>Google Gemini AI</b> › ${K('Generate a response')}.</li>
      <li>${K('Create a connection')} : collez votre clé d’API (dans Make, jamais dans le Chat).</li>
      <li>Collez le prompt ci-dessous ; la fin est la pastille Message du module 1.</li>
      <li>${K('Run once')} + une ligne de test : la bulle montre le JSON reçu.</li>
      <li><b>JSON</b> › ${K('Parse JSON')} › ${K('Add')} › ${K('Generate')} : collez l’exemple de JSON.</li>
      <li><b>Google Sheets</b> › ${K('Update a Row')} : Row number = ${PILL('1. Row number')}.</li>
      <li>Mappez Catégorie, Priorité, Résumé avec les pastilles du module 3.</li>
      <li>Clic sur le lien avant Gmail › ${K('Set up a filter')} : <i>priorite</i> égal à <b>haute</b>.</li>
    </ol>
    ${BOX('warn', 'Parse JSON échoue ?', 'L’IA a sans doute entouré sa réponse de balises <code>```json</code>. Renforcez le prompt (« sans balises de code ») ou retirez-les avec la fonction <code>replace()</code>.')}
    ${P(PROMPT_ATELIER2, 'Prompt de l’étape IA')}
    ${P('{"categorie": "livraison", "priorite": "haute", "resume": "Colis non livré", "confiance": 0.9}', 'Exemple de JSON pour Parse JSON')}
    <p><b>Trois demandes de test</b> (une ligne chacune dans le classeur) : ① « Mon colis devait arriver mardi, toujours rien, c’est urgent pour un anniversaire samedi. » ② « Faites-vous la livraison à Rimouski ? » ③ « J’ai une idée pour améliorer votre site, on peut en parler ? »</p>
  </div>
</section>

<section class="np">
  <h2><span class="n y">12</span>Module 9 · Atelier 3 · Un scénario complet (50 min)</h2>
  <p class="lede">Au choix selon votre niveau, ou votre propre tâche si votre fiche est prête. Testez sur au moins trois cas : normal, limite, ambigu.</p>
  <div class="card b keep" style="margin-bottom:8pt"><h4>A · Suivi des demandes clients <span class="tag">intermédiaire</span></h4>
    Extraction → classification IA → enregistrement → notification. Modules : Google Sheets (ou Forms) › Watch · Gemini › Generate a response · JSON › Parse JSON · Sheets › Update a Row (+ n° de dossier DEM-date-ligne) · Router · Gmail › Send an email. Bonus : accusé de réception au client.</div>
  <div class="card t keep" style="margin-bottom:8pt"><h4>B · Rapport hebdomadaire automatique <span class="tag">débutant</span></h4>
    Chaque lundi 7 h → Sheets › Search Rows (7 derniers jours) → Tools › Text aggregator → Gemini (synthèse, tendances, 3 points d’attention) → Gmail. Les <b>chiffres</b> se calculent dans Make, pas par l’IA.</div>
  <div class="card v keep" style="margin-bottom:8pt"><h4>C · Réponses automatiques intelligentes <span class="tag">avancé</span></h4>
    Question reçue → Gemini rédige à partir de la FAQ (ci-dessous) → Gmail › <b>Create a draft</b> (validation humaine) → journal. Règle du prompt : « Réponds uniquement à partir de la FAQ. Si la réponse n’y est pas, écris HORS_FAQ. Ne promets ni prix, ni date, ni remboursement. »</div>
  <h3>Données fictives · scénarios A et B (boutique de cosmétiques en ligne)</h3>
  <table class="tight"><tr><th>Date</th><th>Nom</th><th>Courriel</th><th>Message</th></tr>${DEMANDES.map((d) => `<tr><td style="white-space:nowrap">${d[0]}</td><td>${d[1]}</td><td class="small">${d[2]}</td><td>${d[3]}</td></tr>`).join('')}</table>
</section>

<section class="np">
  <h3 style="margin-top:0">FAQ fictive · scénario C (centre de formation)</h3>
  <table class="tight"><tr><th style="width:38%">Question</th><th>Réponse validée</th></tr>${FAQ.map(([q, r]) => `<tr><td class="k" style="white-space:normal">${q}</td><td>${r}</td></tr>`).join('')}</table>
  <p><b>Questions de test :</b></p>
  <ol>${QUESTIONS_C.map((q) => `<li>« ${q} »</li>`).join('')}</ol>
  <p class="small muted">Les questions 3 et 5 ne sont pas couvertes par la FAQ : votre scénario doit répondre HORS_FAQ.</p>
  <h3>Critères de réussite</h3>
  <ul class="check"><li>Les 4 étapes du scénario fonctionnent</li><li>L’IA est encadrée : choix fermés, JSON, seuil</li><li>Un humain intervient là où l’erreur coûte</li><li>3 cas testés, résultats notés dans le carnet</li></ul>
  <h3>Mes notes d’atelier</h3>
  <table><tr><th style="width:30%">Cas testé</th><th>Résultat attendu</th><th>Résultat obtenu</th></tr>${blank(3, 3)}</table>
  ${BOX('tip', 'Avant de partir', 'Exportez votre scénario : menu … › <b>Export Blueprint</b>. Rangez le fichier avec votre carnet.')}
</section>

<section class="np">
  <h2><span class="n">13</span>Module 10 · Tester, optimiser, déployer</h2>
  <h3>Les six erreurs les plus fréquentes</h3>
  <table class="tight">
    <tr><th>Symptôme</th><th>Cause probable</th></tr>
    <tr><td>Le scénario ne démarre jamais</td><td>Déclencheur mal réglé, planification désactivée</td></tr>
    <tr><td>Des champs vides à l’arrivée</td><td>Mapping cassé après une modification</td></tr>
    <tr><td>Des dates absurdes</td><td>Formats différents (04/12 lu comme le 12 avril)</td></tr>
    <tr><td>Des doublons</td><td>Scénario relancé sur les mêmes données</td></tr>
    <tr><td>L’étape IA plante ou dérive</td><td>JSON entouré de balises, catégorie inventée, quota atteint</td></tr>
    <tr><td>Tout s’arrête un matin</td><td>Connexion expirée, mot de passe changé, crédits épuisés</td></tr>
  </table>
  <p><b>Test unitaire</b> : un module à la fois, avec une donnée connue (clic droit › ${K('Run this module only')}). <b>Test global</b> : de bout en bout, avec les cas limites, idéalement par la personne qui fait la tâche. Pour l’IA : un <b>taux de bonnes réponses</b> sur un échantillon.</p>
  <p><b>Optimiser</b> : gestionnaires d’erreur (Ignore, Resume, Break) + alerte · filtrer tôt et espacer la planification pour économiser les crédits · ajuster le seuil de confiance · relire un échantillon chaque semaine.</p>
  <div class="lab">
    <h3>Exercice 5 · Plan de test, gain et fiche d’exploitation (15 min)</h3>
    <table><tr><th style="width:16%">Type</th><th>Cas (exemple)</th><th>Résultat attendu</th><th style="width:10%">✓ / ✗</th></tr>
      ${['Normal', 'Urgent', 'Limite', 'Invalide', 'Ambigu'].map((t) => `<tr><td class="k">${t}</td><td class="blank"></td><td class="blank"></td><td class="blank"></td></tr>`).join('')}</table>
    ${BOX('note', 'Gain net', 'Gain net = gain brut (module 2) − temps de vérification des cas « à vérifier » − maintenance. Mesurez aussi le délai, le taux d’erreur et la satisfaction.')}
    <p>Mon gain net estimé : ________ h par an (________ % du brut).</p>
  </div>
</section>

<section class="np">
  <h3 style="margin-top:0">Mettre en production : la liste de contrôle</h3>
  <ul class="check">
    <li>Outil et compte approuvés par l’organisation (pas un compte personnel)</li>
    <li>Données réelles autorisées : politique interne, Loi 25, offre d’IA adaptée</li>
    <li>Jeu de test complet passé, résultats consignés</li>
    <li>Un responsable et un suppléant nommés</li>
    <li>Alertes d’erreur actives, vers une boîte surveillée</li>
    <li>Plan B : comment refaire à la main si ça s’arrête</li>
    <li>Utilisateurs informés : ce qui change, à qui signaler un problème</li>
    <li>Deux semaines en parallèle du processus manuel avant de l’arrêter</li>
  </ul>
  <h3>La fiche d’exploitation</h3>
  <table>
    <tr><th style="width:30%">Rubrique</th><th>Mon workflow</th></tr>
    ${['But', 'Déclencheur et fréquence', 'Applications et comptes', 'Données (sensibles ?)', 'Étape IA : prompt, modèle, seuil, version', 'En cas d’erreur : symptômes, que faire, qui appeler', 'Responsable et suppléant', 'Historique des versions'].map((r, i) => `<tr><td class="k" style="white-space:normal">${i + 1} · ${r}</td><td class="blank"></td></tr>`).join('')}
  </table>
</section>

<section class="np">
  <h2><span class="n">14</span>Votre plan d’action</h2>
  <table>
    <tr><th style="width:22%">Horizon</th><th>Ce que je ferai</th><th style="width:22%">Avec qui</th></tr>
    <tr><td class="k">Cette semaine</td><td class="blank2"></td><td class="blank2"></td></tr>
    <tr><td class="k">Ce mois-ci</td><td class="blank2"></td><td class="blank2"></td></tr>
    <tr><td class="k">Ce trimestre</td><td class="blank2"></td><td class="blank2"></td></tr>
  </table>
  <p class="small muted">Pistes : faire relire votre fiche · demander quels outils et données sont autorisés · construire dans l’outil approuvé · jouer le jeu de test complet · mesurer le gain net réel dans un mois · choisir la deuxième tâche de votre liste.</p>

  <h2 style="margin-top:14pt"><span class="n">15</span>Vocabulaire, dépannage et ressources</h2>
  <table class="tight">
    <tr><th style="width:24%">Terme</th><th>Définition</th></tr>
    <tr><td class="k">API</td><td>La « porte de service » d’une application, prévue pour les programmes.</td></tr>
    <tr><td class="k">Connecteur</td><td>Module tout prêt qui sait parler à l’API d’une application.</td></tr>
    <tr><td class="k">Webhook</td><td>Adresse qu’une application appelle pour prévenir instantanément.</td></tr>
    <tr><td class="k">Mapping</td><td>Relier la sortie d’un module à l’entrée d’un autre (les pastilles).</td></tr>
    <tr><td class="k">JSON</td><td>Format texte de paires nom-valeur, lisible par les machines.</td></tr>
    <tr><td class="k">OCR</td><td>Reconnaissance des caractères dans une image ou un scan.</td></tr>
    <tr><td class="k">Routeur, filtre</td><td>Plusieurs chemins ; condition pour emprunter un chemin.</td></tr>
    <tr><td class="k">RPA</td><td>Robot logiciel qui agit à l’écran comme un humain.</td></tr>
    <tr><td class="k">Seuil de confiance</td><td>Sous ce niveau, le résultat de l’IA va à un humain.</td></tr>
    <tr><td class="k">SIPOC</td><td>Fournisseurs, entrées, étapes, sorties, clients : un processus sur une page.</td></tr>
  </table>
  <h3>Ressources</h3>
  <ul class="small">
    <li><b>Make Academy</b> · academy.make.com (cours gratuits) · <b>aide de Make</b> · help.make.com</li>
    <li><b>Power Automate Desktop</b> · learn.microsoft.com (documentation en français)</li>
    <li><b>Google AI Studio</b> · ai.google.dev (clés, modèles, conditions de l’offre gratuite)</li>
    <li><b>Zapier</b> · zapier.com/learn · <b>n8n</b> · docs.n8n.io</li>
    <li><b>Loi 25</b> · cai.gouv.qc.ca (Commission d’accès à l’information du Québec)</li>
  </ul>
  ${BOX('note', 'Après la formation', 'Supprimez votre clé d’API Gemini si vous ne l’utilisez plus (aistudio.google.com) et désactivez vos scénarios de test dans Make.')}
</section>

<section class="np">
  <h2>Contact et droits d’auteur</h2>
  <div class="row" style="align-items:center;gap:18pt;margin:10pt 0 16pt">
    <img src="${portrait}" alt="Houssem Eddine Lassoued" style="width:84pt;height:84pt;border-radius:999pt;object-fit:cover;object-position:50% 20%;box-shadow:0 0 0 3pt #fff,0 0 0 5.5pt var(--yellow)">
    <div>
      <div class="disp" style="font-size:24pt;font-weight:700;line-height:1.05">Houssem Eddine Lassoued</div>
      <div class="muted" style="font-size:11.5pt;margin-top:3pt">Auteur et formateur · Technologia</div>
    </div>
  </div>
  <div class="grid2">
    <div class="card b"><h4>Courriel</h4><a href="mailto:${EMAIL}" style="color:var(--blue);text-decoration:none;font-weight:600">${EMAIL}</a></div>
    <div class="card b"><h4>LinkedIn</h4><a href="${LINKEDIN}" style="color:var(--blue);text-decoration:none;font-weight:600">${LINKEDIN.replace('https://www.', '')}</a></div>
  </div>
  <div class="box note" style="margin-top:16pt">
    <span class="t">Droits d’auteur</span>
    <p style="margin:0 0 6pt"><b>© ${ANNEE} Houssem Eddine Lassoued. Tous droits réservés.</b></p>
    <p style="margin:0 0 6pt">L’auteur détient les droits sur le contenu de ce guide : textes, exercices, cas pratiques, modèles de consignes et schémas.</p>
    <p style="margin:0">Il est destiné aux participants de la formation IA135. Toute reproduction, diffusion ou réutilisation, en tout ou en partie, est interdite sans l’autorisation écrite préalable de l’auteur.</p>
  </div>
  <p class="small muted" style="margin-top:10pt">Les marques et logos de tiers (Make, Zapier, n8n, Microsoft, Google, OpenAI) restent la propriété de leurs titulaires. Les offres gratuites citées ont été vérifiées en novembre ${ANNEE} et peuvent changer.</p>
</section>
`;

// ─── Impression ──────────────────────────────────────────────────────────────
await printPdf('guide.html', 'IA135 · Guide du participant', body, 'IA135 · Automatisation des tâches avec l’IA · Guide du participant', [
  path.join(SORTIE, 'IA135-Guide-participant.pdf'),
  path.join(DECK, 'assets', 'guide-ia135.pdf'),
]);
console.log('Bouton « Labs » du deck : relancez node .ata-build/build.mjs');
