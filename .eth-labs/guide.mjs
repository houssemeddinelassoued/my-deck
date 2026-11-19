// Guide du participant · IA114 « Introduction à l’IA et à l’éthique » (Technologia, 1 jour, distanciel).
//   node .eth-labs/guide.mjs
//     → labs/introduction-ia-ethique/IA114-Guide-participant-APSM.pdf et -Sobeys.pdf (les participants n'ont pas le deck)
//     → slides/introduction-ia-ethique/assets/guide-apsm.pdf et guide-sobeys.pdf  (lien dans le deck + bouton « Labs » :
//       relancez node .eth-build/build.mjs)
//     + .eth-labs/html/guide-<client>.html (sources imprimées)
// Les ateliers et la couverture changent selon le client (.eth-labs/clients.mjs) ; le reste est commun.
// Contenu aligné sur le deck (.eth-build) : fil rouge Mutuelle des Érables (fictive), trois ateliers individuels,
// mémos des modules, Loi 25, gouvernance, modèle de mini-charte, ressources, crédits photo.
// Impression : Chrome via playwright-core (même chaîne que .gpl-labs/atelier1.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { CLIENTS, toolsCompare, atelier1, atelier2, atelier3 } from './clients.mjs';

const ICI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const RACINE = path.resolve(ICI, '..');
const DECK = path.join(RACINE, 'slides', 'introduction-ia-ethique');
const SORTIE = path.join(RACINE, 'labs', 'introduction-ia-ethique');
const HTML = path.join(ICI, 'html');
fs.mkdirSync(SORTIE, { recursive: true });
fs.mkdirSync(HTML, { recursive: true });

const data = (file, mime) => `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
const logo = data(path.join(RACINE, 'assets', 'technologia', 'logo-horizontal.png'), 'image/png');
const photo = (name) => data(path.join(DECK, 'assets', 'photos', `${name}.jpg`), 'image/jpeg');
const tool = (name) => data(path.join(DECK, 'assets', 'logos', `${name}.svg`), 'image/svg+xml');
const portrait = data(path.join(RACINE, 'assets', 'houssem-formateur.png'), 'image/png');
const EMAIL = 'houssemeddine.lassoued@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/houssemeddinelassoued';
const credits = JSON.parse(fs.readFileSync(path.join(DECK, 'assets', 'photos', 'credits.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ─── Styles ──────────────────────────────────────────────────────────────────
const CSS = `
@page { size: A4; margin: 16mm 16mm 18mm; }
* { box-sizing: border-box; }
:root { --ink:#2B2F33; --soft:#4B545B; --muted:#77818A; --faint:#AFB8C0; --rule:#DCE3E8; --panel:#EAF0F4;
  --blue:#1F78C1; --teal:#22A6B3; --green:#3A9F45; --yellow:#FFD000; --amber:#E8A600; --coral:#E0573D; --violet:#6B57C9; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin:0; font-family: Barlow, Arial, sans-serif; font-size: 10.5pt; line-height: 1.45; color: var(--ink); }
h1, h2, h3, h4, .disp { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; }
h1 { font-size: 30pt; line-height: 1.05; margin: 0 0 8pt; }
h2 { font-size: 19pt; line-height: 1.1; margin: 0 0 10pt; display:flex; align-items:center; gap:10pt; break-after: avoid; }
h2 .n { flex:none; min-width: 26pt; height: 26pt; padding: 0 6pt; border-radius: 7pt; background: var(--blue); color: #fff; display:inline-flex; align-items:center; justify-content:center; font-size: 14pt; }
h2 .n.y { background: var(--yellow); color: var(--ink); }
h2 .n.v { background: var(--violet); }
h3 { font-size: 13.5pt; margin: 12pt 0 5pt; color: var(--blue); break-after: avoid; }
h4 { margin: 0 0 3pt; font-size: 12pt; }
p { margin: 0 0 7pt; }
ul, ol { margin: 0 0 8pt; padding-left: 16pt; } li { margin: 2pt 0; }
.np { break-before: page; }
.keep { break-inside: avoid; }
.eyebrow { font-family: 'Barlow Condensed', Arial, sans-serif; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 9.5pt; color: var(--blue); }
.muted { color: var(--muted); } .small { font-size: 9pt; }
.lede { font-size: 12pt; color: var(--soft); margin-bottom: 12pt; }
.box { border-radius: 8pt; padding: 9pt 12pt; margin: 8pt 0 10pt; break-inside: avoid; }
.box .t { display:block; font-family:'Barlow Condensed', Arial, sans-serif; font-weight:700; font-size: 10pt; letter-spacing:.1em; text-transform: uppercase; margin-bottom: 3pt; }
.tip { background: #E3EFF9; } .tip .t { color: var(--blue); }
.warn { background: #FBE3DD; } .warn .t { color: #B23A22; }
.ok { background: #E3F2E5; } .ok .t { color: #2A7A33; }
.note { background: #FFF6CC; } .note .t { color: #8A6A00; }
.vio { background: #ECE9F8; } .vio .t { color: var(--violet); }
.prompt { background: #fff; border: 1.2pt solid var(--rule); border-left: 4pt solid var(--blue); border-radius: 6pt; padding: 8pt 12pt; margin: 6pt 0 10pt; break-inside: avoid; font-family: 'JetBrains Mono', Consolas, monospace; font-size: 9.2pt; line-height: 1.5; }
.prompt .t { color: var(--blue); font-family:'Barlow Condensed', Arial, sans-serif; font-weight:700; font-size:9.5pt; letter-spacing:.1em; text-transform:uppercase; margin-bottom: 3pt; display:block; }
table { width: 100%; border-collapse: collapse; margin: 6pt 0 10pt; }
tr { break-inside: avoid; } thead, tr:first-child { break-after: avoid; }
th { background: var(--blue); color: #fff; text-align: left; font-weight: 600; font-size: 9.5pt; padding: 5pt 7pt; }
td { border-bottom: 1pt solid var(--rule); padding: 5pt 7pt; vertical-align: top; }
tr:nth-child(even) td { background: #F6F9FB; }
td.blank { height: 30pt; background: #fff !important; }
td.blank2 { height: 46pt; background: #fff !important; }
.k { font-weight: 700; color: var(--blue); white-space: nowrap; }
.check { list-style: none; padding-left: 0; } .check li { padding-left: 20pt; position: relative; margin: 4pt 0; }
.check li::before { content: ''; position: absolute; left: 0; top: 2pt; width: 11pt; height: 11pt; border: 1.3pt solid var(--soft); border-radius: 2.5pt; }
.grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 10pt; }
.grid3 { display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 9pt; }
.card { border: 1pt solid var(--rule); border-radius: 8pt; padding: 8pt 10pt; break-inside: avoid; background: #fff; }
.card.b { border-top: 4pt solid var(--blue); } .card.g { border-top: 4pt solid var(--green); } .card.c { border-top: 4pt solid var(--coral); }
.card.v { border-top: 4pt solid var(--violet); } .card.t { border-top: 4pt solid var(--teal); } .card.y { border-top: 4pt solid var(--yellow); }
.tag { display:inline-block; font-size: 8.5pt; font-weight: 600; padding: 0 6pt; border-radius: 99pt; background: var(--panel); color: var(--soft); }
.fict { font-size: 8.5pt; color: var(--muted); border: 1pt dashed var(--faint); border-radius: 4pt; padding: 2pt 6pt; display: inline-block; }
.fig { position: relative; border-radius: 8pt; overflow: hidden; margin: 4pt 0 10pt; break-inside: avoid; }
.fig img { display:block; width: 100%; height: 100%; object-fit: cover; }
.fig .cr { position:absolute; right: 5pt; bottom: 4pt; font-size: 6.5pt; color: #fff; background: rgba(20,24,28,.55); padding: 1pt 4pt; border-radius: 3pt; }
.fig .cap { position:absolute; left: 7pt; top: 6pt; font-size: 8.5pt; font-weight: 600; color: #fff; background: rgba(20,24,28,.6); padding: 1pt 6pt; border-radius: 4pt; }
.tools { display:flex; gap: 12pt; align-items:center; flex-wrap: wrap; }
.tools span { display:inline-flex; align-items:center; gap: 5pt; font-weight: 600; }
.tools img { width: 18pt; height: 18pt; }
.row { display:flex; gap: 12pt; align-items: flex-start; }
.line { border-bottom: 1pt solid var(--faint); height: 20pt; }
.nest { display:flex; gap: 6pt; align-items: stretch; margin: 6pt 0 10pt; }
.nest div { flex:1; border-radius: 6pt; padding: 6pt 8pt; font-size: 9.5pt; }
.pyr td:first-child { width: 22%; font-weight: 700; color: #fff; }
.cover { height: 255mm; display:flex; flex-direction:column; }
.cover .hero { height: 70mm; margin: 10mm 0 8mm; }
.cover .band { border-left: 6pt solid var(--yellow); padding-left: 16pt; }
.cover h1 { font-size: 40pt; margin: 6pt 0 10pt; }
.cover .sub { font-size: 13.5pt; color: var(--soft); max-width: 160mm; }
.cover .meta { margin-top: 10mm; display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 9pt; }
.cover .foot { margin-top: auto; display:flex; justify-content: space-between; align-items: flex-end; color: var(--muted); font-size: 9.5pt; }
.toc { columns: 2; column-gap: 14pt; padding-left: 14pt; } .toc li { break-inside: avoid; }
.credits td { font-size: 8.5pt; padding: 3pt 6pt; }
.tight td { padding: 3pt 7pt; } .tight th { padding: 4pt 7pt; }
`;

const page = (title, body) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>${body}</body></html>`;

const P = (text, label = 'À copier dans votre outil') => `<div class="prompt"><span class="t">${label}</span>${text}</div>`;
const BOX = (kind, title, html) => `<div class="box ${kind}"><span class="t">${title}</span>${html}</div>`;
const SHORT = {
  achat: 'achat-en-ligne', airCanada: 'air-canada', berlaymont: 'berlaymont', binnenhof: 'binnenhof', datacenter: 'datacenter',
  entrevue: 'entrevue', fondOeil: 'fond-oeil', montreal: 'montreal', paiement: 'paiement', parlement: 'parlement-quebec',
  proteine: 'proteine', radiologie: 'radiologie', troisRivieres: 'trois-rivieres',
  camionMine: 'camion-mine', camerasMagasin: 'cameras-magasin',
};
const credit = (file) => {
  const c = credits[file];
  return c ? `${esc(c.artist)} · ${esc(c.license)}` : '';
};
const FIG = (key, h, cap = '', pos = 'center') =>
  `<div class="fig" style="height:${h}"><img src="${photo(SHORT[key])}" style="object-position:${pos}" alt="">${cap ? `<span class="cap">${cap}</span>` : ''}<span class="cr">${credit(SHORT[key])}</span></div>`;
const TOOLS = `<div class="tools">${['chatgpt', 'copilot', 'gemini', 'claude']
  .map((t) => `<span><img src="${tool(t)}" alt="">${{ chatgpt: 'ChatGPT', copilot: 'Copilot', gemini: 'Gemini', claude: 'Claude' }[t]}</span>`)
  .join('')}</div>`;

const H = { P, BOX, FIG, TOOLS };
// Client logo (slides/<id>/assets/logos/client-<id>.svg|png|jpg|webp), or a typographic badge until it is added.
const clientLogo = (cl, h = '30pt') => {
  for (const [ext, mime] of [['svg', 'image/svg+xml'], ['png', 'image/png'], ['jpg', 'image/jpeg'], ['webp', 'image/webp']]) {
    const f = path.join(DECK, 'assets', 'logos', `client-${cl}.${ext}`);
    if (fs.existsSync(f) && fs.statSync(f).size > 0) return `<img src="${data(f, mime)}" alt="${CLIENTS[cl].name}" style="height:${h};width:auto;display:block">`;
  }
  return `<span style="display:inline-flex;align-items:center;height:${h};padding:0 10pt;border-radius:5pt;background:#2B2F33;color:#fff;font-family:'Barlow Condensed',Arial,sans-serif;font-weight:700;font-size:18pt;letter-spacing:.08em">${CLIENTS[cl].name}</span>`;
};
// Photos printed in each client's guide (for the credits table).
const USED = (cl) => ['montreal', 'trois-rivieres', 'entrevue', 'radiologie', 'paiement', 'achat-en-ligne', 'parlement-quebec', 'air-canada', CLIENTS[cl].caseFile];

// ═══════════════════════════════════════════════════════════════════════════════
// French typography: no line break before ? ! : ; » or after « (text nodes only, never inside tags).
const insecables = (html) =>
  html.replace(/>([^<]+)</g, (m, t) => '>' + t.replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ') + '<');
const bodyFor = (cl) => `
<section class="cover">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <img src="${logo}" alt="Technologia" style="height:34pt;mix-blend-mode:multiply">
    <div style="display:flex;align-items:center;gap:10pt"><span class="small muted">Préparé pour</span>${clientLogo(cl)}</div>
  </div>
  <div class="hero">${FIG('montreal', '70mm', '', '50% 60%')}</div>
  <div class="band">
    <div class="eyebrow">Formation IA114 · ${CLIENTS[cl].session || '1 jour'} · classe virtuelle</div>
    <h1>Introduction à l’IA<br>et à l’éthique</h1>
    <div class="sub">Guide du participant : les repères de chaque module, les trois ateliers pas à pas, le modèle de mini-charte et les ressources pour aller plus loin.</div>
  </div>
  <div class="meta">
    <div class="card b"><h4>Format</h4>Classe virtuelle (Teams ou Zoom). Ateliers <b>individuels</b>, chacun sur son poste, avec un minuteur.</div>
    <div class="card y"><h4>Outils</h4>Un assistant d’IA gratuit, au choix : ChatGPT, Copilot, Gemini, Claude, Le Chat ou Perplexity.</div>
    <div class="card g"><h4>Vos livrables</h4>Trois constats (atelier 1), une analyse de cas (atelier 2), votre mini-charte (atelier 3).</div>
  </div>
  <div class="foot"><span>Préparé pour ${CLIENTS[cl].pour}<br>Formateur : Houssem Eddine Lassoued · Technologia</span><span class="fict">${CLIENTS[cl].fict}</span></div>
</section>

<section class="np">
  <h2>Sommaire</h2>
  <ol class="toc">
    <li>Avant de commencer</li><li>Le programme de la journée</li><li>Le fil rouge : la Mutuelle des Érables</li>
    <li>Mémo · Qu’est-ce que l’IA ?</li><li>Mémo · Applications concrètes</li><li>Atelier 1 · Explorer des outils d’IA</li>
    <li>Mémo · Les grands enjeux éthiques</li><li>Mémo · Loi 25 et IA responsable</li><li>Atelier 2 · Étude de cas éthique</li>
    <li>Mémo · Vers une gouvernance de l’IA</li><li>Atelier 3 · Votre mini-charte éthique IA</li><li>Votre plan d’action</li>
    <li>Ressources et glossaire</li><li>Crédits photographiques</li>
  </ol>

  <h2 style="margin-top:14pt"><span class="n">1</span>Avant de commencer</h2>
  <ul class="check">
    <li>Deux fenêtres côte à côte : la classe virtuelle d’un côté, votre assistant d’IA de l’autre. Idéalement, deux écrans.</li>
    <li>Ouvrez un assistant d’IA avec un compte gratuit. Un seul suffit :</li>
  </ul>
  ${TOOLS}
  <ul class="check" style="margin-top:8pt">
    <li>Caméra si possible, micro coupé hors échanges. Vous votez et répondez à voix haute.</li>
    <li>Gardez ce guide ouvert : toutes les demandes à copier y sont. Le formateur les colle aussi dans le Chat.</li>
    <li>Ouvrez un document à vous (Word, OneNote, Bloc-notes ou papier) pour vos notes et vos livrables.</li>
  </ul>
  ${BOX('warn', 'Règle d’or de la journée', 'Aucune donnée réelle dans les outils : ni nom, ni dossier, ni information de santé. Tous les cas de la formation sont fictifs, sauf les études de cas publiques et documentées.')}

  <h2 style="margin-top:12pt"><span class="n">2</span>Le programme de la journée</h2>
  <table>
    <tr><th style="width:14%">Heure</th><th style="width:10%">Module</th><th>Contenu</th></tr>
    <tr><td>9 h 00</td><td>—</td><td>Accueil, tour de table, fil rouge</td></tr>
    <tr><td>9 h 15</td><td>1</td><td>Qu’est-ce que l’intelligence artificielle ? Définition, historique, IA, machine learning, deep learning</td></tr>
    <tr><td>10 h 05</td><td>2</td><td>Applications concrètes : RH, santé, finance, marketing ; démonstrations</td></tr>
    <tr><td>10 h 35</td><td>—</td><td><i>Pause</i></td></tr>
    <tr><td>10 h 50</td><td>3</td><td><b>Atelier 1</b> · Explorer des outils d’IA</td></tr>
    <tr><td>11 h 30</td><td>4</td><td>Les grands enjeux éthiques : biais, transparence, vie privée</td></tr>
    <tr><td>12 h 00</td><td>—</td><td><i>Dîner</i></td></tr>
    <tr><td>13 h 00</td><td>5</td><td>Loi 25 et principes de l’IA responsable</td></tr>
    <tr><td>13 h 40</td><td>6</td><td><b>Atelier 2</b> · Étude de cas éthique</td></tr>
    <tr><td>14 h 20</td><td>—</td><td><i>Pause</i></td></tr>
    <tr><td>14 h 35</td><td>7</td><td>Vers une gouvernance de l’IA</td></tr>
    <tr><td>15 h 00</td><td>8</td><td><b>Atelier 3</b> · Votre mini-charte éthique IA</td></tr>
    <tr><td>15 h 45</td><td>—</td><td>Bilan, plan d’action, évaluation</td></tr>
  </table>
</section>

<section style="margin-top:16pt">
  <h2><span class="n">3</span>Le fil rouge : la Mutuelle des Érables</h2>
  <div class="row">
    <div style="flex:1.1">
      <p class="lede">Une mutuelle d’assurance de personnes <b>fictive</b> : vie, invalidité, assurance collective. 650 employés, 310 000 membres, siège à Trois-Rivières. Elle manipule chaque jour des données parmi les plus sensibles : santé, revenus, famille.</p>
      ${BOX('tip', 'La question de la journée', '« Comment profiter de l’IA <b>sans trahir la confiance</b> de nos membres et de nos employés ? » (Nathalie, au comité de direction)')}
    </div>
    <div style="flex:1">${FIG('troisRivieres', '52mm', 'Trois-Rivières')}</div>
  </div>
  <h3>Les personnages</h3>
  <table>
    <tr><th style="width:22%">Personnage</th><th style="width:34%">Rôle</th><th>Ce qu’il veut</th></tr>
    <tr><td><b>Nathalie</b></td><td>Vice-présidente, transformation numérique</td><td>Porte le Programme IA. Veut aller vite, sans faire de vagues.</td></tr>
    <tr><td><b>Samir</b></td><td>Directeur des ressources humaines</td><td>Reçoit 4 000 CV par an. Rêve d’un tri automatique.</td></tr>
    <tr><td><b>Chloé</b></td><td>Responsable de la protection des renseignements personnels</td><td>Gardienne de la Loi 25. Veut être consultée avant, pas après.</td></tr>
    <tr><td><b>Vincent</b></td><td>Directeur marketing et expérience membre</td><td>Un agent conversationnel et des campagnes personnalisées.</td></tr>
    <tr><td><b>Mei</b></td><td>Analyste de données</td><td>Construit les modèles. Se demande ce qu’ils ont appris.</td></tr>
  </table>
  <h3>Le Programme IA : quatre projets, quatre questions</h3>
  <table>
    <tr><th style="width:8%">Projet</th><th style="width:30%">Quoi</th><th style="width:24%">Technologie</th><th>La question éthique</th></tr>
    <tr><td class="k">P1</td><td>Léa, l’agent conversationnel des membres</td><td>IA générative</td><td>Peut-elle promettre ? Le membre sait-il qu’il parle à une IA ?</td></tr>
    <tr><td class="k">P2</td><td>Le tri des candidatures</td><td>Machine learning sur 10 ans d’embauches</td><td>Le modèle reproduit-il les choix du passé ?</td></tr>
    <tr><td class="k">P3</td><td>Le score de risque de fraude</td><td>Analyse prédictive sur les réclamations</td><td>Peut-on expliquer le score à un membre soupçonné ?</td></tr>
    <tr><td class="k">P4</td><td>Les campagnes personnalisées</td><td>Prédiction et génération de contenus</td><td>Les membres ont-ils consenti à ce profilage ?</td></tr>
  </table>
</section>

<section style="margin-top:16pt">
  <h2><span class="n">4</span>Mémo · Qu’est-ce que l’IA ?</h2>
  <p class="lede"><b>Définition de travail</b> : des programmes capables de faire des tâches qui demandaient jusqu’ici l’intelligence humaine : percevoir, comprendre, prédire, générer.</p>
  <h3>Des poupées russes</h3>
  <div class="nest">
    <div style="background:#EEF1F3"><b>Intelligence artificielle</b><br>Tout système qui imite une capacité humaine, même avec des règles écrites.</div>
    <div style="background:#E3EFF9"><b>Machine learning</b><br>Le système apprend à partir d’exemples au lieu de suivre des règles.</div>
    <div style="background:#ECE9F8"><b>Deep learning</b><br>Du machine learning avec des réseaux de neurones à nombreuses couches.</div>
    <div style="background:#DFF3F4"><b>IA générative</b><br>Du deep learning qui produit du contenu nouveau : texte, image, voix, code.</div>
  </div>
  <p class="small muted">Tout ce qui est deep learning est du machine learning, et tout ce qui est machine learning est de l’IA. L’inverse n’est pas vrai.</p>
  <h3>Quatre idées à retenir</h3>
  <ul>
    <li><b>Apprendre par l’exemple</b> : on ne donne plus les règles, on donne des exemples. Le modèle apprend aussi les erreurs et les biais de ses exemples.</li>
    <li><b>Toujours une probabilité</b> : « pourriel à 92 % », jamais une certitude. Sur 310 000 membres, 8 % d’erreur, c’est beaucoup de monde.</li>
    <li><b>Probable n’est pas vrai</b> : un modèle de langage (LLM) écrit le mot le plus probable, puis recommence. Il peut inventer un chiffre, une source, un article de loi : c’est une <b>hallucination</b>.</li>
    <li><b>Automatique n’est pas intelligent</b> : un rappel d’Outlook ou une mise en forme Excel sont des règles fixes. Le critère de l’IA : est-ce que ça apprend ou interprète ?</li>
  </ul>
  <h3>Repères historiques</h3>
  <table>
    <tr><th style="width:12%">Année</th><th>Événement</th></tr>
    <tr><td>1950</td><td>Alan Turing pose la question : « Les machines peuvent-elles penser ? »</td></tr>
    <tr><td>1956</td><td>Le terme « intelligence artificielle » est créé (atelier de Dartmouth).</td></tr>
    <tr><td>1997</td><td>Deep Blue bat Garry Kasparov aux échecs.</td></tr>
    <tr><td>2012</td><td>Le deep learning se met à reconnaître les images.</td></tr>
    <tr><td>2016</td><td>AlphaGo bat Lee Sedol au jeu de go.</td></tr>
    <tr><td>2017</td><td>Invention du Transformer, le « T » de GPT.</td></tr>
    <tr><td>2022</td><td>ChatGPT : l’IA générative accessible à tous.</td></tr>
    <tr><td>2025 +</td><td>Des « agents » qui agissent dans nos outils.</td></tr>
  </table>
  <h3>Six grandes familles de technologies</h3>
  <div class="grid3">
    <div class="card b"><h4>Vision par ordinateur</h4>Objets, visages, texte dans une image.</div>
    <div class="card t"><h4>Traitement du langage</h4>Comprendre, classer, résumer, traduire.</div>
    <div class="card g"><h4>Parole</h4>La voix en texte, le texte en voix.</div>
    <div class="card y"><h4>Analyse prédictive</h4>Prévoir, estimer un risque, détecter une anomalie.</div>
    <div class="card v"><h4>IA générative</h4>Texte, image, voix ou code.</div>
    <div class="card c"><h4>Agents IA</h4>Enchaîner des actions dans des outils.</div>
  </div>
</section>

<section style="margin-top:16pt">
  <h2><span class="n">5</span>Mémo · Applications concrètes</h2>
  <div class="grid2">
    <div class="card g"><h4>Ressources humaines</h4>${FIG('entrevue', '30mm', '', '70% 50%')}Offres d’emploi inclusives, présélection des candidatures, réponses aux questions des employés.<br><span class="small" style="color:#B23A22"><b>Vigilance :</b> biais dans le tri des CV.</span></div>
    <div class="card t"><h4>Santé</h4>${FIG('radiologie', '30mm', '', '60% 50%')}Aide au diagnostic en imagerie, résumé des notes cliniques, prévision de l’achalandage.<br><span class="small" style="color:#B23A22"><b>Vigilance :</b> données sensibles, décision médicale.</span></div>
    <div class="card b"><h4>Finance et assurance</h4>${FIG('paiement', '30mm')}Fraude en temps réel, risque de crédit, lecture de factures et de formulaires.<br><span class="small" style="color:#B23A22"><b>Vigilance :</b> pouvoir expliquer un refus.</span></div>
    <div class="card y"><h4>Marketing</h4>${FIG('achat', '30mm')}Recommandation, création de contenus, analyse des avis.<br><span class="small" style="color:#B23A22"><b>Vigilance :</b> profilage et consentement.</span></div>
  </div>
  <h3>Quatre réussites documentées</h3>
  <table>
    <tr><th style="width:18%">Domaine</th><th>Réussite</th><th style="width:28%">Source</th></tr>
    <tr><td>Santé · 2018</td><td>IDx-DR, premier système autorisé aux États-Unis à détecter la rétinopathie diabétique sans qu’un spécialiste lise l’image.</td><td>Autorisation de la FDA, avril 2018</td></tr>
    <tr><td>Science · 2024</td><td>AlphaFold prédit la forme de centaines de millions de protéines. Prix Nobel de chimie 2024.</td><td>Prix Nobel de chimie 2024</td></tr>
    <tr><td>Finance · 2023</td><td>Selon Visa, son IA a aidé à bloquer environ 40 milliards de dollars américains de fraude en un an.</td><td>Visa, communiqué de juillet 2024</td></tr>
    <tr><td>Marketing · 2015</td><td>Chez Netflix, environ 80 % des heures visionnées viennent des recommandations.</td><td>Gomez-Uribe et Hunt, ACM, 2015</td></tr>
  </table>
  ${BOX('vio', 'Le revers de chaque réussite', 'Qui vérifie l’erreur du système ? Qui a donné ses données ? Qui peut contester ? Une IA qui trie doit laisser l’humain trancher sous un seuil de confiance.')}
</section>

${toolsCompare(cl, H)}
${atelier1(cl, H)}

<section style="margin-top:16pt">
  <h2><span class="n v">4</span>Mémo · Les grands enjeux éthiques</h2>
  <h3>Les biais : l’IA apprend aussi nos travers</h3>
  <p>Un outil de tri de CV entraîné sur dix ans d’embauches majoritairement masculines apprend qu’un « bon profil » ressemble aux profils passés. En 2018, Amazon a abandonné un outil expérimental qui pénalisait les CV contenant le mot « women’s » (Reuters).</p>
  <table>
    <tr><th style="width:26%">Source de biais</th><th>Ce qui se passe</th><th style="width:34%">Exemple documenté</th></tr>
    <tr><td><b>Un passé déséquilibré</b></td><td>Les données reflètent des décisions humaines d’hier.</td><td>Amazon, recrutement, 2018</td></tr>
    <tr><td><b>Des données incomplètes</b></td><td>Certains groupes sont absents ou trop peu nombreux.</td><td>« Gender Shades » (MIT, 2018) : jusqu’à 34,7 % d’erreurs pour les femmes à la peau foncée, 0,8 % pour les hommes à la peau claire</td></tr>
    <tr><td><b>Des indices indirects</b></td><td>On retire la variable sensible, d’autres la révèlent.</td><td>Code postal, prénom, sport, pause de carrière</td></tr>
    <tr><td><b>Un mauvais objectif</b></td><td>Le modèle optimise ce qu’on lui demande, pas ce qu’on voulait.</td><td>Revue Science, 2019 : les dépenses de soins utilisées comme mesure des besoins désavantageaient les patients noirs</td></tr>
  </table>
  ${BOX('warn', 'À retenir', 'Retirer une variable sensible ne suffit pas : il faut <b>tester les résultats par groupe</b>, avant et après la mise en service.')}
  <h3>Transparence, explicabilité, recours</h3>
  <div class="grid3">
    <div class="card b"><h4>Transparence</h4>Savoir qu’une IA intervient, et comment.</div>
    <div class="card t"><h4>Explicabilité</h4>Pouvoir dire pourquoi ce résultat, pour cette personne.</div>
    <div class="card g"><h4>Recours</h4>Pouvoir contester auprès d’un humain.</div>
  </div>
  <h3>Vie privée : quatre façons de trahir la confiance</h3>
  <ul>
    <li><b>Collecter trop</b> : chaque donnée gardée « au cas où » est un risque de plus.</li>
    <li><b>Détourner l’usage</b> : une réclamation de santé réutilisée pour le marketing.</li>
    <li><b>Deviner l’intime</b> : un modèle peut déduire une maladie ou une grossesse jamais déclarées.</li>
    <li><b>Laisser fuir</b> : coller un dossier dans un outil public, c’est le sortir de l’organisation (Samsung, 2023).</li>
  </ul>
  <h3>Le feu tricolore des données</h3>
  <table>
    <tr><th style="width:28%;background:#3A9F45">Vert · tout outil</th><th style="width:36%;background:#E8A600">Jaune · outil approuvé seulement</th><th style="background:#E0573D">Rouge · jamais tel quel</th></tr>
    <tr><td>Texte public, publicité, procédure générique</td><td>Plan stratégique, compte rendu de direction, statistiques internes</td><td>Dossiers de membres, CV, salaires, données de santé</td></tr>
  </table>
  <p class="small"><b>La bonne question :</b> la personne s’attend-elle à cet usage de ses données ? Si la réponse est non, on s’arrête.</p>
</section>

<section style="margin-top:16pt">
  <h2><span class="n v">5</span>Mémo · Loi 25 et IA responsable</h2>
  <div class="row">
    <div style="flex:1.3">
      <p>La <b>Loi 25</b> (Loi modernisant des dispositions législatives en matière de protection des renseignements personnels, 2021) s’applique aux entreprises et aux organismes publics du Québec, sous la surveillance de la <b>Commission d’accès à l’information (CAI)</b>. Sanctions pour une entreprise : jusqu’à 10 M$ ou 2 % du chiffre d’affaires mondial (sanction administrative), jusqu’à 25 M$ ou 4 % (amende pénale).</p>
    </div>
    <div style="flex:1">${FIG('parlement', '38mm', 'Hôtel du Parlement, Québec', '50% 40%')}</div>
  </div>
  <table>
    <tr><th style="width:18%">Date</th><th>Entrée en vigueur</th></tr>
    <tr><td>22 sept. 2022</td><td>Personne responsable de la protection des renseignements personnels ; déclaration des incidents à risque de préjudice sérieux.</td></tr>
    <tr><td>22 sept. 2023</td><td>Évaluation des facteurs relatifs à la vie privée (EFVP), consentement, transparence, décisions automatisées, sanctions.</td></tr>
    <tr><td>22 sept. 2024</td><td>Portabilité des renseignements.</td></tr>
  </table>
  <h3>Six obligations qui touchent un projet d’IA (secteur privé)</h3>
  <table>
    <tr><th style="width:30%">Obligation</th><th>En pratique</th><th style="width:14%">Article</th></tr>
    <tr><td><b>Un responsable désigné</b></td><td>Par défaut, la personne qui a la plus haute autorité ; délégation possible par écrit.</td><td>3.1</td></tr>
    <tr><td><b>Une évaluation avant</b></td><td>EFVP pour tout projet de système qui traite des renseignements personnels.</td><td>3.3</td></tr>
    <tr><td><b>Un consentement éclairé</b></td><td>Fins précises et annoncées ; exprès pour les renseignements sensibles.</td><td>12, 14</td></tr>
    <tr><td><b>Le profilage annoncé</b></td><td>Informer la personne ; fonctions d’identification, de localisation ou de profilage désactivées par défaut.</td><td>8.1</td></tr>
    <tr><td><b>La décision automatisée</b></td><td>Informer, expliquer sur demande, permettre une révision par une personne.</td><td>12.1</td></tr>
    <tr><td><b>Les incidents déclarés</b></td><td>Aviser la CAI et les personnes en cas de risque de préjudice sérieux ; tenir un registre.</td><td>3.5 à 3.8</td></tr>
  </table>
  ${BOX('tip', 'Article 12.1 · décision exclusivement automatisée', '1) Informer la personne, au plus tard au moment de lui communiquer la décision. 2) Sur demande, lui donner les renseignements utilisés, les raisons et les principaux facteurs, et son droit de les faire corriger. 3) Lui permettre de présenter ses observations à un membre du personnel en mesure de réviser la décision.')}
  <h3>L’EFVP en cinq questions</h3>
  <ul class="check">
    <li>Quelles données, et sont-elles toutes nécessaires ?</li>
    <li>Pour quelle finalité, annoncée aux personnes ?</li>
    <li>Où sont-elles hébergées ? Sortent-elles du Québec ?</li>
    <li>Qui y a accès, et combien de temps les garde-t-on ?</li>
    <li>Quels risques pour les personnes, et quelles mesures ?</li>
  </ul>
  <p class="small muted">Ce mémo donne des repères, pas un avis juridique. Pour un cas précis, adressez-vous à la personne responsable de la protection des renseignements personnels de votre organisation.</p>
</section>

<section style="margin-top:16pt">
  <h3 style="margin-top:0">Les six principes opérationnels de l’IA responsable</h3>
  <p class="small muted">Ce qui revient dans tous les cadres : Déclaration de Montréal, OCDE, UNESCO, ISO/IEC 42001.</p>
  <table>
    <tr><th style="width:24%">Principe</th><th>La question à se poser</th></tr>
    <tr><td><b>Équité</b></td><td>Qui pourrait être désavantagé, et l’a-t-on testé ?</td></tr>
    <tr><td><b>Transparence</b></td><td>Les personnes savent-elles qu’une IA intervient ?</td></tr>
    <tr><td><b>Vie privée</b></td><td>Utilise-t-on le minimum de données, pour un but annoncé ?</td></tr>
    <tr><td><b>Fiabilité</b></td><td>Que se passe-t-il quand le système se trompe ?</td></tr>
    <tr><td><b>Contrôle humain</b></td><td>Qui peut arrêter, corriger ou réviser une décision ?</td></tr>
    <tr><td><b>Responsabilité</b></td><td>Qui répond du système, nommément ?</td></tr>
  </table>
  <div class="row">
    <div style="flex:1">
      <h3>La Déclaration de Montréal (2018)</h3>
      <p>Dix principes pour un développement responsable de l’IA : bien-être · respect de l’autonomie · protection de l’intimité et de la vie privée · solidarité · participation démocratique · équité · inclusion de la diversité · prudence · responsabilité · développement soutenable.</p>
    </div>
    <div style="flex:.8">${FIG('montreal', '40mm', 'Montréal', '50% 60%')}</div>
  </div>
  <h3>Ailleurs : l’Europe classe l’IA par niveau de risque</h3>
  <table class="pyr">
    <tr><th>Niveau</th><th>Exemples</th><th style="width:34%">Calendrier</th></tr>
    <tr><td style="background:#E0573D">Inacceptable</td><td>Notation sociale, manipulation, reconnaissance des émotions au travail</td><td>Interdit depuis le 2 février 2025</td></tr>
    <tr><td style="background:#E8A600">Haut risque</td><td>Recrutement, crédit, assurance vie et santé</td><td>Obligations au 2 décembre 2027 (report « omnibus » de 2026)</td></tr>
    <tr><td style="background:#1F78C1">Transparence</td><td>Agents conversationnels, contenus générés</td><td>Depuis le 2 août 2026</td></tr>
    <tr><td style="background:#3A9F45">Minimal</td><td>Filtre anti-pourriel, jeux vidéo</td><td>Aucune obligation particulière</td></tr>
  </table>
  <p class="small"><b>Au Canada :</b> pas de loi propre à l’IA ; le projet de loi C-36 (juin 2026) renforcerait les droits face aux décisions automatisées. <b>Normes :</b> ISO/IEC 42001 (2023), un système de management de l’IA certifiable. <i>État au 18 novembre 2026 : à vérifier, ces cadres évoluent vite.</i></p>
</section>

${atelier2(cl, H)}

<section style="margin-top:16pt">
  <h2><span class="n v">7</span>Mémo · Vers une gouvernance de l’IA</h2>
  <div class="row">
    <div style="flex:1.3">
      <h3 style="margin-top:0">Une IA n’est jamais responsable</h3>
      <p>Colombie-Britannique, février 2024 (Moffatt c. Air Canada) : l’agent conversationnel d’Air Canada invente une règle de remboursement pour un tarif de deuil. Air Canada soutient que l’agent est « une entité distincte, responsable de ses propres actes ». Le tribunal rejette l’argument : l’entreprise répond de toute l’information de son site, et doit indemniser le client.</p>
    </div>
    <div style="flex:1">${FIG('airCanada', '36mm', '', '50% 55%')}</div>
  </div>
  <h3>Six rôles à nommer</h3>
  <table class="tight">
    <tr><th style="width:30%">Rôle</th><th>Responsabilité</th></tr>
    <tr><td><b>La direction</b></td><td>Fixe l’ambition et les limites, arbitre les cas difficiles, peut tout arrêter.</td></tr>
    <tr><td><b>Le comité IA</b></td><td>Approuve les projets à risque, tient le registre des systèmes d’IA.</td></tr>
    <tr><td><b>Le responsable des renseignements personnels</b></td><td>EFVP, consentement, incidents. Consulté au début, pas à la fin.</td></tr>
    <tr><td><b>Le propriétaire du système</b></td><td>Une personne du métier qui répond du système au quotidien.</td></tr>
    <tr><td><b>L’équipe données et TI</b></td><td>Teste les biais, documente, surveille, sécurise.</td></tr>
    <tr><td><b>Chaque employé</b></td><td>Respecte la charte, utilise les outils approuvés, signale un problème.</td></tr>
  </table>
  <h3>Cinq points de contrôle… et un bouton d’arrêt</h3>
  <table class="tight">
    <tr><th style="width:18%">Étape</th><th>Point de contrôle</th></tr>
    <tr><td>1 · Idée</td><td>Fiche projet, niveau de risque ; le comité IA est informé.</td></tr>
    <tr><td>2 · Conception</td><td>EFVP : quelles données, pour quel but ?</td></tr>
    <tr><td>3 · Essais</td><td>Biais, fiabilité, explications testés avant le lancement.</td></tr>
    <tr><td>4 · Lancement</td><td>Personnes informées, recours prévu, humain dans la boucle.</td></tr>
    <tr><td>5 · Suivi</td><td>Indicateurs, incidents, revue annuelle.</td></tr>
  </table>
  <div class="keep">
  <h3>Exemple : la charte IA de la Mutuelle, version 1</h3>
  <ol style="columns:2;column-gap:18pt;font-size:9.8pt">
    <li>Nos principes : équité, transparence, vie privée, contrôle humain.</li>
    <li>Un membre sait toujours quand il échange avec une IA.</li>
    <li>Aucune décision qui touche un membre ou un candidat sans révision humaine possible.</li>
    <li>Jamais de données de santé, de CV ni de dossier dans un outil non approuvé.</li>
    <li>Tout projet d’IA passe par le comité IA et une EFVP, avant achat ou développement.</li>
    <li>Chaque système a un propriétaire nommé, qui en répond.</li>
    <li>Les résultats sont testés par groupe avant le lancement, puis chaque année.</li>
    <li>Un doute, un incident ? On le signale à Chloé, sans crainte de reproche.</li>
  </ol>
  <p class="small muted">Version 1 · révision en juin 2027.</p>
  </div>
</section>

${atelier3(cl, H)}

<section class="np">
  <div style="border:1.5pt solid var(--teal);border-top:6pt solid var(--teal);border-radius:8pt;padding:12pt 14pt">
    <div class="eyebrow" style="color:var(--teal)">Modèle à remplir</div>
    <h1 style="font-size:24pt;margin:2pt 0 4pt">Mini-charte éthique IA · ……………………………</h1>
    <p class="small muted">Version 1 · révision le ……………………</p>
    <h3>1 · Nos principes</h3>
    <table>
      <tr><th style="width:30%">Principe</th><th>Chez nous, cela veut dire que…</th></tr>
      <tr><td class="blank"></td><td class="blank"></td></tr><tr><td class="blank"></td><td class="blank"></td></tr><tr><td class="blank"></td><td class="blank"></td></tr>
    </table>
    <h3>2 · Nos règles d’usage</h3>
    <table>
      <tr><th style="background:#3A9F45">Permis</th><th style="background:#E0573D">Interdit</th><th style="background:#E8A600">Sur accord</th></tr>
      <tr><td class="blank2"></td><td class="blank2"></td><td class="blank2"></td></tr>
    </table>
    <h3>3 · Nos données</h3>
    <table>
      <tr><th style="background:#3A9F45">Vert · tout outil</th><th style="background:#E8A600">Jaune · outil approuvé</th><th style="background:#E0573D">Rouge · jamais tel quel</th></tr>
      <tr><td class="blank"></td><td class="blank"></td><td class="blank"></td></tr>
    </table>
    <p class="small">Outils approuvés : ……………………………………………………………</p>
    <h3>4 · Nos rôles</h3>
    <table>
      <tr><td style="width:40%">Approuve les projets et les outils</td><td class="blank"></td></tr>
      <tr><td>Répond de chaque système</td><td class="blank"></td></tr>
      <tr><td>Reçoit les signalements</td><td class="blank"></td></tr>
    </table>
    <h3>5 · Notre suivi</h3>
    <table>
      <tr><td style="width:40%">Indicateur suivi</td><td class="blank"></td></tr>
      <tr><td>Date de révision</td><td class="blank"></td></tr>
    </table>
  </div>
</section>

<section style="margin-top:16pt">
  <h2><span class="n">★</span>Votre plan d’action</h2>
  <p class="lede">Trois engagements, petits et précis. « Présenter ma charte à l’équipe le 15 » plutôt que « faire plus attention à l’éthique ».</p>
  <table>
    <tr><th style="width:22%">Quand</th><th>Mon engagement</th></tr>
    <tr><td><b>Cette semaine</b><br><span class="small muted">ex. : demander qui est notre responsable des renseignements personnels</span></td><td class="blank2"></td></tr>
    <tr><td><b>Ce mois-ci</b><br><span class="small muted">ex. : présenter ma mini-charte à mon gestionnaire</span></td><td class="blank2"></td></tr>
    <tr><td><b>Dans 3 mois</b><br><span class="small muted">ex. : un registre des outils d’IA de mon service</span></td><td class="blank2"></td></tr>
  </table>

  <h2 style="margin-top:16pt"><span class="n">i</span>Ressources et glossaire</h2>
  <table>
    <tr><th style="width:34%">Ressource</th><th>Pour quoi faire</th></tr>
    <tr><td><b>Commission d’accès à l’information</b><br><span class="small">cai.gouv.qc.ca</span></td><td>Loi 25, guide de l’EFVP, déclaration des incidents de confidentialité.</td></tr>
    <tr><td><b>Déclaration de Montréal</b><br><span class="small">declarationmontreal-iaresponsable.com</span></td><td>Les dix principes et un guide pour les appliquer.</td></tr>
    <tr><td><b>OCDE et UNESCO</b></td><td>Principes de l’IA (OCDE, mis à jour en 2024) ; recommandation sur l’éthique de l’IA (UNESCO, 2021).</td></tr>
    <tr><td><b>Règlement européen sur l’IA</b></td><td>Règlement (UE) 2024/1689 et son report « omnibus » (règlement 2026/1744).</td></tr>
    <tr><td><b>ISO/IEC 42001</b></td><td>Norme de système de management de l’IA, certifiable.</td></tr>
    <tr><td><b>Obvia</b><br><span class="small">obvia.ca</span></td><td>Observatoire international sur les impacts sociétaux de l’IA et du numérique (Québec).</td></tr>
  </table>
  <table>
    <tr><th style="width:26%">Terme</th><th>Définition</th></tr>
    <tr><td><b>Algorithme</b></td><td>Suite d’instructions qui transforme des données en résultat.</td></tr>
    <tr><td><b>Modèle</b></td><td>Ce que la machine a appris à partir des exemples.</td></tr>
    <tr><td><b>LLM</b></td><td>Grand modèle de langage : il prédit le mot suivant le plus probable.</td></tr>
    <tr><td><b>Hallucination</b></td><td>Réponse plausible mais inventée.</td></tr>
    <tr><td><b>Biais algorithmique</b></td><td>Erreur systématique qui désavantage un groupe.</td></tr>
    <tr><td><b>Variable « proxy »</b></td><td>Donnée qui en révèle indirectement une autre (code postal → revenu).</td></tr>
    <tr><td><b>Explicabilité</b></td><td>Capacité à dire pourquoi un système a produit ce résultat.</td></tr>
    <tr><td><b>EFVP</b></td><td>Évaluation des facteurs relatifs à la vie privée (Loi 25).</td></tr>
    <tr><td><b>Décision automatisée</b></td><td>Décision prise par un système, sans examen humain réel.</td></tr>
  </table>
</section>

<section class="np">
  <h2>Crédits photographiques</h2>
  <p class="small muted">Photos de Wikimedia Commons, sous licence libre (CC0, CC BY, CC BY-SA ou domaine public). Logos des outils : marques de leurs propriétaires, utilisés à titre d’identification.</p>
  <table class="credits">
    <tr><th style="width:32%">Fichier</th><th style="width:30%">Auteur</th><th style="width:14%">Licence</th><th>Source</th></tr>
    ${Object.entries(credits)
      .filter(([k]) => USED(cl).includes(k))
      .map(([, c]) => c)
      .map((c) => `<tr><td>${esc(c.title)}</td><td>${esc(c.artist)}</td><td>${esc(c.license)}</td><td style="word-break:break-all">${esc(c.page)}</td></tr>`)
      .join('\n    ')}
  </table>
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
    <p style="margin:0 0 6pt"><b>© ${new Date().getFullYear()} Houssem Eddine Lassoued. Tous droits réservés.</b></p>
    <p style="margin:0 0 6pt">L’auteur détient les droits sur le contenu de ce guide : textes, exercices, cas pratiques, modèles de consignes et schémas.</p>
    <p style="margin:0">Il est destiné aux participants de la formation IA114. Toute reproduction, diffusion ou réutilisation, en tout ou en partie, est interdite sans l’autorisation écrite préalable de l’auteur.</p>
  </div>
  <p class="small muted" style="margin-top:10pt">Les photographies, les marques et les logos de tiers (outils d’IA, clients) restent la propriété de leurs titulaires, selon les mentions de la page précédente.</p>
</section>
`;

// ─── Impression ──────────────────────────────────────────────────────────────
let chromium;
for (const base of [import.meta.url, 'file:///C:/Users/ASUS/AppData/Local/Temp/ia134pw/package.json']) {
  try {
    ({ chromium } = createRequire(base)('playwright-core'));
    break;
  } catch {}
}
if (!chromium) throw new Error('playwright-core introuvable (npm i playwright-core dans un dossier de travail, puis ajustez le chemin)');

const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const p = await b.newPage();
for (const cl of Object.keys(CLIENTS)) {
  const c = CLIENTS[cl];
  const f = path.join(HTML, `guide-${cl}.html`);
  fs.writeFileSync(f, page(`IA114 · Guide du participant · ${c.name}`, insecables(bodyFor(cl))));
  await p.goto(`file:///${f.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const pdf = await p.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="font-family:Arial,sans-serif;font-size:7.5px;line-height:1.5;color:#77818A;width:100%;padding:0 16mm;display:flex;justify-content:space-between;align-items:flex-end"><span>IA114 · Introduction à l’IA et à l’éthique · Guide du participant · ${c.name}<br>Auteur et formateur : Houssem Eddine Lassoued · © ${new Date().getFullYear()} Tous droits réservés</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' },
  });
  for (const out of [path.join(SORTIE, `IA114-Guide-participant-${c.name}.pdf`), path.join(DECK, 'assets', `guide-${cl}.pdf`)]) {
    try {
      fs.writeFileSync(out, pdf);
      console.log('→', path.relative(RACINE, out), `(${Math.round(pdf.length / 1024)} Ko)`);
    } catch (e) {
      if (e.code !== 'EBUSY') throw e;
      console.warn('⚠ fichier ouvert dans un lecteur, NON mis à jour :', path.relative(RACINE, out));
    }
  }
}
await b.close();
console.log('Lien du guide dans le deck et bouton « Labs » : relancez node .eth-build/build.mjs');
