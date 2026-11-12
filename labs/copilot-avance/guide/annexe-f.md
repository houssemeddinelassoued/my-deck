# Annexe F · Sécurité, dépendances et revue

## OWASP Top 10 : 2025, appliqué au code généré

| Catégorie | Ce que le code généré oublie |
|---|---|
| A01 · Contrôle d’accès défaillant | le propriétaire n’est jamais vérifié (IDOR) |
| A02 · Mauvaise configuration | CORS ouvert, mode debug, en-têtes absents |
| A03 · Chaîne d’approvisionnement | paquets hallucinés, vulnérables, non épinglés |
| A04 · Défaillances cryptographiques | MD5, secret faible, aléa prévisible |
| A05 · Injection | SQL ou commande par concaténation |
| A06 · Conception non sécurisée | ni limite de débit, ni quota |
| A07 · Authentification défaillante | JWT non vérifié, sans expiration |
| A08 · Intégrité des logiciels et données | désérialisation, actions CI non épinglées |
| A09 · Journalisation et alerte | secrets loggés, aucun audit |
| A10 · Conditions exceptionnelles | erreur avalée, trace renvoyée au client |

## Prompt d’audit (rôle attaquant)

```
Tu es un attaquant. Audite #file:bookings.routes avec la grille
OWASP Top 10 : 2025. Pour chaque faille : ligne, criticité,
la requête HTTP qui l’exploite, le correctif. Ne corrige rien.
```

## Prompt de correctif ciblé

```
Faille : DELETE /bookings/:id supprime la réservation d’autrui.
1. Écris d’abord le test qui l’exploite (doit être rouge).
2. Corrige : propriétaire ou admin, sinon 403.
3. Ne touche à rien d’autre. Tests verts.
```

<!-- col -->

## Dépendances proposées par l’IA

- Le paquet **existe-t-il** sur le registre officiel ? Âge, mainteneurs, téléchargements, dépôt source.
- Un nom inconnu et plausible : risque de **slopsquatting** (un attaquant publie le nom halluciné).
- Version **actuelle**, pas celle de la date d’entraînement du modèle.
- Préférez ce que l’équipe a déjà validé. Lockfile commité, audit en CI.
- Ne demandez pas au modèle si son paquet est fiable : vérifiez hors du modèle.

## Jamais dans un prompt

Mot de passe, jeton, clé d’API, chaîne de connexion · donnée personnelle ou client · code sous NDA hors du périmètre autorisé · contenu de fichiers `.env`.

## Checklist de revue d’un diff généré

- ☐ Fait ce qui est demandé, **seulement** ce qui est demandé
- ☐ Le diff des **tests** relu en premier : rien de supprimé, sauté ou affaibli
- ☐ Cas limites : vide, null, bornes, doublons, fuseaux horaires
- ☐ Fonctions et API qui existent vraiment, dans la bonne version
- ☐ Contrôle d’accès sur chaque route qui lit ou modifie une ressource
- ☐ Entrées validées, requêtes paramétrées, réponses en DTO
- ☐ Aucun secret, aucune donnée personnelle dans le code ou les logs
- ☐ Dépendance ajoutée : vérifiée et acceptée
- ☐ Licence : pas de gros bloc recopié d’un dépôt public
- ☐ Taille relisible : au-delà de 400 lignes, redécouper
- ☐ Je peux l’expliquer ligne à ligne

## Pull request d’un agent

Une issue avec critères d’acceptation → l’agent travaille → description générée **puis relue** → la CI prouve → revue Copilot → **un humain décide**, et ce n’est pas celui qui a lancé l’agent.

## CI/CD générée : quatre vérifications

Permissions en lecture seule par défaut · actions épinglées par SHA · installation reproductible · portes de qualité bloquantes (tests, analyse, secrets).
