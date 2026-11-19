// Atelier 3, étape A3.4 · comment le texte du client est présenté au modèle.
import type { DemandeBrute } from '../domaine/demande.ts';

const CHAMPS = ['nom', 'entreprise', 'email', 'telephone', 'message'] as const;

export function construireMessage(formulaire: DemandeBrute): string {
  // Provisoire : le texte du client est posé tel quel, au milieu de nos consignes.
  return CHAMPS.map((c) => `${c}: ${formulaire[c] ?? ''}`).join('\n');
}
