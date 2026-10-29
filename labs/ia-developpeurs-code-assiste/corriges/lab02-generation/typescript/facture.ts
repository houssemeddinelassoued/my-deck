// Lab 02 — Calcul d'une facture avec TPS et TVQ (corrigé).

export type Ligne = { produit: string; prix: number; quantite: number };

export type Facture = {
  sousTotal: number;
  rabais: number;
  livraison: number;
  tps: number;
  tvq: number;
  total: number;
};

const SEUIL_LIVRAISON_GRATUITE = 7_500;
const FRAIS_LIVRAISON = 999;
const SEUIL_ETE15 = 10_000;

/** Division entière arrondie au plus proche, la moitié vers le haut (montants positifs). */
const arrondi = (numerateur: number, denominateur: number) => Math.floor((2 * numerateur + denominateur) / (2 * denominateur));

function calculerRabais(sousTotal: number, codePromo?: string): number {
  if (codePromo === undefined) return 0;
  const code = codePromo.trim().toUpperCase();
  if (code === 'BIENVENUE10') return arrondi(sousTotal * 10, 100);
  if (code === 'ETE15') return sousTotal >= SEUIL_ETE15 ? arrondi(sousTotal * 15, 100) : 0;
  throw new RangeError(`Code promo inconnu : ${codePromo}`);
}

export function calculerFacture(lignes: Ligne[], codePromo?: string): Facture {
  if (lignes.length === 0) throw new RangeError('Facture vide');
  for (const l of lignes) {
    if (l.quantite < 1) throw new RangeError(`Quantité invalide pour ${l.produit}`);
    if (l.prix < 0) throw new RangeError(`Prix négatif pour ${l.produit}`);
  }
  const sousTotal = lignes.reduce((s, l) => s + l.prix * l.quantite, 0);
  const rabais = calculerRabais(sousTotal, codePromo);
  const apresRabais = sousTotal - rabais;
  const livraison = apresRabais >= SEUIL_LIVRAISON_GRATUITE ? 0 : FRAIS_LIVRAISON;
  const base = apresRabais + livraison;
  const tps = arrondi(base * 5, 100);
  const tvq = arrondi(base * 9_975, 100_000);
  return { sousTotal, rabais, livraison, tps, tvq, total: base + tps + tvq };
}
