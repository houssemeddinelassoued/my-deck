#!/bin/sh
# Pare-feu en liste blanche pour le conteneur d'agent (bonus).
# Tout le trafic sortant est refusé, sauf DNS et les domaines nécessaires au travail.
set -eu

DOMAINES="api.anthropic.com claude.ai console.anthropic.com statsig.anthropic.com sentry.io \
registry.npmjs.org pypi.org files.pythonhosted.org repo.maven.apache.org api.nuget.org \
github.com api.github.com codeload.github.com objects.githubusercontent.com"

iptables -F OUTPUT
ipset destroy autorises 2>/dev/null || true
ipset create autorises hash:net

for d in $DOMAINES; do
  for ip in $(dig +short A "$d" | grep -E '^[0-9.]+$'); do
    ipset add autorises "$ip" 2>/dev/null || true
  done
done

iptables -A OUTPUT -o lo -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 53 -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m set --match-set autorises dst -j ACCEPT
iptables -P OUTPUT DROP

echo "Pare-feu posé : $(ipset list autorises | grep -c '^[0-9]') adresses autorisées."
