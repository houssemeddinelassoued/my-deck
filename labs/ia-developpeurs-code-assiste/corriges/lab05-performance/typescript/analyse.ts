// Lab 05 — Analyse d'une liste de diffusion (corrigé optimisé, O(n)).

export const normaliser = (courriel: string) => courriel.trim().toLowerCase();

/** Courriels uniques, normalisés, dans l'ordre de leur PREMIÈRE apparition. */
export function dedoublonner(courriels: string[]): string[] {
  // Un Set conserve l'ordre d'insertion : O(n) au lieu de O(n²) avec includes().
  return [...new Set(courriels.map(normaliser))];
}

/** Les n domaines les plus fréquents : [domaine, nombre], par nombre décroissant puis par nom. */
export function topDomaines(courriels: string[], n = 3): [string, number][] {
  const comptes = new Map<string, number>();
  for (const c of courriels) {
    const d = normaliser(c).split('@')[1];
    comptes.set(d, (comptes.get(d) ?? 0) + 1);
  }
  return [...comptes].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).slice(0, n);
}

/** Courriels présents dans les deux listes, sans doublon, dans l'ordre de listeA. */
export function communs(listeA: string[], listeB: string[]): string[] {
  const b = new Set(listeB.map(normaliser)); // recherche O(1)
  return dedoublonner(listeA).filter((c) => b.has(c));
}
