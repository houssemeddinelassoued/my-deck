// Éléments communs aux documents IA135 (guide du participant, corrigé formateur) :
// chemins, styles (repris du guide IA114, .eth-labs/guide.mjs), petits gabarits HTML, données fictives
// identiques au deck, et impression PDF. Modifier les données ici les change dans les deux documents.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ICI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
export const RACINE = path.resolve(ICI, '..');
export const DECK = path.join(RACINE, 'slides', 'automatisation-taches-ia');
export const SORTIE = path.join(RACINE, 'labs', 'automatisation-taches-ia');
export const HTML = path.join(ICI, 'html');
fs.mkdirSync(SORTIE, { recursive: true });
fs.mkdirSync(HTML, { recursive: true });

export const data = (file, mime) => `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
export const logo = data(path.join(RACINE, 'assets', 'technologia', 'logo-horizontal.png'), 'image/png');
export const tool = (name) => data(path.join(DECK, 'assets', 'logos', `${name}.svg`), 'image/svg+xml');
export const portrait = data(path.join(RACINE, 'assets', 'houssem-formateur.png'), 'image/png');
export const EMAIL = 'houssemeddine.lassoued@gmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/houssemeddinelassoued';
export const ANNEE = new Date().getFullYear();

// Styles of the IA114 guide (same Technologia look), plus a few additions.
const eth = fs.readFileSync(path.join(RACINE, '.eth-labs', 'guide.mjs'), 'utf8');
const m = eth.match(/const CSS = `([\s\S]*?)`;/);
if (!m) throw new Error('CSS du guide IA114 introuvable (.eth-labs/guide.mjs)');
export const CSS = `${m[1]}
.node { display:inline-flex; flex-direction:column; align-items:center; gap:4pt; width: 70pt; text-align:center; font-size:8.5pt; font-weight:600; }
.node i { width: 34pt; height: 34pt; border-radius: 99pt; display:flex; align-items:center; justify-content:center; font-style:normal; color:#fff; font-size: 15pt; }
.flow { display:flex; align-items:center; gap: 4pt; margin: 6pt 0 10pt; flex-wrap: wrap; }
.flow .arr { color: var(--faint); font-size: 16pt; }
.lab { border-left: 5pt solid var(--yellow); padding-left: 12pt; }
.steps { counter-reset: s; list-style: none; padding-left: 0; }
.steps li { counter-increment: s; position: relative; padding-left: 24pt; margin: 5pt 0; }
.steps li::before { content: counter(s); position: absolute; left: 0; top: 0; width: 16pt; height: 16pt; border-radius: 4pt; background: var(--yellow); color: var(--ink); font-weight: 700; font-size: 9pt; display:flex; align-items:center; justify-content:center; }
.kbd { font-weight: 600; font-size: 9pt; padding: 0 5pt; border: 1pt solid var(--faint); border-bottom-width: 2pt; border-radius: 4pt; background: #fff; white-space: nowrap; }
.pill { font-weight: 600; font-size: 9pt; padding: 0 5pt; border-radius: 4pt; background: #E4F3E3; color: #2B7A33; white-space: nowrap; }
.legend span { display:inline-flex; align-items:center; gap:4pt; margin-right: 10pt; font-size: 9pt; }
.legend b { width: 9pt; height: 9pt; border-radius: 2pt; display:inline-block; }
`;

export const page = (title, body) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>${body}</body></html>`;

export const P = (text, label = 'À copier dans votre outil') => `<div class="prompt"><span class="t">${label}</span>${text}</div>`;
export const BOX = (kind, title, html) => `<div class="box ${kind}"><span class="t">${title}</span>${html}</div>`;
export const K = (t) => `<span class="kbd">${t}</span>`;
export const PILL = (t) => `<span class="pill">${t}</span>`;
export const blank = (cols, n, cls = 'blank') => Array.from({ length: n }, () => `<tr>${Array.from({ length: cols }, () => `<td class="${cls}"></td>`).join('')}</tr>`).join('');
export const NODE = (c, sym, label) => `<span class="node"><i style="background:${c}">${sym}</i>${label}</span>`;
export const ARR = '<span class="arr">→</span>';
export const TOOLS = (ids) =>
  `<div class="tools">${ids
    .map((t) => `<span><img src="${tool(t)}" alt="">${{ make: 'Make', gemini: 'Gemini', googlesheets: 'Google Sheets', gmail: 'Gmail', googleforms: 'Google Forms', copilot: 'Copilot', chatgpt: 'ChatGPT', automate: 'Power Automate', zapier: 'Zapier', n8n: 'n8n' }[t]}</span>`)
    .join('')}</div>`;
export const insecables = (html) =>
  html.replace(/>([^<]+)</g, (mm, t) => '>' + t.replace(/ ([?!:;»%$])/g, '\u00A0$1').replace(/« /g, '«\u00A0') + '<');

// ─── Données fictives (identiques au deck) ──────────────────────────────────
export const MSG6 = [
  'Bonjour, la facture 2231 compte deux fois les frais de livraison.',
  'Mon canapé devait arriver hier entre 8 h et 12 h. Personne. Je suis en congé pour rien.',
  'Le tissu du fauteuil Alba existe-t-il en vert ?',
  'La porte de l’armoire est arrivée rayée, mais ce n’est pas grave, je la garde.',
  'Super service, merci à l’équipe de livraison !',
  'Je veux annuler ma commande avant qu’elle parte et être remboursé.',
];
export const DEMANDES = [
  ['2026-11-16', 'Sophie Lavoie', 'sophie.lavoie@exemple.ca', 'Mon colis devait arriver mardi, toujours rien, c’est urgent pour un anniversaire samedi.'],
  ['2026-11-16', 'Marc Ouellet', 'marc.ouellet@exemple.ca', 'Faites-vous la livraison à Rimouski ?'],
  ['2026-11-17', 'Atelier Brume', 'contact@atelierbrume.exemple', 'J’ai une idée pour améliorer votre site, on peut en parler ?'],
  ['2026-11-17', 'Nadia Benali', 'n.benali@exemple.ca', 'Le flacon de sérum est arrivé fissuré, le produit a coulé partout dans la boîte.'],
  ['2026-11-18', 'Julien Roy', 'jroy@exemple.ca', 'Ma facture 5521 indique 3 crèmes, j’en ai commandé 2.'],
  ['2026-11-18', 'Émilie Caron', 'emilie.c@exemple.ca', 'Votre crème de nuit convient-elle aux peaux sensibles ?'],
  ['2026-11-19', 'Paul Tremblay', 'paul.t@exemple.ca', 'Troisième courriel sans réponse. Je veux être remboursé aujourd’hui, sinon je conteste le paiement.'],
  ['2026-11-19', 'Lina Gagnon', 'lina.g@exemple.ca', 'Est-ce possible de changer l’adresse de livraison de ma commande 7780 ?'],
];
export const FAQ = [
  ['Quand ont lieu les prochaines sessions ?', 'Chaque mois, en classe virtuelle ; le calendrier est sur la page de la formation.'],
  ['Combien coûte la formation ?', 'Le prix est indiqué sur la page de la formation ; il comprend le guide et l’attestation.'],
  ['Puis-je annuler mon inscription ?', 'Oui, sans frais jusqu’à 10 jours ouvrables avant la session ; ensuite, un report est proposé.'],
  ['Vais-je recevoir une attestation ?', 'Oui, une attestation de participation est envoyée par courriel après la session.'],
  ['Y a-t-il des prérequis ?', 'Une connaissance de base des outils bureautiques et d’Internet suffit.'],
  ['Comment se connecter ?', 'Le lien Teams ou Zoom est envoyé 48 h avant la session.'],
  ['Quel matériel faut-il ?', 'Un ordinateur, une connexion stable, idéalement deux écrans, un micro et une caméra.'],
  ['Qui contacter en cas de question ?', 'Le service à la clientèle du centre, par courriel, du lundi au vendredi.'],
];
export const QUESTIONS_C = [
  'Bonjour, est-ce que je peux annuler mon inscription du 8 décembre ?',
  'Est-ce qu’il faut savoir programmer pour suivre la formation ?',
  'Vous faites un rabais pour les groupes de 10 personnes ?',
  'Je n’ai pas reçu le lien pour demain, est-ce normal ?',
  'Pouvez-vous me dire si la formation est admissible au crédit d’impôt ?',
];

export const PROMPT_CLASS = `Tu es l’assistant du service client d’un fabricant de meubles.<br>
Classe le message ci-dessous dans UNE catégorie.<br>
Catégories autorisées : livraison, produit endommagé, question produit, facturation, autre.<br>
Réponds uniquement en JSON : {"categorie": "...", "priorite": "haute|normale", "confiance": 0 à 1}<br>
Si tu hésites, mets "autre" et une confiance inférieure à 0,5. N’invente rien.<br>
Message : [collez ici le message]`;
export const PROMPT_ATELIER2 = `Tu es l’assistant du service client. Analyse la demande ci-dessous. Réponds uniquement avec un objet JSON, sans balises de code ni texte autour :<br>
{"categorie": "livraison | produit endommagé | question produit | facturation | autre", "priorite": "haute | normale", "resume": "une phrase de 15 mots maximum", "confiance": nombre entre 0 et 1}<br>
Si tu hésites, categorie = "autre" et confiance inférieure à 0.5.<br>
Demande : ${PILL('1. Message')}`;

// ─── Impression PDF (Chrome via playwright-core) ─────────────────────────────
// printPdf(htmlName, title, body, footerTitle, outputs) → writes the same PDF to every path of outputs.
export const printPdf = async (htmlName, title, body, footerTitle, outputs) => {
  let chromium;
  for (const base of [import.meta.url, process.env.PW_BASE].filter(Boolean)) {
    try {
      ({ chromium } = createRequire(base)('playwright-core'));
      break;
    } catch {}
  }
  if (!chromium) throw new Error('playwright-core introuvable : npm i playwright-core dans un dossier de travail, puis PW_BASE=<ce dossier>/package.json');
  const br = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const pg = await br.newPage();
  const f = path.join(HTML, htmlName);
  fs.writeFileSync(f, page(title, insecables(body)));
  await pg.goto(`file:///${f.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  const pdf = await pg.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="font-family:Arial,sans-serif;font-size:7.5px;line-height:1.5;color:#77818A;width:100%;padding:0 16mm;display:flex;justify-content:space-between;align-items:flex-end"><span>${footerTitle}<br>Auteur et formateur : Houssem Eddine Lassoued · © ${ANNEE} Tous droits réservés</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' },
  });
  await br.close();
  for (const out of outputs) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    try {
      fs.writeFileSync(out, pdf);
      console.log('→', path.relative(RACINE, out), `(${Math.round(pdf.length / 1024)} Ko)`);
    } catch (e) {
      if (e.code !== 'EBUSY') throw e;
      console.warn('⚠ fichier ouvert dans un lecteur, NON mis à jour :', path.relative(RACINE, out));
    }
  }
};
