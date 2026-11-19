// Défi final (Atelier 5) · langue de la demande et équipe de routage.
import { aCompleter } from '../config.ts';

export type Langue = 'fr' | 'en';

export function detecterLangue(texte: string): Langue {
  return aCompleter(`A5 : detecterLangue (${texte.length} caractères)`);
}

export function equipePour(langue: Langue): string {
  return aCompleter(`A5 : equipePour (${langue})`);
}
