// CORRIGÉ · défauts de sécurité : secret en dur, secret dans l'URL (journaux), HTTP sans TLS.
// Le jeton vient de l'environnement et voyage dans un en-tête.
const API_URL = process.env.TASKFLOW_API_URL ?? 'https://tickets.exemple-interne.fr/api';

export async function listerTickets(fetchFn = fetch, jeton = process.env.TASKFLOW_TOKEN) {
  if (!jeton) throw new Error('TASKFLOW_TOKEN manquant');
  const r = await fetchFn(`${API_URL}/tickets`, { headers: { Authorization: `Bearer ${jeton}` } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
