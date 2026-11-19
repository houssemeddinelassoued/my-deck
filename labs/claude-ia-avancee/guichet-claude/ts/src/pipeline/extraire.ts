// Atelier 3, étape A3.2 · extraction structurée : le modèle reçoit la forme, le code vérifie le contrat.
import { chargerSchema, contratModele, schemaPourModele } from '../contrat.ts';
import type { DemandeBrute, Faits } from '../domaine/demande.ts';
import { validerDemande } from '../domaine/validation.ts';
import type { MoteurClaude } from '../moteurs/moteur.ts';
import { rendreExtraction } from '../prompts/gabarit.ts';
import { ErreurValidation } from './erreurs.ts';

export async function extraire(moteur: MoteurClaude, formulaire: DemandeBrute): Promise<Faits> {
  const schema = chargerSchema();
  const sortie = await moteur.extraire(rendreExtraction(formulaire), schemaPourModele(schema));
  const erreurs = validerDemande(sortie, contratModele(schema));
  if (erreurs.length) throw new ErreurValidation(erreurs);
  return sortie as Faits;
}
