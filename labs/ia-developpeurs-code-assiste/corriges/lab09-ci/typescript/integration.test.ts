// Tests d'intégration (corrigé) : un vrai serveur HTTP, de vraies requêtes.
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';
import { creerServeur } from './api.ts';

const serveur = creerServeur();
let base = '';

before(async () => {
  await new Promise<void>((ok) => serveur.listen(0, '127.0.0.1', ok));
  base = `http://127.0.0.1:${(serveur.address() as AddressInfo).port}`;
});
after(() => serveur.close());

const appel = (chemin: string, init: RequestInit = {}) => fetch(base + chemin, { redirect: 'manual', ...init });
const poster = (corps: string) => appel('/liens', { method: 'POST', body: corps, headers: { 'Content-Type': 'application/json' } });

async function creer(url = 'https://technologia.com'): Promise<string> {
  const r = await poster(JSON.stringify({ url }));
  assert.equal(r.status, 201);
  return ((await r.json()) as { code: string }).code;
}

test('santé', async () => {
  const r = await appel('/sante');
  assert.deepEqual([r.status, await r.json()], [200, { statut: 'ok' }]);
});

test('créer puis suivre un lien', async () => {
  const code = await creer('https://exemple.ca/page');
  const r = await appel(`/l/${code}`);
  assert.equal(r.status, 302);
  assert.equal(r.headers.get('location'), 'https://exemple.ca/page');
});

test('statistiques après trois visites', async () => {
  const code = await creer();
  for (let i = 0; i < 3; i++) await (await appel(`/l/${code}`)).arrayBuffer();
  assert.equal(((await (await appel(`/stats/${code}`)).json()) as { clics: number }).clics, 3);
});

test('URL et JSON invalides → 400', async () => {
  for (const corps of ['{"url":"ftp://x.ca"}', '{"url":""}', '{}', '["https://x.ca"]', '{pas du json']) {
    const r = await poster(corps);
    assert.equal(r.status, 400, corps);
    await r.arrayBuffer();
  }
});

test('introuvable → 404', async () => {
  for (const chemin of ['/l/inconnu', '/stats/inconnu', '/nimporte']) {
    const r = await appel(chemin);
    assert.equal(r.status, 404, chemin);
    await r.arrayBuffer();
  }
});

test('créations concurrentes : codes uniques', async () => {
  const codes = await Promise.all(Array.from({ length: 200 }, (_, i) => creer(`https://exemple.ca/${i}`)));
  assert.equal(new Set(codes).size, 200);
});
