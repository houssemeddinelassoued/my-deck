# Modèle Excel de suivi pour l'atelier 1 (IA124 · Groupe Lessard · Centre sportif de Montréal).
#   python .gpl-labs/modele_excel.py  → labs/ia-gestion-de-projet-lessard/atelier-1/Atelier1-Modele-suivi-des-taches.xlsx
# Feuilles : Lisez-moi, Tâches (avec échéancier semaine par semaine), Risques, RACI.
# Les colonnes B à H de « Tâches » correspondent au tableau demandé à l'IA dans le guide :
#   Étape | Tâche | Responsable | Début | Fin | Statut | Dépendance  (dates AAAA-MM-JJ).
import datetime as dt
import os
import sys

from openpyxl import Workbook
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

RACINE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SORTIE = os.path.join(RACINE, 'labs', 'ia-gestion-de-projet-lessard', 'atelier-1', 'Atelier1-Modele-suivi-des-taches.xlsx')

BLEU, ENCRE, GRIS, TRAIT, PANNEAU = '1F78C1', '2B2F33', '77818A', 'DCE3E8', 'EAF0F4'
CORAIL, JAUNE, VERT = 'E0573D', 'FFD000', '3A9F45'
f_titre = Font(name='Calibri', size=16, bold=True, color=ENCRE)
f_sous = Font(name='Calibri', size=10, italic=True, color=GRIS)
f_tete = Font(name='Calibri', size=10, bold=True, color='FFFFFF')
f_ex = Font(name='Calibri', size=10, italic=True, color=GRIS)
fond_tete = PatternFill('solid', fgColor=BLEU)
fond_fetes = PatternFill('solid', fgColor='EEF2F5')
trait = Side(style='thin', color=TRAIT)
bord = Border(left=trait, right=trait, top=trait, bottom=trait)
centre = Alignment(horizontal='center', vertical='center', wrap_text=True)
gauche = Alignment(horizontal='left', vertical='center', wrap_text=True)

NB = 50  # lignes de saisie
L0 = 5   # première ligne de données
L1 = L0 + NB - 1


def entete(ws, ligne, titres, largeurs):
    for i, (t, w) in enumerate(zip(titres, largeurs), start=1):
        c = ws.cell(row=ligne, column=i, value=t)
        c.font, c.fill, c.alignment, c.border = f_tete, fond_tete, centre, bord
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[ligne].height = 30


def grille(ws, c0, c1):
    for r in range(L0, L1 + 1):
        for c in range(c0, c1 + 1):
            cell = ws.cell(row=r, column=c)
            cell.border = bord
            cell.alignment = gauche
            cell.font = Font(name='Calibri', size=10, color=ENCRE)


wb = Workbook()

# ─── Lisez-moi ───────────────────────────────────────────────────────────────
ws = wb.active
ws.title = 'Lisez-moi'
ws.column_dimensions['A'].width = 4
ws.column_dimensions['B'].width = 110
lignes = [
    ('Modèle de suivi · Atelier 1 · Centre sportif de Montréal (cas fictif)', f_titre),
    ('IA124 · IA appliquée à la gestion de projet · Préparé pour le Groupe Lessard · Technologia', f_sous),
    ('', None),
    ('À quoi sert ce fichier ?', Font(name='Calibri', size=12, bold=True, color=BLEU)),
    ('Il reçoit le plan que vous construisez avec l’IA : les tâches (avec un échéancier semaine par semaine), le registre des risques et la matrice RACI.', None),
    ('Il est facultatif : vous pouvez aussi travailler dans Planner, Smartsheet ou votre propre mini-outil.', None),
    ('', None),
    ('Comment le remplir avec l’IA ?', Font(name='Calibri', size=12, bold=True, color=BLEU)),
    ('1. Demandez à Copilot votre plan sous forme de tableau, avec exactement ces colonnes : Étape | Tâche | Responsable | Début | Fin | Statut | Dépendance (dates au format AAAA-MM-JJ).', None),
    ('2. Copiez le tableau de la réponse, puis collez-le dans la feuille « Tâches », cellule B5.', None),
    ('3. Vérifiez chaque ligne : les dates, les dépendances, un seul responsable. L’échéancier se colore tout seul ; les tâches en retard passent en rouge.', None),
    ('4. Faites de même pour « Risques » (collez en B5 : Risque | Probabilité | Impact | Mesure | Responsable) et « RACI » (collez en A5 : Tâche | Mathieu | Hélène | Nadia | Éric | Patrice).', None),
    ('', None),
    ('Repères du projet', Font(name='Calibri', size=12, bold=True, color=BLEU)),
    ('Départ : lundi 16 novembre 2026 · Bâtiment fermé : vendredi 28 mai 2027 · Usine et chantier fermés aux Fêtes (semaines du 21 et du 28 décembre, en gris dans l’échéancier).', None),
    ('', None),
    ('Smartsheet : Fichier > Importer > Microsoft Excel, puis choisissez la feuille « Tâches ».', None),
    ('Données : cas fictif de formation. Pour un vrai projet, travaillez avec votre compte Lessard et anonymisez ce qui doit l’être.', f_sous),
]
for i, (t, f) in enumerate(lignes, start=1):
    c = ws.cell(row=i, column=2, value=t)
    c.alignment = Alignment(wrap_text=True, vertical='top')
    c.font = f or Font(name='Calibri', size=11, color=ENCRE)

# ─── Tâches + échéancier ─────────────────────────────────────────────────────
ws = wb.create_sheet('Tâches')
ws['A1'] = 'Plan du projet · Lot enveloppe · Centre sportif de Montréal'
ws['A1'].font = f_titre
ws['A2'] = 'Collez le tableau de l’IA en B5 (Étape | Tâche | Responsable | Début | Fin | Statut | Dépendance). La ligne 5 est un exemple : remplacez-la.'
ws['A2'].font = f_sous
titres = ['N°', 'Étape', 'Tâche', 'Responsable', 'Début', 'Fin', 'Statut', 'Dépendance', 'Commentaire', 'Jours ouvr.']
entete(ws, 4, titres, [5, 18, 34, 13, 11, 11, 11, 18, 22, 8])
grille(ws, 1, 10)
debut = dt.date(2026, 11, 16)
SEM = 28
C0 = 12  # colonne L
for k in range(SEM):
    col = C0 + k
    lettre = get_column_letter(col)
    ws.column_dimensions[lettre].width = 4.2
    c = ws.cell(row=4, column=col, value=debut + dt.timedelta(weeks=k))
    c.number_format = 'd mmm'
    c.font, c.fill, c.border = Font(name='Calibri', size=8, bold=True, color='FFFFFF'), fond_tete, bord
    c.alignment = Alignment(horizontal='center', vertical='center', text_rotation=90)
    m = ws.cell(row=3, column=col, value=f'S{k + 1}')
    m.font, m.alignment = Font(name='Calibri', size=8, color=GRIS), Alignment(horizontal='center')
    fetes = (debut + dt.timedelta(weeks=k)) in (dt.date(2026, 12, 21), dt.date(2026, 12, 28))
    for r in range(L0, L1 + 1):
        cell = ws.cell(row=r, column=col)
        cell.border = bord
        if fetes:
            cell.fill = fond_fetes
ws.cell(row=3, column=C0 + 5).value = 'Fêtes'
ws.cell(row=3, column=C0 + 5).font = Font(name='Calibri', size=8, bold=True, color=GRIS)
ws.row_dimensions[4].height = 44
for r in range(L0, L1 + 1):
    ws.cell(row=r, column=1, value=f'=IF(C{r}="","",ROW()-{L0 - 1})').alignment = centre
    for col in (5, 6):
        ws.cell(row=r, column=col).number_format = 'yyyy-mm-dd'
    ws.cell(row=r, column=10, value=f'=IF(AND(ISNUMBER(E{r}),ISNUMBER(F{r})),NETWORKDAYS(E{r},F{r}),"")').alignment = centre
# exemple
ex = ['Dessins d’atelier', 'Exemple — Dessins MR-01 (à remplacer)', 'Mathieu', dt.date(2026, 11, 16), dt.date(2026, 12, 4), 'En cours', '—']
for i, v in enumerate(ex, start=2):
    c = ws.cell(row=L0, column=i, value=v)
    c.font = f_ex
plage_gantt = f'{get_column_letter(C0)}{L0}:{get_column_letter(C0 + SEM - 1)}{L1}'
gL = get_column_letter(C0)
ws.conditional_formatting.add(plage_gantt, FormulaRule(formula=[f'AND(ISNUMBER($E{L0}),ISNUMBER($F{L0}),{gL}$4<=$F{L0},{gL}$4+6>=$E{L0})'], fill=PatternFill('solid', fgColor=BLEU)))
ws.conditional_formatting.add(f'B{L0}:J{L1}', FormulaRule(formula=[f'AND(ISNUMBER($F{L0}),$F{L0}<TODAY(),$G{L0}<>"Terminé")'], font=Font(color=CORAIL, bold=True)))
ws.conditional_formatting.add(f'G{L0}:G{L1}', CellIsRule(operator='equal', formula=['"Terminé"'], fill=PatternFill('solid', fgColor='E3F2E5')))
ws.conditional_formatting.add(f'G{L0}:G{L1}', CellIsRule(operator='equal', formula=['"En cours"'], fill=PatternFill('solid', fgColor='E3EFF9')))
ws.conditional_formatting.add(f'G{L0}:G{L1}', CellIsRule(operator='equal', formula=['"À valider"'], fill=PatternFill('solid', fgColor='FFF6CC')))
dv = DataValidation(type='list', formula1='"À faire,En cours,À valider,Terminé"', allow_blank=True, showErrorMessage=False)
ws.add_data_validation(dv)
dv.add(f'G{L0}:G{L1}')
dvr = DataValidation(type='list', formula1='"Mathieu,Hélène,Nadia,Éric,Patrice"', allow_blank=True, showErrorMessage=False)
ws.add_data_validation(dvr)
dvr.add(f'D{L0}:D{L1}')
ws.freeze_panes = 'D5'

# ─── Risques ─────────────────────────────────────────────────────────────────
ws = wb.create_sheet('Risques')
ws['A1'] = 'Registre des risques'
ws['A1'].font = f_titre
ws['A2'] = 'Probabilité et impact de 1 (faible) à 3 (élevé). Le score et le niveau se calculent. Ce sont des jugements : c’est votre expérience qui les fixe, pas l’IA.'
ws['A2'].font = f_sous
entete(ws, 4, ['N°', 'Risque', 'Probabilité (1-3)', 'Impact (1-3)', 'Mesure', 'Responsable', 'Score', 'Niveau', 'Échéance', 'Statut'], [5, 40, 12, 11, 46, 13, 8, 10, 11, 11])
grille(ws, 1, 10)
for r in range(L0, L1 + 1):
    ws.cell(row=r, column=1, value=f'=IF(B{r}="","","R"&(ROW()-{L0 - 1}))').alignment = centre
    ws.cell(row=r, column=7, value=f'=IF(AND(ISNUMBER(C{r}),ISNUMBER(D{r})),C{r}*D{r},"")').alignment = centre
    ws.cell(row=r, column=8, value=f'=IF(G{r}="","",IF(G{r}>=6,"Élevé",IF(G{r}>=3,"Moyen","Faible")))').alignment = centre
    ws.cell(row=r, column=9).number_format = 'yyyy-mm-dd'
for i, v in enumerate(['Exemple — Approbation des dessins en retard (à remplacer)', 2, 3, 'Relance à J+5, point fixe en réunion de chantier', 'Mathieu'], start=2):
    ws.cell(row=L0, column=i, value=v).font = f_ex
ws.conditional_formatting.add(f'H{L0}:H{L1}', CellIsRule(operator='equal', formula=['"Élevé"'], fill=PatternFill('solid', fgColor='FBE3DD'), font=Font(color=CORAIL, bold=True)))
ws.conditional_formatting.add(f'H{L0}:H{L1}', CellIsRule(operator='equal', formula=['"Moyen"'], fill=PatternFill('solid', fgColor='FFF6CC')))
ws.conditional_formatting.add(f'H{L0}:H{L1}', CellIsRule(operator='equal', formula=['"Faible"'], fill=PatternFill('solid', fgColor='E3F2E5')))
dvp = DataValidation(type='whole', operator='between', formula1='1', formula2='3', allow_blank=True)
ws.add_data_validation(dvp)
dvp.add(f'C{L0}:D{L1}')
ws.freeze_panes = 'C5'

# ─── RACI ────────────────────────────────────────────────────────────────────
ws = wb.create_sheet('RACI')
ws['A1'] = 'Matrice RACI'
ws['A1'].font = f_titre
ws['A2'] = 'R réalise · A approuve (un seul par ligne !) · C est consulté · I est informé. La colonne Contrôle vérifie la règle du A unique.'
ws['A2'].font = f_sous
entete(ws, 4, ['Tâche', 'Mathieu', 'Hélène', 'Nadia', 'Éric', 'Patrice', 'Contrôle'], [40, 11, 11, 11, 11, 11, 16])
grille(ws, 1, 7)
for r in range(L0, L1 + 1):
    for c in range(2, 7):
        ws.cell(row=r, column=c).alignment = centre
    ws.cell(row=r, column=7, value=f'=IF(A{r}="","",IF(COUNTIF(B{r}:F{r},"A")=1,"OK",IF(COUNTIF(B{r}:F{r},"A")=0,"Aucun A","Plusieurs A")))').alignment = centre
for i, v in enumerate(['Exemple — Revue du contrat (à remplacer)', 'R', 'A', 'I', 'C', 'I'], start=1):
    ws.cell(row=L0, column=i, value=v).font = f_ex
ws.conditional_formatting.add(f'G{L0}:G{L1}', CellIsRule(operator='equal', formula=['"OK"'], fill=PatternFill('solid', fgColor='E3F2E5'), font=Font(color=VERT, bold=True)))
ws.conditional_formatting.add(f'G{L0}:G{L1}', CellIsRule(operator='notEqual', formula=['"OK"'], fill=PatternFill('solid', fgColor='FBE3DD'), font=Font(color=CORAIL, bold=True)))
for lettre_val, couleur in (('R', 'E3EFF9'), ('A', 'FBE3DD'), ('C', 'FFF6CC'), ('I', PANNEAU)):
    ws.conditional_formatting.add(f'B{L0}:F{L1}', CellIsRule(operator='equal', formula=[f'"{lettre_val}"'], fill=PatternFill('solid', fgColor=couleur)))
dva = DataValidation(type='list', formula1='"R,A,C,I"', allow_blank=True, showErrorMessage=False)
ws.add_data_validation(dva)
dva.add(f'B{L0}:F{L1}')
ws.freeze_panes = 'B5'

os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
wb.save(SORTIE)
print('->', os.path.relpath(SORTIE, RACINE))
