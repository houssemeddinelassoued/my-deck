# SalleLibre

API REST **fictive** de réservation de salles de réunion, construite pendant la formation « GitHub Copilot · niveau avancé ». Aucune donnée réelle.

## Le besoin

Les collaborateurs d'une entreprise réservent des salles de réunion. Pas d'interface : seulement l'API et sa documentation OpenAPI.

## Stack (une seule, au choix)

TypeScript · Express · Vitest 

## Rôles

- **Membre** : consulte les salles, cherche une salle libre, réserve, annule **ses** réservations.
- **Admin** : gère les salles, peut annuler toute réservation.
- Authentification par jeton **JWT** (identifiant et rôle).

## Règles métier

1. Une salle : nom unique, capacité ≥ 1, équipements.
2. Une réservation : salle, propriétaire, début, fin, objet.
3. Créneaux en `[début, fin[` : 10h–11h puis 11h–12h **ne** se chevauchent **pas**.
4. Pas de chevauchement sur une même salle.
5. Du lundi au vendredi, 8h–19h, de 15 min à 4 h, pas dans le passé.
6. Seul le propriétaire (ou un admin) annule une réservation.

## Routes

| Route | Qui |
|---|---|
| `POST /auth/login` | tous |
| `GET /rooms` · `GET /rooms/available?date=&start=&duration=&capacity=` | membre |
| `POST` · `PUT` · `DELETE /rooms` | admin |
| `GET /bookings?mine=true` · `POST /bookings` | membre |
| `DELETE /bookings/{id}` | propriétaire ou admin |

Erreurs : `400` donnée invalide · `401` sans jeton · `403` droits insuffisants · `404` introuvable · `409` chevauchement ou nom pris.

## Ici, tout est à construire

Le dépôt est vide : vous le construisez avec Copilot, TP après TP. Les règles de la maison iront dans `.github/copilot-instructions.md` (TP 1).
