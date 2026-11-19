// Rend le prompt d'extraction (prompts/extraction.md) pour une demande du formulaire.
import { lireTexte } from '../config.ts';
import type { DemandeBrute } from '../domaine/demande.ts';
import { construireMessage } from '../pipeline/message.ts';
import { choisirExemples, lireExemples, rendreExemples } from './exemples.ts';

export function rendreExtraction(formulaire: DemandeBrute): string {
  let prompt = lireTexte('prompts', 'extraction.md');
  if (prompt.includes('{{exemples}}')) prompt = prompt.replace('{{exemples}}', rendreExemples(choisirExemples(formulaire.message, lireExemples(), 3)));
  return prompt.replace('{{demande}}', construireMessage(formulaire));
}
