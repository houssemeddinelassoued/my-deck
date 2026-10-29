"""Lab 02 — Calcul d'une facture avec TPS et TVQ (corrigé)."""

TAUX_TPS = (5, 100)  # 5 %
TAUX_TVQ = (9975, 100_000)  # 9,975 %
SEUIL_LIVRAISON_GRATUITE = 7_500
FRAIS_LIVRAISON = 999
SEUIL_ETE15 = 10_000


def arrondi(numerateur: int, denominateur: int) -> int:
    """Division entière arrondie au plus proche, la moitié vers le haut (montants positifs)."""
    return (2 * numerateur + denominateur) // (2 * denominateur)


def calculer_rabais(sous_total: int, code_promo: str | None) -> int:
    if code_promo is None:
        return 0
    code = code_promo.strip().upper()
    if code == "BIENVENUE10":
        return arrondi(sous_total * 10, 100)
    if code == "ETE15":
        return arrondi(sous_total * 15, 100) if sous_total >= SEUIL_ETE15 else 0
    raise ValueError(f"Code promo inconnu : {code_promo!r}")


def calculer_facture(lignes: list[dict], code_promo: str | None = None) -> dict[str, int]:
    if not lignes:
        raise ValueError("Facture vide")
    for ligne in lignes:
        if ligne["quantite"] < 1:
            raise ValueError(f"Quantité invalide pour {ligne['produit']}")
        if ligne["prix"] < 0:
            raise ValueError(f"Prix négatif pour {ligne['produit']}")

    sous_total = sum(ligne["prix"] * ligne["quantite"] for ligne in lignes)
    rabais = calculer_rabais(sous_total, code_promo)
    apres_rabais = sous_total - rabais
    livraison = 0 if apres_rabais >= SEUIL_LIVRAISON_GRATUITE else FRAIS_LIVRAISON
    base = apres_rabais + livraison
    tps = arrondi(base * TAUX_TPS[0], TAUX_TPS[1])
    tvq = arrondi(base * TAUX_TVQ[0], TAUX_TVQ[1])
    return {
        "sous_total": sous_total,
        "rabais": rabais,
        "livraison": livraison,
        "tps": tps,
        "tvq": tvq,
        "total": base + tps + tvq,
    }
