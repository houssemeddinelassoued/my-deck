// Imprime les trois HTML de .sit-labs/html en PDF avec Chrome (playwright-core).
//   node .sit-labs/render.mjs
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire('C:/Users/ASUS/AppData/Local/Temp/ia134pw/');
const { chromium } = require('playwright-core');
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const OUT = path.resolve(here, '..', 'labs', 'ia-support-infrastructure');

const jobs = [
  ['audit.html', path.join(OUT, 'Orvalis', 'rapport-audit-infra-2026.pdf'), false],
  ['livret.html', path.join(OUT, 'Livret-des-labs.pdf'), false],
  ['memo.html', path.join(OUT, 'Memo-participant.pdf'), true],
];
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const p = await b.newPage();
for (const [src, dest, landscape] of jobs) {
  await p.goto('file:///' + path.join(here, 'html', src).split(path.sep).join('/'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: dest, format: 'A4', landscape, printBackground: true, preferCSSPageSize: true });
  console.log('pdf', path.basename(dest));
}
await b.close();
