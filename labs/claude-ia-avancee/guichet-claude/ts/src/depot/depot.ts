import type { Demande } from '../domaine/demande.ts';

export interface Depot {
  /** Enregistre une demande et la renvoie complétée (id, cree_le, statut). */
  inserer(demande: Record<string, unknown>): Demande;
  /** Toutes les demandes, les plus récentes d'abord. */
  lister(): Demande[];
  /** La demande déjà enregistrée avec cette clé d'idempotence, ou null. */
  parCle(cle: string): Demande | null;
}
