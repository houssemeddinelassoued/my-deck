// Atelier 2, étape A2.3 · la boucle générer → vérifier → corriger, avec une limite de tours.

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
    if (r.ok) return { ok: true, tour, historique };
    // On renvoie la sortie exacte de la garde et des tests, pas un résumé.
    retours = r.sortie;
  }
  // Après maxTours échecs : on s'arrête et on rend l'historique complet à un humain.
  return { ok: false, tour: maxTours, historique };
}
