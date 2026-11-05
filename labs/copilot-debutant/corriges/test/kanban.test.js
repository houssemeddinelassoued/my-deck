// CORRIGÉ Atelier 7 · suite de tests de deplacerTicket (Arrange-Act-Assert, une règle par describe).
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LIMITE_WIP, deplacerTicket } from '../src/kanban.js';

const ticket = (id, statut, points = 3) => ({ id, titre: `T${id}`, points, statut });
const tableau = (...tickets) => tickets;

describe('R1 · limite de travail en cours', () => {
  it('accepte le 3e ticket en cours', () => {
    const tickets = tableau(ticket(1, 'encours'), ticket(2, 'encours'), ticket(3, 'afaire'));
    const r = deplacerTicket(tickets, 3, 'encours');
    assert.equal(r.ok, true);
  });
  it('refuse le 4e ticket en cours avec un message explicite', () => {
    const tickets = tableau(ticket(1, 'encours'), ticket(2, 'encours'), ticket(3, 'encours'), ticket(4, 'afaire'));
    assert.deepEqual(deplacerTicket(tickets, 4, 'encours'), { ok: false, erreur: `WIP atteint (3/${LIMITE_WIP})` });
  });
  it('laisse sortir un ticket d’une colonne pleine', () => {
    const tickets = tableau(ticket(1, 'encours'), ticket(2, 'encours'), ticket(3, 'encours'));
    assert.equal(deplacerTicket(tickets, 3, 'afaire').ok, true);
  });
});

describe('R2 · Definition of Ready', () => {
  it('refuse de sortir un ticket non estimé du backlog', () => {
    assert.deepEqual(deplacerTicket([ticket(1, 'backlog', null)], 1, 'afaire'), { ok: false, erreur: 'Ticket non estimé' });
  });
  it('accepte un ticket estimé', () => {
    assert.equal(deplacerTicket([ticket(1, 'backlog', 5)], 1, 'afaire').ok, true);
  });
});

describe('R3 · terminer', () => {
  it('refuse de terminer un ticket qui n’est pas en cours', () => {
    assert.deepEqual(deplacerTicket([ticket(1, 'afaire')], 1, 'termine'), { ok: false, erreur: 'Seul un ticket en cours peut être terminé' });
  });
  it('date la fin avec la date du jour reçue en paramètre', () => {
    const r = deplacerTicket([ticket(1, 'encours')], 1, 'termine', { aujourdHui: '2026-11-04' });
    assert.equal(r.ok, true);
    assert.equal(r.tickets[0].termineLe, '2026-11-04');
  });
});

describe('R4 · immuabilité', () => {
  it('ne modifie ni le tableau ni le ticket d’origine', () => {
    const tickets = tableau(ticket(1, 'backlog'));
    const copie = structuredClone(tickets);
    const r = deplacerTicket(tickets, 1, 'afaire');
    assert.deepEqual(tickets, copie);
    assert.notEqual(r.tickets, tickets);
  });
  it('conserve les autres tickets à l’identique', () => {
    const autre = ticket(2, 'afaire');
    const r = deplacerTicket(tableau(ticket(1, 'backlog'), autre), 1, 'afaire');
    assert.equal(r.tickets[1], autre);
  });
});

describe('Erreurs', () => {
  it('signale un id inconnu', () => {
    assert.deepEqual(deplacerTicket([ticket(1, 'afaire')], 9, 'encours'), { ok: false, erreur: 'Ticket introuvable' });
  });
  it('compare les id strictement : "1" ne trouve pas 1', () => {
    assert.equal(deplacerTicket([ticket(1, 'afaire')], '1', 'encours').ok, false);
  });
  it('signale un statut inconnu', () => {
    assert.deepEqual(deplacerTicket([ticket(1, 'afaire')], 1, 'fini'), { ok: false, erreur: 'Statut inconnu : fini' });
  });
});
