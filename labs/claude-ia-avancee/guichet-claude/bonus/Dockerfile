# Bonus · image d'agent isolée pour le dépôt Guichet (stack TypeScript par défaut).
#   docker build -t guichet-agent -f bonus/Dockerfile .
#   docker run --rm -it -v "$PWD:/travail" -w /travail --cap-add NET_ADMIN guichet-agent bash
FROM node:22-bookworm

# Outils réseau pour le pare-feu en liste blanche, et Git.
RUN apt-get update \
 && apt-get install -y --no-install-recommends iptables ipset dnsutils git ca-certificates sudo \
 && rm -rf /var/lib/apt/lists/*

# Claude Code en ligne de commande.
RUN npm install -g @anthropic-ai/claude-code

# Autres stacks (décommentez selon la vôtre) :
# RUN curl -LsSf https://astral.sh/uv/install.sh | sh                      # Python (uv)
# RUN apt-get update && apt-get install -y openjdk-17-jdk maven            # Java
# RUN apt-get update && apt-get install -y dotnet-sdk-8.0                  # .NET

COPY bonus/pare-feu.sh /usr/local/bin/pare-feu.sh
RUN chmod +x /usr/local/bin/pare-feu.sh \
 && echo "node ALL=(root) NOPASSWD: /usr/local/bin/pare-feu.sh" > /etc/sudoers.d/pare-feu

USER node
WORKDIR /travail
# Le pare-feu est posé à chaque démarrage, puis la commande demandée est lancée.
ENTRYPOINT ["/bin/sh", "-c", "sudo /usr/local/bin/pare-feu.sh && exec \"$@\"", "--"]
CMD ["bash"]
