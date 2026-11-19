# TP 1 · Corrigé de `prompts/tp1-mesures.md`

> **Exemple de référence pour le formateur.** Les chiffres sont **illustratifs** : Copilot n'est pas déterministe, chaque participant obtiendra les siens. Ce qui est corrigé ici, c'est la **méthode** : grille fixée avant les essais, protocole, lecture des résultats. Le participant n'est pas évalué sur les chiffres, mais sur le fait qu'ils existent, qu'ils viennent d'essais en session neuve, et qu'ils soutiennent sa conclusion.

## 1. Protocole : aucun essai n'influence le suivant

Trois sources d'interférence en rôle Agent : l'**historique de la conversation**, les **fichiers laissés sur le disque** par l'essai précédent, et le **contexte ouvert** (onglets, modifications non commitées). Un essai = **une branche propre + une session neuve**.

- Session **Copilot**, rôle **Agent**, permissions manuelles, modèle **fixé** (pas Auto) pour tous les essais.
- **Un seul message** par essai ; chaque relance = 1 aller-retour (plafond 3).
- 2 essais par version (V1 = prompt de départ, V2 = prompt réécrit).
- **Les tests d'acceptation ne sont jamais dans le dépôt pendant l'essai** : ils sont copiés après, par le script. Sinon l'agent les lit et on mesure sa lecture de tests, pas le prompt.

### Point de départ de chaque tâche (pas de dépendance entre essais)

| Tâche | Fichier à produire | Le socle contient |
|---|---|---|
| P1 · `overlaps` | `src/domain/overlap.ts` + son test | `types.ts` de référence |
| P2 · types | `src/domain/types.ts` | rien (ni `types.ts` ni `overlap.ts`) |
| P3 · salles libres | `src/domain/availability.ts` + son test | `types.ts` et `overlap.ts` de référence |

P3 s'appuie donc toujours sur la **référence**, jamais sur le résultat d'un essai P1 ou P2.

### Déroulé (script `essai.mjs`, Node 22)

```bash
node essai.mjs init ../sallelibre-mesures      # une fois : dépôt de départ, tag « socle »
cd ../sallelibre-mesures

node essai.mjs start p1-v1-1                   # branche essai-p1-v1-1, identique au socle
# VS Code : fermer tous les onglets · Ctrl+N dans le Chat · rôle Agent · modèle fixé
# coller le prompt, UN message ; noter les allers-retours
node essai.mjs mesure                          # compile, tests d'acceptation, hors sujet, commit
node essai.mjs start p1-v1-2                   # essai suivant, repart du socle
```

`mesure` affiche une ligne de grille prête à coller (reste à remplacer `?` par les allers-retours) et commit l'essai : chaque branche `essai-…` reste comme preuve.

## 2. Grille (décidée avant les essais)

Critères **binaires ou comptables**, pas d'appréciation :

| Critère | Comment le mesurer | Valeur |
|---|---|---|
| **Compile** | `tsc --noEmit` sur le code de l'agent | 0 / 1 |
| **Tests** | les tests d'acceptation de la tâche passent (P2 : le fichier de typage compile) | 0 / 1 |
| **Bornes** | les cas « borne » des tests d'acceptation (10h–11h puis 11h–12h) | 0 / 1 / n/a |
| **Allers-retours** | messages supplémentaires pour arriver à « compile + tests verts » (plafond 3) | 0 à 3 |
| **Hors sujet** | fichiers touchés non attendus + dépendances ajoutées (compté par `mesure`) | nombre |

Les tests d'acceptation sont dans `acceptance/` (`overlap`, `availability`, `types`) ; le formateur les garde, les participants ne les voient pas pendant l'essai.

## 3. Les trois prompts réécrits (V2)

### P1 · chevauchement

```
Contexte : projet SalleLibre, TypeScript. Le type Slot est dans
#file:src/domain/types.ts (fourni).
Tâche : écris UNIQUEMENT la fonction overlaps(a: Slot, b: Slot): boolean
dans src/domain/overlap.ts. Rien d'autre.
Contraintes : intervalles [début, fin[ (fin exclue), fonction pure,
aucune dépendance, aucune mutation des paramètres.
Exemples attendus :
- 10h–11h et 11h–12h → false (bout à bout)
- 10h–11h et 10h30–11h30 → true
- 9h–12h et 10h–11h → true (inclusion)
Fin : arrête-toi quand ces 3 exemples sont des tests Vitest verts
dans tests/domain/overlap.test.ts.
```

### P2 · modèles de données

```
Contexte : API REST de réservation de salles (lis README.md).
Tâche : écris UNIQUEMENT les types TypeScript Slot, Room, Booking et
User dans src/domain/types.ts. Aucune classe, aucun accès aux données.
Contraintes : champs en lecture seule (readonly), dates en Date, aucune
dépendance. Champs : Slot {start, end} ; Room {id, name, capacity,
equipment} ; User {id, name, role} avec role = 'membre' | 'admin' ;
Booking {id, roomId, ownerId, subject, start, end}.
Exemples attendus : Room.capacity est un nombre >= 1 ; role = 'root'
est refusé par le compilateur ; modifier capacity est refusé.
Fin : le fichier compile (tsc --noEmit) et n'importe rien.
```

### P3 · salles libres

```
Contexte : #file:src/domain/types.ts et #file:src/domain/overlap.ts (fournis).
Tâche : écris UNIQUEMENT findAvailableRooms(rooms, bookings, slot,
minCapacity) dans src/domain/availability.ts.
Contraintes : réutilise overlaps, fonction pure, résultat trié par
capacité croissante, aucune dépendance.
Exemples attendus :
- aucune réservation, 4 salles → les salles de capacité >= minCapacity
- une réservation 10h–11h sur Atlas, demande 11h–12h → Atlas est libre
- une réservation 10h–11h sur Atlas, demande 10h30–11h30 → Atlas exclue
Fin : tests Vitest verts pour ces 3 exemples dans
tests/domain/availability.test.ts.
```

## 4. Résultats (exemple)

Modèle fixé : `<modèle>` · 2 essais par version.

| Tâche | Version | Essai | Compile | Tests | Bornes | Allers-retours | Hors sujet |
|---|---|---|---|---|---|---|---|
| P1 | V1 | 1 | 1 | 0 | 0 | 3 | 1 |
| P1 | V1 | 2 | 1 | 0 | 1 | 2 | 2 |
| P1 | V2 | 1 | 1 | 1 | 1 | 0 | 0 |
| P1 | V2 | 2 | 1 | 1 | 1 | 0 | 0 |
| P2 | V1 | 1 | 1 | 0 | n/a | 1 | 3 |
| P2 | V1 | 2 | 0 | 0 | n/a | 2 | 2 |
| P2 | V2 | 1 | 1 | 1 | n/a | 0 | 0 |
| P2 | V2 | 2 | 1 | 1 | n/a | 0 | 0 |
| P3 | V1 | 1 | 0 | 0 | 0 | 3 | 2 |
| P3 | V1 | 2 | 1 | 0 | 1 | 2 | 1 |
| P3 | V2 | 1 | 1 | 1 | 1 | 1 | 0 |
| P3 | V2 | 2 | 1 | 1 | 1 | 0 | 0 |

### Synthèse

| | Compile | Tests verts | Bornes OK | Allers-retours (moy.) | Hors sujet (total) |
|---|---|---|---|---|---|
| **V1** (basique) | 4 / 6 | 0 / 6 | 2 / 4 | 2,2 | 11 |
| **V2** (structuré) | 6 / 6 | 6 / 6 | 4 / 4 | 0,2 | 0 |

## 5. Lecture des résultats

- **Ce qui change tout : l'exemple de borne.** En V1, le modèle choisit « à l'instinct » entre `<` et `<=` : c'est la cause de 2 échecs « Bornes » sur 4. En V2, l'exemple `10h–11h / 11h–12h → false` supprime la décision.
- **Le critère de fin remplace les allers-retours.** « Arrête-toi quand ces 3 exemples sont des tests verts » donne à l'agent sa condition d'arrêt : 0,2 aller-retour en moyenne au lieu de 2,2.
- **La tâche bornée supprime les hors-sujet.** V1 ajoute un ORM, un fichier de config, une classe `Booking` avec méthodes : « UNIQUEMENT » et « Rien d'autre » les font disparaître.
- **P2 est le cas où V1 « marche »** (il compile), mais le résultat n'est pas utilisable : classes avec logique, rôle typé en `string`, champs modifiables. « Compile » seul est insuffisant : d'où le test de typage et le décompte des hors-sujet.
- **Limite honnête :** 2 essais par version ne prouvent pas une probabilité. Ils montrent un **écart net**. Pour un écart faible, il faudrait 5 essais ou plus.

## 6. Ce qu'on attend d'un bon `tp1-mesures.md` (critères du formateur)

| Attendu | Signal d'alerte |
|---|---|
| Grille écrite **avant** les essais, critères comptables | grille complétée après coup, critères du type « qualité du code : bien » |
| Modèle noté, identique partout | « Auto » : on compare des modèles |
| 2 essais par version, **session neuve** à chaque fois | un seul essai, ou essais enchaînés dans la même session |
| V2 contient les 5 composants (contexte, tâche bornée, contraintes, exemples, fin) | V2 = V1 + « fais-le bien » |
| Un seul changement entre deux versions quand on itère | trois changements d'un coup, impossible d'attribuer l'effet |
| Conclusion qui cite des chiffres **et** une limite | « V2 est meilleur » sans chiffre |
| Meilleur code gardé pour `overlaps`, meilleur prompt dans `prompts/meilleur-prompt.md` | rien de réutilisable pour le TP 2 |

## 7. Bonus (autre modèle)

Exemple de lecture : en relançant V1 et V2 avec un second modèle, V1 passe de 0/4 à 1/4 tests verts, V2 reste à 4/4. L'écart **entre prompts** (4 points) dépasse l'écart **entre modèles** (1 point) : structurer le prompt rapporte plus que changer de modèle. Si un participant observe l'inverse, c'est une observation légitime à discuter, pas une erreur.

## 8. Solution de référence (TypeScript · Express · Vitest)

Dossier `reference/` : projet complet qui compile et passe ses 16 tests.

| Fichier | Rôle |
|---|---|
| `src/domain/types.ts` | `Slot`, `Room`, `Booking`, `User` (lecture seule, `role` = union) |
| `src/domain/overlap.ts` | `overlaps(a, b)` : `a.start < b.end && b.start < a.end` |
| `src/domain/availability.ts` | `findAvailableRooms` : capacité, aucun chevauchement dans la salle, tri par capacité croissante |
| `tests/domain/*.test.ts` | tests du participant idéal (paramétrés, horloge fixe, symétrie, absence de mutation) |

Le test à faire casser pour le bonus du TP 3 : `<` en `<=` dans `overlap.ts` fait échouer les cas « borne ».
