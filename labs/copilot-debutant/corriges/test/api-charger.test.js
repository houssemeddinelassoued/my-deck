// CORRIGÉ Atelier 7 · chargerTickets testé sans réseau (mock de fetch).
import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { chargerTickets } from '../src/api.js';

const reponse = (status, corps) => ({ ok: status >= 200 && status < 300, status, json: async () => corps });

describe('chargerTickets', () => {
  it('renvoie les tickets et appelle la bonne URL', async () => {
    const fetchFn = mock.fn(async () => reponse(200, [{ id: 1 }]));
    const tickets = await chargerTickets('/api/tickets', { fetchFn });
    assert.deepEqual(tickets, [{ id: 1 }]);
    assert.equal(fetchFn.mock.callCount(), 1);
    assert.equal(fetchFn.mock.calls[0].arguments[0], '/api/tickets');
  });
  it('lève « HTTP 500 » quand le serveur est en panne', async () => {
    await assert.rejects(chargerTickets('/api/panne', { fetchFn: async () => reponse(500, {}) }), /HTTP 500/);
  });
  it('lève « Format inattendu » si la réponse n’est pas un tableau', async () => {
    await assert.rejects(chargerTickets('/x', { fetchFn: async () => reponse(200, { tickets: [] }) }), /Format inattendu/);
  });
});
