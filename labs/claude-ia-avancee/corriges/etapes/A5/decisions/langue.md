# Décision · langue et routage des demandes (défi final)

## Plan validé (mode Plan de Claude Code, corrigé avant l’implémentation)
1. Contrat : deux champs « code » (`"x-source": "code"`) : `langue` (fr, en) et `equipe` (Tunis, Europe).
2. Domaine : `detecterLangue` (heuristique des mots-outils) et `equipePour` ; branchés dans l’enrichissement.
3. Interface : colonnes Langue et Équipe dans le tableau de bord.
4. Tests : FR, EN, message mélangé, message vide ; demande n° 5 routée vers Europe de bout en bout.

## Corrections apportées au plan de Claude
- Claude proposait de demander la langue au modèle : refusé, la règle doit être déterministe et testable (même logique que la priorité).
- Il proposait une bibliothèque de détection de langue : refusé (dépendance de plus pour deux langues).

## Constats du relecteur sécurité
- Aucun champ du formulaire n’est utilisé comme instruction : RAS.
- Suggestion retenue : un test sur un message vide (langue par défaut : fr).
