// CORRIGÉ · défauts de logique : les non estimés comptaient pour 0 au dénominateur ; NaN sur liste vide.
export function moyennePoints(tickets) {
  const estimes = tickets.filter((t) => t.points !== null && t.points !== undefined);
  if (estimes.length === 0) return 0;
  return estimes.reduce((s, t) => s + t.points, 0) / estimes.length;
}
