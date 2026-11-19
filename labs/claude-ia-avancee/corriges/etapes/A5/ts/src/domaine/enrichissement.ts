// Point d'extension : calcule les champs « code » du contrat (x-source: code) avant l'enregistrement.
// A5 : langue du message et équipe de routage.
import { detecterLangue, equipePour } from './langue.ts';

export function enrichir(demande: Record<string, unknown>): Record<string, unknown> {
  const langue = detecterLangue(String(demande.message ?? ''));
  return { ...demande, langue, equipe: equipePour(langue) };
}
