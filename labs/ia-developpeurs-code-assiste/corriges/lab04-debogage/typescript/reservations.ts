// Lab 04 — Réservation de salles de réunion (corrigé).

export type Reservation = { salle: string; debut: Date; fin: Date; tarifHoraire: number };

const MS_PAR_HEURE = 3_600_000;

/** Durée de la réservation, en heures. */
export function dureeHeures(r: Reservation): number {
  // INC-105 : getHours() ignore le jour ; l'écart entre les deux instants le compte.
  return (r.fin.getTime() - r.debut.getTime()) / MS_PAR_HEURE;
}

/** Vrai si les deux réservations occupent la même salle au même moment. */
export function seChevauchent(a: Reservation, b: Reservation): boolean {
  // INC-103 : intervalles semi-ouverts [début, fin[ : une fin à 10 h libère la salle à 10 h.
  return a.salle === b.salle && a.debut < b.fin && b.debut < a.fin;
}

export function peutReserver(existantes: Reservation[], nouvelle: Reservation): boolean {
  return !existantes.some((r) => seChevauchent(r, nouvelle));
}

/** Coût de la réservation en dollars, arrondi au cent (la moitié vers le haut). */
export function cout(r: Reservation): number {
  // INC-104 : 31,15 × 1,5 × 100 vaut 4672,4999… en binaire ; on calcule en cents et en minutes.
  const tarifCents = Math.round(r.tarifHoraire * 100);
  const minutes = Math.round(dureeHeures(r) * 60);
  return Math.round((tarifCents * minutes) / 60) / 100;
}

/** Retourne la page `page` (1 = première page) de `taille` éléments. */
export function paginer<T>(items: T[], page: number, taille = 10): T[] {
  const debut = (page - 1) * taille;
  // INC-102 : la borne de fin de slice() est exclue, pas de + 1.
  return items.slice(debut, debut + taille);
}

/** Part des heures d'ouverture occupées pour une salle, sur les jours où elle est réservée. */
export function tauxOccupation(reservations: Reservation[], salle: string, heuresOuvertes = 10): number {
  const deLaSalle = reservations.filter((r) => r.salle === salle);
  // INC-101 : aucune réservation → 0 / 0 = NaN.
  if (deLaSalle.length === 0) return 0;
  const jours = new Set(deLaSalle.map((r) => r.debut.toDateString()));
  const heures = deLaSalle.reduce((s, r) => s + dureeHeures(r), 0);
  return Math.round((heures / (heuresOuvertes * jours.size)) * 100) / 100;
}
