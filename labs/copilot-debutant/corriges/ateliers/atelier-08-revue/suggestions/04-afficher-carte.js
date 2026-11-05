// CORRIGÉ · défaut de sécurité : injection HTML (XSS) via le titre. Dans le navigateur : textContent.
// Ici (chaîne HTML, testable sans navigateur) : on échappe les caractères spéciaux.
const ENTITES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const echapper = (s) => String(s).replace(/[&<>"']/g, (c) => ENTITES[c]);

export function htmlCarte(ticket) {
  const points = ticket.points === null ? '?' : ticket.points;
  return `<div class="carte"><h3>${echapper(ticket.titre)}</h3><span>${echapper(points)} pts</span></div>`;
}
