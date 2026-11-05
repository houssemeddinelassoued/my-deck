// kanban-legacy.js — CORRIGÉ de l'étape « refactoring » (Atelier 6).
// Même comportement qu'avant (== conservé, mutation conservée, limite > conservée) :
// les 9 tests de caractérisation restent verts. La correction vit dans src/kanban.js.

const LIMITE = 3;
const STATUTS_CONNUS = ['backlog', 'afaire', 'encours', 'termine'];

/** Recherche historique : comparaison large (==), le dernier ticket trouvé gagne. */
function trouverTicket(tickets, id) {
  let trouve = null;
  for (const t of tickets) {
    // biome-ignore lint/suspicious/noDoubleEquals: comportement historique conservé ("1" trouve 1)
    if (t.id == id) trouve = t;
  }
  return trouve;
}

function compterEnCours(tickets) {
  return tickets.filter((t) => t.statut === 'encours').length;
}

const dateDuJour = () => new Date().toISOString().substring(0, 10);

function traiter(tickets, id, versStatut, options) {
  const ticket = trouverTicket(tickets, id);
  if (ticket === null) return { ok: false, msg: 'introuvable' };
  if (!STATUTS_CONNUS.includes(versStatut)) return { ok: false, msg: 'statut ?' };

  const quitteLeBacklog = ticket.statut === 'backlog' && versStatut !== 'backlog';
  if (quitteLeBacklog && ticket.points == null) return { ok: false, msg: 'non estime' };

  // ⚠ Bug historique conservé : « > » laisse passer un 4e ticket. Corrigé dans kanban.js.
  if (versStatut === 'encours' && compterEnCours(tickets) > LIMITE) return { ok: false, msg: 'WIP' };

  if (versStatut === 'termine' && ticket.statut !== 'encours') return { ok: false, msg: 'pas en cours' };

  ticket.statut = versStatut; // mutation historique conservée
  if (versStatut === 'termine') ticket.termineLe = options?.date ? options.date : dateDuJour();
  return { ok: true, msg: '' };
}

export { traiter, LIMITE };
