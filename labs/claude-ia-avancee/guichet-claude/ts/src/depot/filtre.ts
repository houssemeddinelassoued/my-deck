// Atelier 4, étape A4.5 · filtre du tableau de bord par client (GET /api/demandes?client=…).
import type { Demande } from '../domaine/demande.ts';

export function filtrerParClient(demandes: Demande[], client: string | null): Demande[] {
  // Pas encore de filtre : toutes les demandes sont renvoyées.
  void client;
  return demandes;
}
