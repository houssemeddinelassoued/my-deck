// Atelier 1 · ce fichier est GÉNÉRÉ par Claude : node guichet.mjs generer normaliser v1 (puis v2, v3).
// Ne l'écrivez pas à la main : améliorez le prompt.
import type { DemandeBrute, DemandeNormalisee } from './demande.ts';
import { aCompleter } from '../config.ts';

export function normaliserDemande(brute: DemandeBrute, aujourdhui: string): DemandeNormalisee {
  return aCompleter(`A1.2 : normaliserDemande (${Object.keys(brute).length} champs, ${aujourdhui})`);
}
