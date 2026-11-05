// TaskFlow · src/api.js — CORRIGÉ (Atelier 5)

/**
 * Lit un CSV « titre;type;priorite;points ».
 * @param {string} texte contenu du fichier
 * @returns {{ tickets: Array<{ titre: string, type: string, priorite: number, points: number | null }>, rejets: Array<{ ligne: number, raison: string }> }}
 */
export function parserCsv(texte) {
  const lignes = texte.replace(/^﻿/, '').split(/\r?\n/);
  const tickets = [];
  const rejets = [];
  lignes.forEach((brute, i) => {
    const ligne = i + 1;
    if (ligne === 1 || brute.trim() === '') return;
    const champs = brute.split(';').map((c) => c.trim());
    if (champs.length !== 4) return rejets.push({ ligne, raison: '4 colonnes attendues' });
    const [titre, type, prio, pts] = champs;
    if (titre === '') return rejets.push({ ligne, raison: 'titre vide' });
    const priorite = Number(prio);
    const points = pts === '' ? null : Number(pts);
    if (prio === '' || Number.isNaN(priorite) || Number.isNaN(points)) return rejets.push({ ligne, raison: 'nombre attendu' });
    tickets.push({ titre, type, priorite, points });
  });
  return { tickets, rejets };
}

/**
 * Charge des tickets depuis une API JSON.
 * @param {string} url
 * @param {{ fetchFn?: typeof fetch }} [options] fetchFn injectable (tests)
 * @returns {Promise<Array<object>>}
 * @throws {Error} « HTTP <code> » ou « Format inattendu »
 */
export async function chargerTickets(url, { fetchFn = fetch } = {}) {
  const reponse = await fetchFn(url);
  if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
  const donnees = await reponse.json();
  if (!Array.isArray(donnees)) throw new Error('Format inattendu');
  return donnees;
}
