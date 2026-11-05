// CORRIGÉ · défaut : API inventée (Array.prototype.sortBy n'existe pas) + tri sur place.
export function trierParPriorite(tickets) {
  return [...tickets].sort((a, b) => a.priorite - b.priorite);
}
