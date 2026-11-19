// Paquet de l'atelier 1 · IA124 « IA appliquée à la gestion de projet » · Groupe Lessard (cas fictif : Centre sportif de Montréal).
//   node .gpl-labs/atelier1.mjs   → labs/ia-gestion-de-projet-lessard/atelier-1/
//       Atelier1-Guide-participant.pdf          guide détaillé (les participants n'ont pas le deck)
//       Atelier1-Dossier-transmis-par-Eric.pdf  courriel d'Éric, fiche de transfert, calendrier, intervenants, notes, résumé à coller
//       Soumission_Montreal.pdf                 la soumission (pièce jointe à Copilot Chat à l'étape 1)
//       Atelier1-Courriels-boite-de-Mathieu.pdf les 8 courriels de l'étape 4, une page par courriel
//   → labs/ia-gestion-de-projet-lessard/formateur/Atelier1-Corrige-formateur.pdf (hors zip : ne pas distribuer)
//     + .gpl-labs/html/*.html (sources imprimées) ; le modèle Excel vient de python .gpl-labs/modele_excel.py
// Dates alignées sur le deck : départ lun. 16 nov. 2026, Fêtes 21 déc.–1er janv., bâtiment fermé ven. 28 mai 2027,
// boîte de réception au mer. 16 déc. 2026. Impression : Chrome via playwright-core.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const ICI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const RACINE = path.resolve(ICI, '..');
const SORTIE = path.join(RACINE, 'labs', 'ia-gestion-de-projet-lessard', 'atelier-1');
const HTML = path.join(ICI, 'html');
fs.mkdirSync(SORTIE, { recursive: true });
fs.mkdirSync(HTML, { recursive: true });

const logo = `data:image/png;base64,${fs.readFileSync(path.join(RACINE, 'assets', 'technologia', 'logo-horizontal.png')).toString('base64')}`;

// ─── Styles communs ──────────────────────────────────────────────────────────
const CSS = `
@page { size: A4; margin: 16mm 16mm 18mm; }
* { box-sizing: border-box; }
:root { --ink:#2B2F33; --soft:#4B545B; --muted:#77818A; --faint:#AFB8C0; --rule:#DCE3E8; --panel:#EAF0F4;
  --blue:#1F78C1; --teal:#22A6B3; --green:#3A9F45; --yellow:#FFD000; --amber:#E8A600; --coral:#E0573D; --violet:#6B57C9; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin:0; font-family: Barlow, Arial, sans-serif; font-size: 10.5pt; line-height: 1.45; color: var(--ink); }
h1, h2, h3, .disp { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; }
h1 { font-size: 30pt; line-height: 1.05; margin: 0 0 8pt; }
h2 { font-size: 19pt; line-height: 1.1; margin: 0 0 10pt; display:flex; align-items:center; gap:10pt; }
h2 .n { flex:none; width: 26pt; height: 26pt; border-radius: 7pt; background: var(--yellow); color: var(--ink); display:inline-flex; align-items:center; justify-content:center; font-size: 15pt; }
h3 { font-size: 13.5pt; margin: 14pt 0 5pt; color: var(--blue); break-after: avoid; }
h2 { break-after: avoid; }
p { margin: 0 0 7pt; }
ul, ol { margin: 0 0 8pt; padding-left: 16pt; } li { margin: 2pt 0; }
.np { break-before: page; }
.keep { break-inside: avoid; }
.eyebrow { font-family: 'Barlow Condensed', Arial, sans-serif; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 9.5pt; color: var(--blue); }
.muted { color: var(--muted); } .small { font-size: 9pt; }
.lede { font-size: 12pt; color: var(--soft); margin-bottom: 12pt; }
.box { border-radius: 8pt; padding: 9pt 12pt; margin: 8pt 0 10pt; break-inside: avoid; }
.box > b:first-child, .box .t { display:block; font-family:'Barlow Condensed', Arial, sans-serif; font-weight:700; font-size: 10pt; letter-spacing:.1em; text-transform: uppercase; margin-bottom: 3pt; }
.tip { background: #E3EFF9; } .tip .t { color: var(--blue); }
.warn { background: #FBE3DD; } .warn .t { color: #B23A22; }
.ok { background: #E3F2E5; } .ok .t { color: #2A7A33; }
.note { background: #FFF6CC; } .note .t { color: #8A6A00; }
.prompt { background: #fff; border: 1.2pt solid var(--rule); border-left: 4pt solid var(--blue); border-radius: 6pt; padding: 8pt 12pt; margin: 6pt 0 10pt; break-inside: avoid; }
.prompt .t { color: var(--blue); font-family:'Barlow Condensed', Arial, sans-serif; font-weight:700; font-size:9.5pt; letter-spacing:.1em; text-transform:uppercase; margin-bottom: 3pt; display:block; }
.prompt .slot { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 9pt; color: var(--muted); }
table { width: 100%; border-collapse: collapse; margin: 6pt 0 10pt; break-inside: avoid; }
th { background: var(--blue); color: #fff; text-align: left; font-weight: 600; font-size: 9.5pt; padding: 5pt 7pt; }
td { border-bottom: 1pt solid var(--rule); padding: 5pt 7pt; vertical-align: top; }
tr.alt td { background: #F6F9FB; }
td.blank { height: 22pt; }
.k { font-weight: 700; color: var(--blue); white-space: nowrap; }
.check { list-style: none; padding-left: 0; } .check li { padding-left: 20pt; position: relative; margin: 4pt 0; }
.check li::before { content: ''; position: absolute; left: 0; top: 2pt; width: 11pt; height: 11pt; border: 1.3pt solid var(--soft); border-radius: 2.5pt; }
.x2 { display:inline-block; font-size: 8pt; font-weight:700; color:#fff; background: var(--coral); border-radius: 3pt; padding: 0 4pt; margin-left: 4pt; }
.grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 10pt; }
.card { border: 1pt solid var(--rule); border-radius: 8pt; padding: 8pt 10pt; break-inside: avoid; }
.card h4 { margin: 0 0 3pt; font-family:'Barlow Condensed', Arial, sans-serif; font-size: 12pt; }
.tag { display:inline-block; font-size: 8.5pt; font-weight: 600; padding: 0 6pt; border-radius: 99pt; background: var(--panel); color: var(--soft); }
.fict { font-size: 8.5pt; color: var(--muted); border: 1pt dashed var(--faint); border-radius: 4pt; padding: 2pt 6pt; display: inline-block; }
code { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 8.8pt; background: var(--panel); padding: 0 3pt; border-radius: 3pt; }
`;

const page = (title, body, extra = '') => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${CSS}${extra}</style></head><body>${body}</body></html>`;

// Demande à copier.
const P = (text, label = 'Votre demande à copier') => `<div class="prompt"><span class="t">${label}</span>${text}</div>`;
const BOX = (kind, title, html) => `<div class="box ${kind}"><span class="t">${title}</span>${html}</div>`;

// ═══════════════════════════════════════════════════════════════════════════════
// 1. GUIDE DU PARTICIPANT
// ═══════════════════════════════════════════════════════════════════════════════
const guideCss = `
.cover { height: 255mm; display:flex; flex-direction:column; }
.cover .band { margin-top: 28mm; border-left: 6pt solid var(--yellow); padding-left: 16pt; }
.cover h1 { font-size: 40pt; margin: 6pt 0 10pt; }
.cover .sub { font-size: 14pt; color: var(--soft); max-width: 150mm; }
.cover .meta { margin-top: 18mm; display:grid; grid-template-columns: 1fr 1fr; gap: 10pt; }
.cover .foot { margin-top: auto; display:flex; justify-content: space-between; align-items: flex-end; color: var(--muted); font-size: 9.5pt; }
.files li { margin: 3pt 0; }
.files b { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 8.8pt; font-weight: 500; }
.toc { columns: 2; column-gap: 14pt; padding-left: 14pt; } .toc li { break-inside: avoid; }
.steps td:first-child { width: 22%; } .steps td:nth-child(2) { width: 11%; white-space: nowrap; }
`;

const guide = page(
  'Atelier 1 · Guide du participant',
  `
<section class="cover">
  <img src="${logo}" alt="Technologia" style="height:34pt;align-self:flex-start;mix-blend-mode:multiply">
  <div class="band">
    <div class="eyebrow">IA124 · IA appliquée à la gestion de projet · Jour 1</div>
    <h1>Atelier 1<br>Lancer un projet avec l’IA</h1>
    <div class="sub">Guide du participant : du dossier des ventes au plan du projet du Centre sportif de Montréal, puis une boîte de réception à reprendre en main.</div>
  </div>
  <div class="meta">
    <div class="card"><h4>Format</h4>Classe virtuelle · atelier <b>individuel</b>, chacun sur son poste · ≈ 1 h 45 : une courte démonstration, puis votre travail, étape par étape.</div>
    <div class="card"><h4>Outils</h4>Copilot avec votre compte Lessard (Outlook et Copilot Chat). Puis Excel, Planner ou Smartsheet. Claude en option.</div>
    <div class="card" style="grid-column: span 2"><h4>Dans votre paquet</h4>
      <ul class="files" style="margin:0">
        <li><b>Atelier1-Guide-participant.pdf</b> · ce guide : toutes les consignes et les demandes à copier</li>
        <li><b>Atelier1-Dossier-transmis-par-Eric.pdf</b> · le dossier des ventes : courriel d’Éric, fiche de transfert, calendrier, intervenants</li>
        <li><b>Soumission_Montreal.pdf</b> · la soumission signée (à joindre à Copilot Chat)</li>
        <li><b>Atelier1-Courriels-boite-de-Mathieu.pdf</b> · 8 courriels, une page par courriel (étape 4)</li>
        <li><b>Atelier1-Modele-suivi-des-taches.xlsx</b> · modèle Excel : tâches et échéancier, risques, RACI</li>
      </ul>
    </div>
  </div>
  <div class="foot"><span>Préparé pour le Groupe Lessard · Formateur : Houssem Eddine Lassoued</span><span class="fict">Cas fictif de formation</span></div>
</section>

<section class="np">
  <h2>Sommaire</h2>
  <ol class="toc">
    <li>Avant de commencer</li><li>Votre mission et le livrable</li><li>Le cas en bref</li><li>Une bonne demande en cinq ingrédients</li>
    <li>Étape 1 · Découvrir l’outil</li><li>Étape 2 · Cadrer : la fiche de démarrage</li><li>Étape 3 · Planifier</li>
    <li>Étape 4 · Trier la boîte de réception et relancer</li><li>Étape 5 · Vérifier et présenter</li><li>Parcours adjointe</li>
    <li>Pour aller plus loin : votre mini-outil de suivi</li><li>Coincé ?</li><li>Annexes : modèles et glossaire</li>
  </ol>

  <h2 style="margin-top:14pt"><span class="n">1</span>Avant de commencer</h2>
  <h3>Installez-vous (5 minutes)</h3>
  <ul class="check">
    <li>Deux fenêtres côte à côte : la classe virtuelle d’un côté, Copilot de l’autre. Idéalement, deux écrans.</li>
    <li>Ouvrez Copilot Chat (application Microsoft 365 Copilot, Teams ou Edge) et connectez-vous avec votre <b>compte Lessard</b>.</li>
    <li>Vérifiez le <b>bouclier vert</b> près de la zone de saisie : il indique la protection des données de l’entreprise. Pas de bouclier : n’y mettez aucun dossier client.</li>
    <li>Ouvrez les fichiers du paquet. Gardez ce guide ouvert : toutes les demandes à copier y sont.</li>
    <li>Ouvrez le modèle Excel si vous comptez l’utiliser (étape 3).</li>
  </ul>
  <h3>Comment se passe l’atelier à distance</h3>
  <ul>
    <li><b>Individuel</b> : chacun travaille seul, sur son poste, micro coupé. Le formateur ne voit pas votre écran.</li>
    <li>Le formateur montre chaque étape en quelques minutes, puis lance <b>le minuteur de l’étape</b> : 5, 10, 25, 10 et 5 minutes.</li>
    <li><b>Un point d’étape</b> de 3 minutes à la fin de chaque étape : où en êtes-vous, qu’a raté l’IA ? Répondez au micro.</li>
    <li>Bloqué ? Dites-le au micro ou dans le Chat. Le formateur peut vous demander de partager votre écran 2 minutes.</li>
    <li>À la fin, <b>2 ou 3 volontaires</b> partagent leur écran 2 minutes. Les autres peuvent déposer une capture dans le Chat.</li>
  </ul>
  ${BOX('warn', 'Les données : la règle qui ne se discute pas', `Le cas de l’atelier est <b>fictif</b>. Sur vos vrais projets : uniquement les outils approuvés par Lessard, avec votre compte Lessard. Jamais de soumission, de prix, de nom de client ou de courriel client dans un compte personnel (ChatGPT, Gemini, Claude personnels).`)}

  <h2 class="np"><span class="n">2</span>Votre mission et le livrable</h2>
  <p class="lede">Vous êtes <b>Mathieu, chargé de projet</b>. Ce lundi 16 novembre, Éric (ventes) vous transmet le dossier du Centre sportif de Montréal. Vous devez lancer le projet cette semaine… entre douze autres projets. Puis, à la mi-décembre, reprendre en main votre boîte de réception.</p>
  <div class="grid2">
    <div class="card"><h4>Le livrable</h4>
      <ul style="margin:0">
        <li>Une fiche de démarrage d’une page, avec les points à clarifier</li>
        <li>Un plan de 6 à 8 étapes, des tâches datées avec un responsable</li>
        <li>3 jalons et le chemin critique</li>
        <li>5 risques avec une mesure chacun</li>
        <li>Une RACI vérifiée (un seul A par ligne)</li>
        <li>Les tâches <b>dans un outil de suivi</b>, pas dans une conversation</li>
        <li>La boîte de réception triée et une relance prête à envoyer</li>
      </ul>
    </div>
    <div class="card"><h4>La règle d’or</h4>
      <p>L’IA va vite pour structurer, résumer et proposer. Elle se trompe sur ce qui demande de connaître la réalité : délais, dépendances, responsabilités, promesses faites au client.</p>
      <p style="margin:0"><b>Vous vérifiez tout</b>, ligne par ligne, avec le dossier et le calendrier réel.</p>
    </div>
  </div>
  <h3>Le déroulé</h3>
  <table class="steps">
    <tr><th>Étape</th><th>Durée</th><th>Ce que vous faites</th><th>Résultat</th></tr>
    <tr><td><b>1 · Découvrir</b></td><td>15 min</td><td>Démonstration de Copilot dans Outlook et de Copilot Chat, puis 5 minutes d’essai avec la soumission jointe.</td><td>Vous savez joindre un document et l’interroger.</td></tr>
    <tr class="alt"><td><b>2 · Cadrer</b></td><td>10 min</td><td>Le dossier d’Éric en une fiche de démarrage.</td><td>Fiche + questions pour Éric.</td></tr>
    <tr><td><b>3 · Planifier</b></td><td>25 min</td><td>Découpage, échéancier, risques, RACI, puis l’outil de suivi.</td><td>Le plan dans Excel, Planner, Smartsheet…</td></tr>
    <tr class="alt"><td><b>4 · Trier et relancer</b></td><td>10 min</td><td>Les 8 courriels de Mathieu : votre tri, puis celui de Copilot. Une relance.</td><td>Boîte triée, relance prête.</td></tr>
    <tr><td><b>5 · Vérifier et présenter</b></td><td>15 min</td><td>Grille de contrôle, puis partage d’écran de 2 ou 3 volontaires.</td><td>Plan prêt à présenter à Hélène.</td></tr>
    <tr class="alt"><td><b>Option</b></td><td>—</td><td>Pour les plus rapides : votre propre mini-outil de suivi, généré par l’IA (section 11).</td><td>Un prototype personnel.</td></tr>
  </table>
  <p class="small muted">Chaque étape a son minuteur, puis un point d’étape. Si vous manquez de temps, priorité : la fiche (étape 2), l’échéancier en tableau (3b) et le tri (étape 4).</p>

  <h2 class="np"><span class="n">3</span>Le cas en bref</h2>
  <p class="lede">Le Centre sportif de Montréal est un projet fictif, mais il devrait vous sembler familier : un bâtiment institutionnel, un entrepreneur général, un architecte, et votre lot, l’enveloppe en aluminium et verre.</p>
  <table>
    <tr><th style="width:26%">Élément</th><th>Ce que dit le dossier</th></tr>
    <tr><td class="k">Objet</td><td>Lot enveloppe : mur-rideau du hall (420 m²), 46 fenêtres, 6 portes d’entrée, 1 verrière.</td></tr>
    <tr class="alt"><td class="k">Contrat</td><td>1,2 M$ avec Construction Boréa (entrepreneur général, « l’EG »). Propriétaire : Ville de Rivière-Claire. Architecte : Atelier Mercier.</td></tr>
    <tr><td class="k">Départ</td><td>Lundi 16 novembre 2026.</td></tr>
    <tr class="alt"><td class="k">Échéance</td><td>Bâtiment fermé le vendredi 28 mai 2027. Structure d’acier terminée vers le 15 mars.</td></tr>
    <tr><td class="k">Délais</td><td>Dessins d’atelier : 3 semaines, puis 10 jours ouvrables d’approbation. Verre : 8 semaines après la commande.</td></tr>
    <tr class="alt"><td class="k">Contraintes</td><td>Usine et chantier fermés 2 semaines aux Fêtes (21 décembre au 1er janvier). Relevés au chantier une fois la structure terminée.</td></tr>
    <tr><td class="k">Déjà connu</td><td>Exclus : calfeutrage intérieur, stores. Éric a promis à Boréa une pose du hall « dès mars ».</td></tr>
  </table>
  <h3>L’équipe du projet</h3>
  <div class="grid2">
    <div class="card"><h4>Chez Lessard</h4>
      <ul style="margin:0">
        <li><b>Mathieu</b> · chargé de projet (vous)</li>
        <li><b>Hélène</b> · directrice de projets</li>
        <li><b>Nadia</b> · adjointe chargée de projet</li>
        <li><b>Éric</b> · représentant des ventes</li>
        <li><b>Patrice</b> · contremaître d’installation</li>
      </ul></div>
    <div class="card"><h4>À l’externe</h4>
      <ul style="margin:0">
        <li><b>Construction Boréa</b> · entrepreneur général</li>
        <li><b>Atelier Mercier</b> · architecte</li>
        <li><b>Ville de Rivière-Claire</b> · propriétaire</li>
        <li><b>Vitrerie Laurentienne</b> · fournisseur du verre</li>
        <li><b>Panneaux Nordik</b> · panneaux d’allège</li>
      </ul></div>
  </div>
  ${BOX('tip', 'Le dossier complet', `Les détails (courriel d’Éric, fiche de transfert, calendrier, contacts, notes de la rencontre avec Boréa) sont dans <b>Atelier1-Dossier-transmis-par-Eric.pdf</b>. À la fin de ce dossier, un <b>résumé prêt à coller</b> si Copilot ne lit pas le PDF.`)}

  <h2 class="np"><span class="n">4</span>Une bonne demande en cinq ingrédients</h2>
  <p class="lede">Plus l’IA a de contexte, moins elle invente. Toutes les demandes de ce guide suivent cette recette.</p>
  <table>
    <tr><th style="width:18%">Ingrédient</th><th style="width:38%">La question</th><th>Exemple</th></tr>
    <tr><td class="k">Rôle</td><td>Qui doit-elle être ?</td><td>« Tu es chargé de projet chez un fabricant-installateur d’enveloppe en aluminium et verre. »</td></tr>
    <tr class="alt"><td class="k">Contexte</td><td>Que doit-elle savoir ? (l’ingrédient le plus oublié)</td><td>Le dossier, les dates, ce qui s’est passé, l’impact.</td></tr>
    <tr><td class="k">Tâche</td><td>Que doit-elle faire, précisément ?</td><td>« Rédige la fiche de démarrage. »</td></tr>
    <tr class="alt"><td class="k">Format</td><td>Sous quelle forme ?</td><td>« En une page », « en tableau : Tâche | Responsable | Fin ».</td></tr>
    <tr><td class="k">Contraintes</td><td>Quelles limites ?</td><td>« Utilise seulement les dates du dossier », « 6 lignes maximum ».</td></tr>
  </table>
  <h3>Trois réflexes qui changent tout</h3>
  <div class="grid2">
    <div class="card"><h4>« Signale ce qui manque ou se contredit. »</h4>L’IA liste les questions à poser au lieu d’inventer les réponses.</div>
    <div class="card"><h4>« Pose-moi d’abord tes questions. »</h4>Avant une tâche floue : elle vous demande ce qui lui manque.</div>
    <div class="card"><h4>« Quelles dates as-tu supposées ? »</h4>Après un plan : elle avoue souvent ses hypothèses.</div>
    <div class="card"><h4>Relancer, préciser, corriger</h4>La qualité vient de la conversation : « plus court », « en tableau », « tu as oublié les Fêtes ».</div>
  </div>
  ${BOX('note', 'Pourquoi vérifier', `L’IA prédit le mot le plus probable, pas le vrai. Un délai « typique », une norme, une quantité : elle peut les inventer avec aplomb.`)}

  <h2 class="np"><span class="n">5</span>Étape 1 · Découvrir l’outil <span class="tag">15 min</span></h2>
  <p class="lede">Le formateur montre deux façons d’utiliser Copilot. Ensuite, 5 minutes pour essayer vous-même.</p>
  <h3>A · Copilot dans Outlook (licence Microsoft 365 Copilot)</h3>
  <table>
    <tr><th style="width:30%">Où</th><th>À quoi ça sert</th></tr>
    <tr><td class="k">« Résumer » en haut d’un courriel</td><td>L’essentiel d’un long fil (14 messages avec l’architecte, par exemple) et ce qui reste ouvert.</td></tr>
    <tr class="alt"><td class="k">« Brouillon avec Copilot »</td><td>Vous décrivez la réponse en une phrase, il rédige. Vous relisez, vous corrigez, vous envoyez.</td></tr>
    <tr><td class="k">Accompagnement</td><td>Il relit votre propre courriel : ton, clarté, ce qui pourrait irriter. Utile avant un courriel délicat.</td></tr>
    <tr class="alt"><td class="k">Le volet Copilot, à droite</td><td>Des questions sur vos courriels : « Quels courriels de Boréa attendent encore ma réponse ? »</td></tr>
  </table>
  <p class="small muted">Sans cette licence : copiez le texte du courriel dans Copilot Chat. C’est moins fluide, mais ça marche.</p>
  <h3>B · Copilot Chat avec un document joint (tous les comptes Lessard)</h3>
  <ol>
    <li>Dans Copilot Chat, cliquez sur le trombone (ou « + ») et joignez <b>Soumission_Montreal.pdf</b>.</li>
    <li>Posez la question :</li>
  </ol>
  ${P('Résume ce dossier pour le chargé de projet : périmètre, exclusions, dates, promesses faites au client.')}
  <ol start="3"><li>Puis la relance la plus utile :</li></ol>
  ${P('Qu’est-ce qui manque pour lancer le projet ? Pose-moi tes questions.')}
  <ol start="4"><li>Notez les questions qu’elle vous renvoie : vous en aurez besoin à l’étape 2.</li></ol>
  ${BOX('tip', 'Et avec Claude ?', `Si vous avez un compte Claude : un « projet » garde les documents et vos consignes d’une conversation à l’autre. Pratique pour un dossier qui dure six mois. Faites la même demande et comparez.`)}

  <h2 class="np"><span class="n">6</span>Étape 2 · Cadrer : la fiche de démarrage <span class="tag">10 min</span></h2>
  <p class="lede">Le passage de la vente au projet, c’est là que se perdent les promesses. Une fiche d’une page, relue par Éric, évite bien des surprises.</p>
  <ol>
    <li>Joignez <b>Atelier1-Dossier-transmis-par-Eric.pdf</b> et <b>Soumission_Montreal.pdf</b> à Copilot Chat (ou collez le résumé de la dernière page du dossier).</li>
    <li>Copiez la demande :</li>
  </ol>
  ${P('Tu es chargé de projet chez un fabricant-installateur d’enveloppe en aluminium et verre. À partir du dossier transmis par les ventes (fichiers joints), rédige la fiche de démarrage du projet en une page : périmètre (inclus / exclu), dates clés, intervenants, engagements pris envers le client. Signale ce qui manque ou se contredit, sous forme de questions à poser à Éric.')}
  <ol start="3">
    <li>Relisez la fiche avec le dossier sous les yeux : toutes les exclusions y sont ? Les dates sont-elles celles du dossier ?</li>
    <li>Gardez les « points à clarifier » : ce sont vos questions pour Éric. Ce n’est pas à l’IA de trancher.</li>
  </ol>
  ${BOX('note', 'Cherchez la contradiction', `Une promesse a été faite à Boréa. Est-elle tenable, compte tenu des autres dates du dossier ? Est-elle écrite au contrat ? Si la fiche ne le signale pas, demandez-le : « Les engagements d’Éric sont-ils compatibles avec les dates du dossier ? »`)}
  <p class="small muted">Un modèle de fiche vide est en annexe A, si vous voulez comparer la structure.</p>

  <h2 class="np"><span class="n">7</span>Étape 3 · Planifier <span class="tag">25 min</span></h2>
  <p class="lede">Quatre demandes dans la même conversation (l’IA garde le contexte), puis le transfert dans un outil de suivi.</p>
  <h3>3a · Le découpage</h3>
  ${P('Découpe le lot enveloppe en 6 à 8 étapes, puis chaque étape en tâches de 1 à 2 semaines. Présente le résultat en liste numérotée.')}
  <p><b>Complétez ce que l’IA oublie.</b> Posez-vous ces questions : où est le travail du chargé de projet lui-même (réunions, rapports, avis de modification) ? Les approbations du client (échantillons, maquette) ? Les essais ? La fermeture (déficiences, documents de fin, garanties) ? Les moyens au chantier (grue, accès) ?</p>
  <h3>3b · L’échéancier et ses jalons</h3>
  ${P('Place ces tâches sur 28 semaines, du lundi 16 novembre 2026 au vendredi 28 mai 2027, avec les dépendances, 3 jalons et le chemin critique. Respecte les délais du dossier (dessins d’atelier 3 semaines, approbation 10 jours ouvrables, verre 8 semaines après la commande) et la fermeture de l’usine et du chantier du 21 décembre au 1er janvier. Présente un tableau avec exactement ces colonnes : Étape | Tâche | Responsable | Début | Fin | Statut | Dépendance. Dates au format AAAA-MM-JJ, statut « À faire », un seul responsable par tâche parmi Mathieu, Hélène, Nadia, Éric, Patrice.')}
  <p>Puis, toujours :</p>
  ${P('Quelles dates as-tu supposées ? Lesquelles ne viennent pas du dossier ? Quel est le chemin critique, et quelle marge reste-t-il avant le 28 mai ?', 'La question de contrôle')}
  <h3>3c · Les risques</h3>
  ${P('Liste 6 risques pour ce projet. Pour chacun : probabilité (1 à 3), impact (1 à 3), une mesure concrète et un responsable. Présente un tableau : Risque | Probabilité | Impact | Mesure | Responsable.')}
  <p>L’IA est excellente pour proposer des risques auxquels vous n’aviez pas pensé. Mais la probabilité et l’impact sont un <b>jugement</b> : c’est votre expérience qui les fixe.</p>
  <h3>3d · Qui fait quoi : la RACI</h3>
  ${P('Propose une matrice RACI pour ces six activités : revue du contrat, dessins d’atelier, commandes et livraisons, classement et suivis, pose au chantier, liste de déficiences. Présente un tableau : Tâche | Mathieu | Hélène | Nadia | Éric | Patrice. R réalise, A approuve, C est consulté, I est informé. Une seule lettre A par ligne.')}
  ${BOX('warn', 'À vérifier ligne par ligne', `Un seul A par ligne (qui tranche ?). Au moins un A par ligne (qui approuve ?). Et surtout : l’IA ne connaît pas votre organisation. Qui a vraiment l’autorité chez Lessard ? La RACI se valide avec les personnes concernées.`)}

  <h3 class="np">3e · Du plan aux tâches : dans l’outil, pas dans un document</h3>
  <p class="lede">Un plan qui reste dans une conversation ne se suit pas. Choisissez votre outil :</p>
  <table>
    <tr><th style="width:20%">Outil</th><th>Comment faire</th></tr>
    <tr><td class="k">Excel (modèle fourni)</td><td>Ouvrez <b>Atelier1-Modele-suivi-des-taches.xlsx</b>. Copiez le tableau de l’étape 3b (bouton « Copier » sous la réponse) et collez-le dans la feuille <b>Tâches</b>, cellule <b>B5</b>. L’échéancier semaine par semaine se colore tout seul, les Fêtes sont grisées, les tâches en retard passent en rouge. Faites de même dans <b>Risques</b> (collez en B5) et <b>RACI</b> (collez en A5) : la colonne Contrôle signale une ligne sans A ou avec deux A.</td></tr>
    <tr class="alt"><td class="k">Planner</td><td>Si votre licence le permet : demandez à Copilot dans Planner de créer le plan à partir de votre objectif, puis comparez avec votre tableau. Sinon, créez un plan et ajoutez les tâches (responsable, date d’échéance) à partir du tableau. La vue Chronologie affiche l’échéancier.</td></tr>
    <tr><td class="k">Smartsheet</td><td>Remplissez d’abord le modèle Excel, puis dans Smartsheet : <i>Importer › Microsoft Excel</i>, feuille <b>Tâches</b>. La vue Gantt affiche l’échéancier dès que les tâches ont des dates.</td></tr>
    <tr class="alt"><td class="k">Votre mini-outil</td><td>En option, pour les plus rapides : faites générer par l’IA votre propre outil de suivi (section 11).</td></tr>
  </table>
  ${BOX('tip', 'Si le tableau se colle mal dans Excel', `Demandez : « Donne-moi le même tableau au format CSV, séparateur point-virgule, dates AAAA-MM-JJ. » Copiez le texte, collez-le en B5, puis <i>Données › Convertir</i> avec le point-virgule comme séparateur.`)}
  ${BOX('ok', 'La valeur', `Chaque tâche a un responsable et une date : demain, au jour 2, l’IA pourra suivre l’avancement et alerter avant que le retard n’arrive.`)}

  <h2 class="np"><span class="n">8</span>Étape 4 · Trier la boîte de réception et relancer <span class="tag">10 min</span></h2>
  <p class="lede">Nous sommes le <b>mercredi 16 décembre</b>. Ouvrez <b>Atelier1-Courriels-boite-de-Mathieu.pdf</b> : huit courriels, une page par courriel.</p>
  <h3>a · D’abord vous</h3>
  <p>Pour chaque courriel, décidez où il va : <b>À traiter</b> (aujourd’hui, par Mathieu) · <b>À Nadia</b> (à transférer, avec la consigne) · <b>À relancer</b> (on attend une réponse) · <b>À classer</b> (dans le dossier du projet).</p>
  <table>
    <tr><th style="width:6%">N°</th><th style="width:40%">Courriel</th><th>Votre choix</th><th>Choix de Copilot</th><th>Écart ? Pourquoi ?</th></tr>
    <tr><td>1</td><td>Boréa · Date de pose du mur-rideau du hall ?</td><td class="blank"></td><td></td><td></td></tr>
    <tr><td>2</td><td>Boréa · Certificat d’assurance à fournir</td><td class="blank"></td><td></td><td></td></tr>
    <tr><td>3</td><td>Vous · Dessins MR-01 pour approbation (7 déc.)</td><td class="blank"></td><td></td><td></td></tr>
    <tr><td>4</td><td>Vitrerie Laurentienne · Bordereau de livraison 4471</td><td class="blank"></td><td></td><td></td></tr>
    <tr><td>5</td><td>Ville de Rivière-Claire · Formulaire d’accès au chantier</td><td class="blank"></td><td></td><td></td></tr>
    <tr><td>6</td><td>Patrice · Écart de 40 mm à l’axe C</td><td class="blank"></td><td></td><td></td></tr>
    <tr><td>7</td><td>Boréa · Liste des contacts du chantier (rév. 3)</td><td class="blank"></td><td></td><td></td></tr>
    <tr><td>8</td><td>Vous · Prix des panneaux d’allège (4 déc.)</td><td class="blank"></td><td></td><td></td></tr>
  </table>
  <h3>b · Puis Copilot</h3>
  <p>Joignez le PDF des courriels à Copilot Chat (ou copiez-collez leur texte), puis :</p>
  ${P('Voici les 8 courriels de ma boîte de réception de chargé de projet. Classe-les en quatre groupes : à traiter aujourd’hui par moi, à transférer à Nadia (mon adjointe) avec la consigne, à relancer, à classer dans le dossier du projet. Pour chacun, une ligne de justification. Pour ceux à transférer, rédige la consigne à Nadia en une phrase. Présente un tableau.')}
  <p><b>Comparez</b> avec votre propre tri. Les écarts sont intéressants : la règle de transfert dépend de votre équipe (c’est ce qu’on écrira au jour 2). Vérifiez surtout la colonne « à traiter » : un courriel urgent mal classé coûte cher.</p>
  <h3>c · Une relance prête à envoyer</h3>
  ${P('Tu es chargé de projet chez un fabricant-installateur d’enveloppe en aluminium et verre. Le lundi 7 décembre, j’ai soumis à l’architecte (Atelier Mercier) les dessins d’atelier du mur-rideau du hall, MR-01, pour approbation. Aucune réponse depuis. Le devis prévoit 10 jours ouvrables d’approbation : sans approbation d’ici le lundi 21 décembre, la commande du verre (8 semaines de délai) passe après les Fêtes et menace le bâtiment fermé du 28 mai. Rédige une relance courtoise mais ferme : un objet clair, 6 lignes maximum, la date de réponse attendue. Prévois Construction Boréa en copie, pour information.')}
  <p>Relisez : les dates sont-elles exactes ? Le ton convient-il à votre relation avec cet architecte ? Rien d’inventé (une pénalité, une clause) ? Demandez une version plus courte ou plus ferme si besoin.</p>

  <h2 class="np"><span class="n">9</span>Étape 5 · Vérifier et présenter <span class="tag">15 min</span></h2>
  <h3>La grille de contrôle</h3>
  <p>Passez votre plan à la grille. Comptez vos points (les critères ×2 valent 2 points) : <b>0 à 5</b> premier jet à retravailler · <b>6 à 9</b> presque, complétez les trous · <b>10 ou 11</b> prêt à présenter à Hélène.</p>
  <ul class="check">
    <li>Les délais clés ont été validés par une personne qui sait (verrier, bureau technique) <span class="x2">×2</span></li>
    <li>Les dépendances sont indiquées : approbation → verre → pose</li>
    <li>Le chemin critique est identifié</li>
    <li>Chaque tâche a un responsable (un seul) et une date <span class="x2">×2</span></li>
    <li>Le calendrier réel est respecté : fermeture des Fêtes, congés de l’équipe</li>
    <li>Chaque risque majeur a une mesure et un responsable</li>
    <li>Les exclusions et les promesses des ventes sont reprises</li>
    <li>Aucun fait inventé : délais, normes, quantités vérifiés <span class="x2">×2</span></li>
  </ul>
  <h3>Les quatre pièges les plus fréquents</h3>
  <div class="grid2">
    <div class="card"><h4>1 · Une durée inventée</h4>L’IA remplace un délai du dossier par une valeur « typique ». Confrontez chaque durée au dossier.</div>
    <div class="card"><h4>2 · Le calendrier réel oublié</h4>Les Fêtes, les congés, la météo : l’IA les ignore si vous ne les donnez pas.</div>
    <div class="card"><h4>3 · Un ordre impossible</h4>Une tâche placée avant celle dont elle dépend (poser avant les relevés, par exemple).</div>
    <div class="card"><h4>4 · Une promesse oubliée</h4>Un engagement des ventes que le plan contredit, sans que personne prévienne le client.</div>
  </div>
  ${BOX('tip', 'Votre méthode', `Confrontez chaque ligne au dossier et au calendrier réel. Et demandez à l’IA : « Quelles dates as-tu supposées ? » Elle vous le dira souvent.`)}
  <h3>Présenter (2 ou 3 volontaires)</h3>
  <p>Les volontaires partagent leur écran 2 minutes et répondent à trois questions. Les autres réagissent au micro ou déposent une capture dans le Chat.</p>
  <ol>
    <li>Qu’est-ce que l’IA a bien fait ? (résumé du dossier, structure, idées de risques…)</li>
    <li>Qu’avez-vous dû corriger ? (délais, dépendances, promesses des ventes, oublis)</li>
    <li>Le referiez-vous avec l’IA, sur votre prochain vrai projet ?</li>
  </ol>
  <p class="small muted">Puis un court sondage, un numéro par personne, à voix haute : le temps gagné par rapport à un plan fait seul.</p>

  <h2 class="np"><span class="n">10</span>Parcours adjointe</h2>
  <p class="lede">Même dossier, autre point de vue : celui de Nadia. Les adjointes commencent par l’étape 4, puis préparent les suivis et le classement.</p>
  <ol>
    <li><b>L’étape 4</b> (tri de la boîte de réception) : du point de vue de Nadia, quels courriels lui reviennent, avec quelle consigne ?</li>
    <li><b>La liste des suivis à faire</b> :</li>
  </ol>
  ${P('Je suis adjointe chargée de projet. À partir de ces courriels et du dossier du projet (joints), dresse la liste des suivis à faire cette semaine : quoi, pour qui, avant quand, et ce que je dois demander à Mathieu (le chargé de projet) avant d’agir. Présente un tableau trié par échéance.')}
  <ol start="3"><li><b>Le plan de classement du dossier</b> :</li></ol>
  ${P('Propose un plan de classement du dossier de projet pour un lot d’enveloppe en aluminium et verre (dossiers et sous-dossiers) : contrat et soumission, dessins et approbations, achats et livraisons, chantier, correspondance, fin de projet. Ajoute une règle de nommage des fichiers, avec trois exemples tirés de ces courriels.')}
  <ol start="4"><li>Ensuite, si le temps le permet : les étapes 2 et 3.</li></ol>
  ${BOX('tip', 'Regardez aussi la RACI', `La ligne « Classement et suivis » : Nadia réalise, Mathieu approuve. Est-ce votre réalité ? C’est ce qu’on formalisera au jour 2 avec les règles de transfert.`)}

  <h2 class="np"><span class="n">11</span>Pour aller plus loin</h2>
  <h3>Votre propre mini-outil de suivi (vibecoding)</h3>
  <p>Au-delà d’Excel, Planner ou Smartsheet, vous pouvez faire générer par l’IA un petit outil sur mesure. Le <b>vibecoding</b>, c’est décrire en français l’outil que vous voulez : l’IA écrit le code. Le formateur en fait la démonstration ; à vous d’essayer.</p>
  <table>
    <tr><th style="width:22%">Avec</th><th>Ce qui se passe</th></tr>
    <tr><td class="k">Claude</td><td>L’outil s’affiche à côté de la conversation (« artefact ») : vous l’essayez tout de suite.</td></tr>
    <tr class="alt"><td class="k">Gemini</td><td>Même principe avec « Canvas » : l’outil s’affiche et se modifie à côté de la conversation.</td></tr>
    <tr><td class="k">Copilot</td><td>Il écrit le même code. Copiez-le dans le Bloc-notes, enregistrez sous <code>suivi-montreal.html</code>, puis ouvrez le fichier dans Edge. L’aperçu intégré dépend de votre version.</td></tr>
  </table>
  ${P(`Tu es développeur web. Crée une application de suivi de projet en un seul fichier HTML (HTML, CSS et JavaScript dans le même fichier, sans serveur ni bibliothèque externe), en français.<br>
Le projet : lot enveloppe du Centre sportif de Montréal, du lundi 16 novembre 2026 au vendredi 28 mai 2027.<br>
Fonctions :<br>
1. Un tableau des tâches : étape, tâche, responsable, début, fin, statut (À faire, En cours, À valider, Terminé), dépendance.<br>
2. Ajouter, modifier, supprimer une tâche ; filtrer par responsable et par statut.<br>
3. Les tâches en retard (fin dépassée et statut différent de « Terminé ») en rouge.<br>
4. En haut : l’avancement en % (tâches terminées sur le total) et les 3 jalons avec leur date.<br>
5. Une vue chronologique simple, semaine par semaine, avec les deux semaines des Fêtes grisées.<br>
6. Les données restent dans le navigateur, avec un bouton « Exporter en CSV » (séparateur point-virgule, pour Excel en français).<br>
Voici mes tâches de départ : <span class="slot">[collez ici le tableau de l’étape 3b]</span>`, 'La demande du mini-outil')}
  <p><b>Puis améliorez-le en une phrase</b>, comme avec un collègue : « Ajoute un filtre par étape. » · « Ajoute une colonne Lot. » · « Mets les jalons en losange dans la vue chronologique. » Testez : changez une date de fin dans le passé, la tâche doit passer en rouge. Exportez le CSV et ouvrez-le dans Excel.</p>
  ${BOX('warn', 'Les règles du jeu', `C’est un <b>prototype personnel</b>. Pour cet atelier (cas fictif), Claude, Gemini ou Copilot conviennent. Pour un vrai projet : données anonymisées et outils approuvés par Lessard seulement. Un fichier sur votre poste n’est pas un outil d’équipe : pas de sauvegarde, pas de partage, pas de droits d’accès. Avant d’en faire l’outil de l’équipe, passez par vos TI. Et vérifiez ce qu’il calcule, comme pour le plan.`)}
  <h3>Trois petits défis</h3>
  <ul>
    <li><b>Comparer</b> Copilot et Claude sur la même demande (fiche ou échéancier) : lequel signale le plus de points à clarifier ?</li>
    <li><b>Smartsheet</b> : « Donne-moi ce plan sous forme de tableau prêt à importer dans Smartsheet, avec une colonne Prédécesseurs. »</li>
    <li><b>En anglais</b> : « Rédige la même relance en anglais, pour un fournisseur américain. »</li>
  </ul>

  <h2 class="np"><span class="n">12</span>Coincé ?</h2>
  <table>
    <tr><th style="width:36%">Situation</th><th>Que faire</th></tr>
    <tr><td>Copilot ne lit pas mon PDF</td><td>Ouvrez le PDF, sélectionnez tout (Ctrl+A), copiez (Ctrl+C) et collez le texte dans la conversation. Ou utilisez le résumé à coller, à la fin du dossier d’Éric.</td></tr>
    <tr class="alt"><td>La réponse est longue et générique</td><td>Ajoutez les ingrédients qui manquent : le format (« en tableau », « en 10 lignes ») et les contraintes (« seulement les dates du dossier »).</td></tr>
    <tr><td>L’IA invente des dates</td><td>« N’utilise que les dates et délais du dossier. Signale chaque hypothèse dans une colonne à part. »</td></tr>
    <tr class="alt"><td>Le tableau se colle mal dans Excel</td><td>Bouton « Copier » sous la réponse, ou demandez un CSV au point-virgule (voir l’étape 3e).</td></tr>
    <tr><td>Je n’ai pas la licence Microsoft 365 Copilot</td><td>Tout l’atelier se fait dans Copilot Chat, en joignant ou en collant les documents. Seules les fonctions intégrées à Outlook manquent.</td></tr>
    <tr class="alt"><td>Je suis en retard</td><td>Priorité : la fiche (étape 2), l’échéancier en tableau (3b), le tri (étape 4). Le reste après la formation.</td></tr>
    <tr><td>Je ne sais pas quoi demander</td><td>« Pose-moi les questions qui te manquent pour… » : laissez l’IA vous guider.</td></tr>
    <tr class="alt"><td>Toujours bloqué</td><td>Dites-le au micro ou dans le Chat : le formateur vous propose un partage d’écran de 2 minutes.</td></tr>
  </table>
  ${BOX('ok', 'Après la formation', `Refaites ce parcours sur un de vos vrais projets, anonymisé, avec votre compte Lessard : fiche de démarrage, échéancier, risques, tri de la boîte de réception. Gardez les demandes qui marchent dans votre bibliothèque personnelle.`)}

  <h2 class="np"><span class="n">A</span>Annexes : modèles</h2>
  <h3>A · Fiche de démarrage</h3>
  <table>
    <tr><th style="width:30%">Rubrique</th><th>Contenu</th></tr>
    <tr><td class="k">Périmètre inclus</td><td class="blank"></td></tr>
    <tr><td class="k">Exclusions</td><td class="blank"></td></tr>
    <tr><td class="k">Dates clés</td><td class="blank"></td></tr>
    <tr><td class="k">Intervenants</td><td class="blank"></td></tr>
    <tr><td class="k">Engagements envers le client</td><td class="blank"></td></tr>
    <tr><td class="k">Points à clarifier (avec qui ?)</td><td class="blank"></td></tr>
    <tr><td class="k">Risques immédiats</td><td class="blank"></td></tr>
  </table>
  <h3>B · Registre des risques</h3>
  <table>
    <tr><th style="width:6%">N°</th><th style="width:32%">Risque</th><th style="width:9%">Proba. (1-3)</th><th style="width:9%">Impact (1-3)</th><th>Mesure</th><th style="width:13%">Responsable</th></tr>
    <tr><td>R1</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>R2</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>R3</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>R4</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>R5</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
  </table>
  <h3>C · Matrice RACI</h3>
  <table>
    <tr><th style="width:34%">Activité</th><th>Mathieu</th><th>Hélène</th><th>Nadia</th><th>Éric</th><th>Patrice</th></tr>
    <tr><td>Revue du contrat</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Dessins d’atelier</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Commandes et livraisons</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Classement et suivis</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Pose au chantier</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Liste de déficiences</td><td class="blank"></td><td></td><td></td><td></td><td></td></tr>
  </table>
  <p class="small muted">R réalise · A approuve (un seul par ligne) · C est consulté · I est informé.</p>

  <h2 class="np"><span class="n">B</span>Annexe : glossaire</h2>
  <table>
    <tr><th style="width:26%">Terme</th><th>Définition</th></tr>
    <tr><td class="k">EG</td><td>Entrepreneur général : ici Construction Boréa, qui coordonne le chantier et tous les sous-traitants.</td></tr>
    <tr class="alt"><td class="k">Mur-rideau</td><td>Façade légère en aluminium et verre, accrochée à la structure du bâtiment.</td></tr>
    <tr><td class="k">Verrière</td><td>Toiture vitrée (puits de lumière de grande taille).</td></tr>
    <tr class="alt"><td class="k">Unités scellées</td><td>Vitrages isolants (deux ou trois verres scellés), fabriqués sur mesure par le verrier.</td></tr>
    <tr><td class="k">Panneau d’allège</td><td>Panneau opaque isolé, placé sous une fenêtre ou entre deux étages dans un mur-rideau.</td></tr>
    <tr class="alt"><td class="k">Solin</td><td>Pièce de tôle qui dirige l’eau vers l’extérieur à la jonction de deux éléments.</td></tr>
    <tr><td class="k">Dessins d’atelier</td><td>Dessins de fabrication produits par Lessard et soumis à l’architecte pour approbation avant toute commande.</td></tr>
    <tr class="alt"><td class="k">Relevés</td><td>Mesures prises au chantier sur la structure réelle, avant la fabrication finale.</td></tr>
    <tr><td class="k">Bâtiment fermé</td><td>Enveloppe étanche : l’EG peut lancer les finitions intérieures. C’est l’échéance contractuelle du lot.</td></tr>
    <tr class="alt"><td class="k">Jalon</td><td>Un événement daté qui marque une étape franchie (dessins approuvés, verre livré, bâtiment fermé).</td></tr>
    <tr><td class="k">Chemin critique</td><td>La suite de tâches dont tout retard repousse la fin du projet. Ici : dessins → approbation → verre → relevés → pose.</td></tr>
    <tr class="alt"><td class="k">RACI</td><td>Matrice des responsabilités : qui Réalise, qui Approuve, qui est Consulté, qui est Informé.</td></tr>
    <tr><td class="k">Liste de déficiences</td><td>Liste des travaux à corriger ou à terminer, établie à la fin du projet.</td></tr>
    <tr class="alt"><td class="k">Vibecoding</td><td>Créer un petit logiciel en le décrivant en langage courant ; l’IA écrit le code.</td></tr>
  </table>
`,
  guideCss,
);

// ═══════════════════════════════════════════════════════════════════════════════
// 2. DOSSIER TRANSMIS PAR ÉRIC
// ═══════════════════════════════════════════════════════════════════════════════
const docCss = `
.dochead { display:flex; justify-content:space-between; align-items:flex-end; border-bottom: 2pt solid var(--ink); padding-bottom: 6pt; margin-bottom: 12pt; }
.dochead .who { font-family:'Barlow Condensed', Arial, sans-serif; font-weight:700; font-size: 11pt; letter-spacing:.06em; text-transform: uppercase; color: var(--soft); }
.dochead .ref { font-size: 9pt; color: var(--muted); text-align:right; }
.mail { border: 1pt solid var(--rule); border-radius: 6pt; overflow: hidden; }
.mail .hd { background: #F6F9FB; border-bottom: 1pt solid var(--rule); padding: 8pt 12pt; }
.mail .hd table { margin: 0; } .mail .hd td { border: 0; padding: 1.5pt 0; } .mail .hd td:first-child { width: 18mm; color: var(--muted); }
.mail .subj { font-family:'Barlow Condensed', Arial, sans-serif; font-weight:700; font-size: 15pt; margin: 2pt 0 4pt; }
.mail .bd { padding: 12pt 14pt; font-size: 10.5pt; }
.att { display:inline-block; border:1pt solid var(--rule); border-radius: 4pt; padding: 1pt 6pt; font-size: 9pt; margin-right: 4pt; background:#fff; }
.form td:first-child { width: 34%; color: var(--soft); font-weight: 600; }
table.form { break-inside: auto; } table.form tr { break-inside: avoid; }
.fiche h2 { margin-bottom: 6pt; } .fiche td, .fiche th { padding: 3.2pt 7pt; font-size: 9.6pt; line-height: 1.35; }
.sign { margin-top: 10pt; color: var(--soft); }
.hand { font-style: italic; color: #1F4E8A; }
`;
const docHead = (who, ref) => `<div class="dochead"><div><div class="who">${who}</div></div><div class="ref">${ref}<br><span class="fict">Cas fictif de formation · IA124</span></div></div>`;
const mailHd = ({ from, to, cc, date, subj, att }) => `<div class="hd">
  <div class="subj">${subj}</div>
  <table>
    <tr><td>De</td><td>${from}</td></tr>
    <tr><td>À</td><td>${to}</td></tr>
    ${cc ? `<tr><td>Cc</td><td>${cc}</td></tr>` : ''}
    <tr><td>Date</td><td>${date}</td></tr>
    ${att ? `<tr><td>Pièces j.</td><td>${att.map((a) => `<span class="att">📎 ${a}</span>`).join('')}</td></tr>` : ''}
  </table></div>`;

const dossier = page(
  'Dossier transmis par Éric',
  `
<section>
  ${docHead('Groupe Lessard · Ventes → Projets', 'Dossier de transfert · P-2611-04')}
  <div class="eyebrow">Atelier 1 · Données de départ</div>
  <h1>Dossier transmis par Éric</h1>
  <p class="lede">Centre sportif de Montréal · Lot enveloppe en aluminium et verre · Transmis au chargé de projet le lundi 16 novembre 2026.</p>
  <table>
    <tr><th style="width:10%">Page</th><th>Contenu</th></tr>
    <tr><td>2</td><td>Le courriel de transfert d’Éric à Mathieu</td></tr>
    <tr class="alt"><td>3</td><td>La fiche de transfert ventes → projet</td></tr>
    <tr><td>4</td><td>Le calendrier : dates imposées et délais</td></tr>
    <tr class="alt"><td>5</td><td>Les intervenants et leurs coordonnées</td></tr>
    <tr><td>6</td><td>Les notes d’Éric : rencontre avec Boréa du 3 novembre</td></tr>
    <tr class="alt"><td>7</td><td>Le résumé à coller dans Copilot (si le PDF n’est pas lu)</td></tr>
  </table>
  <p>La soumission signée est dans un fichier à part : <b>Soumission_Montreal.pdf</b>.</p>
  ${BOX('warn', 'Rappel', `Ce dossier est fictif, créé pour la formation. Sur un vrai dossier client : votre compte Lessard uniquement, jamais un compte personnel.`)}
</section>

<section class="np">
  ${docHead('Courriel · Boîte de réception de Mathieu', 'Page 2')}
  <div class="mail">
    ${mailHd({
      from: 'Éric · Représentant des ventes, Groupe Lessard',
      to: 'Mathieu · Chargé de projet',
      cc: 'Hélène · Directrice de projets',
      date: 'Lundi 16 novembre 2026, 8 h 12',
      subj: 'Transfert · Centre sportif de Montréal (Boréa) · c’est à toi !',
      att: ['Soumission_Montreal.pdf', 'Fiche_transfert_P-2611-04.pdf', 'Notes_rencontre_Borea_3nov.docx'],
    })}
    <div class="bd">
      <p>Salut Mathieu,</p>
      <p>Bonne nouvelle : le contrat du Centre sportif de Montréal est signé avec Construction Boréa (signature le 6 novembre). C’est le lot enveloppe au complet : le mur-rideau du hall, les 46 fenêtres, les 6 portes d’entrée et la verrière. 1,2 M$. Je te transfère le dossier, c’est toi qui le pilotes à partir d’aujourd’hui.</p>
      <p>Tu trouveras ci-joint la soumission, la fiche de transfert et mes notes de la rencontre avec Boréa du 3 novembre.</p>
      <p>Quelques points à savoir :</p>
      <ul>
        <li>Leur date qui compte, c’est le <b>bâtiment fermé le vendredi 28 mai</b>. Ils veulent lancer les finitions intérieures tout de suite après.</li>
        <li>J’ai dit à Simon (le chargé de projet de Boréa) qu’on pourrait <b>commencer la pose du hall dès mars</b>. Ils comptent un peu là-dessus pour leur échéancier.</li>
        <li>Ils nous ont demandé si on pouvait aussi faire le calfeutrage intérieur et les stores. Je leur ai dit que ce n’était pas dans notre prix, qu’on pourrait en reparler.</li>
        <li>Pour l’architecte, c’est Marc-André Leduc chez Atelier Mercier. Il est rigoureux, mais pas toujours rapide.</li>
      </ul>
      <p>Hélène est au courant. Je suis en déplacement mardi et mercredi, mais joignable sur mon cellulaire si tu as des questions.</p>
      <p>Bon projet !</p>
      <p class="sign">Éric<br><span class="small muted">Représentant des ventes · Groupe Lessard · 514-555-0142</span></p>
    </div>
  </div>
</section>

<section class="np fiche">
  ${docHead('Fiche de transfert · Ventes → Projets', 'Page 3 · Remplie par Éric le 13 novembre 2026')}
  <h2>Fiche de transfert ventes → projet</h2>
  <table class="form">
    <tr><th colspan="2">Identification</th></tr>
    <tr><td>N° de projet</td><td>P-2611-04</td></tr>
    <tr><td>Projet</td><td>Centre sportif de Montréal · lot enveloppe en aluminium et verre</td></tr>
    <tr><td>Propriétaire</td><td>Ville de Rivière-Claire</td></tr>
    <tr><td>Client (entrepreneur général)</td><td>Construction Boréa · Simon Tremblay, chargé de projet</td></tr>
    <tr><td>Architecte</td><td>Atelier Mercier architectes · Marc-André Leduc</td></tr>
    <tr><td>Soumission</td><td>S-26-0412 du 2 octobre 2026 (voir Soumission_Montreal.pdf)</td></tr>
    <tr><td>Contrat</td><td>Signé le 6 novembre 2026 · 1 200 000 $ avant taxes · retenue contractuelle de 10 %</td></tr>
    <tr><th colspan="2">Périmètre</th></tr>
    <tr><td>Inclus</td><td>Mur-rideau du hall (420 m²) · 46 fenêtres (types F1, F2, F3) · 6 portes d’entrée, dont 2 automatiques · 1 verrière (64 m²) · panneaux d’allège et solins · dessins d’atelier signés et scellés · installation</td></tr>
    <tr><td>Exclus</td><td>Calfeutrage intérieur · stores · finitions intérieures · raccordement électrique des portes automatiques · permis</td></tr>
    <tr><th colspan="2">Dates et délais</th></tr>
    <tr><td>Départ du projet</td><td>Lundi 16 novembre 2026</td></tr>
    <tr><td>Échéance contractuelle</td><td>Bâtiment fermé le vendredi 28 mai 2027</td></tr>
    <tr><td>Structure d’acier (par l’EG)</td><td>Terminée vers le 15 mars 2027 (selon Boréa)</td></tr>
    <tr><td>Délais de Lessard (soumission)</td><td>Dessins d’atelier : 3 semaines · approbation par l’architecte : 10 jours ouvrables (devis) · verre : 8 semaines après la commande ferme · fabrication : 6 semaines</td></tr>
    <tr><td>Calendrier</td><td>Usine et chantier fermés aux Fêtes : du lundi 21 décembre 2026 au vendredi 1er janvier 2027</td></tr>
    <tr><th colspan="2">Engagements et points ouverts</th></tr>
    <tr><td>Engagements verbaux</td><td class="hand">Pose du hall dès mars (dit à Simon, Boréa, le 3 nov.)</td></tr>
    <tr><td>Demandes du client hors contrat</td><td class="hand">Calfeutrage intérieur et stores : « on en reparlera »</td></tr>
    <tr><td>Risques connus</td><td class="hand">Architecte lent à répondre. Grue partagée avec les autres corps de métier.</td></tr>
    <tr><td>Remarques</td><td class="hand">Client important pour nous, d’autres projets de la Ville à venir.</td></tr>
  </table>
</section>

<section class="np">
  ${docHead('Calendrier · Dates imposées et délais', 'Page 4')}
  <h2>Le calendrier : ce qui est imposé</h2>
  <p class="lede">Les dates que Lessard ne choisit pas, et les délais de la soumission. Les dates intermédiaires sont à établir par le chargé de projet.</p>
  <table>
    <tr><th style="width:28%">Date</th><th>Événement</th><th style="width:22%">Source</th></tr>
    <tr><td>Ven. 6 nov. 2026</td><td>Signature du contrat</td><td>Contrat</td></tr>
    <tr class="alt"><td>Lun. 16 nov. 2026</td><td>Départ du projet chez Lessard (transfert des ventes)</td><td>Fiche de transfert</td></tr>
    <tr><td>Lun. 21 déc. 2026 → ven. 1er janv. 2027</td><td>Fermeture des Fêtes : usine Lessard et chantier fermés. Retour le lundi 4 janvier.</td><td>Calendrier Lessard et Boréa</td></tr>
    <tr class="alt"><td>Vers le lun. 15 mars 2027</td><td>Structure d’acier terminée : les relevés au chantier peuvent commencer</td><td>Boréa (estimation)</td></tr>
    <tr><td>Ven. 28 mai 2027</td><td><b>Bâtiment fermé</b> : enveloppe étanche, échéance contractuelle du lot</td><td>Contrat</td></tr>
  </table>
  <h3>Les délais à respecter</h3>
  <table>
    <tr><th style="width:36%">Activité</th><th style="width:22%">Délai</th><th>Condition</th></tr>
    <tr><td>Dessins d’atelier</td><td>3 semaines</td><td>À partir du départ du projet</td></tr>
    <tr class="alt"><td>Approbation par l’architecte</td><td>10 jours ouvrables</td><td>Après la soumission des dessins (devis, section 01 33 00)</td></tr>
    <tr><td>Verre (unités scellées)</td><td>8 semaines</td><td>Après la commande ferme, qui suit l’approbation des dessins</td></tr>
    <tr class="alt"><td>Fabrication des cadres</td><td>6 semaines</td><td>En usine, en parallèle du verre</td></tr>
    <tr><td>Relevés au chantier</td><td>2 semaines</td><td>Une fois la structure terminée</td></tr>
    <tr class="alt"><td>Installation</td><td>8 semaines</td><td>Après les relevés et la livraison du verre, selon l’accès à la grue</td></tr>
  </table>
  ${BOX('note', 'À garder en tête', `Les jours fériés et la fermeture des Fêtes ne sont pas des jours ouvrables. Les délais du verrier sont confirmés à la commande, pas avant.`)}
</section>

<section class="np">
  ${docHead('Intervenants · Coordonnées', 'Page 5')}
  <h2>Les intervenants</h2>
  <h3>Groupe Lessard</h3>
  <table>
    <tr><th style="width:22%">Personne</th><th style="width:34%">Rôle</th><th>Coordonnées</th></tr>
    <tr><td>Mathieu</td><td>Chargé de projet</td><td>514-555-0131</td></tr>
    <tr class="alt"><td>Hélène</td><td>Directrice de projets</td><td>514-555-0120</td></tr>
    <tr><td>Nadia</td><td>Adjointe chargée de projet</td><td>514-555-0133</td></tr>
    <tr class="alt"><td>Éric</td><td>Représentant des ventes</td><td>514-555-0142</td></tr>
    <tr><td>Patrice</td><td>Contremaître d’installation</td><td>514-555-0156</td></tr>
  </table>
  <h3>À l’externe</h3>
  <table>
    <tr><th style="width:26%">Organisation</th><th style="width:30%">Personne · rôle</th><th>Coordonnées</th></tr>
    <tr><td>Construction Boréa (EG)</td><td>Simon Tremblay · chargé de projet</td><td>s.tremblay@borea-construction.exemple · 514-555-0171</td></tr>
    <tr class="alt"><td>Construction Boréa</td><td>Julie Bergeron · adjointe administrative</td><td>j.bergeron@borea-construction.exemple · 514-555-0172</td></tr>
    <tr><td>Construction Boréa</td><td>Luc Paquette · surintendant de chantier</td><td>514-555-0175</td></tr>
    <tr class="alt"><td>Atelier Mercier architectes</td><td>Marc-André Leduc · architecte</td><td>ma.leduc@ateliermercier.exemple · 514-555-0188</td></tr>
    <tr><td>Ville de Rivière-Claire</td><td>Isabelle Côté · gestionnaire de projet, Service des immeubles</td><td>i.cote@riviere-claire.exemple · 514-555-0190</td></tr>
    <tr class="alt"><td>Vitrerie Laurentienne</td><td>Martin Dubé · service à la clientèle</td><td>commandes@vitrerie-laurentienne.exemple · 514-555-0164</td></tr>
    <tr><td>Panneaux Nordik</td><td>Kevin Ouellet · estimateur</td><td>k.ouellet@panneaux-nordik.exemple · 514-555-0167</td></tr>
  </table>
  <p class="small muted">Noms, adresses et numéros fictifs (indicatif 555).</p>
</section>

<section class="np">
  ${docHead('Notes d’Éric · Rencontre avec Construction Boréa', 'Page 6 · Mardi 3 novembre 2026')}
  <h2>Notes de la rencontre avec Boréa</h2>
  <p class="small muted">Présents : Simon Tremblay et Luc Paquette (Boréa), Éric (Lessard). Notes prises par Éric, non relues.</p>
  <ul>
    <li>Boréa veut nos dessins d’atelier « le plus vite possible » : l’architecte leur a dit qu’il serait chargé en décembre.</li>
    <li>Structure d’acier : montage à partir de janvier, terminée « vers la mi-mars si l’hiver est correct ».</li>
    <li>Date clé pour Boréa : bâtiment fermé le 28 mai, sinon décalage des finitions et de l’ouverture prévue par la Ville.</li>
    <li>Simon demande si on peut commencer le hall en mars. <span class="hand">Je lui ai dit oui, dès mars.</span></li>
    <li>Grue : une seule grue au chantier, partagée. Réserver nos créneaux au moins deux semaines d’avance auprès de Luc.</li>
    <li>Accès au chantier : chaque travailleur doit remplir le formulaire de la Ville avant sa première présence.</li>
    <li>Assurance : Boréa veut notre certificat d’assurance responsabilité à jour avant la mobilisation.</li>
    <li>Ils demandent des échantillons de verre pour l’architecte (deux types de vitrage).</li>
    <li>Calfeutrage intérieur et stores : Boréa cherche quelqu’un. <span class="hand">Pas dans notre prix. À voir.</span></li>
    <li>Réunions de chantier : aux deux semaines, le mardi matin, à partir de janvier.</li>
  </ul>
</section>

<section class="np">
  ${docHead('Résumé à coller', 'Page 7')}
  <h2>Le résumé à coller dans Copilot</h2>
  <p class="lede">Si Copilot ne lit pas ce PDF, sélectionnez le texte de l’encadré ci-dessous, copiez-le et collez-le dans la conversation.</p>
  <div class="prompt" style="font-size:10pt">
  DOSSIER DU PROJET — Centre sportif de Montréal (fictif). Objet : lot enveloppe en aluminium et verre, mur-rideau du hall (420 m²), 46 fenêtres, 6 portes d’entrée, 1 verrière (64 m²), panneaux d’allège et solins. Départ : lundi 16 novembre 2026. Contrat de 1,2 M$ avec Construction Boréa (entrepreneur général), signé le 6 novembre. Propriétaire : Ville de Rivière-Claire. Architecte : Atelier Mercier. Échéance : bâtiment fermé le vendredi 28 mai 2027. Structure d’acier terminée vers le 15 mars 2027 (estimation de Boréa). Équipe Lessard : Mathieu (chargé de projet), Hélène (directrice de projets), Nadia (adjointe), Éric (ventes), Patrice (contremaître d’installation). Délais : dessins d’atelier 3 semaines, puis 10 jours ouvrables d’approbation par l’architecte ; verre 8 semaines après la commande ferme ; fabrication 6 semaines ; relevés 2 semaines une fois la structure terminée ; installation 8 semaines. Contraintes : usine et chantier fermés aux Fêtes, du 21 décembre 2026 au 1er janvier 2027 ; une seule grue partagée, à réserver deux semaines d’avance ; formulaire d’accès de la Ville pour chaque travailleur ; certificat d’assurance à jour avant la mobilisation. Exclusions : calfeutrage intérieur, stores, finitions intérieures, raccordement électrique des portes automatiques, permis. Déjà connu : Éric a promis à Boréa une pose du hall « dès mars » (verbalement, le 3 novembre) ; Boréa demande aussi le calfeutrage intérieur et les stores, hors contrat.
  </div>
</section>
`,
  docCss,
);

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SOUMISSION
// ═══════════════════════════════════════════════════════════════════════════════
const soumission = page(
  'Soumission S-26-0412',
  `
<section>
  ${docHead('Groupe Lessard · Service des ventes', 'Soumission S-26-0412 · 2 octobre 2026')}
  <div class="eyebrow">Soumission · Lot enveloppe en aluminium et verre</div>
  <h1>Centre sportif de Montréal</h1>
  <table class="form">
    <tr><td>Client</td><td>Construction Boréa · à l’attention de Simon Tremblay, chargé de projet</td></tr>
    <tr><td>Propriétaire</td><td>Ville de Rivière-Claire</td></tr>
    <tr><td>Architecte</td><td>Atelier Mercier architectes · plans et devis émis pour soumission, rév. B</td></tr>
    <tr><td>Préparée par</td><td>Éric, représentant des ventes</td></tr>
    <tr><td>Validité</td><td>30 jours · taxes en sus</td></tr>
  </table>
  <h3>Description des travaux et prix</h3>
  <table>
    <tr><th style="width:6%">N°</th><th>Description</th><th style="width:16%">Quantité</th><th style="width:16%;text-align:right">Prix</th></tr>
    <tr><td>1</td><td>Mur-rideau du hall, aluminium à rupture thermique, unités scellées triples</td><td>420 m²</td><td style="text-align:right">520 000 $</td></tr>
    <tr class="alt"><td>2</td><td>Fenêtres fixes et ouvrantes · F1 (30 u), F2 (12 u), F3 (4 u)</td><td>46 u</td><td style="text-align:right">310 000 $</td></tr>
    <tr><td>3</td><td>Portes d’entrée en aluminium, dont 2 automatiques (opérateurs fournis, raccordement exclu)</td><td>6 u</td><td style="text-align:right">96 000 $</td></tr>
    <tr class="alt"><td>4</td><td>Verrière au-dessus du hall</td><td>64 m²</td><td style="text-align:right">148 000 $</td></tr>
    <tr><td>5</td><td>Panneaux d’allège isolés et solins</td><td>forfait</td><td style="text-align:right">58 000 $</td></tr>
    <tr class="alt"><td>6</td><td>Dessins d’atelier et calculs, signés et scellés par un ingénieur</td><td>forfait</td><td style="text-align:right">38 000 $</td></tr>
    <tr><td>7</td><td>Mobilisation, levage, protection des ouvrages, nettoyage final</td><td>forfait</td><td style="text-align:right">30 000 $</td></tr>
    <tr><td></td><td colspan="2" style="text-align:right"><b>Total avant taxes</b></td><td style="text-align:right"><b>1 200 000 $</b></td></tr>
  </table>
  <div class="grid2">
    <div class="card"><h4>Inclus</h4>
      <ul style="margin:0"><li>Fourniture, fabrication et installation des items 1 à 7</li><li>Échantillons de verre pour approbation (2 types)</li><li>Essais d’étanchéité sur une travée du mur-rideau</li><li>Garantie : 2 ans main-d’œuvre, 10 ans unités scellées</li></ul></div>
    <div class="card"><h4>Exclus</h4>
      <ul style="margin:0"><li>Calfeutrage intérieur</li><li>Stores et habillages intérieurs</li><li>Finitions intérieures</li><li>Raccordement électrique des portes automatiques</li><li>Permis et frais de la Ville</li></ul></div>
  </div>
</section>

<section class="np">
  ${docHead('Groupe Lessard · Service des ventes', 'Soumission S-26-0412 · page 2')}
  <h3>Délais</h3>
  <table>
    <tr><th style="width:40%">Activité</th><th>Délai</th></tr>
    <tr><td>Dessins d’atelier</td><td>3 semaines après la réception des documents pour construction</td></tr>
    <tr class="alt"><td>Approbation des dessins</td><td>Par l’architecte, 10 jours ouvrables selon le devis (section 01 33 00)</td></tr>
    <tr><td>Verre (unités scellées)</td><td>8 semaines après la commande ferme, sur dessins approuvés</td></tr>
    <tr class="alt"><td>Fabrication</td><td>6 semaines en usine</td></tr>
    <tr><td>Installation</td><td>8 semaines, selon l’accès au chantier et à la grue</td></tr>
  </table>
  <h3>Conditions</h3>
  <ul>
    <li>Les dates de pose seront confirmées <b>après l’approbation des dessins d’atelier et les relevés au chantier</b>, une fois la structure terminée.</li>
    <li>Les délais de fabrication et de livraison ne comprennent pas les fermetures de l’usine (Fêtes, vacances de la construction).</li>
    <li>L’accès au chantier, la grue et les aires d’entreposage sont fournis par l’entrepreneur général.</li>
    <li>Paiements mensuels selon l’avancement, retenue contractuelle de 10 %.</li>
    <li>Toute modification fera l’objet d’un avis de modification avant exécution.</li>
  </ul>
  <h3>Acceptation</h3>
  <table class="form">
    <tr><td>Pour Construction Boréa</td><td class="hand">Simon Tremblay · accepté le 6 novembre 2026</td></tr>
    <tr><td>Pour le Groupe Lessard</td><td class="hand">Éric · 6 novembre 2026</td></tr>
  </table>
  ${BOX('warn', 'Cas fictif', `Soumission créée pour la formation IA124. Montants et quantités fictifs.`)}
</section>
`,
  docCss,
);

// ═══════════════════════════════════════════════════════════════════════════════
// 4. COURRIELS (une page par courriel)
// ═══════════════════════════════════════════════════════════════════════════════
const mailCss = `
.inbox { display:flex; justify-content:space-between; align-items:center; background: var(--ink); color:#fff; border-radius: 6pt; padding: 7pt 12pt; margin-bottom: 10pt; }
.inbox b { font-family:'Barlow Condensed', Arial, sans-serif; font-size: 12pt; letter-spacing:.04em; }
.inbox span { font-size: 9.5pt; opacity: .85; }
.sent { display:inline-block; background:#FFF6CC; color:#8A6A00; border-radius: 4pt; padding: 2pt 8pt; font-size: 9.5pt; font-weight: 600; margin-top: 10pt; }
.mailpage { break-after: page; }
.mailpage:last-child { break-after: auto; }
`;
const MAILS = [
  {
    folder: 'Boîte de réception',
    from: 'Simon Tremblay &lt;s.tremblay@borea-construction.exemple&gt; · Construction Boréa',
    to: 'Mathieu · Groupe Lessard',
    date: 'Mardi 15 décembre 2026, 16 h 48',
    subj: 'Centre sportif · Date de début de pose du mur-rideau du hall ?',
    body: `<p>Bonjour Mathieu,</p>
<p>Nous bâtissons l’échéancier des finitions intérieures du hall. Pouvez-vous nous confirmer la date de début de pose du mur-rideau ?</p>
<p>Éric nous avait parlé d’un début en mars. Nous avons besoin de votre confirmation pour la réunion de coordination de vendredi (18 décembre), avant la fermeture des Fêtes.</p>
<p>Merci,</p>
<p class="sign">Simon Tremblay<br><span class="small muted">Chargé de projet · Construction Boréa · 514-555-0171</span></p>`,
  },
  {
    folder: 'Boîte de réception',
    from: 'Julie Bergeron &lt;j.bergeron@borea-construction.exemple&gt; · Construction Boréa',
    to: 'Mathieu · Groupe Lessard',
    date: 'Lundi 14 décembre 2026, 10 h 05',
    subj: 'Certificat d’assurance à jour à fournir',
    body: `<p>Bonjour,</p>
<p>En faisant la mise à jour du dossier de chantier, nous constatons que votre certificat d’assurance responsabilité civile a expiré le 30 novembre.</p>
<p>Il nous faut le certificat à jour avant toute présence de votre équipe au chantier. Merci de nous le faire parvenir d’ici le vendredi 18 décembre.</p>
<p>Bonne journée,</p>
<p class="sign">Julie Bergeron<br><span class="small muted">Adjointe administrative · Construction Boréa · 514-555-0172</span></p>`,
  },
  {
    folder: 'Éléments envoyés',
    from: 'Mathieu · Groupe Lessard',
    to: 'Marc-André Leduc &lt;ma.leduc@ateliermercier.exemple&gt; · Atelier Mercier architectes',
    cc: 'Simon Tremblay · Construction Boréa',
    date: 'Lundi 7 décembre 2026, 15 h 32',
    subj: 'Centre sportif · Dessins d’atelier MR-01 pour approbation',
    att: ['MR-01_rev0.pdf (24 pages)'],
    body: `<p>Bonjour Monsieur Leduc,</p>
<p>Veuillez trouver ci-joints les dessins d’atelier MR-01 du mur-rideau du hall (révision 0) pour approbation.</p>
<p>Selon le devis, le délai d’approbation est de 10 jours ouvrables. Votre retour nous permettra de passer la commande du verre.</p>
<p>Je reste disponible pour en discuter.</p>
<p class="sign">Mathieu<br><span class="small muted">Chargé de projet · Groupe Lessard · 514-555-0131</span></p>`,
    flag: 'Aucune réponse au mercredi 16 décembre',
  },
  {
    folder: 'Boîte de réception',
    from: 'Vitrerie Laurentienne &lt;commandes@vitrerie-laurentienne.exemple&gt;',
    to: 'Mathieu · Groupe Lessard',
    date: 'Lundi 14 décembre 2026, 13 h 20',
    subj: 'Bordereau de livraison 4471',
    att: ['Bordereau_4471_signe.pdf'],
    body: `<p>Bonjour,</p>
<p>Veuillez trouver ci-joint le bordereau de livraison 4471, signé à la réception à votre usine ce matin.</p>
<p>Contenu : 2 échantillons d’unités scellées 300 × 300 mm (types V1 et V2) pour le projet Centre sportif.</p>
<p>Aucune action requise de votre part.</p>
<p class="sign">Martin Dubé<br><span class="small muted">Service à la clientèle · Vitrerie Laurentienne · 514-555-0164</span></p>`,
  },
  {
    folder: 'Boîte de réception',
    from: 'Isabelle Côté &lt;i.cote@riviere-claire.exemple&gt; · Ville de Rivière-Claire',
    to: 'Mathieu · Groupe Lessard',
    cc: 'Simon Tremblay · Construction Boréa',
    date: 'Mardi 15 décembre 2026, 9 h 41',
    subj: 'Formulaire d’accès au chantier · à remplir pour chaque travailleur',
    att: ['Formulaire_acces_chantier.pdf'],
    body: `<p>Bonjour,</p>
<p>Pour des raisons de sécurité, tout travailleur doit remplir le formulaire d’accès au chantier et fournir son attestation de formation en santé et sécurité avant sa première présence.</p>
<p>Merci de nous transmettre les formulaires de votre équipe d’installation avant le vendredi 15 janvier 2027.</p>
<p>Cordialement,</p>
<p class="sign">Isabelle Côté<br><span class="small muted">Gestionnaire de projet · Service des immeubles · Ville de Rivière-Claire</span></p>`,
  },
  {
    folder: 'Boîte de réception',
    from: 'Patrice · Contremaître d’installation, Groupe Lessard',
    to: 'Mathieu',
    date: 'Mercredi 16 décembre 2026, 7 h 05',
    subj: 'Écart de 40 mm à l’axe C',
    body: `<p>Salut Mathieu,</p>
<p>Hier, j’ai fait un tour au chantier avec Luc (Boréa) pour voir l’avancement. À l’axe C, l’ouverture du hall mesure 40 mm de plus que les plans (hauteur entre la dalle et la poutre).</p>
<p>Si c’est pareil ailleurs, nos dessins MR-01 sont à revoir avant la fabrication. On fait quoi ?</p>
<p>Je peux reprendre des mesures jeudi si tu veux.</p>
<p class="sign">Patrice</p>`,
  },
  {
    folder: 'Boîte de réception',
    from: 'Julie Bergeron &lt;j.bergeron@borea-construction.exemple&gt; · Construction Boréa',
    to: 'Tous les sous-traitants du chantier',
    date: 'Mardi 15 décembre 2026, 11 h 30',
    subj: 'Liste des contacts du chantier · révision 3',
    att: ['Contacts_chantier_rev3.pdf'],
    body: `<p>Bonjour à tous,</p>
<p>Voici la liste des contacts du chantier à jour (révision 3). Seul changement : l’ajout de notre nouvelle coordonnatrice en santé et sécurité.</p>
<p>Merci de la diffuser à vos équipes.</p>
<p class="sign">Julie Bergeron<br><span class="small muted">Adjointe administrative · Construction Boréa</span></p>`,
  },
  {
    folder: 'Éléments envoyés',
    from: 'Mathieu · Groupe Lessard',
    to: 'Kevin Ouellet &lt;k.ouellet@panneaux-nordik.exemple&gt; · Panneaux Nordik',
    date: 'Vendredi 4 décembre 2026, 10 h 17',
    subj: 'Demande de prix · panneaux d’allège isolés · Centre sportif',
    att: ['Panneaux_allege_details.pdf'],
    body: `<p>Bonjour Monsieur Ouellet,</p>
<p>Pourriez-vous nous transmettre votre prix pour 38 panneaux d’allège isolés (détails et dimensions ci-joints), avec votre délai de livraison ?</p>
<p>Une réponse d’ici le vendredi 11 décembre nous serait utile pour finaliser nos commandes.</p>
<p>Merci d’avance,</p>
<p class="sign">Mathieu<br><span class="small muted">Chargé de projet · Groupe Lessard · 514-555-0131</span></p>`,
    flag: 'Aucune réponse au mercredi 16 décembre',
  },
];
const courriels = page(
  'Courriels de la boîte de Mathieu',
  MAILS.map(
    (m, i) => `<section class="mailpage">
  <div class="inbox"><b>Outlook · Mathieu · ${m.folder}</b><span>Situation au mercredi 16 décembre 2026 · Courriel ${i + 1} / ${MAILS.length}</span></div>
  <div class="mail">${mailHd(m)}<div class="bd">${m.body}${m.flag ? `<div class="sent">⚑ ${m.flag}</div>` : ''}</div></div>
  <p class="small muted" style="margin-top:12pt">Atelier 1 · étape 4 · Où va ce courriel : à traiter, à Nadia, à relancer ou à classer ? <span class="fict">Cas fictif de formation · IA124</span></p>
</section>`,
  ).join('\n'),
  docCss + mailCss,
);

// ═══════════════════════════════════════════════════════════════════════════════
// 5. CORRIGÉ DU FORMATEUR (pas dans le zip des participants)
// ═══════════════════════════════════════════════════════════════════════════════
const corrigeCss = `
.conf { display:inline-block; font-family:'Barlow Condensed', Arial, sans-serif; font-weight:700; letter-spacing:.12em; text-transform:uppercase; font-size:9pt; color:#fff; background: var(--coral); border-radius:4pt; padding:2pt 8pt; }
.ans td:first-child { width: 24%; font-weight: 600; }
.mini td, .mini th { font-size: 9pt; padding: 3.5pt 6pt; }
.r { text-align:center; font-weight:700; }
.fix { background: #FBE3DD; }
.q li { margin: 3pt 0; }
table.mini, table.ans { break-inside: auto; } table.mini tr, table.ans tr { break-inside: avoid; }
`;
const corrige = page(
  'Atelier 1 · Corrigé du formateur',
  `
<section>
  <img src="${logo}" alt="Technologia" style="height:28pt;mix-blend-mode:multiply">
  <div style="margin-top:14pt"><span class="conf">Formateur · ne pas distribuer</span></div>
  <h1 style="margin-top:10pt">Atelier 1 · Corrigé du formateur</h1>
  <p class="lede">IA124 · Groupe Lessard · Centre sportif de Montréal (cas fictif). Les réponses attendues, étape par étape, avec la numérotation du guide du participant et du deck.</p>
  ${BOX('note', 'Comment utiliser ce corrigé', `Il n’existe pas <i>une</i> bonne réponse : les productions de l’IA varient d’un participant à l’autre. Ce corrigé donne <b>une version de référence</b> et surtout <b>ce qui doit absolument y être</b> (les points « À exiger »). Pendant les points d’étape, cherchez ces points-là, pas la formulation.`)}
  <h2>Le déroulé et les minuteurs</h2>
  <table>
    <tr><th style="width:24%">Étape</th><th style="width:22%">Démonstration (deck)</th><th style="width:18%">Minuteur</th><th>Point d’étape (3 min, 1 clic)</th></tr>
    <tr><td><b>1 · Découvrir</b></td><td>Copilot dans Outlook, Copilot Chat</td><td>m3-s1 · 5 min</td><td>Fichier joint par tous ? Deux volontaires : la meilleure question de Copilot.</td></tr>
    <tr class="alt"><td><b>2 · Cadrer</b></td><td>La fiche de démarrage</td><td>m3-s2 · 10 min</td><td>Combien d’exclusions sur 5 ? « Dès mars » signalé ?</td></tr>
    <tr><td><b>3 · Planifier</b></td><td>3a à 3e, puis le mini-outil (option)</td><td>m3-s3 · 25 min</td><td>Dates supposées ? Ligne de RACI fautive ? Deux échéanciers montrés.</td></tr>
    <tr class="alt"><td><b>4 · Trier et relancer</b></td><td>La boîte de réception (glisser-déposer)</td><td>m3-s4 · 10 min</td><td>Désaccords avec Copilot ? Une ou deux relances lues.</td></tr>
    <tr><td><b>5 · Vérifier</b></td><td>Grille de contrôle, quatre pièges</td><td>m3-s5 · 5 min</td><td>Scores, puis 2 ou 3 volontaires pour le débriefing.</td></tr>
  </table>
  <p class="small muted">Chaque page « À vous » a son minuteur ; le point d’étape apparaît au clic. Les minuteurs se règlent à ±1 min depuis la vue présentateur.</p>
  ${BOX('tip', 'Les dates qui reviennent partout', `Départ <b>lun. 16 nov. 2026</b> · dessins MR-01 envoyés <b>lun. 7 déc.</b> · approbation due <b>lun. 21 déc.</b> (10 jours ouvrables) · Fêtes <b>21 déc. → 1er janv.</b> (retour le 4 janv.) · commande du verre <b>22 déc.</b> (créneau du verrier jusqu’au 23) · verre livré <b>fin février</b> · structure <b>vers le 15 mars</b> · relevés <b>15 → 26 mars</b> · pose <b>à partir du 5 avril</b> · bâtiment fermé <b>ven. 28 mai 2027</b>.`)}
</section>

<section class="np">
  <h2><span class="n">1</span>Étape 1 · Découvrir l’outil</h2>
  <p class="lede">Pas de « bonne réponse » ici : on vérifie que chacun sait joindre un document et l’interroger.</p>
  <h3>Le résumé attendu de la soumission</h3>
  <ul>
    <li><b>Périmètre</b> : mur-rideau du hall 420 m², 46 fenêtres (F1 ×30, F2 ×12, F3 ×4), 6 portes dont 2 automatiques, verrière 64 m², panneaux d’allège et solins, dessins scellés, mobilisation et nettoyage. Total <b>1 200 000 $</b> avant taxes.</li>
    <li><b>Exclusions</b> : calfeutrage intérieur, stores et habillages, finitions intérieures, raccordement électrique des portes automatiques, permis et frais de la Ville.</li>
    <li><b>Délais</b> : dessins 3 semaines après réception des documents pour construction, approbation 10 jours ouvrables, verre 8 semaines après commande ferme, fabrication 6 semaines.</li>
    <li><b>Inclus discret</b> : échantillons de verre (2 types), essai d’étanchéité sur une travée, garanties 2 ans / 10 ans.</li>
  </ul>
  <p class="small muted">La soumission seule ne contient <b>pas</b> la promesse « dès mars » : elle est dans le dossier d’Éric. Si un participant la voit déjà ici, c’est qu’il a joint les deux fichiers.</p>
  <h3>Les questions que Copilot devrait renvoyer (« Qu’est-ce qui manque ? »)</h3>
  <ul class="q">
    <li>Les documents pour construction sont-ils reçus ? (les plans de la soumission sont « émis pour soumission, rév. B »)</li>
    <li>Quelle est la date de fin imposée ? Quelle est la date de disponibilité du chantier ?</li>
    <li>Qui est l’interlocuteur chez l’entrepreneur général et chez l’architecte ?</li>
    <li>Quelles sont les conditions de paiement et la retenue ? Y a-t-il des pénalités de retard ?</li>
  </ul>
  ${BOX('ok', 'À exiger', `Le fichier est bien joint (ou le résumé collé) · le bouclier vert est visible · chacun a noté au moins deux questions pour l’étape 2.`)}

  <h2 style="margin-top:16pt"><span class="n">2</span>Étape 2 · Cadrer : la fiche de démarrage</h2>
  <h3>La fiche de référence</h3>
  <table class="ans">
    <tr><th>Rubrique</th><th>Attendu</th></tr>
    <tr><td>Identification</td><td>P-2611-04 · Centre sportif de Montréal · propriétaire Ville de Rivière-Claire · EG Construction Boréa (Simon Tremblay) · architecte Atelier Mercier (Marc-André Leduc) · contrat signé le 6 nov. 2026, 1 200 000 $ avant taxes, retenue 10 %.</td></tr>
    <tr class="alt"><td>Périmètre inclus</td><td>Mur-rideau du hall (420 m²), 46 fenêtres, 6 portes dont 2 automatiques, verrière (64 m²), panneaux d’allège et solins, dessins d’atelier signés et scellés, installation. Plus : échantillons de verre (2 types), essai d’étanchéité, garanties.</td></tr>
    <tr><td>Exclusions</td><td><b>Les 5</b> : calfeutrage intérieur · stores · finitions intérieures · raccordement électrique des portes automatiques · permis.</td></tr>
    <tr class="alt"><td>Dates clés</td><td>Départ 16 nov. 2026 · Fêtes 21 déc. → 1er janv. · structure vers le 15 mars 2027 (estimation Boréa) · <b>bâtiment fermé ven. 28 mai 2027</b> (contractuel).</td></tr>
    <tr><td>Délais</td><td>Dessins 3 sem. · approbation 10 jours ouvrables · verre 8 sem. après commande ferme · fabrication 6 sem. · relevés 2 sem. après la structure · installation 8 sem.</td></tr>
    <tr class="alt"><td>Intervenants</td><td>Boréa : Simon Tremblay (CP), Luc Paquette (surintendant), Julie Bergeron (adjointe). Atelier Mercier : M.-A. Leduc. Ville : Isabelle Côté. Fournisseurs : Vitrerie Laurentienne, Panneaux Nordik. Lessard : Mathieu, Hélène, Nadia, Éric, Patrice.</td></tr>
    <tr><td>Engagements</td><td>Pose du hall « dès mars » (verbal, Éric à Simon, le 3 nov.). Bâtiment fermé le 28 mai.</td></tr>
    <tr class="alt"><td>Contraintes</td><td>Une seule grue partagée, à réserver 2 sem. d’avance auprès de Luc · formulaire d’accès de la Ville pour chaque travailleur · certificat d’assurance à jour avant la mobilisation · réunions de chantier aux 2 semaines, le mardi, dès janvier.</td></tr>
  </table>
  <h3>Les points à clarifier avec Éric (le cœur de la correction)</h3>
  <ol class="q">
    <li><b>« Dès mars » est intenable.</b> Structure vers le 15 mars, puis 2 semaines de relevés : la pose ne peut commencer qu’en fin mars au mieux, début avril de façon réaliste. Est-ce écrit au contrat ? Qui prévient Boréa, et quand ?</li>
    <li><b>Calfeutrage intérieur et stores, « on en reparlera ».</b> Hors contrat. Il faut une réponse claire : refus, ou travaux supplémentaires avec prix à part. Sinon, litige en vue.</li>
    <li><b>Point de départ des dessins.</b> La soumission compte 3 semaines « après la réception des documents pour construction » ; la fiche les compte « à partir du départ du projet ». Avons-nous les plans pour construction ?</li>
    <li><b>Architecte « pas toujours rapide ».</b> Les 10 jours ouvrables finissent le 21 déc., premier jour des Fêtes : prévoir une relance et une marge.</li>
    <li><b>Échantillons de verre</b> promis dans la soumission, absents de la fiche : qui les envoie à l’architecte, et quand ?</li>
  </ol>
  ${BOX('ok', 'À exiger', `Les 5 exclusions · aucune date inventée · la contradiction « dès mars » contre la structure au 15 mars · le calfeutrage et les stores présentés comme une demande hors contrat · les points ouverts formulés comme des <b>questions à Éric</b>, pas des décisions de l’IA.`)}
  ${BOX('warn', 'Erreurs fréquentes de l’IA', `Elle ajoute le calfeutrage ou les stores au périmètre · elle oublie le raccordement des portes et les permis · elle présente « dès mars » comme un jalon acquis · elle invente une date d’approbation ou une pénalité de retard.`)}
</section>

<section class="np">
  <h2><span class="n">3</span>Étape 3 · Planifier</h2>
  <h3>3a · Le découpage de référence (7 étapes)</h3>
  <table class="mini">
    <tr><th style="width:24%">Étape</th><th>Tâches (1 à 2 semaines)</th></tr>
    <tr><td>1 · Transfert et démarrage</td><td>Revue du contrat et fiche de démarrage · réunion de démarrage interne (Éric, Hélène, Patrice, Nadia) · réunion de démarrage avec Boréa · liste des intervenants</td></tr>
    <tr class="alt"><td>2 · Dessins d’atelier</td><td>Dessins MR-01 (mur-rideau) et fenêtres · soumission à l’architecte · échantillons de verre · corrections et réémission</td></tr>
    <tr><td>3 · Achats et livraisons</td><td>Commande ferme du verre · profilés et quincaillerie · panneaux d’allège · suivi des livraisons</td></tr>
    <tr class="alt"><td>4 · Fabrication</td><td>Cadres en usine · contrôle qualité · expédition par zones</td></tr>
    <tr><td>5 · Installation</td><td>Relevés au chantier · réservation de la grue · fenêtres et entrées · mur-rideau et verrière · essai d’étanchéité</td></tr>
    <tr class="alt"><td>6 · Fermeture</td><td>Liste de déficiences · documents de fin de projet · garanties · retenue</td></tr>
    <tr><td class="fix">7 · Gestion de projet</td><td class="fix">Réunions de chantier (aux 2 semaines, le mardi) · rapports à Hélène · avis de modification · suivi des risques</td></tr>
  </table>
  <p><b>À exiger</b> : la 7<sup>e</sup> colonne, le travail du chargé de projet, que l’IA oublie presque toujours. Autres oublis à faire trouver : approbation des échantillons, essai d’étanchéité, protection des ouvrages, documents de fin exigés par l’EG, assurance et formulaires d’accès, réservation de la grue.</p>

  <h3>3b · L’échéancier de référence</h3>
  <p class="small muted">Semaine 1 = 16 nov. 2026 ; semaine 28 = 24 → 28 mai 2027. Une version acceptable parmi d’autres : ce qui compte, ce sont les délais du dossier, les Fêtes et les dépendances.</p>
  <table class="mini">
    <tr><th style="width:15%">Étape</th><th>Tâche</th><th style="width:10%">Resp.</th><th style="width:12%">Début</th><th style="width:12%">Fin</th><th style="width:17%">Dépendance</th></tr>
    <tr><td>Transfert</td><td>Revue du contrat, fiche de démarrage</td><td>Mathieu</td><td>2026-11-16</td><td>2026-11-18</td><td>—</td></tr>
    <tr class="alt"><td>Transfert</td><td>Démarrage avec Boréa (clarifier « dès mars »)</td><td>Mathieu</td><td>2026-11-20</td><td>2026-11-20</td><td>Fiche</td></tr>
    <tr><td>Dessins</td><td>Dessins d’atelier MR-01 et fenêtres</td><td>Mathieu</td><td>2026-11-16</td><td>2026-12-04</td><td>Plans pour construction</td></tr>
    <tr class="alt"><td>Dessins</td><td>Approbation par l’architecte (10 j. ouvr.)</td><td>Mathieu</td><td>2026-12-07</td><td>2026-12-21</td><td>Dessins</td></tr>
    <tr><td>Dessins</td><td>Échantillons de verre V1, V2 à l’architecte</td><td>Nadia</td><td>2026-12-14</td><td>2026-12-18</td><td>—</td></tr>
    <tr class="alt"><td>Achats</td><td>Commande ferme du verre</td><td>Mathieu</td><td>2026-12-22</td><td>2026-12-22</td><td>Approbation</td></tr>
    <tr><td>Achats</td><td>Livraison du verre (8 sem. + Fêtes)</td><td>Nadia</td><td>2026-12-22</td><td>2027-02-26</td><td>Commande</td></tr>
    <tr class="alt"><td>Achats</td><td>Profilés, quincaillerie, panneaux d’allège</td><td>Nadia</td><td>2027-01-04</td><td>2027-01-15</td><td>Approbation</td></tr>
    <tr><td>Fabrication</td><td>Cadres en usine (6 sem.), contrôle, expédition</td><td>Mathieu</td><td>2027-01-18</td><td>2027-03-26</td><td>Profilés</td></tr>
    <tr class="alt"><td>Installation</td><td>Formulaires d’accès de l’équipe</td><td>Nadia</td><td>2027-01-04</td><td>2027-01-15</td><td>—</td></tr>
    <tr><td>Installation</td><td>Relevés au chantier</td><td>Patrice</td><td>2027-03-15</td><td>2027-03-26</td><td>Structure (Boréa)</td></tr>
    <tr class="alt"><td>Installation</td><td>Réservation de la grue (2 sem. d’avance)</td><td>Patrice</td><td>2027-03-15</td><td>2027-03-19</td><td>—</td></tr>
    <tr><td>Installation</td><td>Fenêtres, entrées, mur-rideau, verrière</td><td>Patrice</td><td>2027-04-05</td><td>2027-05-28</td><td>Relevés, verre</td></tr>
    <tr class="alt"><td>Installation</td><td>Essai d’étanchéité sur une travée</td><td>Patrice</td><td>2027-05-03</td><td>2027-05-07</td><td>Mur-rideau</td></tr>
    <tr><td>Fermeture</td><td>Liste de déficiences</td><td>Mathieu</td><td>2027-05-24</td><td>2027-05-28</td><td>Installation</td></tr>
  </table>
  <p><b>Jalons</b> : dessins approuvés (21 déc. 2026) · verre livré (fin février 2027) · bâtiment fermé (28 mai 2027).<br>
  <b>Chemin critique</b> : dessins → approbation → commande et livraison du verre → relevés → pose. <b>Marge : nulle</b> (8 semaines de pose du 5 avril au 28 mai).</p>
  ${BOX('warn', 'Ce que l’IA rate le plus souvent', `L’approbation en « 2 jours » ou « 1 semaine » · le verre qui ignore les Fêtes · la pose avant les relevés ou avant la structure · une date de fin après le 28 mai sans le signaler · un « 2 responsables » par tâche. <b>Pour aller plus loin</b> : les jours fériés de la pose (Vendredi saint 26 mars, lundi de Pâques 29 mars, Journée nationale des patriotes lundi 24 mai) mangent la marge déjà nulle. Bon sujet pour la question « Quelles dates as-tu supposées ? ».`)}
</section>

<section class="np">
  <h3 style="margin-top:0">3c · Le registre des risques de référence</h3>
  <table class="mini">
    <tr><th style="width:5%">N°</th><th style="width:27%">Risque</th><th style="width:6%">P</th><th style="width:6%">I</th><th>Mesure</th><th style="width:10%">Resp.</th></tr>
    <tr><td>R1</td><td>Approbation des dessins en retard</td><td class="r">2</td><td class="r">3</td><td>Soumettre en deux envois ; relance à J+5 ; point fixe à chaque réunion de chantier.</td><td>Mathieu</td></tr>
    <tr class="alt"><td>R2</td><td>Structure d’acier terminée en retard (EG)</td><td class="r">3</td><td class="r">3</td><td>Suivi hebdomadaire avec Boréa ; relevés par zones dès qu’une zone est prête.</td><td>Mathieu</td></tr>
    <tr><td>R3</td><td>Délai du verre plus long que prévu</td><td class="r">3</td><td class="r">2</td><td>Commande ferme dès l’approbation ; date de livraison confirmée par écrit.</td><td>Nadia</td></tr>
    <tr class="alt"><td>R4</td><td>Écarts de mesures au chantier</td><td class="r">2</td><td class="r">2</td><td>Relevés par Patrice avant la fabrication finale ; tolérances aux dessins.</td><td>Patrice</td></tr>
    <tr><td>R5</td><td>Promesse des ventes intenable (« dès mars »)</td><td class="r">1</td><td class="r">3</td><td>Clarifier avec Éric, puis avec Boréa, à la réunion de démarrage.</td><td>Éric</td></tr>
    <tr class="alt"><td>R6</td><td>Météo pendant la pose</td><td class="r">1</td><td class="r">2</td><td>Jours tampons à l’échéancier ; protections temporaires prêtes.</td><td>Patrice</td></tr>
  </table>
  <p class="small">Autres risques recevables : grue partagée indisponible · certificat d’assurance ou formulaires d’accès non prêts (équipe refusée au chantier) · demandes hors contrat (calfeutrage, stores) · échantillons refusés par l’architecte.</p>
  ${BOX('note', 'Le message à faire passer', `Les risques proposés par l’IA sont bons ; les notes P et I sont un <b>jugement</b>. Si un participant a mis R2 en vert, demandez-lui ce qu’il vit sur ses chantiers : c’est son expérience qui tranche, pas l’IA.`)}

  <h3>3d · La RACI corrigée</h3>
  <table class="mini">
    <tr><th style="width:30%">Activité</th><th class="r">Mathieu</th><th class="r">Hélène</th><th class="r">Nadia</th><th class="r">Éric</th><th class="r">Patrice</th><th style="width:22%">Commentaire</th></tr>
    <tr><td>Revue du contrat</td><td class="r">R</td><td class="r">A</td><td class="r">I</td><td class="r">C</td><td class="r">I</td><td>Correct dans le premier jet.</td></tr>
    <tr class="alt"><td>Dessins d’atelier</td><td class="r">R</td><td class="r">A</td><td class="r"></td><td class="r"></td><td class="r">C</td><td>Correct.</td></tr>
    <tr><td class="fix">Commandes et livraisons</td><td class="r fix">A</td><td class="r fix">I</td><td class="r fix">R</td><td class="r fix"></td><td class="r fix">I</td><td class="fix">Deux A dans le jet de l’IA : Hélène passe à I.</td></tr>
    <tr class="alt"><td>Classement et suivis</td><td class="r">A</td><td class="r"></td><td class="r">R</td><td class="r"></td><td class="r"></td><td>Correct (repris au jour 2).</td></tr>
    <tr><td>Pose au chantier</td><td class="r">A</td><td class="r">I</td><td class="r">I</td><td class="r"></td><td class="r">R</td><td>Correct.</td></tr>
    <tr class="alt"><td class="fix">Liste de déficiences</td><td class="r fix">A</td><td class="r fix">I</td><td class="r fix">C</td><td class="r fix"></td><td class="r fix">R</td><td class="fix">Aucun A dans le jet de l’IA : Mathieu approuve, Patrice corrige.</td></tr>
  </table>
  <p class="small">Autre réponse acceptable : Hélène A et Mathieu R sur une ligne, si c’est la réalité chez Lessard. La règle à vérifier : <b>exactement un A par ligne</b>, et au moins un R. Dans le modèle Excel, la colonne Contrôle le signale.</p>

  <h3>3e · Dans l’outil</h3>
  <ul>
    <li><b>Excel</b> : le tableau 3b collé en B5 de la feuille Tâches ; l’échéancier se colore, les Fêtes sont grisées. Si les dates restent en texte : demander le format CSV « ; », puis <i>Données › Convertir</i>.</li>
    <li><b>Planner / Smartsheet</b> : chaque tâche a un responsable et une date de fin. Dans Smartsheet, import depuis le modèle Excel.</li>
    <li><b>Mini-outil</b> (option) : les dates et les retards affichés sont justes ; l’export CSV se rouvre dans Excel.</li>
  </ul>
  ${BOX('ok', 'À exiger', `Chaque tâche a <b>un seul</b> responsable et une date, dans un outil de suivi : pas seulement dans la conversation.`)}
</section>

<section style="margin-top:18pt">
  <h2><span class="n">4</span>Étape 4 · Trier la boîte de réception et relancer</h2>
  <p class="lede">Situation au mercredi 16 décembre 2026.</p>
  <table class="mini">
    <tr><th style="width:4%">N°</th><th style="width:26%">Courriel</th><th style="width:12%">Corrigé</th><th>Justification · consigne</th></tr>
    <tr><td>1</td><td>Boréa · date de début de pose du mur-rideau ?</td><td><b>À traiter</b></td><td>Réponse attendue avant la coordination du ven. 18 déc. Boréa cite « mars » : <b>ne pas confirmer</b>. Accorder la réponse avec Éric, proposer une date réaliste (pose à partir du 5 avril, après les relevés).</td></tr>
    <tr class="alt"><td>2</td><td>Boréa · certificat d’assurance à fournir</td><td><b>À Nadia</b></td><td>Expiré le 30 nov. Consigne : « Obtiens le certificat d’assurance responsabilité civile à jour et envoie-le à Julie Bergeron (Boréa) avant le vendredi 18 décembre. »</td></tr>
    <tr><td>3</td><td>Vous · dessins MR-01 pour approbation (7 déc.)</td><td><b>À relancer</b></td><td>Aucune réponse ; échéance des 10 jours ouvrables le lun. 21 déc., premier jour des Fêtes. Sans approbation, la commande du verre glisse en janvier.</td></tr>
    <tr class="alt"><td>4</td><td>Vitrerie Laurentienne · bordereau 4471</td><td><b>À classer</b></td><td>Échantillons V1 et V2 reçus. « Aucune action requise »… mais ces échantillons doivent partir chez l’architecte : « À Nadia » est accepté si elle s’en charge.</td></tr>
    <tr><td>5</td><td>Ville · formulaire d’accès au chantier</td><td><b>À Nadia</b></td><td>Consigne : « Fais remplir le formulaire d’accès et rassemble les attestations SST de l’équipe de Patrice ; à renvoyer à la Ville avant le vendredi 15 janvier 2027. »</td></tr>
    <tr class="alt"><td>6</td><td>Patrice · écart de 40 mm à l’axe C</td><td><b>À traiter</b></td><td>Le plus urgent : si l’écart se répète, MR-01 est à revoir avant la fabrication. Répondre à Patrice (oui, mesures jeudi sur tous les axes), prévenir l’architecte et Boréa.</td></tr>
    <tr><td>7</td><td>Boréa · liste des contacts (rév. 3)</td><td><b>À classer</b></td><td>Seul changement : la coordonnatrice SST. Diffusion à l’équipe : peut aller à Nadia.</td></tr>
    <tr class="alt"><td>8</td><td>Vous · prix des panneaux d’allège (4 déc.)</td><td><b>À relancer</b></td><td>Réponse attendue le 11 déc., rien reçu. Les panneaux sont à commander début janvier.</td></tr>
  </table>
  ${BOX('warn', 'Les pièges de Copilot dans ce tri', `Il met le courriel 6 « à classer » (pas de question explicite au chargé de projet) · il prend « Aucune action requise » au pied de la lettre (courriel 4) · dans un brouillon de réponse au courriel 1, il <b>confirme mars</b>. C’est l’occasion de rappeler : un courriel urgent mal classé coûte cher.`)}
  <h3>La relance de référence (MR-01)</h3>
  <div class="prompt"><span class="t">Exemple de résultat attendu</span>
  <b>Objet</b> : Centre sportif · Dessins MR-01 · approbation requise d’ici le lundi 21 décembre<br><br>
  Bonjour Monsieur Leduc,<br>
  Le 7 décembre, nous vous avons soumis les dessins d’atelier MR-01 du mur-rideau du hall pour approbation. Selon le devis, le délai est de 10 jours ouvrables, soit le lundi 21 décembre.<br>
  Votre approbation nous permettra de commander le verre avant la fermeture des Fêtes : sans elle, la livraison glisse et le bâtiment fermé du 28 mai est menacé.<br>
  Pourriez-vous nous transmettre vos commentaires ou votre approbation d’ici le vendredi 18 décembre ? Je reste disponible pour en discuter.<br>
  Mathieu · Chargé de projet · Groupe Lessard<br>
  <span class="small muted">c. c. : Simon Tremblay, Construction Boréa</span></div>
  ${BOX('ok', 'À exiger', `Les dates exactes (7 déc., 21 déc.) · une date de réponse demandée · Boréa en copie · rien d’inventé (pénalité, clause). <b>Piste experte</b> : avec l’écart de 40 mm du courriel 6, faut-il relancer l’approbation de MR-01… ou prévenir l’architecte d’une révision possible ? Excellente question pour le point d’étape.`)}
</section>

<section style="margin-top:18pt">
  <h2><span class="n">5</span>Étape 5 · Vérifier et présenter</h2>
  <h3>La grille, avec ce qu’il faut chercher</h3>
  <table class="mini">
    <tr><th style="width:44%">Critère</th><th style="width:6%">Pts</th><th>Où regarder</th></tr>
    <tr><td>Délais clés validés par une personne qui sait</td><td class="r">2</td><td>Verre, fabrication : confirmés par le verrier et l’usine ? Sinon, marqués « à confirmer ».</td></tr>
    <tr class="alt"><td>Dépendances indiquées</td><td class="r">1</td><td>Approbation → commande du verre → pose ; structure → relevés → pose.</td></tr>
    <tr><td>Chemin critique identifié</td><td class="r">1</td><td>Dessins, approbation, verre, relevés, pose. Marge nulle.</td></tr>
    <tr class="alt"><td>Un seul responsable et une date par tâche</td><td class="r">2</td><td>Pas de « Mathieu / Nadia », pas de tâche sans date.</td></tr>
    <tr><td>Calendrier réel respecté</td><td class="r">1</td><td>Fêtes 21 déc. → 1er janv., jours fériés du printemps.</td></tr>
    <tr class="alt"><td>Chaque risque majeur a une mesure et un responsable</td><td class="r">1</td><td>R1, R2, R3 au minimum.</td></tr>
    <tr><td>Exclusions et promesses des ventes reprises</td><td class="r">1</td><td>Les 5 exclusions ; « dès mars » traité, pas ignoré.</td></tr>
    <tr class="alt"><td>Aucun fait inventé</td><td class="r">2</td><td>Délais, quantités, normes, pénalités : tout vient du dossier.</td></tr>
  </table>
  <p>Barème : <b>0 à 5</b> premier jet · <b>6 à 9</b> presque · <b>10 ou 11</b> prêt à présenter à Hélène.</p>
  <h3>Les quatre pièges du plan généré (page « Repérez les quatre pièges »)</h3>
  <ol class="q">
    <li><b>Approbation en 2 jours</b> : durée inventée ; le devis dit 10 jours ouvrables.</li>
    <li><b>Verre des semaines 4 à 11 « en continu »</b> : traverse les Fêtes (semaines 6 et 7), et la commande précède l’approbation.</li>
    <li><b>Pose des fenêtres semaine 13, relevés semaine 15</b> : ordre inversé, et avant la fin de la structure (semaine 18).</li>
    <li><b>Mur-rideau mi-avril</b> : réaliste, mais la promesse « dès mars » d’Éric est ignorée, sans prévenir Boréa.</li>
  </ol>
  <h3>Pour le débriefing (2 ou 3 volontaires)</h3>
  <ul>
    <li>Ce que l’IA a bien fait : résumé du dossier, structure, idées de risques, premier jet de RACI et de relance.</li>
    <li>Ce qu’il a fallu corriger : délais, Fêtes, dépendances, « dès mars », A en double ou absent, tri du courriel 6.</li>
    <li>Le message de fin : l’IA fait gagner du temps sur la mise en forme ; le chargé de projet reste responsable des dates et des engagements.</li>
  </ul>
</section>

<section style="margin-top:18pt">
  <h2><span class="n">6</span>Parcours adjointe : réponses attendues</h2>
  <h3>Les suivis de la semaine (tri par échéance)</h3>
  <table class="mini">
    <tr><th>Suivi</th><th style="width:16%">Pour qui</th><th style="width:16%">Avant le</th><th style="width:30%">À demander à Mathieu</th></tr>
    <tr><td>Certificat d’assurance responsabilité à jour</td><td>Boréa (Julie Bergeron)</td><td>ven. 18 déc.</td><td>Qui le fournit chez Lessard ?</td></tr>
    <tr class="alt"><td>Échantillons V1, V2 à l’architecte</td><td>Atelier Mercier</td><td>ven. 18 déc.</td><td>Les envoyer maintenant ou attendre MR-01 ?</td></tr>
    <tr><td>Diffuser la liste des contacts rév. 3</td><td>Équipe Lessard</td><td>cette semaine</td><td>—</td></tr>
    <tr class="alt"><td>Relance du prix des panneaux d’allège</td><td>Panneaux Nordik</td><td>cette semaine</td><td>Accord pour relancer en son nom</td></tr>
    <tr><td>Formulaires d’accès et attestations SST</td><td>Ville de Rivière-Claire</td><td>ven. 15 janv.</td><td>Liste de l’équipe de Patrice</td></tr>
  </table>
  <h3>Un plan de classement acceptable</h3>
  <p><code>01 Contrat et soumission</code> · <code>02 Dessins et approbations</code> · <code>03 Achats et livraisons</code> · <code>04 Chantier</code> (accès, sécurité, relevés) · <code>05 Correspondance</code> · <code>06 Fin de projet</code> (déficiences, garanties).</p>
  <p>Règle de nommage : <code>P-2611-04_AAAA-MM-JJ_Type_Description</code>. Exemples :</p>
  <ul>
    <li><code>P-2611-04_2026-12-07_DA_MR-01_rev0_pour-approbation.pdf</code></li>
    <li><code>P-2611-04_2026-12-14_BL_Vitrerie-Laurentienne-4471.pdf</code></li>
    <li><code>P-2611-04_2026-12-15_Contacts-chantier_rev3.pdf</code></li>
  </ul>
  ${BOX('ok', 'À exiger', `Des échéances datées · ce que Nadia doit faire valider par Mathieu avant d’agir · un plan de classement qui suit le cycle du projet, avec une règle de nommage appliquée à de vrais fichiers.`)}

  <h2 style="margin-top:16pt"><span class="n">7</span>Les questions qu’on vous posera</h2>
  <table class="ans">
    <tr><th>Question</th><th>Réponse courte</th></tr>
    <tr><td>« Copilot ne lit pas mon PDF. »</td><td>Coller le résumé de la dernière page du dossier d’Éric. Vérifier le bouclier vert et la taille du fichier.</td></tr>
    <tr class="alt"><td>« Mon tableau se colle dans une seule colonne. »</td><td>Demander le même tableau en CSV, séparateur point-virgule, puis <i>Données › Convertir</i>.</td></tr>
    <tr><td>« L’IA m’a donné une autre date de fin. »</td><td>C’est le bon réflexe de la questionner : « Quelles dates as-tu supposées ? » Le 28 mai est contractuel.</td></tr>
    <tr class="alt"><td>« Pourquoi pas Hélène comme A partout ? »</td><td>Possible si c’est la réalité, mais elle devient un goulot. La RACI se valide avec les personnes concernées.</td></tr>
    <tr><td>« Puis-je utiliser mon ChatGPT personnel ? »</td><td>Pas pour un vrai dossier client. Ici le cas est fictif, mais l’habitude se prend avec le compte Lessard.</td></tr>
  </table>
</section>
`,
  docCss + corrigeCss,
);

// ─── Impression ──────────────────────────────────────────────────────────────
const FORMATEUR = path.join(RACINE, 'labs', 'ia-gestion-de-projet-lessard', 'formateur');
fs.mkdirSync(FORMATEUR, { recursive: true });
const DOCS = [
  { html: guide, name: 'guide', pdf: 'Atelier1-Guide-participant.pdf', foot: 'IA124 · Atelier 1 · Guide du participant' },
  { html: dossier, name: 'dossier', pdf: 'Atelier1-Dossier-transmis-par-Eric.pdf', foot: 'IA124 · Atelier 1 · Dossier transmis par Éric · cas fictif' },
  { html: soumission, name: 'soumission', pdf: 'Soumission_Montreal.pdf', foot: 'Soumission S-26-0412 · cas fictif de formation IA124' },
  { html: courriels, name: 'courriels', pdf: 'Atelier1-Courriels-boite-de-Mathieu.pdf', foot: 'IA124 · Atelier 1 · Courriels de Mathieu · cas fictif' },
  { html: corrige, name: 'corrige', pdf: 'Atelier1-Corrige-formateur.pdf', foot: 'IA124 · Atelier 1 · Corrigé du formateur · ne pas distribuer', dir: FORMATEUR },
];

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
for (const d of DOCS) {
  const f = path.join(HTML, `${d.name}.html`);
  fs.writeFileSync(f, d.html);
  await p.goto(`file:///${f.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const pdf = await p.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="font-family:Arial,sans-serif;font-size:7.5px;color:#77818A;width:100%;padding:0 16mm;display:flex;justify-content:space-between"><span>${d.foot}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' },
  });
  const out = path.join(d.dir ?? SORTIE, d.pdf);
  try {
    fs.writeFileSync(out, pdf);
    console.log('→', path.relative(RACINE, out));
  } catch (e) {
    if (e.code !== 'EBUSY') throw e;
    console.warn('⚠ fichier ouvert dans un lecteur, NON mis à jour :', path.relative(RACINE, out));
  }
}
await b.close();

// Modèle Excel, copie du guide pour le bouton « Labs » du deck, puis le zip à déposer dans le Chat.
execSync('python .gpl-labs/modele_excel.py', { cwd: RACINE, stdio: 'inherit' });
const DECK_PDF = path.join(RACINE, 'slides', 'ia-gestion-de-projet-lessard', 'assets', 'guide-atelier1.pdf');
fs.copyFileSync(path.join(SORTIE, DOCS[0].pdf), DECK_PDF);
console.log('→', path.relative(RACINE, DECK_PDF), '(bouton « Labs » : relancez node .gpl-build/build.mjs)');
const ZIP = 'IA124-Lessard-Atelier1.zip';
fs.rmSync(path.join(SORTIE, ZIP), { force: true });
const fichiers = [...DOCS.filter((d) => !d.dir).map((d) => d.pdf), 'Atelier1-Modele-suivi-des-taches.xlsx'];
// tar de Windows (bsdtar) : -a choisit le format d'après l'extension .zip
execSync(`C:\\Windows\\System32\\tar.exe -a -cf ${ZIP} ${fichiers.join(' ')}`, { cwd: SORTIE });
console.log('→', path.relative(RACINE, path.join(SORTIE, ZIP)));
