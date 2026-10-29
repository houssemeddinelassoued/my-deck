// Imprime .ia132-labs/html/guide.html en PDF avec Chrome (playwright-core), puis prépare le paquet des labs.
//   PYTHONPATH=<scratch>/pylibs python .ia132-labs/guide.py && node .ia132-labs/render.mjs
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire('C:/Users/ASUS/AppData/Local/Temp/ia134pw/');
const { chromium } = require('playwright-core');
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const OUT = path.resolve(here, '..', 'labs', 'ia-developpeurs-code-assiste');

const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const p = await b.newPage();
await p.goto('file:///' + path.join(here, 'html', 'guide.html').split(path.sep).join('/'), { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
const dest = path.join(OUT, 'Guide-des-ateliers-IA132.pdf');
await p.pdf({ path: dest, format: 'A4', printBackground: true, preferCSSPageSize: true });
console.log('pdf', path.relative(path.resolve(here, '..'), dest));
await b.close();
