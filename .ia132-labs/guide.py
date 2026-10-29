"""Construit le guide PDF des ateliers IA132 (HTML → PDF avec Chrome, voir render.mjs).

    PYTHONPATH=<scratch>/pylibs python .ia132-labs/guide.py     (bibliothèque « markdown »)
    node .ia132-labs/render.mjs

Source unique : les README.md des labs (ia132-labs/labs/*/README.md). Le guide reprend leurs
sections Objectif, Point de départ, Étapes, Livrable, Pièges et Bonus.
"""

import base64
import html
import re
from pathlib import Path

import markdown

ICI = Path(__file__).resolve().parent
RACINE = ICI.parent
DEPOT = RACINE / "labs" / "ia-developpeurs-code-assiste" / "ia132-labs"
SORTIE = ICI / "html" / "guide.html"
REPO = "github.com/houssemeddinelassoued/ia132-labs"

# Moment de chaque lab dans les 2 jours (repère pour le participant).
PLANNING = {
    "lab00": ("Jour 1", "9 h 20"),
    "lab01": ("Jour 1", "10 h 05"),
    "lab02": ("Jour 1", "11 h 25"),
    "lab03": ("Jour 1", "13 h 00"),
    "lab04": ("Jour 1", "13 h 55"),
    "lab05": ("Jour 1", "14 h 55"),
    "lab06": ("Jour 2", "9 h 25"),
    "lab07": ("Jour 2", "10 h 00"),
    "lab08": ("Jour 2", "11 h 05"),
    "lab09": ("Jour 2", "11 h 40"),
    "lab10": ("Jour 2", "13 h 40"),
    "lab11": ("Jour 2", "14 h 30"),
}
TON_MODULE = {"Ouverture": "grey", "1": "blue", "2": "teal", "3": "coral", "4": "violet", "5": "green", "6": "yellow", "7": "blue"}

md = markdown.Markdown(extensions=["pymdownx.superfences", "tables", "sane_lists"])


def rendre(texte: str) -> str:
    # Les README indentent le contenu des listes de 3 espaces (CommonMark) ; Python-Markdown en veut 4.
    texte = re.sub(r"^   (?=\S)", "    ", texte.strip(), flags=re.M)
    # Python-Markdown veut une ligne vide avant une citation et avant un nouvel élément de liste.
    lignes: list[str] = []
    for ligne in texte.split("\n"):
        prec = lignes[-1] if lignes else ""
        cite, cite_prec = ligne.lstrip().startswith(">"), prec.lstrip().startswith(">")
        item = re.match(r"(\d+\.|-) ", ligne) is not None
        if prec.strip() and ((cite and not cite_prec) or (cite_prec and not cite) or (item and not re.match(r"(\d+\.|-) ", prec))):
            lignes.append("")
        lignes.append(ligne)
    texte = "\n".join(lignes)
    md.reset()
    h = md.convert(texte)
    return h.replace("<li>", '<li><span class="sq"></span><div>').replace("</li>", "</div></li>")


def coches(h: str) -> str:
    return h.replace('<li><span class="sq"></span>', '<li><span class="box"></span>')


def lire_lab(dossier: Path) -> dict:
    src = (dossier / "README.md").read_text(encoding="utf-8")
    titre = re.search(r"^# Lab \d+ · (.+)$", src, re.M).group(1)
    ligne = re.search(r"^\| (?!Module|---)(.+) \| (.+) \| (.+) \|$", src, re.M)
    module, duree, langages = (x.strip() for x in ligne.groups())
    sections = dict(re.findall(r"^## (.+?)\n(.*?)(?=^## |\Z)", src, re.M | re.S))
    num = dossier.name[3:5]
    return {
        "id": dossier.name,
        "num": num,
        "titre": titre,
        "module": module,
        "mod_num": module.split(" ")[0] if module[0].isdigit() else "Ouverture",
        "duree": duree,
        "langages": langages,
        "sections": {k.split(" (")[0].strip(): v for k, v in sections.items()},
    }


def page_lab(lab: dict) -> str:
    s = lab["sections"]
    jour, heure = PLANNING[f"lab{lab['num']}"]
    ton = TON_MODULE[lab["mod_num"]]
    bloc = lambda cle: rendre(s[cle]) if cle in s else ""  # noqa: E731
    etapes = next((v for k, v in s.items() if k.startswith("Étapes")), "")
    return f"""
<section class="lab" id="lab{lab['num']}">
  <header class="lh">
    <div class="lnum"><span>LAB</span><b>{lab['num']}</b></div>
    <div class="lt">
      <div class="eyebrow t-{ton}">{html.escape(lab['module'])}</div>
      <h2>{html.escape(lab['titre'])}</h2>
      <div class="chips">
        <span class="chip">⏱ {html.escape(lab['duree'])}</span>
        <span class="chip">{html.escape(jour)} · vers {heure}</span>
        <span class="chip">{html.escape(lab['langages'])}</span>
        <span class="chip mono">labs/{lab['id']}/</span>
      </div>
    </div>
  </header>
  <div class="obj"><div class="cap">Objectif</div>{bloc('Objectif')}</div>
  <h3>Point de départ</h3>{bloc('Point de départ')}
  <h3>Étapes</h3><div class="steps">{rendre(etapes)}</div>
  <div class="duo">
    <div class="liv"><div class="cap">Livrable · c’est terminé quand…</div>{coches(bloc('Livrable'))}</div>
    <div class="col">
      <div class="trap"><div class="cap">Pièges à observer</div>{bloc('Pièges à observer')}</div>
      {f'<div class="bonus"><div class="cap">Bonus</div>{bloc("Bonus")}</div>' if 'Bonus' in s else ''}
      {f'<div class="help"><div class="cap">Coincé ?</div>{bloc("Coincé ?")}</div>' if 'Coincé ?' in s else ''}
    </div>
  </div>
  <div class="notes"><div class="cap">Mes notes</div></div>
</section>"""


def ligne_vue(lab: dict) -> str:
    jour, heure = PLANNING[f"lab{lab['num']}"]
    obj = re.sub(r"\*\*|`", "", lab["sections"]["Objectif"].strip())
    ton = TON_MODULE[lab["mod_num"]]
    return (
        f"<tr><td><b class='n t-{ton}'>{lab['num']}</b></td><td><b>{html.escape(lab['titre'])}</b>"
        f"<div class='o'>{html.escape(obj)}</div></td><td>{html.escape(lab['module'])}</td>"
        f"<td class='nw'>{jour}<br>{heure}</td><td class='nw'>{html.escape(lab['duree'])}</td></tr>"
    )


def main() -> None:
    labs = [lire_lab(d) for d in sorted((DEPOT / "labs").iterdir()) if (d / "README.md").exists()]
    logo = base64.b64encode((RACINE / "assets" / "technologia" / "logo-horizontal.png").read_bytes()).decode()
    css = (ICI / "guide.css").read_text(encoding="utf-8")
    corps = (ICI / "guide-intro.html").read_text(encoding="utf-8")
    corps = corps.replace("{{LOGO}}", f"data:image/png;base64,{logo}").replace("{{REPO}}", REPO)
    corps = corps.replace("{{VUE}}", "\n".join(ligne_vue(lab) for lab in labs))
    corps = corps.replace("{{LABS}}", "\n".join(page_lab(lab) for lab in labs))
    corps = corps.replace("{{ANNEXES}}", (ICI / "guide-annexes.html").read_text(encoding="utf-8"))
    SORTIE.parent.mkdir(exist_ok=True)
    SORTIE.write_text(
        "<!doctype html><html lang='fr'><head><meta charset='utf-8'><title>Guide des ateliers · IA132</title>"
        "<link href='https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400"
        "&family=Barlow+Condensed:wght@600;700&family=JetBrains+Mono:wght@400;600&display=swap' rel='stylesheet'>"
        f"<style>{css}</style></head><body>{corps}</body></html>",
        encoding="utf-8",
    )
    print(f"{SORTIE.relative_to(RACINE)} : {len(labs)} labs")


if __name__ == "__main__":
    main()
