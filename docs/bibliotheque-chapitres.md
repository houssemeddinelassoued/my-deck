# Bibliothèque de chapitres réutilisables

> Inventaire du 6 novembre 2026, à tenir à jour après chaque nouvelle formation.
> Règle : **on réutilise avant de générer.** On copie le fichier de part dans le nouveau dossier de build, sans jamais modifier la source, puis on adapte le fil rouge, la charte, les notes et la date.
> Durées = somme des `⏱` des notes.

## Familles de kits (compatibilité de copie)

| Famille | Dossiers de build | Remarque |
|---|---|---|
| **Charte Docaposte Institute** | `.dap-build`, `.cop-build`, `.cpd-build`, `.po-build` | Thème `docaposte-institute` ; copie directe entre ces kits, en vérifiant les composants |
| **Charte « inspirée de », sans nom ni logo** | `.iaa-build`, `.iad-build`, `.rh-build`, `.mkt-build`, `.o20-build`, `.irc-build`, `.sit-build` | Ne jamais y introduire le nom Docaposte ni sa marque à trois barres |
| **Technologia** | `.ia134-build`, `.gp-build`, `.ia132-build`, `.eth-build`, `.ata-build` | Thème `technologia` (`.eth-build` : une seule journée, 8 modules ; `.ata-build` : 2 jours, 10 modules, composants de workflow FlowRow / Chain / AtelierPage) |
| **Decks autonomes** | `slides/ai-history-*`, `llm-explique`, `ml-explique`, `fenetre-de-contexte` | Pages à recopier depuis leur `index.tsx`, avec leurs notes |

D'une famille à l'autre, on porte les composants manquants dans le nouveau kit, puis on vérifie par le build et les captures.

## 1. Introduction à l'IA

| Chapitre | Source | Pages | Durée | Public | Pages périssables |
|---|---|---|---|---|---|
| **« Sous le capot » technique** : frise 1943→2026 avec portraits, IA/ML/DL, neurone, entraînement (descente de gradient), tokens, Transformer et attention, génération et température, hallucinations, fonctionnement, boucle agentique, prompt / contexte / harnais | `.cpd-build/10-m1.tsx` (liste des pages) + `11-m1-moteur.tsx` + `12-m1-llm.tsx` ; portraits dans `slides/copilot-debutant/assets/timeline/` | `M1_IAHistoire` → `M1_Engineering` (12 p.) | ≈ 37 min | Développeurs, technique | Aucune |
| Le même module Copilot, complet | `.cpd-build/10-m1.tsx` | 23 p. | ≈ 1 h 45 avec atelier et pause | Développeurs débutants Copilot | `M1_Offres`, `M1_Nouveautes`, `M1_Ecosysteme`, `M1_Modeles` |
| Intro IA pour développeurs (panorama) | `.dap-build/j1-10-m1.tsx` | 19 p. : Timeline, Determinism, NextToken, Context, Halluc, Software3, Levels, Typology, Market… | ≈ 1 h 35 | Développeurs | `M1_Market`, `M1_Criteria` |
| Intro assistants de code | `.ia132-build/10-m1.tsx` | 15 p. : Timeline, Predict, Context, Tools, Models, Modes, AgentLoop, Evidence… | ≈ 1 h | Développeurs | `M1_Models`, `M1_Modes` |
| Intro IA pour métiers non techniques | `.gp-build/10-m1.tsx` | 19 p. : Define, RulesVsLearn, Learn, Families, NextWord, Plausible, History, AiOrNot, Pipeline, Sort… | ≈ 1 h 10 | Chefs de projet, métiers | `M1_Figures`, `M1_Business` |
| Intro IA courte (produit) | `.po-build/10-m1.tsx` | 12 p. : Rules, Nested, Learn, Families, Llm, PredGen, UseCases, Sort | ≈ 1 h | PO, métiers | — |
| Intro IA générative grand public | `.o20-build/10-m1.tsx`, `.iad-build/10-m1.tsx` | 10 à 11 p. | ≈ 55 min | Débutants bureautique | Outils cités |
| Intro IA support et infra (mot suivant, contexte, hallucinations, Copilot, Claude, autres) | `.sit-build/10-m1.tsx` | 15 p. | ≈ 55 min | Support IT, exploitation | Pages outils |
| Intro agents IA | `.ia134-build/j1-10-m1a.tsx` (+ `m1b`, `m1c`, `m1d`) | Timeline, Definition, Anatomy… | à mesurer | Tous publics | — |
| Épisodes d'histoire de l'IA (neurone formel, perceptron, rétropropagation, IA symbolique, CNN, Deep Blue, AlexNet, word2vec, AlphaGo, Transformer, ChatGPT) + sommaire | `slides/ai-history-00` … `10`, `ai-history-sommaire` | 10 à 20 p. chacun | à mesurer | Annexe, bonus, approfondissement | — |
| Comment fonctionne un LLM / Comment une machine apprend / La fenêtre de contexte | `slides/llm-explique`, `ml-explique`, `fenetre-de-contexte` | 20 à 22 p. | à mesurer | Tous publics | — |

## 2. Prompting

| Chapitre | Source | Durée | Public |
|---|---|---|---|
| Fondamentaux (exemples, itérer, vérifier, formules) | `.o20-build/20-m2.tsx` | ≈ 55 min | Débutants |
| Structure, contexte, format, bibliothèque de prompts | `.iad-build/20-m2.tsx` | ≈ 1 h | Assistants, métiers |
| Anatomie, lecteurs, réparer un prompt | `.sit-build/20-m2.tsx` | ≈ 45 min | Support IT |
| Prompt engineering avancé pour le code | `.cop-build/10-m1.tsx` | à mesurer | Développeurs confirmés |

## 3. Limites, sécurité, conformité

| Chapitre | Source | Durée | Public |
|---|---|---|---|
| Défauts, données sensibles (feu tricolore), anonymiser, injection, cadre | `.sit-build/40-m4.tsx` | ≈ 1 h | Support IT, tous |
| Erreurs, données, RGPD, propriété intellectuelle, injection, gouvernance, quand ne pas utiliser l'IA | `.iaa-build/91-m9.tsx` | ≈ 50 min | Métiers, automatisation |
| Limites et précautions ; cybersécurité et IA | `.dap-build/j1-30-m3is.tsx`, `j2-10-m5.tsx` | à mesurer | Développeurs |
| Enjeux éthiques : biais (Amazon), quatre sources de biais (Gender Shades, Obermeyer 2019), lettre « boîte noire » / explicable (interrupteur), vie privée, feu tricolore | `.eth-build/40-m4.tsx` | ≈ 30 min | Tous publics, Technologia |
| Loi 25 et IA responsable : calendrier 2022-2024, six obligations avec articles, article 12.1, EFVP, Déclaration de Montréal, six principes, règlement européen (report omnibus 2026), C-36, classement par niveau de risque | `.eth-build/50-m5.tsx` | ≈ 40 min | Tous publics, Québec. **Périssable** : `M5_World` |
| Étude de cas : allocations de garde aux Pays-Bas (analyse individuelle par principes, rôles, débat avec volontaires, suite et leçons) | `.eth-build/60-a2.tsx` | ≈ 40 min | Atelier éthique |
| Gouvernance : Air Canada (Moffatt), six rôles, cinq points de contrôle, charte en cinq rubriques + exemple, atelier mini-charte | `.eth-build/70-m7.tsx`, `80-a3.tsx` | ≈ 25 min + 45 min | Gestionnaires, décideurs |

## 4. Vérifier le code généré

| Chapitre | Source | Durée | Public |
|---|---|---|---|
| Confiance, checklist, hallucinations, sécurité, droits, revue | `.cpd-build/80-m8.tsx` | ≈ 1 h 25 | Développeurs débutants |
| Sécurité et audit | `.cop-build/50-m5.tsx` | à mesurer | Développeurs confirmés |
| Revue de code et documentation ; tests et qualité | `.ia132-build/60-m4.tsx`, `70-m5.tsx` | à mesurer | Développeurs |

## 5. Agents

| Chapitre | Source | Durée | Attention |
|---|---|---|---|
| Agents, Skills, orchestration dans Copilot | `.cpd-build/85-m9.tsx` | ≈ 45 min | Relais `handoffs` ignorés par le harnais Copilot (défaut depuis le 28 octobre 2026) : à mettre à jour avant réutilisation |
| Assistants et agents IA (métiers) | `.iaa-build/90-m8.tsx` | à mesurer | — |
| Typologie, conception, déploiement, mesure | `.ia134-build/` (M3, M7, M9, M10) | à mesurer | — |

## 5 bis. Automatisation (workflows, RPA, IA)

| Chapitre | Source | Durée | Public | Pages périssables |
|---|---|---|---|---|
| Introduction : Quand / Si / Alors, avant-après, six niveaux, classique ou IA, règle vs IA sur 4 courriels, tri, exemples par service | `.ata-build/10-m1.tsx` | ≈ 45 min | Métiers | — |
| Identifier les processus : SIPOC (notes de frais), cartographie en couloirs avec irritants, voleurs de temps, 4 critères, score /20, calculateur de gain, 2 exercices | `.ata-build/20-m2.tsx` | ≈ 1 h 20 | Tous | — |
| Outils : familles, connecteur/API, panorama Make/Zapier/n8n/Power Automate/PAD, vocabulaire commun, choix interactif, visite de Make, préparation des comptes | `.ata-build/30-m3.tsx` | ≈ 50 min | Tous | `M3_Panorama`, `M3_Make` |
| RPA : robot animé, écran vs API, assisté/non assisté, six briques, 3 cas, démo Power Automate Desktop, pannes et parades, exercice d'ordre | `.ata-build/40-m4.tsx` | ≈ 50 min | Tous | `M4_Modes` (licences) |
| IA dans les workflows : texte libre → JSON, OCR, classification avec seuil, extraction, réponses en 3 niveaux, assistant/workflow/agent, prompt de workflow, exercice | `.ata-build/45-m5.tsx` | ≈ 55 min | Tous | `M5_Agents` |
| Construire dans Make : premier flux, conception (fiche en 8 rubriques), sources, déclencheurs, actions, mapping, module Gemini + Parse JSON, routeur, ateliers guidés, scénario complet, tests, gain net, mise en production, fiche d'exploitation | `.ata-build/60-m6.tsx` … `93-m10.tsx` | ≈ 5 h | Tous | `M6_DemoPA`, `M8_IA` |

## 6. Blocs transverses

| Bloc | Où le prendre |
|---|---|
| Ouverture : « Votre formateur », encadré classe virtuelle, sondage, objectifs en escalier, programme, auto-positionnement, check technique, page Dépôt | Le `00-open.tsx` le plus proche de la charte (`.cpd-build` pour un parcours avec ateliers et dépôt) |
| Reprise du jour 2 : quiz flash et programme | `.cpd-build/45-j2.tsx`, `.gp-build/50-j2.tsx` |
| Clôture : points clés, plan d'action à 3 horizons, ressources, évaluation | `90-close.tsx` (`.cpd-build`, `.gp-build`) |

## Vigilance avant toute reprise

- **QCM** : le commit `aadaee2` (« Redistribution terminée des QCM », 6 novembre 2026) avait déplacé les marqueurs `ok` sans les réponses, ce qui rendait 182 questions fausses. **C'est corrigé depuis le 6 novembre 2026** : positions rééquilibrées conservées, bonnes réponses remises, 11 decks régénérés. En reprenant un QCM, gardez l'option entière avec son marqueur.
- **Auto-positionnement** : ne reprenez pas les pages `O_AutoPos` / `C_AutoPos`. Il n'y a plus d'auto-positionnement par défaut.
- **Pages périssables** : re-vérifiez et re-datez offres, nouveautés, marché et outils.
- **Charte** : retirez tout nom ou logo interdit par le commanditaire de destination.
