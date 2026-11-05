// CORRIGÉ · défaut : saisie utilisateur transformée en RegExp sans échappement (« ( » fait planter,
// « .* » trouve tout, risque de ReDoS). Une recherche de texte n'a pas besoin de RegExp.
export function rechercher(tickets, saisie) {
  const cherche = saisie.toLowerCase();
  return tickets.filter((t) => t.titre.toLowerCase().includes(cherche));
}
