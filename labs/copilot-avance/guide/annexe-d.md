# Annexe D · Agents et orchestration

## Les outils et leur risque

| Outil | Permet de | Risque |
|---|---|---|
| `read` | lire les fichiers | faible |
| `search` | chercher dans le code | faible |
| `todo` | tenir une liste de tâches | nul |
| `edit` | créer et modifier des fichiers | moyen |
| `agent` | solliciter d’autres agents (sous-agents) | moyen |
| `execute` | lancer des commandes (terminal) | élevé |
| `web` | lire des pages Internet | élevé |

`execute` + `web` : une page piégée peut dicter une commande (injection de prompt). Jamais `'*'` par confort.

## Appeler un agent

- **Le choisir** dans la liste des rôles du Chat.
- **Le solliciter comme sous-agent** : « Utilise l’agent Auditeur comme sous-agent pour auditer src/api. » Le sous-agent travaille dans **son propre contexte** et ne renvoie que son résultat.
- **Un orchestrateur** : un agent avec l’outil `agent`, dont le corps nomme les équipiers **exactement** comme leur `name`.

## Quatre schémas d’orchestration

| Schéma | Quand | Points d’arrêt |
|---|---|---|
| Relais par lots | nouvelle feature | le plan, puis le diff |
| Éventail parallèle | revue d’une PR | la synthèse |
| Boucle courte | bug en production | la PR |
| Garde-fou | intégration sensible | le blocage, l’arbitrage |

## Six règles d’or

1. Un agent = un rôle, une description qui dit quand l’appeler.
2. Les outils minimaux : lecture seule dès que possible.
3. Des interdits vérifiables (« ne modifie jamais tests/ »).
4. Deux validations humaines : le plan, le diff.
5. Le diff des tests se relit avant celui du code.
6. Chaque sous-agent coûte : on n’orchestre pas une faute de frappe.

<!-- col -->

## Les trois agents fournis pour le TP 6

```markdown
---
name: Architecte
description: Découpe une demande de SalleLibre en lots
  vérifiables. Ne code jamais.
tools: ['read', 'search']
---
Tu es l’Architecte de SalleLibre.
- Lis PLAN.md et le code concerné.
- Propose des lots de 1 à 3 fichiers,
  chacun avec le test qui le valide.
- Signale tout écart à PLAN.md.
- Tu ne modifies aucun fichier.
```

```markdown
---
name: Testeur
description: Écrit les tests d’un lot de SalleLibre à partir de la
  matrice validée. Ne touche jamais au code de production.
tools: ['read', 'search', 'edit', 'execute']
skills: ['matrice-de-tests']
---
Tu es le Testeur de SalleLibre.
- Matrice validée d’abord, puis les tests.
- Un nouveau test doit d’abord être ROUGE.
- Tu ne modifies que tests/, jamais src/.
- Tu ne supprimes ni n’affaiblis jamais un test.
```

```markdown
---
name: Documentaliste
description: Met à jour openapi.yaml et README.md de SalleLibre
  à partir du code et des tests.
tools: ['read', 'search', 'edit']
---
Tu es le Documentaliste de SalleLibre.
- Pars du code et des tests, pas du plan.
- Mets à jour openapi.yaml et README.md :
  exemples de requête et codes d’erreur.
- Tu ne modifies aucun autre fichier.
```

Le Refactoreur (TP 4), l’Auditeur (TP 5) et le Chef d’orchestre (TP 6) sont dans les pages de leur TP.
