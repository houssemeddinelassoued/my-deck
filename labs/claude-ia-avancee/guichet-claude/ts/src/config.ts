// Chemins et réglages communs. GUICHET_RACINE est fourni par node guichet.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RACINE = process.env.GUICHET_RACINE ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const chemin = (...parties: string[]): string => path.join(RACINE, ...parties);
export const lireJson = <T>(...parties: string[]): T => JSON.parse(fs.readFileSync(chemin(...parties), 'utf8')) as T;
export const lireTexte = (...parties: string[]): string => fs.readFileSync(chemin(...parties), 'utf8');

export const MODELE = process.env.GUICHET_MODELE ?? 'claude-sonnet-5-5';

// Date du jour à Tunis, au format AAAA-MM-JJ.
export const aujourdhui = (): string => new Date().toLocaleDateString('sv-SE', { timeZone: 'Africa/Tunis' });

export class NonImplemente extends Error {
  constructor(quoi: string) {
    super(`À compléter · ${quoi}`);
    this.name = 'NonImplemente';
  }
}

// Marque un trou de l'énoncé : le code compile, mais lève une erreur claire à l'exécution.
export function aCompleter<T>(quoi: string): T {
  throw new NonImplemente(quoi);
}
