// Guide PDF des TP « GitHub Copilot · Niveau avancé » (Docaposte Institute).
//   node .cop-labs/guide.mjs   → .cop-labs/html/guide.html
//                               + labs/copilot-avance/Guide-des-TP-Copilot-Avance.pdf
//                               + slides/copilot-avance/assets/guide-copilot-avance.pdf (bouton « Labs » du deck,
//                                 câblé par node .cop-build/build.mjs)
// Source unique : labs/copilot-avance/guide/ — 00-intro.md, tp-0N.md (sections Objectif, Point de départ, Étapes,
// Livrable, Pièges à observer, Bonus, Coincé ? + toute section propre à un TP), annexe-*.md (cheat sheets,
// deux colonnes séparées par <!-- col -->). Impression : Chrome via playwright-core.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ICI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const RACINE = path.resolve(ICI, '..');
const LABS = path.join(RACINE, 'labs', 'copilot-avance');
const SRC = path.join(LABS, 'guide');
const SORTIE_HTML = path.join(ICI, 'html', 'guide.html');
const SORTIE_PDF = path.join(LABS, 'Guide-des-TP-Copilot-Avance.pdf');
const SORTIE_DECK = path.join(RACINE, 'slides', 'copilot-avance', 'assets', 'guide-copilot-avance.pdf');
const lire = (f) => fs.readFileSync(path.join(SRC, f), 'utf8').replace(/\r\n/g, '\n');

// ─── Mini Markdown (titres, listes imbriquées, blocs de code, tableaux, `code`, **gras**) ──
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => {
  const parts = s.split(/(`[^`]+`)/g);
  return parts
    .map((p) =>
      p.startsWith('`') && p.endsWith('`') && p.length > 1
        ? `<code>${esc(p.slice(1, -1))}</code>`
        : esc(p)
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[\s(«])\*([^*\s][^*]*?)\*(?=[\s).,;:!?»]|$)/g, '$1<em>$2</em>'),
    )
    .join('');
};

function md(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const isItem = (l) => /^(\s*)(-|\d+\.) /.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) {
      i++;
      continue;
    }
    const fence = l.match(/^(\s*)```(\w*)/);
    if (fence) {
      const ind = fence[1].length;
      const buf = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) buf.push(lines[i++].slice(ind));
      i++;
      out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }
    if (l.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      out.push(
        `<table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${body
          .map((r) => `<tr>${r.map((c) => `<td>${c === '☐' ? '<span class="box"></span>' : inline(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody></table>`,
      );
      continue;
    }
    const h = l.match(/^(#{1,4}) (.+)/);
    if (h) {
      out.push(`<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`);
      i++;
      continue;
    }
    if (isItem(l)) {
      const ordered = /^\s*\d+\. /.test(l);
      const items = [];
      while (i < lines.length) {
        // A blank line between two items of the same list does not end it.
        if (!lines[i].trim()) {
          let j = i;
          while (j < lines.length && !lines[j].trim()) j++;
          if (j < lines.length && /^(-|\d+\.) /.test(lines[j]) && /^\d+\. /.test(lines[j]) === ordered) {
            i = j;
            continue;
          }
          break;
        }
        const m = lines[i].match(/^(\s*)(-|\d+\.) (.*)/);
        if (!m || m[1].length > 0) break;
        const body = [m[3]];
        i++;
        while (i < lines.length && (lines[i].startsWith('   ') || (!lines[i].trim() && i + 1 < lines.length && lines[i + 1].startsWith('   ')))) {
          body.push(lines[i].replace(/^ {3}/, ''));
          i++;
        }
        items.push(body.join('\n'));
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((it) => `<li><div>${md(it).replace(/^<p>([\s\S]*?)<\/p>/, '$1')}</div></li>`).join('')}</${tag}>`);
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !isItem(lines[i]) && !/^(#|\||\s*```)/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}

// Sections « ## Titre » ; une ligne « ## » à l’intérieur d’un bloc de code ne compte pas.
const sections = (src) => {
  const map = {};
  let cur = null;
  let fence = false;
  for (const l of src.split('\n')) {
    if (/^\s*```/.test(l)) fence = !fence;
    const h = !fence && l.match(/^## (.+)$/);
    if (h) map[(cur = h[1].trim())] = [];
    else if (cur) map[cur].push(l);
  }
  for (const k of Object.keys(map)) map[k] = map[k].join('\n').trim();
  return map;
};


// Cases à cocher (« ☐ » en tête d’item) et touches <kbd> autorisées dans le texte.
const html2 = (s) =>
  md(s)
    .replace(/<li><div>☐ /g, '<li><span class="box"></span><div>')
    .replace(/&lt;(\/?)kbd&gt;/g, '<$1kbd>');

// ─── Lecture des TP ─────────────────────────────────────────────────────────
const TON = { 1: 'blue', 2: 'teal', 3: 'pink', 4: 'violet', 5: 'coral', 6: 'green' };
const tps = fs
  .readdirSync(SRC)
  .filter((f) => /^tp-\d\d\.md$/.test(f))
  .sort()
  .map((f) => {
    const src = lire(f);
    const titre = src.match(/^# TP (\d+) · (.+)$/m);
    const ligne = src.match(/^\| (\d) · ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/m);
    if (!titre || !ligne) throw new Error(`${f} : titre ou ligne d’en-tête manquants`);
    return { n: Number(titre[1]), titre: titre[2], module: `Module ${ligne[1]} · ${ligne[2].trim()}`, duree: ligne[3].trim(), moment: ligne[4].trim(), fichiers: ligne[5].trim(), s: sections(src) };
  });

const bloc = (a, k) => (a.s[k] ? html2(a.s[k]) : '');
const CONNUES = ['Objectif', 'Point de départ', 'Étapes', 'Livrable', 'Pièges à observer', 'Bonus', 'Coincé ?'];
const extras = (a, ou) => {
  const cles = Object.keys(a.s);
  const iEtapes = cles.indexOf('Étapes');
  return cles
    .filter((k, i) => !CONNUES.includes(k) && (ou === 'avant' ? i < iEtapes : i > iEtapes))
    .map((k) => `<h3>${inline(k)}</h3>${bloc(a, k)}`)
    .join('');
};
const pageTP = (a) => `
<section class="atelier t-${TON[a.n]}">
  <header>
    <div class="num"><span>TP</span><b>${a.n}</b></div>
    <div class="ttl">
      <div class="mod">${esc(a.module)}</div>
      <h2>${inline(a.titre)}</h2>
      <div class="chips"><span class="chip">⏱ ${esc(a.duree)}</span><span class="chip">${esc(a.moment)}</span><span class="chip">Individuel</span></div>
      <div class="files">${inline(a.fichiers)}</div>
    </div>
  </header>
  <div class="obj"><div class="cap">Objectif</div>${bloc(a, 'Objectif')}</div>
  <div class="grid">
    <div class="main">
      <h3>Point de départ</h3>${bloc(a, 'Point de départ')}
      ${extras(a, 'avant')}
      <h3>Étapes</h3><div class="steps">${bloc(a, 'Étapes')}</div>
      ${extras(a, 'apres')}
    </div>
    <aside>
      <div class="done"><div class="cap">C’est terminé quand…</div>${bloc(a, 'Livrable').replace(/<li><div>/g, '<li><span class="box"></span><div>')}</div>
      <div class="traps"><div class="cap">Pièges à observer</div>${bloc(a, 'Pièges à observer')}</div>
      ${a.s.Bonus ? `<div class="bonus"><div class="cap">Bonus</div>${bloc(a, 'Bonus')}</div>` : ''}
      ${a.s['Coincé ?'] ? `<div class="help"><div class="cap">Coincé ?</div>${bloc(a, 'Coincé ?')}</div>` : ''}
    </aside>
  </div>
</section>`;

// ─── Annexes (cheat sheets) ─────────────────────────────────────────────────
const TON_ANX = ['navy', 'blue', 'violet', 'teal', 'pink', 'coral'];
const annexes = fs
  .readdirSync(SRC)
  .filter((f) => /^annexe-[a-z]\.md$/.test(f))
  .sort()
  .map((f, i) => {
    const src = lire(f);
    const t = src.match(/^# Annexe ([A-Z]) · (.+)$/m);
    if (!t) throw new Error(`${f} : titre « # Annexe X · … » manquant`);
    const corps = src.replace(/^# .+$/m, '').trim();
    const [g, d = ''] = corps.split(/^<!-- col -->$/m);
    return { lettre: t[1], titre: t[2], ton: TON_ANX[i % TON_ANX.length], g: html2(g), d: html2(d) };
  });
const pageAnnexe = (x) => `
<section class="annexe t-${x.ton}">
  <div class="ahead"><div class="lt">${x.lettre}</div><div><div class="k">Annexe ${x.lettre} · cheat sheet</div><h2>${inline(x.titre)}</h2></div></div>
  <div class="two"><div>${x.g}</div><div>${x.d}</div></div>
</section>`;

// ─── Document ───────────────────────────────────────────────────────────────
const intro = sections(lire('00-intro.md'));
const logo = `<div class="logo"><div><span class="dap">DOCAPOSTE<svg viewBox="0 0 30 20" width="30" height="20"><rect x="0" y="2" width="30" height="3.4" rx="1.7"/><rect x="6" y="8.3" width="24" height="3.4" rx="1.7"/><rect x="12" y="14.6" width="18" height="3.4" rx="1.7"/></svg></span><span class="inst">Institute</span></div></div>`;
const sommaire = `<table class="toc"><tbody>${tps.map((a) => `<tr><td>TP ${a.n}</td><td>${inline(a.titre)}</td></tr>`).join('')}${annexes
  .map((x) => `<tr><td>${x.lettre}</td><td>${inline(x.titre)}</td></tr>`)
  .join('')}</tbody></table>`;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Guide des TP · GitHub Copilot niveau avancé</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap">
<style>${fs.readFileSync(path.join(ICI, 'guide.css'), 'utf8')}</style></head><body>
<section class="cover">
  ${logo}
  <div class="kicker">Formation · 1 jour · classe virtuelle</div>
  <h1>GitHub Copilot<br><span>niveau avancé</span></h1>
  <p class="sub">Guide des 6 TP individuels · fil rouge SalleLibre<br>Instructions, skills, agents personnalisés et orchestration · 6 cheat sheets en annexe</p>
  <div class="who">Houssem Eddine LASSOUED · Docaposte Institute</div>
  <div class="foot">Version du 12 novembre 2026 · formats vérifiés sur code.visualstudio.com et docs.github.com le 11 novembre 2026</div>
</section>
<section class="intro">
  <h2>Mode d’emploi</h2>
  ${html2(intro['La journée'])}
  <h3>Les 6 TP</h3>${html2(intro['Les 6 TP'])}
  <h3>Votre dossier .github en fin de journée</h3>${html2(intro['Votre dossier .github en fin de journée'])}
  <h3>Règles du jeu</h3>${html2(intro['Règles du jeu'])}
</section>
<section class="intro">
  <h2>Avant la formation</h2>
  ${html2(intro['Avant la formation'])}
  <h3>Sommaire</h3>${sommaire}
  <div class="notes"><div class="cap">Mes notes</div></div>
</section>
${tps.map(pageTP).join('\n')}
${annexes.map(pageAnnexe).join('\n')}
</body></html>`;

fs.mkdirSync(path.dirname(SORTIE_HTML), { recursive: true });
fs.writeFileSync(SORTIE_HTML, html);
console.log('html', path.relative(RACINE, SORTIE_HTML), `${tps.length} TP, ${annexes.length} annexes`);

const require = createRequire('C:/Users/ASUS/AppData/Local/Temp/ia134pw/');
const { chromium } = require('playwright-core');
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const p = await b.newPage();
await p.goto(`file:///${SORTIE_HTML.split(path.sep).join('/')}`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: SORTIE_PDF, format: 'A4', printBackground: true, preferCSSPageSize: true });
if (process.argv.includes('--png')) {
  await p.setViewportSize({ width: 794, height: 1123 });
  await p.screenshot({ path: path.join(ICI, 'html', 'apercu.png'), fullPage: true });
}
await b.close();
fs.mkdirSync(path.dirname(SORTIE_DECK), { recursive: true });
fs.copyFileSync(SORTIE_PDF, SORTIE_DECK);
console.log('pdf', path.relative(RACINE, SORTIE_PDF), '(+ copie', path.relative(RACINE, SORTIE_DECK) + ')');
