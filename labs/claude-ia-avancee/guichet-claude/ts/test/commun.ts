// Outils partagés par les tests : les cas viennent de donnees/, communs aux 4 stacks.
import { lireJson, lireTexte } from '../src/config.ts';

export const cas = <T>(fichier: string): T => lireJson<T>('donnees', fichier);
export const exemples = () =>
  lireTexte('donnees', 'exemples.jsonl')
    .trim()
    .split(/\r?\n/)
    .map((l) => JSON.parse(l));

export interface Reference {
  id: number;
  formulaire: Record<string, string>;
}
export const reference = (id: number): Reference => cas<Reference[]>('demandes.json').find((d) => d.id === id)!;
