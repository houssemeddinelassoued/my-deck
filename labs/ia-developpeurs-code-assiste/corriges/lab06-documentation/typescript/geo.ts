/**
 * Calculs géographiques simples pour l'application de livraison.
 *
 * Distances à vol d'oiseau (formule de haversine, Terre supposée sphérique), recherche des
 * points proches et affichage des coordonnées. Précision : environ 0,5 %.
 *
 * @packageDocumentation
 */

/** Rayon moyen de la Terre, en kilomètres. */
export const RAYON_TERRE_KM = 6371;

/** Un lieu nommé, en coordonnées WGS 84 (degrés décimaux ; ouest et sud négatifs). */
export type Point = { nom: string; lat: number; lon: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Distance à vol d'oiseau entre deux points, par la formule de haversine.
 *
 * @param a - Point de départ.
 * @param b - Point d'arrivée.
 * @returns La distance en kilomètres, arrondie à 0,1 km.
 * @example
 * ```ts
 * distanceKm(montreal, quebec); // 233
 * ```
 */
export function distanceKm(a: Point, b: Point): number {
  const dlat = rad(b.lat - a.lat);
  const dlon = rad(b.lon - a.lon);
  const h = Math.sin(dlat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dlon / 2) ** 2;
  return Math.round(2 * RAYON_TERRE_KM * Math.asin(Math.sqrt(h)) * 10) / 10;
}

/**
 * Points situés à au plus `rayonKm` du centre, du plus proche au plus éloigné.
 *
 * @param centre - Point de référence.
 * @param points - Points candidats.
 * @param rayonKm - Rayon de recherche en kilomètres (bord inclus).
 * @returns Les points dans le rayon, triés par distance croissante.
 * @throws {RangeError} Si `rayonKm` est négatif.
 * @example
 * ```ts
 * dansLeRayon(montreal, [quebec, troisRivieres], 150); // [troisRivieres]
 * ```
 */
export function dansLeRayon(centre: Point, points: Point[], rayonKm: number): Point[] {
  if (rayonKm < 0) throw new RangeError('rayon négatif');
  return points.filter((p) => distanceKm(centre, p) <= rayonKm).sort((p, q) => distanceKm(centre, p) - distanceKm(centre, q));
}

/**
 * Le point le plus proche de l'origine, l'origine elle-même étant exclue.
 *
 * @param origine - Point de référence.
 * @param points - Points candidats (peut contenir l'origine).
 * @returns Le point le plus proche, ou `undefined` s'il n'y a aucun autre point.
 * @example
 * ```ts
 * plusProche(montreal, [montreal]); // undefined
 * ```
 */
export function plusProche(origine: Point, points: Point[]): Point | undefined {
  let meilleur: Point | undefined;
  for (const p of points) {
    if (p === origine) continue;
    if (!meilleur || distanceKm(origine, p) < distanceKm(origine, meilleur)) meilleur = p;
  }
  return meilleur;
}

/**
 * Coordonnées lisibles, avec 4 décimales et les points cardinaux N/S et E/O.
 *
 * @param p - Le point à afficher.
 * @returns Une chaîne comme « 45.5019° N, 73.5674° O ».
 * @example
 * ```ts
 * formatCoordonnees({ nom: 'Montréal', lat: 45.5019, lon: -73.5674 }); // '45.5019° N, 73.5674° O'
 * ```
 */
export function formatCoordonnees(p: Point): string {
  const ns = p.lat >= 0 ? 'N' : 'S';
  const eo = p.lon >= 0 ? 'E' : 'O';
  return `${Math.abs(p.lat).toFixed(4)}° ${ns}, ${Math.abs(p.lon).toFixed(4)}° ${eo}`;
}
