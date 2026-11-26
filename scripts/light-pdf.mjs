// Export PDF de la version light d’un deck (à envoyer aux participants avant la formation), avec les
// pages interactives dépliées. Version simple, sans script : bouton Télécharger › Version light (PDF).
//   le serveur de développement tourne (npm run dev, http://localhost:5173), puis :
//   node scripts/light-pdf.mjs <slideId> <sortie.pdf> [--client <id>] [--last <n>] [--all]
// Pages : la liste « export const light » du deck (écrite par son build) ; --all = toutes les pages.
// Ex. : node scripts/light-pdf.mjs automatisation-taches-ia labs/automatisation-taches-ia/IA135-Version-light.pdf
//       node scripts/light-pdf.mjs introduction-ia-ethique labs/introduction-ia-ethique/IA114-Version-light-Sobeys.pdf --client sobeys
// Mode lecture du player (touche Entrée) : la page active remplit 1920 × 1080 et accepte de vrais clics
// (la vue éditeur pose un calque qui bloque les clics). Navigation par l’événement open-slide:goto.
// Chaque page est capturée avec toutes ses étapes révélées ; les pages interactives sont dépliées :
// un onglet = une page du PDF (data-osd-tab), une page par pastille ouverte seule (data-osd-hotspot),
// interrupteur unique montré dans ses deux états (data-osd-toggle), cartes retournées (<prefix>-flip).
// --client : version client des decks à bouton de couverture (localStorage osd-client-<slideId>).
// Environnement : PORT=5173 · SITE_PASSWORD (sinon lu dans open-slide.config.ts)
//   PW_BASE=<dossier où playwright-core est installé>/package.json
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i < 0 ? undefined : args.splice(i, 2)[1];
};
const CLIENT = opt('client');
const LAST = Number(opt('last') || 0);
const [ID, OUTARG] = args.filter((a) => a !== '--all');
if (!ID || !OUTARG) throw new Error('usage : node scripts/light-pdf.mjs <slideId> <sortie.pdf> [--client <id>] [--last <n>] [--all]');
const OUT = path.resolve(RACINE, OUTARG);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const PORT = process.env.PORT || '5173';
const src = fs.readFileSync(path.join(RACINE, 'slides', ID, 'index.tsx'), 'utf8');
const P = src.match(/const P = '([^']+)'/)?.[1];
if (!P) throw new Error(`slides/${ID}/index.tsx : préfixe CSS (const P) introuvable`);
const total = (src.match(/export default \[([\s\S]*?)\] satisfies/)?.[1].match(/\w+,/g) ?? []).length;
if (!total) throw new Error(`slides/${ID}/index.tsx : aucune page`);
// Pages to print: the deck's own light list (export const light, written by its build) unless --all.
const ALL = args.includes('--all');
const lightList = src.match(/export const light: number\[\] = \[([^\]]*)\]/)?.[1];
const order = !ALL && lightList ? lightList.split(',').map((x) => Number(x.trim()) + 1).filter((x) => x >= 1 && x <= total) : Array.from({ length: total }, (_, i) => i + 1);
const list = LAST ? order.slice(0, LAST) : order;
const last = list.length;

const cfg = fs.readFileSync(path.join(RACINE, 'open-slide.config.ts'), 'utf8');
const password = process.env.SITE_PASSWORD ?? cfg.match(/siteLock\s*:\s*\{[^}]*password\s*:\s*'([^']*)'/)?.[1] ?? '';
const unlock = password ? crypto.createHash('sha256').update(`open-slide:site:${password}`).digest('hex') : null;

let chromium;
for (const base of [import.meta.url, process.env.PW_BASE].filter(Boolean)) {
  try {
    ({ chromium } = createRequire(base)('playwright-core'));
    break;
  } catch {}
}
if (!chromium) throw new Error('playwright-core introuvable : npm i playwright-core dans un dossier de travail, puis PW_BASE=<ce dossier>/package.json');

// Installed Google Chrome (CHROME_EXECUTABLE_PATH to override); otherwise Playwright's own browser.
const chromeExe =
  process.env.CHROME_EXECUTABLE_PATH ||
  (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '');
const browser = await chromium.launch(chromeExe && fs.existsSync(chromeExe) ? { executablePath: chromeExe } : {});
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
if (unlock) await ctx.addInitScript((h) => sessionStorage.setItem('open-slide:site-unlocked', h), unlock);
if (CLIENT) await ctx.addInitScript(([key, value]) => localStorage.setItem(key, value), [`osd-client-${ID}`, CLIENT]);
const page = await ctx.newPage();

// The active slide = the .<prefix>-page whose box covers the viewport centre.
const SLIDE = `.${P}-page`;
const active = () =>
  page.evaluateHandle((sel) => {
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (r.width > 1000 && r.left <= 960 && r.right >= 960 && r.top <= 540 && r.bottom >= 540) return el;
    }
    return null;
  }, SLIDE);
const inSlide = async (fn, arg) => {
  const el = (await active()).asElement();
  return el ? el.evaluate(fn, arg) : null;
};
// Real mouse click on the i-th element matching `sel` inside the active slide.
const clickIn = async (sel, i = 0) => {
  const el = (await active()).asElement();
  const h = el ? (await el.$$(sel))[i] : null;
  if (h) await h.click({ timeout: 3000 }).catch(() => {});
};
const shots = [];
const shoot = async () => {
  await page.waitForTimeout(900);
  // PNG preserves all colors and gradients; JPEG at quality 88% loses subtle color variations.
  shots.push(await page.screenshot({ type: 'png' }));
};

await page.goto(`http://localhost:${PORT}/s/${ID}?p=1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
await page.keyboard.press('Enter');
await page.waitForTimeout(2500);
for (const [k, p] of list.entries()) {
  if (k > 0 || p !== 1) {
    await page.evaluate((index) => window.dispatchEvent(new CustomEvent('open-slide:goto', { detail: { index } })), p - 1);
    await page.waitForTimeout(1600);
  }
  await inSlide((root) => root.querySelectorAll('[data-osd-step]').forEach((n) => n.setAttribute('data-osd-step', 'revealed')));
  await page.waitForTimeout(1200);
  const n = await inSlide(
    (root, cls) => ({
      hot: root.querySelectorAll('[data-osd-hotspot]').length,
      tabs: root.querySelectorAll('[data-osd-tab]').length,
      toggles: root.querySelectorAll('[data-osd-toggle]').length,
      flips: root.querySelectorAll(cls).length,
    }),
    `.${P}-flip`,
  );
  if (!n) {
    console.warn(`\n⚠ page ${p} : diapositive active introuvable`);
    continue;
  }
  if (n.hot) {
    // Base view, then one page per hotspot opened alone (their tips overlap when all are open).
    await shoot();
    for (let i = 0; i < n.hot; i++) {
      await clickIn('[data-osd-hotspot]', i);
      await shoot();
      await clickIn('[data-osd-hotspot]', i);
    }
  } else if (n.tabs) {
    for (let i = 0; i < n.tabs; i++) {
      await clickIn('[data-osd-tab]', i);
      await shoot();
    }
  } else {
    await shoot();
    if (n.toggles === 1) {
      await clickIn('[data-osd-toggle]');
      await shoot();
    }
    if (n.flips) {
      for (let i = 0; i < n.flips; i++) await clickIn(`.${P}-flip`, i);
      await shoot();
    }
  }
  process.stdout.write(`\r  page ${k + 1} / ${last} (p. ${p}) · ${shots.length} images`);
}
console.log('');

// Assemble: one 16:9 PDF page per image.
const pdfPage = await ctx.newPage();
const html = `<!doctype html><html><head><style>@page{size:1920px 1080px;margin:0}html,body{margin:0}img{display:block;width:1920px;height:1080px;object-fit:contain;break-after:page}</style></head><body>${shots
  .map((s) => `<img src="data:image/png;base64,${s.toString('base64')}">`)
  .join('')}</body></html>`;
await pdfPage.setContent(html, { waitUntil: 'load' });
const pdf = await pdfPage.pdf({ width: '1920px', height: '1080px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await browser.close();
try {
  fs.writeFileSync(OUT, pdf);
  console.log('→', path.relative(RACINE, OUT), `(${shots.length} pages, ${Math.round((pdf.length / 1024 / 1024) * 10) / 10} Mo)`);
} catch (e) {
  if (e.code !== 'EBUSY') throw e;
  console.warn('⚠ fichier ouvert dans un lecteur, NON mis à jour :', path.relative(RACINE, OUT));
}
