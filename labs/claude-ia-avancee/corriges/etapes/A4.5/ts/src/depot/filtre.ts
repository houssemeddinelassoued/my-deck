// Atelier 4, étape A4.5 · filtre du tableau de bord par client (GET /api/demandes?client=…).
// Recherche partielle, insensible à la casse et aux accents ; filtre vide = tout.
import type { Demande } from '../domaine/demande.ts';

const simplifier = (s: unknown): string =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();

export function filtrerParClient(demandes: Demande[], client: string | null): Demande[] {
  const cherche = simplifier(client);
  if (!cherche) return demandes;
  return demandes.filter((d) => simplifier(d.client).includes(cherche));
}
