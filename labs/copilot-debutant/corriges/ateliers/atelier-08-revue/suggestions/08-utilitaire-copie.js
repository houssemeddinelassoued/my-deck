// CORRIGÉ · licence : code copié sous GPL-3.0 retiré (incompatible avec la politique du projet) ;
// la plateforme fournit l'équivalent : structuredClone (Node 17+, navigateurs récents).
export function deepClone(obj) {
  return structuredClone(obj);
}
