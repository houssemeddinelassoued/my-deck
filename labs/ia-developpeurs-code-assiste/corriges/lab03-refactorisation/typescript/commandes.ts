// Calcule le total, la livraison et la priorité des commandes (corrigé refactorisé).

export type Ligne = { prix: number; qte: number };
export type Commande = { id: string; statut: string; poids: number; lignes: Ligne[] };
export type Priorite = 'haute' | 'normale' | 'basse';
export type Resultat = { id: string; total: number; livraison: number; priorite: Priorite };

type Grille = { leger: number; moyen: number; parKgSupplementaire: number };

const POIDS_LEGER_KG = 2;
const POIDS_MOYEN_KG = 10;
const GRILLES: Record<string, Grille> = {
  QC: { leger: 8, moyen: 15, parKgSupplementaire: 1.5 },
  ON: { leger: 10, moyen: 18, parKgSupplementaire: 1.75 },
};
const GRILLE_AUTRES_REGIONS: Grille = { leger: 14, moyen: 25, parKgSupplementaire: 2.5 };

const SEUIL_LIVRAISON_OFFERTE_PREMIUM = 100;
const SEUIL_PRIORITE_HAUTE = 500;
const SEUIL_PRIORITE_NORMALE = 100;

const arrondi2 = (x: number) => Math.round(x * 100) / 100;

const sousTotal = (c: Commande) => c.lignes.reduce((s, l) => s + l.prix * l.qte, 0);

function fraisLivraison(poids: number, region: string): number {
  const g = GRILLES[region] ?? GRILLE_AUTRES_REGIONS;
  if (poids <= POIDS_LEGER_KG) return g.leger;
  if (poids <= POIDS_MOYEN_KG) return g.moyen;
  return g.moyen + (poids - POIDS_MOYEN_KG) * g.parKgSupplementaire;
}

const appliquerPremium = (frais: number, totalArticles: number) =>
  totalArticles > SEUIL_LIVRAISON_OFFERTE_PREMIUM ? 0 : frais / 2;

function priorite(totalArticles: number): Priorite {
  if (totalArticles > SEUIL_PRIORITE_HAUTE) return 'haute';
  if (totalArticles > SEUIL_PRIORITE_NORMALE) return 'normale';
  return 'basse';
}

function traiterCommande(c: Commande, region: string, premium: boolean): Resultat {
  const totalArticles = sousTotal(c);
  let frais = fraisLivraison(c.poids, region);
  if (premium) frais = appliquerPremium(frais, totalArticles);
  return { id: c.id, total: arrondi2(totalArticles + frais), livraison: arrondi2(frais), priorite: priorite(totalArticles) };
}

export function traiter(commandes: Commande[], region: string, premium: boolean): Resultat[] {
  const resultats: Resultat[] = [];
  for (const c of commandes) {
    if (c.statut === 'annulee') continue;
    if (c.poids <= 0) {
      console.log(`poids invalide ${c.id}`);
      continue;
    }
    resultats.push(traiterCommande(c, region, premium));
  }
  return resultats;
}
