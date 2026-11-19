// Tâche de la boucle (Atelier 2, étape A2.3) : écrit par Claude via
//   node guichet.mjs boucle taches/tronquer-resume.md

export function tronquerResume(texte: string, max = 280): string {
  const t = (texte ?? '').trim();
  if (t.length <= max) return t;
  let coupe = t.slice(0, max - 1);
  const espace = coupe.lastIndexOf(' ');
  if (espace > 0) coupe = coupe.slice(0, espace);
  return `${coupe.trimEnd()}…`;
}
