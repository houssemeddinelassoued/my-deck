// Atelier 2, étape A2.3 · la boucle générer → vérifier → corriger, avec une limite de tours.
import { aCompleter } from '../config.ts';

export interface Verification {
  ok: boolean;
  sortie: string; // ce qu'ont dit la garde et les tests (renvoyé tel quel au modèle)
}

export interface Resultat {
  ok: boolean;
  tour: number;
  historique: Verification[]; // pour l'humain, en cas d'échec
}

export async function boucle(
  tache: string,
  generer: (tache: string, retours: string) => Promise<void>,
  verifier: () => Promise<Verification>,
  maxTours = 3,
): Promise<Resultat> {
  const historique: Verification[] = [];
  let retours = '';
  for (let tour = 1; tour <= maxTours; tour++) {
    await generer(tache, retours);
    const r = await verifier();
    historique.push(r);
    if (aCompleter<boolean>(`A2.3 : condition de sortie (tour ${tour})`)) return { ok: true, tour, historique };
    retours = aCompleter<string>('A2.3 : que renvoie-t-on au modèle pour le tour suivant ?');
  }
  return aCompleter<Resultat>(`A2.3 : résultat d’échec après ${maxTours} tours, avec ce qu’il faut à un humain`);
}
