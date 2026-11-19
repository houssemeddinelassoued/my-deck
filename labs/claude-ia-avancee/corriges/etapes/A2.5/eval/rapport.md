# Rapport d’évaluation · extraction des demandes

## Mesure 2026-11-16 14:41 · prompt extraction.v1 · modèle haiku · moteur claude-cli

| Champ | Score |
|---|---|
| type | 10/11 |
| priorite | 7/11 |
| client | 11/11 |
| telephone | 9/11 |
| utilisateurs_touches | 10/11 |
| panne_totale | 9/11 |
| injection | 0/1 |
| rejet | 1/1 |
| temps moyen | 3,2 s |

Cas ratés : n° 4 (priorite) ; n° 10 (priorite) ; n° 11 (injection) ; n° 3 (telephone) ; …

## Mesure 2026-11-16 14:49 · prompt extraction · modèle haiku · moteur claude-cli

| Champ | Score |
|---|---|
| type | 11/11 |
| priorite | 9/11 |
| client | 11/11 |
| telephone | 11/11 |
| utilisateurs_touches | 11/11 |
| panne_totale | 11/11 |
| injection | 1/1 |
| rejet | 1/1 |
| temps moyen | 3,5 s |

Cas ratés : n° 4 (priorite : "P2") ; n° 10 (priorite : "P1")

## Mesure 2026-11-16 14:57 · prompt extraction · modèle sonnet · moteur claude-cli

| Champ | Score |
|---|---|
| type | 11/11 |
| priorite | 9/11 |
| client | 11/11 |
| telephone | 11/11 |
| utilisateurs_touches | 11/11 |
| panne_totale | 11/11 |
| injection | 1/1 |
| rejet | 1/1 |
| temps moyen | 6,9 s |

Cas ratés : n° 4 (priorite : "P2") ; n° 10 (priorite : "P1")

## Décision
On garde le prompt « extraction » (v3) avec Haiku : même qualité que Sonnet sur nos 12 cas, deux fois plus rapide.
Les deux priorités ratées ne sont pas une erreur du prompt : le modèle ne connaît pas le contrat du client (n° 4) et se laisse impressionner par les majuscules (n° 10).
Conséquence : la priorité sera calculée par le code à partir des faits extraits (Atelier 3, étape A3.4).
