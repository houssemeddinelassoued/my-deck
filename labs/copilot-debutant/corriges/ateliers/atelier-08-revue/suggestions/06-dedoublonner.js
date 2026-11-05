// CORRIGÉ · défaut de performance : findIndex dans filter = O(n²). Un Set rend l'opération O(n).
export function dedoublonner(tickets) {
  const vus = new Set();
  return tickets.filter((t) => {
    if (vus.has(t.titre)) return false;
    vus.add(t.titre);
    return true;
  });
}
