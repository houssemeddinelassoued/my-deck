<contexte>
Guichet reçoit des demandes clients saisies à la main dans un formulaire web. Avant toute analyse, on normalise les champs : les téléphones sont rappelés par un automate (format E.164), les e-mails servent de clé de dédoublonnage, les dates et les budgets vont en base.
</contexte>

<code_existant>
{{fichier:src/domaine/demande}}
</code_existant>

<tache>
Implémente la fonction de normalisation déclarée dans le fichier de normalisation (même nom, même signature, mêmes types que dans le code existant) : elle reçoit la demande brute et la date du jour (AAAA-MM-JJ) et renvoie la demande normalisée.
</tache>

<criteres>
- telephone : retirer espaces, points, tirets, parenthèses et un « (0) » éventuel. 8 chiffres commençant par 2 à 9 → +216XXXXXXXX ; +216 ou 00216 suivi de 8 chiffres → +216XXXXXXXX ; 0 suivi de 9 chiffres → +33 + les 9 chiffres ; +33 ou 0033 suivi de 9 chiffres → +33… ; sinon null.
- email : espaces retirés, minuscules ; doit contenir un seul @ et un domaine avec un point suivi d'au moins 2 lettres ; sinon null.
- date_souhaitee : « AAAA-MM-JJ » tel quel ; « JJ/MM/AAAA » ; « JJ/MM » (année de la date du jour) ; « aujourd'hui », « demain », « hier » relatifs à la date du jour ; tout le reste → null. Sortie au format AAAA-MM-JJ.
- budget : montant + devise. DT, TND, dinar(s) → "TND" ; €, EUR, euro(s) → "EUR". Les espaces séparent les milliers ; s'il y a un point et une virgule, le point sépare les milliers et la virgule les décimales ; une virgule seule est décimale. Pas de nombre ou pas de devise → null.
- Une chaîne vide ou absente donne null. La fonction ne lève jamais d'exception.
</criteres>

<format_sortie>
Le fichier complet, compilable, sans explication.
</format_sortie>
