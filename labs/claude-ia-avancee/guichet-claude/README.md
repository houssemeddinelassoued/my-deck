# Guichet · ateliers « Claude · IA avancée pour les développeurs »

Le portail des demandes d’**Oasis Digital**, une ESN fictive : un formulaire web libre → Claude extrait et qualifie la demande → des garde-fous vérifient → la demande arrive dans une base SQLite, visible dans un tableau de bord. Tout est fictif : aucune donnée réelle.

La même application existe en **4 stacks**, avec les mêmes étapes, les mêmes tests et les mêmes reprises :

| Dossier | Stack | Prérequis |
|---|---|---|
| `ts/` | TypeScript (Node 22.18+, types retirés à l’exécution) | Node |
| `python/` | Python 3.12+ | uv |
| `java/` | Java 21+ (Maven) | JDK, Maven |
| `dotnet/` | .NET 8+ (C#, ASP.NET Core) | SDK .NET |

Pour toutes les stacks : Git, Node.js 22.18+ (outil commun et simulateur), Claude Code (`claude`) connecté à votre compte.

## Démarrer

```bash
node guichet.mjs init python      # votre stack : ts, python, java ou dotnet
node guichet.mjs poste            # tout doit être vert
node guichet.mjs simu             # terminal 1 : simulateur de l’API (http://localhost:8787)
node guichet.mjs lancer           # terminal 2 : application (http://localhost:3000)
```

## Pas de clé API ? Trois moteurs

| `MOTEUR=` | Ce qui répond | Coût |
|---|---|---|
| `simu` (défaut) | le simulateur local : même format que l’API Messages, le SDK officiel est pointé dessus | gratuit, hors ligne |
| `claude-cli` | le vrai modèle, par `claude -p` et votre licence Claude | inclus dans la licence |
| `api` | l’API réelle, avec `ANTHROPIC_API_KEY` | facturé à l’usage |

## Les ateliers

| Atelier | Énoncé | Étapes |
|---|---|---|
| 0 · Préparer son poste | `ateliers/A0.md` | A0 |
| 1 · Prompt engineering pour le code | `ateliers/A1.md` | A1.1 → A1.4 |
| 2 · Harnais et évaluation | `ateliers/A2.md` | A2.1 → A2.5 |
| 3 · Formulaire → Claude → base | `ateliers/A3.md` | A3.1 → A3.5 |
| 4 · L’environnement Claude Code | `ateliers/A4.md` | A4.1 → A4.5 |
| 5 · Défi final | `ateliers/A5.md` | A5 |
| Bonus · Docker et bac à sable | `ateliers/BONUS-docker.md` | — |

```bash
node guichet.mjs verifier A3.2    # l’étape est-elle réussie ?
node guichet.mjs reprise A3.2     # en retard : se remettre à l’état de FIN de A3.2
node guichet.mjs aide             # toutes les commandes
```

## Ce que contient le dépôt

| Chemin | Contenu |
|---|---|
| `guichet.mjs` | l’outil commun : poste, tests, garde, verifier, reprise, generer, extraire, eval, juger, boucle |
| `web/` | l’interface web commune (formulaire + tableau de bord), servie par chaque stack |
| `simulateur/` | le faux serveur de l’API Messages et son journal (`/__journal`) |
| `donnees/` | 12 demandes de référence (dont 2 pièges), les clients, les cas de test partagés |
| `contrats/` | le contrat de la demande (source de vérité des champs) et celui du juge |
| `prompts/` | les prompts versionnés |
| `garde/` | les règles de garde et les extraits piégés |
| `outils/mcp-demandes/` | le serveur MCP de la base des demandes (Atelier 4) |
| `reprises/` | les points de reprise, compressés |
| `bonus/` | Dockerfile, pare-feu, lancement d’agents en parallèle |

Les tests de chaque stack lisent les mêmes cas dans `donnees/` : une règle se vérifie de la même façon en TypeScript, en Python, en Java et en .NET.
