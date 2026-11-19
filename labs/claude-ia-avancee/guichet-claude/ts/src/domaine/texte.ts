// Tâche de la boucle (Atelier 2, étape A2.3) : ce fichier est écrit par Claude via
//   node guichet.mjs boucle taches/tronquer-resume.md
import { aCompleter } from '../config.ts';

export function tronquerResume(texte: string, max = 280): string {
  return aCompleter(`BOUCLE : tronquerResume (${texte.length} caractères, max ${max})`);
}
