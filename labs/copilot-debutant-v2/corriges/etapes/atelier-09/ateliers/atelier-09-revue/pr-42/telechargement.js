import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ErreurParafo } from '../../../src/erreurs.js';

/** Dossier où sont rangés les PDF signés. */
export const DOSSIER_SIGNES = fileURLToPath(new URL('../../../data/signes/', import.meta.url));

// Liste blanche : seul un nom de la forme DOC-xxxxxxxx.pdf est accepté.
// Aucun séparateur, aucun « .. », aucun chemin absolu ne peut passer.
const NOM_SIGNE = /^DOC-[0-9a-f]{8}\.pdf$/;

/**
 * Renvoie le chemin complet du fichier signé demandé dans l'URL.
 * @param {string} nomFichier par exemple DOC-3f9a1c07.pdf
 * @returns {string}
 * @throws {ErreurParafo} NOM_INVALIDE
 */
export function cheminDocument(nomFichier) {
  if (typeof nomFichier !== 'string' || !NOM_SIGNE.test(nomFichier)) {
    throw new ErreurParafo('NOM_INVALIDE', 'Nom de fichier invalide.');
  }
  return join(DOSSIER_SIGNES, nomFichier);
}
