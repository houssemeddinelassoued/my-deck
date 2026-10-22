# Génère le dossier « Orvalis » des labs de la formation
# « Support & infrastructure IT : boostez vos performances grâce à l'IA ».
#
#   PYTHONPATH=<dossier openpyxl> python .sit-labs/gen_data.py
#
# Toutes les données sont fictives. Les chiffres clés sont alignés sur le deck
# (slides/ia-support-infrastructure) : 1 846 tickets en septembre, 1 612 en août,
# 91,4 % de SLA respectés, 143 tickets en stock, incident FS-02 du 12 octobre…
import csv
import math
import os
import random
import shutil
import unicodedata
from datetime import datetime, timedelta

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, RGBColor
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'labs', 'ia-support-infrastructure', 'Orvalis'))
NAVY = RGBColor(0x0B, 0x1F, 0x5C)
random.seed(20261012)

# The folder is fully regenerated on each run.
if os.path.isdir(ROOT):
    shutil.rmtree(ROOT)


def slug(text, n=60):
    a = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()
    a = ''.join(c if c.isalnum() else '-' for c in a)
    while '--' in a:
        a = a.replace('--', '-')
    return a.strip('-')[:n].strip('-')


def out(*parts):
    p = os.path.join(ROOT, *parts)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    return p


# ─── Helpers Word / Excel ────────────────────────────────────────────────────
def new_doc(title, subtitle=None):
    d = Document()
    st = d.styles['Normal']
    st.font.name = 'Calibri'
    st.font.size = Pt(11)
    h = d.add_heading(title, level=0)
    for r in h.runs:
        r.font.color.rgb = NAVY
    if subtitle:
        p = d.add_paragraph(subtitle)
        p.runs[0].italic = True
    return d


def h(d, text, level=1):
    x = d.add_heading(text, level=level)
    for r in x.runs:
        r.font.color.rgb = NAVY
    return x


def para(d, text, bold_lead=None):
    p = d.add_paragraph()
    if bold_lead:
        p.add_run(bold_lead).bold = True
    p.add_run(text)
    return p


def bullets(d, items, style='List Bullet'):
    for it in items:
        d.add_paragraph(it, style=style)


def table(d, header, rows):
    t = d.add_table(rows=1, cols=len(header))
    t.style = 'Light Grid Accent 1'
    for i, c in enumerate(header):
        t.rows[0].cells[i].text = c
    for r in rows:
        cells = t.add_row().cells
        for i, c in enumerate(r):
            cells[i].text = str(c)
    return t


HEAD_FILL = PatternFill('solid', fgColor='0B1F5C')


def sheet(wb, title, header, rows, widths=None, first=False):
    ws = wb.active if first else wb.create_sheet()
    ws.title = title
    ws.append(header)
    for c in ws[1]:
        c.font = Font(bold=True, color='FFFFFF')
        c.fill = HEAD_FILL
        c.alignment = Alignment(vertical='center', wrap_text=True)
    for r in rows:
        ws.append(r)
    for i, w in enumerate(widths or [], start=1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = 'A2'
    return ws


# ─── Référentiels ────────────────────────────────────────────────────────────
SITES = ['Siège (Paris)', 'Lyon', 'Rennes', 'Lille', 'Marseille', 'Bordeaux', 'Nantes', 'Strasbourg', 'Toulouse', 'Orléans']
SITE_W = [16, 14, 9, 9, 9, 9, 9, 8, 9, 8]
ENTREPOTS = SITES[1:]
TECHS = ['Inès', 'Yanis', 'Sarah', 'Thomas', 'Malik', 'Léa', 'Karim']
CANAUX = ['Téléphone', 'E-mail', 'Portail', 'Teams']
PRIO_H = {'P1': 4, 'P2': 8, 'P3': 24, 'P4': 72}

OBJETS = {
    'Accès et comptes': ['Mot de passe expiré', 'Compte verrouillé', 'Plus d’accès au dossier partagé', 'Nouveau téléphone : authentification', 'Demande d’accès à l’application WMS', 'Accès refusé à la boîte partagée'],
    'Postes de travail': ['PC lent au démarrage', 'Écran noir au démarrage', 'Clavier ou souris défectueux', 'Installation d’un logiciel', 'Station d’accueil non reconnue', 'Mise à jour Windows bloquée'],
    'Applications métier': ['WMS : erreur à la validation', 'WMS : bon de préparation introuvable', 'Logiciel de transport : export impossible', 'ERP : lenteurs', 'Portail fournisseurs inaccessible'],
    'Impression': ['Étiquettes ne s’impriment plus', 'File d’impression bloquée', 'Imprimante hors ligne', 'Bourrage papier récurrent', 'Impression en mauvais format'],
    'Réseau et Wi-Fi': ['Scanner de quai sans Wi-Fi', 'Wi-Fi instable sur le quai', 'Pas de réseau au bureau', 'VPN qui se déconnecte', 'Borne Wi-Fi hors service'],
    'Messagerie': ['Outlook demande le mot de passe en boucle', 'Boîte aux lettres pleine', 'Courriel non reçu', 'Teams : pas de son', 'Calendrier partagé non visible'],
    'Autres': ['Demande de renseignement', 'Téléphone fixe en panne', 'Badge d’accès', 'Commande de matériel', 'Question sur la charte informatique'],
}

MONTHS = {
    'sept': dict(
        start=datetime(2026, 9, 1), end=datetime(2026, 9, 30, 23, 59), first_id=46050,
        counts={'Accès et comptes': 412, 'Postes de travail': 388, 'Applications métier': 301, 'Impression': 236, 'Réseau et Wi-Fi': 198, 'Messagerie': 174, 'Autres': 137},
        means={'Accès et comptes': 2.1, 'Postes de travail': 7.4, 'Applications métier': 9.0, 'Impression': 9.8, 'Réseau et Wi-Fi': 11.4, 'Messagerie': 4.3, 'Autres': 6.2},
        stock=143, sla_ok=0.914, lyon_print=118, wifi_3=121, dirty=True,
    ),
    'aout': dict(
        start=datetime(2026, 8, 1), end=datetime(2026, 8, 31, 23, 59), first_id=44420,
        counts={'Accès et comptes': 398, 'Postes de travail': 371, 'Applications métier': 287, 'Impression': 128, 'Réseau et Wi-Fi': 141, 'Messagerie': 168, 'Autres': 119},
        means={'Accès et comptes': 2.2, 'Postes de travail': 7.1, 'Applications métier': 8.6, 'Impression': 5.9, 'Réseau et Wi-Fi': 9.7, 'Messagerie': 4.4, 'Autres': 6.0},
        stock=121, sla_ok=0.931, lyon_print=24, wifi_3=62, dirty=False,
    ),
}


def pick_site(cat, i, cfg, n_cat):
    if cat == 'Impression' and i < cfg['lyon_print']:
        return 'Lyon'
    if cat == 'Réseau et Wi-Fi' and i < cfg['wifi_3']:
        return ['Lyon', 'Rennes', 'Lille'][i % 3]
    pool = SITES
    w = SITE_W
    if cat in ('Impression', 'Réseau et Wi-Fi'):
        pool = [s for s in SITES if s not in (('Lyon',) if cat == 'Impression' else ('Lyon', 'Rennes', 'Lille'))]
        w = [SITE_W[SITES.index(s)] for s in pool]
    return random.choices(pool, w)[0]


def gen_month(key):
    cfg = MONTHS[key]
    start, end = cfg['start'], cfg['end']
    span_h = (end - start).total_seconds() / 3600
    total = sum(cfg['counts'].values())
    # Which tickets are still open at the end of the month (stock).
    open_idx = set(random.sample(range(total), cfg['stock']))
    tickets = []
    k = 0
    for cat, n in cfg['counts'].items():
        rows = []
        for i in range(n):
            rows.append({'cat': cat, 'site': pick_site(cat, i, cfg, n), 'open': k in open_idx})
            k += 1
        # Durations: log-normal, rescaled to the exact target mean over resolved tickets.
        res = [r for r in rows if not r['open']]
        raw = [random.lognormvariate(0, 1.0) for _ in res]
        f = cfg['means'][cat] / (sum(raw) / len(raw))
        for r, x in zip(res, raw):
            r['d'] = x * f
        tickets.extend(rows)
    resolved = [t for t in tickets if not t['open']]
    n_bad = len(resolved) - round(len(resolved) * cfg['sla_ok'])
    must = [t for t in resolved if t['d'] > 70]
    cand = [t for t in resolved if 4.5 < t['d'] <= 70]
    weights = [3 if t['cat'] in ('Impression', 'Réseau et Wi-Fi') else 1 for t in cand]
    chosen = set()
    for t in must:
        chosen.add(id(t))
    while len(chosen) < n_bad:
        t = random.choices(cand, weights)[0]
        chosen.add(id(t))
    for t in resolved:
        bad = id(t) in chosen
        d = t['d']
        if bad:
            opts = [p for p, hh in PRIO_H.items() if hh < d]
            t['prio'] = random.choice(opts[-2:]) if len(opts) > 1 else opts[0]
        else:
            opts = [p for p, hh in PRIO_H.items() if hh >= d]
            base = {'P1': 5, 'P2': 20, 'P3': 55, 'P4': 20}
            t['prio'] = random.choices(opts, [base[o] for o in opts])[0]
        t['sla'] = not bad
        # Creation date: the ticket must be resolved before the end of the month.
        lo = 0
        if t['cat'] == 'Impression' and t['site'] == 'Lyon' and key == 'sept':
            lo = 2 * 24 + 8  # after the driver update of 3 September
        hi = span_h - d - 0.5
        t['created'] = start + timedelta(hours=random.uniform(lo, max(lo + 1, hi)))
        t['resolved'] = t['created'] + timedelta(hours=d)
        t['fcr'] = 'Oui' if d < 1.2 and random.random() < 0.85 else 'Non'
    for t in tickets:
        if t['open']:
            t['prio'] = random.choices(['P2', 'P3', 'P4'], [20, 60, 20])[0]
            t['created'] = end - timedelta(hours=random.uniform(2, 24 * 9)) if random.random() < 0.8 else start + timedelta(hours=random.uniform(24, span_h - 200))
    # Working hours look: snap creation to 7h–19h when possible.
    for t in tickets:
        c = t['created']
        if c.hour < 7 or c.hour >= 19:
            shift = timedelta(hours=random.uniform(7.5, 18.5) - (c.hour + c.minute / 60))
            if not t['open'] and t['resolved'] + shift > end:
                continue
            t['created'] = c + shift
            if not t['open']:
                t['resolved'] = t['resolved'] + shift
    tickets.sort(key=lambda t: t['created'])
    rows = []
    for n, t in enumerate(tickets):
        cat = t['cat']
        label = cat
        if cfg['dirty']:
            # A few inconsistent labels, on purpose (lab 6.1: quality of data).
            r = random.random()
            if cat == 'Impression' and r < 0.06:
                label = 'impression'
            elif cat == 'Réseau et Wi-Fi' and r < 0.06:
                label = 'Réseau & Wi-Fi'
            elif cat == 'Accès et comptes' and r < 0.02:
                label = 'Accès et comptes '
        status = 'Résolu' if not t['open'] else random.choice(['Ouvert', 'Ouvert', 'En attente'])
        rows.append([
            cfg['first_id'] + n,
            t['created'].replace(second=0, microsecond=0),
            t['resolved'].replace(second=0, microsecond=0) if not t['open'] else None,
            status,
            label,
            t['prio'],
            t['site'],
            random.choice(CANAUX),
            t.get('fcr', '') if not t['open'] else '',
            random.choice(TECHS),
            f'UTILISATEUR_{random.randint(1000, 2399)}',
            random.choice(OBJETS[cat]),
        ])
    return rows


HEADER = ['N° ticket', 'Créé le', 'Résolu le', 'Statut', 'Catégorie', 'Priorité', 'Site', 'Canal', 'Résolu au premier contact', 'Technicien', 'Demandeur', 'Objet']
WIDTHS = [11, 17, 17, 11, 20, 9, 14, 11, 14, 12, 18, 40]


def write_export(key, rows):
    wb = Workbook()
    ws = sheet(wb, 'Tickets', HEADER, rows, WIDTHS, first=True)
    for row in ws.iter_rows(min_row=2, min_col=2, max_col=3):
        for c in row:
            c.number_format = 'dd/mm/yyyy hh:mm'
    wb.save(out(f'export-tickets-{key}.xlsx'))


# ─── 1. Exports de tickets (labs 6.1, 7.2, macro 7.3) ────────────────────────
sept = gen_month('sept')
aout = gen_month('aout')
write_export('sept', sept)
write_export('aout', aout)

# Exports par entrepôt (bonus macro du lab 7.3) : septembre, un fichier par site.
for site in ENTREPOTS:
    wb = Workbook()
    sub = [r for r in sept if r[6] == site]
    ws = sheet(wb, 'Tickets', HEADER, sub, WIDTHS, first=True)
    for row in ws.iter_rows(min_row=2, min_col=2, max_col=3):
        for c in row:
            c.number_format = 'dd/mm/yyyy hh:mm'
    wb.save(out('exports-entrepots', f'export-{slug(site)}-sept.xlsx'))


# Contrôle des chiffres clés
def check(rows, label):
    res = [r for r in rows if r[3] == 'Résolu']
    ok = sum(1 for r in res if (r[2] - r[1]).total_seconds() / 3600 <= PRIO_H[r[5]])
    print(f'{label}: {len(rows)} tickets, stock {len(rows) - len(res)}, SLA {100 * ok / len(res):.1f} %')
    cats = {}
    for r in res:
        c = r[4].strip().replace('&', 'et').capitalize() if r[4] != 'Réseau & Wi-Fi' else 'Réseau et Wi-Fi'
        c = {'Impression': 'Impression', 'Réseau et wi-fi': 'Réseau et Wi-Fi'}.get(c, c)
        cats.setdefault(c, []).append((r[2] - r[1]).total_seconds() / 3600)
    print('   ', {k: round(sum(v) / len(v), 2) for k, v in sorted(cats.items())})


check(sept, 'Septembre')
check(aout, 'Août')

# ─── 2. Référentiel du reporting (lab 7.2) ───────────────────────────────────
wb = Workbook()
sheet(wb, 'Délais par priorité', ['Priorité', 'Définition', 'Délai de résolution (heures calendaires)'], [
    ['P1', 'Site ou activité entière à l’arrêt', 4],
    ['P2', 'Plusieurs utilisateurs bloqués, pas de contournement', 8],
    ['P3', 'Un utilisateur gêné, contournement possible', 24],
    ['P4', 'Demande ou gêne mineure', 72],
], [10, 55, 22], first=True)
sheet(wb, 'Objectifs 2026', ['Indicateur', 'Objectif', 'Seuil d’alerte'], [
    ['Respect des SLA', '≥ 95 %', '< 90 %'],
    ['Délai moyen de résolution', '< 8 h', '> 10 h'],
    ['Résolution au premier contact', '≥ 40 %', '< 30 %'],
    ['Stock de fin de mois', '< 120 tickets', '> 150 tickets'],
], [34, 18, 18])
wb.save(out('Reporting', 'objectifs-SLA-2026.xlsx'))

d = new_doc('Définitions des indicateurs du support', 'Service IT d’Orvalis · référentiel en vigueur depuis janvier 2026')
for name, txt in [
    ('Volume', 'Nombre de tickets créés sur la période (date « Créé le »), tous statuts confondus, par catégorie et par site.'),
    ('Délai moyen de résolution', 'Moyenne de « Résolu le − Créé le », en heures calendaires, calculée sur les seuls tickets résolus de la période.'),
    ('Respect des SLA', 'Part des tickets résolus dont le délai est inférieur ou égal au délai prévu pour leur priorité (P1 4 h, P2 8 h, P3 24 h, P4 72 h).'),
    ('Résolution au premier contact', 'Part des tickets résolus marqués « Oui » dans la colonne « Résolu au premier contact ».'),
    ('Stock', 'Tickets au statut « Ouvert » ou « En attente » à la fin de la période, avec leur ancienneté.'),
]:
    h(d, name, 2)
    para(d, txt)
h(d, 'Règles de calcul', 2)
bullets(d, [
    'Les libellés de catégorie sont harmonisés avant calcul (casse, espaces, « & » / « et »).',
    'Une catégorie compte pour un ticket, même si son objet en évoque plusieurs.',
    'Les pourcentages sont arrondis à une décimale, les délais à une décimale.',
])
d.save(out('Reporting', 'definitions-indicateurs.docx'))

d = new_doc('Modèle de reporting mensuel du support', 'À compléter chaque mois · une page maximum')
for s, t in [
    ('1. Les chiffres du mois', 'Volume, délai moyen, respect des SLA, résolution au premier contact, stock. Pour chacun : valeur, objectif, évolution par rapport au mois précédent.'),
    ('2. Les trois faits marquants', 'Les trois plus forts écarts, chacun avec son chiffre et une hypothèse d’explication à vérifier.'),
    ('3. Les actions en cours', 'Ce qui est fait pour corriger les écarts : action, responsable, échéance.'),
    ('4. Le point d’attention pour la direction', 'Une phrase, sans jargon : ce que la direction doit savoir ou décider.'),
]:
    h(d, s, 2)
    para(d, t)
d.save(out('Reporting', 'modele-reporting.docx'))

# ─── 3. Journal de l'incident FS-02 (atelier 1, labs 2.1 et 6.2) ─────────────
d = new_doc('Journal d’incident · INC-2026-1012-01 · Serveur de fichiers FS-02', 'Rédigé par l’équipe exploitation · version du 12 octobre 2026, 17:20 · diffusion interne')
h(d, 'Résumé')
table(d, ['Rubrique', 'Valeur'], [
    ['Service touché', 'Partages de fichiers des entrepôts (\\\\FS-02\\quais, \\\\FS-02\\preparation)'],
    ['Début de l’impact', 'Lundi 12 octobre 2026, 7:52'],
    ['Fin de l’impact', 'Lundi 12 octobre 2026, 10:31'],
    ['Durée', '2 h 39'],
    ['Utilisateurs bloqués', '340 (préparateurs, chefs de quai, administratifs des entrepôts)'],
    ['Sites concernés', 'Lyon, Rennes, Lille, Nantes et Orléans (les quatre autres sites utilisent FS-03)'],
    ['Priorité', 'P1'],
])
h(d, 'Chronologie')
table(d, ['Date et heure', 'Événement', 'Source'], [
    ['Ven. 2 oct. 21:30', 'Mise à jour de l’agent de sauvegarde en version 12 sur FS-01 à FS-04 (changement CHG-0931). Après la mise à jour, l’option « purge automatique des journaux » est désactivée par défaut.', 'Fiche de changement'],
    ['Sam. 10 oct. 14:05', 'Alerte supervision : volume D: de FS-02 à 90 %. Alerte envoyée à la boîte supervision@orvalis.example, non lue le week-end.', 'Supervision'],
    ['Dim. 11 oct. 23:10', 'Alerte supervision : volume D: de FS-02 à 98 %. Même destinataire, non acquittée.', 'Supervision'],
    ['Lun. 12 oct. 7:52', 'Volume D: plein (0 octet libre). Écritures refusées sur les partages.', 'Journal système FS-02'],
    ['7:58', 'Premiers appels au support (quai 3 de Lyon, puis Rennes). 27 appels entre 7:58 et 8:30.', 'Outil de ticketing'],
    ['8:05', 'Message d’information envoyé aux entrepôts par Inès (support). Retour visé : 10:30. Urgences : poste 4400.', 'Messagerie'],
    ['8:20', 'Thomas (exploitation) identifie le dossier D:\\Backup\\Logs : 180 Go de journaux de l’agent de sauvegarde.', 'Exploitation'],
    ['8:45', 'Décision : purge manuelle des journaux de plus de 30 jours, après snapshot du volume.', 'Cellule de crise'],
    ['9:30', 'Point d’étape sur le canal Teams « Incidents ».', 'Teams'],
    ['9:40', 'Purge manuelle réalisée par Malik (administrateur). 162 Go libérés.', 'Administration'],
    ['10:31', 'Service rétabli, partages accessibles en écriture. Message de fin d’incident envoyé à 10:40.', 'Supervision'],
])
h(d, 'Impact métier')
bullets(d, [
    '1 140 bons de préparation ouverts en retard sur les cinq sites.',
    'Trois départs de camions décalés : deux à Lyon (35 et 50 minutes), un à Rennes (40 minutes).',
    'Les quais ont travaillé sur les bons imprimés la veille pendant l’incident.',
    'Aucune perte de données constatée.',
])
h(d, 'Actions immédiates et suites')
bullets(d, [
    'Réactivation de la purge automatique (conservation 30 jours) sur FS-01 à FS-04 : fait le 12 octobre à 14:00.',
    'Extension du volume D: de FS-02 : à étudier (Malik).',
    'Revue des destinataires des alertes de supervision le week-end : à faire (Thomas).',
    'Post-mortem sans blâme : à rédiger (lab 6.2).',
])
d.save(out('journal-incident-FS02.docx'))

# ─── 4. Alertes de supervision (lab 6.2, démo « croiser 3 sources ») ─────────
alerts = []
base = datetime(2026, 9, 1)
for day in range(0, 42):
    dte = base + timedelta(days=day)
    for site in ENTREPOTS:
        rate = 0.55 if site in ('Lyon', 'Rennes', 'Lille') else 0.25
        if random.random() < rate:
            ts = dte + timedelta(hours=random.uniform(5, 22))
            alerts.append([ts, f'AP-{site[:3].upper()}-{random.randint(1, 14):02d}', site, 'Borne Wi-Fi injoignable', random.choice(['Mineure', 'Majeure']), '', 'reseau@orvalis.example', random.choice(['Oui', 'Oui', 'Non'])])
    if random.random() < 0.3:
        srv = random.choice(['APP-04', 'FS-01', 'FS-03', 'PRT-01', 'SQL-02'])
        alerts.append([dte + timedelta(hours=random.uniform(0, 24)), srv, 'Siège (Paris)', random.choice(['CPU > 90 %', 'Mémoire > 85 %', 'Sauvegarde en échec']), 'Mineure', '', 'supervision@orvalis.example', 'Oui'])
for ts, sev, val in [(datetime(2026, 10, 10, 14, 5), 'Majeure', '90 %'), (datetime(2026, 10, 11, 23, 10), 'Critique', '98 %'), (datetime(2026, 10, 12, 7, 52), 'Critique', '100 %')]:
    alerts.append([ts, 'FS-02', 'Siège (Paris)', 'Espace disque D:', sev, val, 'supervision@orvalis.example', 'Non'])
for ts, val in [(datetime(2026, 10, 3, 4, 10), '82 %'), (datetime(2026, 10, 7, 4, 10), '86 %')]:
    alerts.append([ts, 'FS-02', 'Siège (Paris)', 'Espace disque D:', 'Avertissement', val, 'supervision@orvalis.example', 'Non'])
alerts.sort(key=lambda a: a[0])
with open(out('alertes-supervision.csv'), 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f, delimiter=';')
    w.writerow(['horodatage', 'equipement', 'site', 'type', 'severite', 'valeur', 'destinataire', 'acquittee'])
    for a in alerts:
        w.writerow([a[0].strftime('%d/%m/%Y %H:%M')] + a[1:])

# ─── 5. Contrats prestataires (démo « croiser 3 sources ») ──────────────────
wb = Workbook()
rows = []
for s in ENTREPOTS:
    if s in ('Lyon', 'Rennes', 'Lille'):
        rows.append([s, 'Wi-Fi et réseau local', 'NetQuai Services', '01/01/2024', '31/12/2026', '8 h ouvrées', 'Non'])
    else:
        rows.append([s, 'Wi-Fi et réseau local', 'Aerolink Réseaux', '01/07/2025', '30/06/2028', '4 h ouvrées', 'Oui'])
rows.append(['Siège (Paris)', 'Impression', 'PrintLog Solutions', '01/03/2023', '28/02/2027', '1 jour ouvré', 'Oui'])
sheet(wb, 'Contrats', ['Site', 'Périmètre', 'Prestataire (fictif)', 'Début', 'Échéance', 'Délai d’intervention', 'Pénalités prévues'], rows, [16, 22, 22, 12, 12, 18, 16], first=True)
wb.save(out('contrats-prestataires.xlsx'))

# ─── 6. Tickets récurrents (lab 2.2) ─────────────────────────────────────────
rec = [
    ('Accès dossier partagé', 'Lyon', 'Bonjour, depuis ce matin je n’arrive plus à ouvrir le dossier Préparation sur le réseau, il me dit accès refusé. Merci'),
    ('Accès dossier partagé', 'Rennes', 'Je ne vois plus le lecteur P: sur mon PC, c’est urgent je dois imprimer les bons'),
    ('Accès dossier partagé', 'Siège (Paris)', 'Je viens de changer de service (achats → transport), je n’ai pas accès au dossier Transport'),
    ('Accès dossier partagé', 'Lille', 'Le dossier Quais s’ouvre mais je ne peux rien enregistrer dedans'),
    ('Accès dossier partagé', 'Nantes', 'Nouvelle arrivante, je n’ai accès à aucun dossier partagé'),
    ('Accès dossier partagé', 'Orléans', 'Message « Le chemin d’accès réseau est introuvable » quand je clique sur le raccourci'),
    ('Accès dossier partagé', 'Lyon', 'Plus d’accès au dossier depuis que je suis en télétravail'),
    ('Accès dossier partagé', 'Bordeaux', 'Mon collègue a accès au dossier Inventaire et pas moi, on a le même poste'),
    ('Accès dossier partagé', 'Marseille', 'Accès refusé sur \\\\FS-03\\inventaire depuis lundi'),
    ('Accès dossier partagé', 'Toulouse', 'Je retrouve plus le dossier partagé de l’équipe, il a été supprimé ?'),
    ('Accès dossier partagé', 'Strasbourg', 'Le dossier partagé est très lent et parfois inaccessible l’après-midi'),
    ('Accès dossier partagé', 'Rennes', 'Après la réinitialisation de mon mot de passe je n’ai plus accès à rien sur le réseau'),
    ('Nouveau téléphone', 'Lyon', 'J’ai changé de téléphone, je ne reçois plus la notification pour me connecter'),
    ('Nouveau téléphone', 'Siège (Paris)', 'Téléphone volé hier soir, je ne peux plus valider mes connexions'),
    ('Nouveau téléphone', 'Lille', 'L’application d’authentification me demande un code que je n’ai pas'),
    ('Nouveau téléphone', 'Nantes', 'Nouveau téléphone pro, comment je transfère l’authentification ?'),
    ('Nouveau téléphone', 'Bordeaux', 'Je reçois les notifications mais quand je valide ça ne marche pas'),
    ('Nouveau téléphone', 'Marseille', 'J’ai réinitialisé mon téléphone et tout est perdu'),
    ('Nouveau téléphone', 'Rennes', 'Pas de réseau sur le quai, je ne reçois pas la notification à temps'),
    ('Nouveau téléphone', 'Orléans', 'Mon numéro a changé, les SMS de vérification arrivent sur l’ancien'),
]
rows = []
for i, (cat, site, msg) in enumerate(rec):
    rows.append([48300 + i * 7, (datetime(2026, 10, 5) + timedelta(hours=7 + i * 5.3)).strftime('%d/%m/%Y %H:%M'), site, cat, f'UTILISATEUR_{1100 + i * 37}', msg, ''])
sheet(wb := Workbook(), 'Tickets récurrents', ['N° ticket', 'Créé le', 'Site', 'Type de demande', 'Demandeur', 'Message de l’utilisateur', 'Réponse envoyée'], rows, [11, 17, 14, 22, 18, 80, 40], first=True)
for c in wb.active['F']:
    c.alignment = Alignment(wrap_text=True, vertical='top')
wb.save(out('tickets-recurrents.xlsx'))

# ─── 7. Tickets résolus avec notes de technicien (lab 3.2) ───────────────────
res = [
    (48213, 'Lyon', 'Impression', 'L’imprimante d’étiquettes de Lyon n’imprime plus rien',
     '08:12 appel de Mme Garcia, quai 3, file bloquée\n08:20 ping ok, page de test ok depuis l’imprimante\n08:31 file PRT-01 : 214 travaux en erreur\n08:35 pilote mis à jour hier soir (KB auto)\n08:41 retour pilote v5.2 → OK\n08:45 purge file, impression reprise\nà faire : bloquer MAJ auto pilote sur PRT-01'),
    (48227, 'Rennes', 'Réseau et Wi-Fi', 'Le scanner du quai 5 ne se connecte plus au Wi-Fi',
     '10:02 appel M. Lefèvre (06 12 34 56 78), scanner SC-RE-17 « réseau introuvable »\n10:10 autres scanners du quai ok → pas la borne\n10:18 certificat Wi-Fi du scanner expiré le 30/09\n10:25 renouvellement certificat via console MDM\n10:31 scanner reconnecté\nvérifier date d’expiration des 40 autres scanners de Rennes'),
    (48241, 'Siège (Paris)', 'Messagerie', 'Outlook demande le mot de passe en boucle',
     '14:05 Mme Dubois, comptabilité, fenêtre mot de passe toutes les 2 min\n14:12 mot de passe ok sur le web → problème local\n14:20 identifiants enregistrés dans le gestionnaire Windows obsolètes\n14:24 suppression des identifiants Office dans le gestionnaire\n14:27 reconnexion Outlook ok\ncause : changement de mot de passe vendredi, ancien jeton conservé'),
    (48255, 'Nantes', 'Messagerie', 'Pas de son dans Teams pendant les réunions',
     '09:40 appel J. Martin (poste 2210), entend rien en réunion, son ok sur YouTube\n09:46 périphérique audio Teams = écran HDMI (pas de haut-parleur)\n09:48 bascule sur casque USB → ok\n09:50 désactivé « suivre la sortie par défaut de Windows »\nastuce : vérifier les paramètres de périphériques Teams avant tout'),
    (48262, 'Lille', 'Accès et comptes', 'Accès refusé à l’application de gestion d’entrepôt',
     '11:15 A. Benali, chef d’équipe, « accès refusé » sur le WMS depuis son changement de site\n11:20 compte toujours rattaché au groupe WMS-ORLEANS\n11:28 ajout au groupe WMS-LILLE, retrait ancien groupe (demande validée par manager)\n11:40 déconnexion / reconnexion → ok\nprocédure mutation : penser aux groupes applicatifs'),
    (48270, 'Bordeaux', 'Postes de travail', 'Écran noir au démarrage du PC portable',
     '16:02 appel M. Petit, écran noir après logo constructeur\n16:08 écran externe ok → pas la carte graphique\n16:15 luminosité à 0 après mise à jour pilote écran\n16:17 Fn + touche luminosité → image revenue\n16:20 pilote écran réinstallé version précédente\nconsigner dans la base : très fréquent sur ce modèle'),
]
rows = [[n, site, cat, titre, notes, 'Résolu', f'UTILISATEUR_{1500 + i * 11}'] for i, (n, site, cat, titre, notes) in enumerate(res)]
wb = Workbook()
sheet(wb, 'Tickets résolus', ['N° ticket', 'Site', 'Catégorie', 'Titre', 'Notes du technicien', 'Statut', 'Demandeur'], rows, [11, 14, 18, 48, 90, 10, 18], first=True)
for row in wb.active.iter_rows(min_row=2):
    for c in row:
        c.alignment = Alignment(wrap_text=True, vertical='top')
wb.save(out('tickets-resolus.xlsx'))

# ─── 8. Procédure générée par l'IA, piégée (atelier 4) ──────────────────────
d = new_doc('Procédure : purge des journaux de sauvegarde sur FS-02', 'Document généré par un assistant IA · à valider avant publication')
h(d, 'Objet', 2)
para(d, 'Libérer de l’espace sur le volume D: du serveur FS-02 en supprimant les journaux de l’agent de sauvegarde, afin d’éviter une nouvelle saturation du disque.')
h(d, 'Prérequis', 2)
bullets(d, ['Accès au serveur FS-02 en bureau à distance.', 'PowerShell 5.1 ou supérieur.'])
h(d, 'Étapes', 2)
bullets(d, [
    'Se connecter à FS-02 avec le compte administrateur du domaine.',
    'Arrêter le service de l’agent de sauvegarde.',
    'Exécuter la commande suivante : Remove-Item D:\\Backup\\Logs\\* -Recurse -Force',
    'Redémarrer le serveur pour libérer l’espace.',
    'Vérifier que l’espace libre dépasse 5 %.',
    'Aucun retour arrière nécessaire : les journaux ne servent à rien.',
    'Prévenir l’équipe sur le canal Teams « Général » en indiquant le mot de passe du compte de service svc-backup, pour les prochaines interventions.',
], style='List Number')
h(d, 'Fréquence', 2)
para(d, 'À réaliser chaque mois, ou dès que la supervision signale un espace disque faible.')
d.save(out('procedure-purge-IA.docx'))

# ─── 9. Base de connaissances (lab 7.1) ─────────────────────────────────────
KB = [
    ('KB-0101', 'Les étiquettes ne s’impriment plus après une mise à jour', 'Rien ne sort de l’imprimante d’étiquettes ; l’imprimante répond et imprime sa page de test.', 'Le pilote de l’imprimante a été mis à jour automatiquement sur le serveur d’impression et n’est pas compatible.', ['Imprimez la page de test depuis l’imprimante elle-même.', 'Si elle sort, le problème vient de la file d’impression : ouvrez un ticket « Impression · file bloquée ».', 'Le support remet le pilote 5.2 et purge la file.'], 'Les mises à jour automatiques des pilotes sont bloquées sur PRT-01.', 'étiquettes, imprimante, quai, file bloquée'),
    ('KB-0102', 'Je n’ai plus accès au dossier partagé', 'Message « accès refusé » ou lecteur réseau absent.', 'Changement de service, de site ou mot de passe récemment réinitialisé.', ['Redémarrez votre poste connecté au réseau de l’entreprise (ou au VPN).', 'Si le lecteur n’apparaît toujours pas, notez le nom exact du dossier.', 'Ouvrez un ticket « Accès dossier partagé » : votre responsable devra valider la demande.'], 'Lors d’une mutation, le manager demande les accès en même temps que le changement de service.', 'dossier partagé, lecteur réseau, accès refusé'),
    ('KB-0103', 'Nouveau téléphone : je ne reçois plus la notification d’authentification', 'Impossible de valider la connexion depuis le nouveau téléphone.', 'L’application d’authentification est liée à l’ancien téléphone.', ['Ne réinstallez pas l’ancien téléphone.', 'Appelez le 4400 depuis votre poste fixe : le support vérifie votre identité.', 'Le support réinitialise votre méthode d’authentification ; enregistrez le nouveau téléphone en suivant le lien reçu.'], 'Avant de changer de téléphone, ajoutez le nouveau comme méthode d’authentification.', 'téléphone, authentification, notification, MFA'),
    ('KB-0104', 'Se connecter au VPN depuis un portable Windows 11', 'Pas d’accès aux applications internes hors des locaux.', 'Le VPN n’est pas connecté.', ['Cliquez sur l’icône réseau en bas à droite.', 'Choisissez « VPN Orvalis », puis « Se connecter ».', 'Validez la notification d’authentification sur votre téléphone.'], 'Le VPN se déconnecte après 12 heures : reconnectez-vous chaque matin.', 'VPN, télétravail, connexion à distance'),
    ('KB-0105', 'Mot de passe expiré : le réinitialiser en libre-service', 'Message « votre mot de passe a expiré ».', 'Les mots de passe expirent tous les 180 jours.', ['Depuis le portail de connexion, cliquez sur « Mot de passe oublié ».', 'Validez votre identité avec la notification d’authentification.', 'Choisissez un nouveau mot de passe de 14 caractères minimum.'], 'Le support ne vous demandera jamais votre mot de passe.', 'mot de passe, expiré, libre-service'),
    ('KB-0106', 'Le scanner de quai ne se connecte plus au Wi-Fi', 'Le scanner affiche « réseau introuvable » alors que les autres fonctionnent.', 'Le certificat Wi-Fi du scanner a expiré.', ['Notez le numéro du scanner (étiquette au dos).', 'Ouvrez un ticket « Réseau et Wi-Fi » avec ce numéro.', 'En attendant, utilisez un scanner de remplacement du rack.'], 'Les certificats sont renouvelés automatiquement 30 jours avant leur expiration.', 'scanner, Wi-Fi, quai, certificat'),
    ('KB-0107', 'Teams : pas de son pendant les réunions', 'Les participants ne sont pas entendus ; le son fonctionne ailleurs.', 'Teams utilise un autre périphérique audio (écran, station d’accueil).', ['Dans Teams, ouvrez Paramètres, puis Périphériques.', 'Choisissez votre casque comme haut-parleur et micro.', 'Faites un appel de test.'], 'Branchez le casque avant de rejoindre la réunion.', 'Teams, son, audio, casque'),
    ('KB-0108', 'Outlook demande le mot de passe en boucle', 'Une fenêtre de mot de passe réapparaît toutes les deux minutes.', 'Des identifiants anciens restent enregistrés sur le poste après un changement de mot de passe.', ['Fermez Outlook.', 'Ouvrez le Gestionnaire d’identification Windows et supprimez les entrées « Microsoft Office ».', 'Relancez Outlook et reconnectez-vous.'], 'Après un changement de mot de passe, redémarrez le poste.', 'Outlook, mot de passe, boucle, identifiants'),
]
for ref, titre, symp, cause, sol, prev, kw in KB:
    d = new_doc(titre, f'{ref} · Base de connaissances IT d’Orvalis · pour tous les salariés')
    h(d, 'Symptôme', 2)
    para(d, symp)
    h(d, 'Cause', 2)
    para(d, cause)
    h(d, 'Solution', 2)
    bullets(d, sol, style='List Number')
    h(d, 'Prévention', 2)
    para(d, prev)
    h(d, 'Besoin d’aide ?', 2)
    para(d, 'Support informatique : poste 4400, ou un ticket sur le portail. Le support ne demande jamais votre mot de passe.')
    p = d.add_paragraph()
    p.add_run('Mots-clés : ').bold = True
    p.add_run(kw)
    d.save(out('base-connaissances', f'{ref}-{slug(titre)}.docx'))

# ─── 10. Dossier de changement PRT-01 (démos M1 et M3) ──────────────────────
d = new_doc('Dossier de changement CHG-1004 · Migration du serveur d’impression PRT-01', 'Préparé par Malik (administration) pour le comité de changement du jeudi 15 octobre 2026')
h(d, 'Description', 2)
para(d, 'Remplacer le serveur d’impression PRT-01 (Windows Server 2016, 2017) par un nouveau serveur PRT-02 sous Windows Server 2022, et migrer les 212 files d’impression des neuf entrepôts et du siège.')
h(d, 'Justification', 2)
bullets(d, [
    'Tickets « Impression » : 128 en août, 236 en septembre (+84 %), dont 118 à Lyon.',
    'Mises à jour automatiques de pilotes incompatibles (incident du 3 septembre, ticket 48213 du 12 octobre).',
    'Disque système de PRT-01 à 12 % d’espace libre.',
])
h(d, 'Impacts', 2)
bullets(d, ['Coupure de 15 minutes par site lors de la bascule.', 'Reconfiguration automatique des postes par stratégie de groupe.', 'Imprimantes d’étiquettes à tester une par une sur chaque quai.'])
h(d, 'Planning proposé', 2)
table(d, ['Étape', 'Période'], [['Inventaire des pilotes par site', 'Semaine 45'], ['Installation de PRT-02', 'Semaines 45 – 46'], ['Pilote à l’entrepôt de Lyon', 'Semaine 46'], ['Bascule des huit autres entrepôts', 'Semaine 47'], ['Arrêt de PRT-01', 'Fin semaine 47']])
h(d, 'Plan de retour arrière', 2)
para(d, 'PRT-01 reste allumé jusqu’à la fin de la semaine 47. En cas d’échec sur un site, la stratégie de groupe de ce site est remise sur PRT-01 (10 minutes).')
h(d, 'Communication', 2)
para(d, 'Message aux chefs d’entrepôt une semaine avant (Inès), rappel la veille de la bascule de chaque site.')
d.save(out('dossier-migration-PRT01.docx'))

# ─── 11. Liste de serveurs de test (lab 7.3) ────────────────────────────────
with open(out('serveurs-test.txt'), 'w', encoding='utf-8', newline='\n') as f:
    f.write('localhost\n')

print('OK ->', ROOT)
