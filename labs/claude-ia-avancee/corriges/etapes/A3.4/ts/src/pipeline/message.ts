// Atelier 3, étape A3.4 · comment le texte du client est présenté au modèle.
// Le texte du formulaire est une DONNÉE non fiable : il est délimité, et le prompt le dit.
import type { DemandeBrute } from '../domaine/demande.ts';

const CHAMPS = ['nom', 'entreprise', 'email', 'telephone', 'message'] as const;

export function construireMessage(formulaire: DemandeBrute): string {
  // On retire toute balise que le client aurait glissée pour « sortir » du bloc.
  const propre = (s: string | undefined): string => String(s ?? '').replace(/<\/?demande_client>/gi, '');
  return ['<demande_client>', ...CHAMPS.map((c) => `${c}: ${propre(formulaire[c])}`), '</demande_client>'].join('\n');
}
