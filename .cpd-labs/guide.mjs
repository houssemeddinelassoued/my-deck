// Guide PDF des ateliers « GitHub Copilot · Débutant » (Docaposte Institute).
//   node .cpd-labs/guide.mjs          → .cpd-labs/html/guide.html + labs/copilot-debutant/Guide-des-ateliers-Copilot-Debutant.pdf (+ copie dans le dépôt)
// Source unique : README.md du dépôt et ateliers/*/README.md (sections Objectif, Point de départ,
// Étapes, Livrable, Pièges à observer, Bonus, Coincé ?). Impression : Chrome via playwright-core.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ICI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const RACINE = path.resolve(ICI, '..');
const LABS = path.join(RACINE, 'labs', 'copilot-debutant');
const DEPOT = path.join(LABS, 'taskflow-copilot');
const SORTIE_HTML = path.join(ICI, 'html', 'guide.html');
const SORTIE_PDF = path.join(LABS, 'Guide-des-ateliers-Copilot-Debutant.pdf');

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

const sections = (src) => {
  const map = {};
  for (const part of src.split(/^## /m).slice(1)) {
    const nl = part.indexOf('\n');
    map[part.slice(0, nl).trim()] = part.slice(nl + 1).trim();
  }
  return map;
};

// ─── Lecture des ateliers ───────────────────────────────────────────────────
const TON = { 1: 'blue', 2: 'navy', 3: 'teal', 4: 'green', 5: 'teal', 6: 'violet', 7: 'pink', 8: 'coral', 9: 'violet' };
const ateliers = fs
  .readdirSync(path.join(DEPOT, 'ateliers'))
  .filter((d) => /^atelier-\d\d/.test(d))
  .sort()
  .map((dossier) => {
    const src = fs.readFileSync(path.join(DEPOT, 'ateliers', dossier, 'README.md'), 'utf8').replace(/\r\n/g, '\n');
    const titre = src.match(/^# Atelier (\d+) · (.+)$/m);
    const ligne = src.match(/^\| (\d) · ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/m);
    return {
      dossier,
      n: Number(titre[1]),
      titre: titre[2],
      module: `Module ${ligne[1]} · ${ligne[2].trim()}`,
      duree: ligne[3].trim(),
      moment: ligne[4].trim(),
      fichiers: ligne[5].trim(),
      s: sections(src),
    };
  });

const bloc = (a, k) => (a.s[k] ? md(a.s[k]) : '');
const pageAtelier = (a) => `
<section class="atelier t-${TON[a.n]}">
  <header>
    <div class="num"><span>ATELIER</span><b>${a.n}</b></div>
    <div class="ttl">
      <div class="mod">${esc(a.module)}</div>
      <h2>${esc(a.titre)}</h2>
      <div class="chips"><span class="chip">⏱ ${esc(a.duree)}</span><span class="chip">${esc(a.moment)}</span><span class="chip">Individuel</span></div>
      <div class="files">${inline(a.fichiers)}</div>
    </div>
  </header>
  <div class="obj"><div class="cap">Objectif</div>${bloc(a, 'Objectif')}</div>
  <div class="grid">
    <div class="main">
      <h3>Point de départ</h3>${bloc(a, 'Point de départ')}
      <h3>Étapes</h3><div class="steps">${bloc(a, 'Étapes')}</div>
    </div>
    <aside>
      <div class="done"><div class="cap">C’est terminé quand…</div>${bloc(a, 'Livrable').replace(/<li><div>/g, '<li><span class="box"></span><div>')}</div>
      <div class="traps"><div class="cap">Pièges à observer</div>${bloc(a, 'Pièges à observer')}</div>
      ${a.s.Bonus ? `<div class="bonus"><div class="cap">Bonus</div>${bloc(a, 'Bonus')}</div>` : ''}
      ${a.s['Coincé ?'] ? `<div class="help"><div class="cap">Coincé ?</div>${bloc(a, 'Coincé ?')}</div>` : ''}
    </aside>
  </div>
</section>`;

const readme = sections(fs.readFileSync(path.join(DEPOT, 'README.md'), 'utf8').replace(/\r\n/g, '\n'));
const logo = `<div class="logo"><div><span class="dap">DOCAPOSTE<svg viewBox="0 0 30 20" width="30" height="20"><rect x="0" y="2" width="30" height="3.4" rx="1.7"/><rect x="6" y="8.3" width="24" height="3.4" rx="1.7"/><rect x="12" y="14.6" width="18" height="3.4" rx="1.7"/></svg></span><span class="inst">Institute</span></div></div>`;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Guide des ateliers · GitHub Copilot Débutant</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap">
<style>${fs.readFileSync(path.join(ICI, 'guide.css'), 'utf8')}</style></head><body>
<section class="cover">
  ${logo}
  <div class="kicker">Formation · 2 jours · classe virtuelle</div>
  <h1>GitHub Copilot<br><span>Débutant</span></h1>
  <p class="sub">Guide des 9 ateliers individuels · fil rouge TaskFlow</p>
  <div class="who">Houssem Eddine LASSOUED · Docaposte Institute</div>
  <div class="foot">Version du 5 novembre 2026 · dépôt <code>taskflow-copilot</code></div>
</section>
<section class="intro">
  <h2>Mode d’emploi</h2>
  <p>Pendant deux jours, vous construisez <strong>TaskFlow</strong>, un petit outil de gestion de tickets (backlog et Kanban), avec GitHub Copilot dans VS Code. Chaque atelier ajoute une brique au même dépôt. Les ateliers sont <strong>individuels</strong> : chacun sur son poste, minuteur affiché, points d’étape oraux toutes les 15 à 20 minutes. Bloqué plus de 5 minutes ? Dites-le au micro : partage d’écran de 2 minutes.</p>
  <h3>Installer</h3>${md(readme['Installer (5 minutes, avant la formation)'])}
  <h3>Commandes</h3>${md(readme.Commandes)}
  <h3>Vue d’ensemble</h3>${md(readme['Les 9 ateliers (individuels)'])}
  <h3>Règles du jeu</h3>${md(readme['Règles du jeu'])}
</section>
${ateliers.map(pageAtelier).join('\n')}
<section class="annexe">
  <h2>Annexe · Aide-mémoire</h2>
  <div class="two">
    <div><h3>Les 8 raccourcis (Windows / Linux)</h3>
      <table><tbody>
        <tr><td><kbd>Tab</kbd></td><td>accepter la suggestion</td></tr>
        <tr><td><kbd>Échap</kbd></td><td>refuser</td></tr>
        <tr><td><kbd>Ctrl+→</kbd></td><td>accepter mot par mot</td></tr>
        <tr><td><kbd>Alt+]</kbd> <kbd>Alt+[</kbd></td><td>suggestion suivante / précédente</td></tr>
        <tr><td><kbd>Alt+\\</kbd></td><td>déclencher une suggestion</td></tr>
        <tr><td><kbd>Ctrl+I</kbd></td><td>chat en ligne (modifier la sélection)</td></tr>
        <tr><td><kbd>Ctrl+Alt+I</kbd></td><td>vue Chat</td></tr>
        <tr><td><kbd>Ctrl+N</kbd> (chat)</td><td>nouvelle conversation</td></tr>
      </tbody></table>
      <p class="small">macOS : Ctrl devient Cmd, Alt devient Option.</p>
      <h3>Le commentaire en 5 ingrédients</h3>
      <p>Entrée · Sortie · Règle · Exemple (dont un cas refusé) · Contrainte</p>
      <h3>Lire avant d’accepter : 5 questions</h3>
      <ol><li><div>Fait-elle ce que j’ai demandé ?</div></li><li><div>Ce qu’elle appelle existe-t-il ?</div></li><li><div>Et les cas limites ?</div></li><li><div>A-t-elle des effets de bord ?</div></li><li><div>Puis-je l’expliquer ligne à ligne ?</div></li></ol>
    </div>
    <div><h3>Checklist de relecture</h3>
      <p class="cl b">Logique</p><ul><li><span class="box"></span><div>Fait ce qui est demandé, tout ce qui est demandé</div></li><li><span class="box"></span><div>Cas limites : vide, null, bornes, doublons</div></li><li><span class="box"></span><div>Erreurs gérées, messages clairs</div></li><li><span class="box"></span><div>Fonctions et API qui existent vraiment</div></li></ul>
      <p class="cl y">Performances</p><ul><li><span class="box"></span><div>Pas de boucle dans une boucle évitable</div></li><li><span class="box"></span><div>Pas de recalcul inutile dans une boucle</div></li><li><span class="box"></span><div>Set ou Map pour les recherches répétées</div></li></ul>
      <p class="cl c">Sécurité</p><ul><li><span class="box"></span><div>Aucun secret, aucun jeton dans le code</div></li><li><span class="box"></span><div>Entrées utilisateur jamais injectées telles quelles</div></li><li><span class="box"></span><div>Dépendance proposée : existe-t-elle, est-elle sûre ?</div></li><li><span class="box"></span><div>Licence : code recopié d’un dépôt public ?</div></li></ul>
    </div>
  </div>
</section>
</body></html>`;

fs.mkdirSync(path.dirname(SORTIE_HTML), { recursive: true });
fs.writeFileSync(SORTIE_HTML, html);
console.log('html', path.relative(RACINE, SORTIE_HTML), `${ateliers.length} ateliers`);

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
fs.copyFileSync(SORTIE_PDF, path.join(DEPOT, path.basename(SORTIE_PDF))); // le PDF est aussi publié dans le dépôt GitHub
console.log('pdf', path.relative(RACINE, SORTIE_PDF), '(+ copie dans taskflow-copilot/)');
