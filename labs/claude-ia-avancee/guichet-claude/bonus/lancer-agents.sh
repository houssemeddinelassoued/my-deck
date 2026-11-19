#!/usr/bin/env bash
# Bonus · un agent par tâche : une copie de travail Git, une branche et un conteneur chacun.
#   bash bonus/lancer-agents.sh            (toutes les tâches agent-*.md de taches/)
# Chaque agent implémente sa tâche, lance garde + tests, et commite sur sa branche. Vous relisez ensuite.
set -euo pipefail

for t in taches/agent-*.md; do
  [ -e "$t" ] || { echo "Aucune tâche taches/agent-*.md : écrivez-en une ou plusieurs."; exit 1; }
  nom="agent/$(basename "$t" .md)"
  dossier="../wt-$(basename "$t" .md)"
  git worktree add "$dossier" -b "$nom"
  docker run -d --rm --cap-add NET_ADMIN -v "$(cd "$dossier" && pwd):/travail" guichet-agent \
    claude -p "$(cat "$t")
Quand c’est fait : node guichet.mjs garde && node guichet.mjs tests, puis git commit sur la branche courante." \
    --dangerously-skip-permissions
  echo "→ $nom lancé dans $dossier"
done
echo "Suivi : docker ps · relecture : git log --oneline agent/…"
