# Décision · détecter les demandes en double

Atelier 1, étape A1.4. Trois conceptions produites par Claude (plan explicite, puis comparaison), notées sur nos critères.

## Piste A
Hachage du texte normalisé (minuscules, espaces réduits) + e-mail. Simple, déterministe, gratuit.
Limite : la moindre reformulation (« ne charge plus » / « ne s’affiche plus ») passe pour une nouvelle demande.

## Piste B
Similarité de mots-clés (Jaccard) entre demandes du même client, dans une fenêtre de 48 h ; seuil réglable (0,6).
Robuste aux reformulations simples, sans dépendance, testable avec des cas fixes. Faux positifs possibles sur des messages très courts.

## Piste C
Demander à Claude, à chaque dépôt, si la demande ressemble aux 10 dernières du client.
Le plus précis sur les reformulations, mais un appel de plus par demande (coût, latence) et un résultat non déterministe.

## Critères
Coût par demande (×3), faux positifs (×3), maintenance (×2), testabilité (×2). Notes de 1 à 4.
A : 4 / 2 / 4 / 4 = 32 · B : 4 / 3 / 3 / 4 = 34 · C : 1 / 4 / 2 / 1 = 21.

## Choix
Piste B. Elle tient le meilleur compromis ; la piste A reste en premier filtre (doublon exact = refus immédiat, déjà couvert par la clé d’idempotence).
La piste C est écartée tant que les faux négatifs de B ne sont pas mesurés comme gênants : à réévaluer avec l’évaluation de l’Atelier 2.
