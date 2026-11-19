// Atelier 3, étape A3.4 · la priorité est une règle métier : c'est le code qui décide, pas le modèle.
// Règle : hors incident → P3 ; incident avec panne totale ou au moins 20 utilisateurs touchés → P1 ;
// sinon P1 pour un contrat « or », P2 pour les autres.
import type { Contrat, Faits, Priorite } from './demande.ts';

export function calculerPriorite(faits: Pick<Faits, 'type' | 'panne_totale' | 'utilisateurs_touches' | 'priorite'>, contrat: Contrat | null): Priorite {
  if (faits.type !== 'incident') return 'P3';
  if (faits.panne_totale || (faits.utilisateurs_touches ?? 0) >= 20) return 'P1';
  return contrat === 'or' ? 'P1' : 'P2';
}
