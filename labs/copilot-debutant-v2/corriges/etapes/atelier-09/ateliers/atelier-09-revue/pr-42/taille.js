// Remplace l'extrait copié (licence incompatible, unités anglaises, 1 Ko = 1000 o)
// par la fonction maison, déjà testée à l'Atelier 4.
import { formaterTaille } from '../../../src/format.js';

/**
 * Taille lisible d'un fichier, selon la règle Parafo.
 * @param {number} octets
 * @returns {string}
 */
export function tailleLisible(octets) {
  return formaterTaille(octets);
}
