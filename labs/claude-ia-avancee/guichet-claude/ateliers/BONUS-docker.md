# Bonus · Docker et bac à sable (hors programme)

> 30 minutes · facultatif · Docker (ou Docker Desktop) autorisé sur le poste

## Pourquoi

Une permission à chaque commande protège, mais fatigue. Isoler l’agent (fichiers limités au dépôt, réseau en liste blanche, conteneur jetable) permet de le laisser travailler sans demander, en sécurité.

## B1 · L’image (10 min)

```bash
docker build -t guichet-agent -f bonus/Dockerfile .
docker run --rm -it -v "$PWD:/travail" -w /travail --cap-add NET_ADMIN guichet-agent bash
# dans le conteneur :
curl -sS https://example.com     # doit échouer (réseau filtré)
npm view @anthropic-ai/sdk version   # doit réussir (registre autorisé)
```

Le pare-feu (`bonus/pare-feu.sh`) n’autorise que les registres de paquets, GitHub et l’API de Claude.

## B2 · Un agent sans permissions, mais isolé (10 min)

Dans le conteneur, et seulement là :

```bash
claude --dangerously-skip-permissions
```

Connectez-vous à votre compte dans le conteneur. Ne montez jamais vos clés SSH ni un `.env` de production. Demandez une petite tâche et observez : aucun accès hors du dossier monté.

## B3 · Trois agents en parallèle (10 min)

1. Écrivez trois tâches `taches/agent-1.md`, `agent-2.md`, `agent-3.md` (par exemple : un test manquant, un message d’erreur à clarifier, une colonne de plus).
2. `bash bonus/lancer-agents.sh` : une copie de travail Git, une branche et un conteneur par tâche.
3. Relisez les trois branches avec le sous-agent `relecteur-securite`, puis fusionnez ce qui est vert et relu.

## Sans Docker

- Le bac à sable intégré de Claude Code (`/sandbox`) isole les commandes (macOS, Linux, WSL 2) : vérifiez sa disponibilité dans la documentation à jour.
- Claude Code sur le Web (claude.ai/code) fait tourner chaque tâche dans un environnement cloud et produit une branche ou une PR.
