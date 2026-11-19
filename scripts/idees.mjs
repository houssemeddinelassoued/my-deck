#!/usr/bin/env node
// Petit gestionnaire des idées d'amélioration de la plateforme.
// Source de vérité : docs/idees-plateforme/idees.json
// Vue lisible regénérée à chaque modification : docs/idees-plateforme/TABLEAU.md
//
//   node scripts/idees.mjs list [--statut idee] [--cat presentation] [--prio haute]
//   node scripts/idees.mjs show IDEE-003
//   node scripts/idees.mjs add "Titre" [--cat presentation] [--prio moyenne] [--effort M] [--desc "…"]
//   node scripts/idees.mjs statut IDEE-003 en-cours
//   node scripts/idees.mjs set IDEE-003 prio=haute effort=S
//   node scripts/idees.mjs note IDEE-003 "Texte de la note"
//   node scripts/idees.mjs piste IDEE-003 "Piste technique"
//   node scripts/idees.mjs render
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'idees-plateforme');
const DATA = join(DIR, 'idees.json');
const BOARD = join(DIR, 'TABLEAU.md');

const PRIOS = ['haute', 'moyenne', 'basse'];
const EFFORTS = ['S', 'M', 'L'];
const LIBELLES = {
  idee: '💡 Idée',
  'a-etudier': '🔍 À étudier',
  planifie: '📅 Planifié',
  'en-cours': '🛠️ En cours',
  fait: '✅ Fait',
  abandonne: '🗑️ Abandonné',
};

const today = () => new Date().toISOString().slice(0, 10);
const load = () => JSON.parse(readFileSync(DATA, 'utf8'));
const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

function parseFlags(args) {
  const pos = [];
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) flags[args[i].slice(2)] = args[++i];
    else pos.push(args[i]);
  }
  return { pos, flags };
}

function find(db, id) {
  const idee = db.idees.find((x) => x.id.toLowerCase() === String(id ?? '').toLowerCase());
  if (!idee) die(`Idée introuvable : ${id}`);
  return idee;
}

function check(db, field, value) {
  const allowed = { statut: db.statuts, categorie: Object.keys(db.categories), priorite: PRIOS, effort: EFFORTS }[field];
  if (allowed && !allowed.includes(value)) die(`${field} invalide : ${value} (attendu : ${allowed.join(', ')})`);
}

function render(db) {
  const prioRank = (p) => PRIOS.indexOf(p);
  const out = [
    '# Idées d’amélioration de la plateforme',
    '',
    `> Fichier généré par \`node scripts/idees.mjs\`, ne pas l'éditer à la main. Source : \`idees.json\`. Mis à jour le ${today()}.`,
    '',
    '| ID | Idée | Catégorie | Statut | Prio | Effort |',
    '|---|---|---|---|---|---|',
  ];
  const sorted = [...db.idees].sort(
    (a, b) => db.statuts.indexOf(a.statut) - db.statuts.indexOf(b.statut) || prioRank(a.priorite) - prioRank(b.priorite),
  );
  for (const i of sorted)
    out.push(`| ${i.id} | ${i.titre} | ${i.categorie} | ${LIBELLES[i.statut] ?? i.statut} | ${i.priorite} | ${i.effort} |`);
  for (const statut of db.statuts) {
    const items = sorted.filter((i) => i.statut === statut);
    if (!items.length) continue;
    out.push('', `## ${LIBELLES[statut] ?? statut}`);
    for (const i of items) {
      out.push('', `### ${i.id} · ${i.titre}`, '', `*${db.categories[i.categorie] ?? i.categorie}* · priorité **${i.priorite}** · effort **${i.effort}** · créée le ${i.creee}`, '', i.description);
      if (i.pistes?.length) out.push('', '**Pistes techniques**', '', ...i.pistes.map((p) => `- ${p}`));
      if (i.notes?.length) out.push('', '**Journal**', '', ...i.notes.map((n) => `- ${n.date} : ${n.texte}`));
    }
  }
  writeFileSync(BOARD, out.join('\n') + '\n');
}

function save(db) {
  writeFileSync(DATA, JSON.stringify(db, null, 2) + '\n');
  render(db);
}

function line(i) {
  return `${i.id.padEnd(9)} ${(LIBELLES[i.statut] ?? i.statut).padEnd(13)} ${i.priorite.padEnd(8)} ${i.effort}  ${i.titre}`;
}

const [cmd = 'list', ...rest] = process.argv.slice(2);
const { pos, flags } = parseFlags(rest);
const db = load();

switch (cmd) {
  case 'list': {
    const items = db.idees.filter(
      (i) =>
        (!flags.statut || i.statut === flags.statut) &&
        (!flags.cat || i.categorie === flags.cat) &&
        (!flags.prio || i.priorite === flags.prio),
    );
    console.log(items.map(line).join('\n') || 'Aucune idée.');
    break;
  }
  case 'show': {
    const i = find(db, pos[0]);
    console.log(JSON.stringify(i, null, 2));
    break;
  }
  case 'add': {
    if (!pos[0]) die('Usage : add "Titre" [--cat …] [--prio …] [--effort …] [--desc "…"]');
    const n = Math.max(0, ...db.idees.map((i) => Number(i.id.split('-')[1]) || 0)) + 1;
    const idee = {
      id: `IDEE-${String(n).padStart(3, '0')}`,
      titre: pos[0],
      description: flags.desc ?? '',
      categorie: flags.cat ?? 'presentation',
      statut: 'idee',
      priorite: flags.prio ?? 'moyenne',
      effort: flags.effort ?? 'M',
      creee: today(),
      pistes: [],
      notes: [],
    };
    for (const f of ['categorie', 'priorite', 'effort']) check(db, f, idee[f]);
    db.idees.push(idee);
    save(db);
    console.log(`Ajoutée : ${line(idee)}`);
    break;
  }
  case 'statut': {
    const i = find(db, pos[0]);
    check(db, 'statut', pos[1]);
    i.notes.push({ date: today(), texte: `statut : ${i.statut} → ${pos[1]}` });
    i.statut = pos[1];
    save(db);
    console.log(line(i));
    break;
  }
  case 'set': {
    const i = find(db, pos[0]);
    const alias = { prio: 'priorite', cat: 'categorie', desc: 'description' };
    for (const kv of pos.slice(1)) {
      const [k, ...v] = kv.split('=');
      const field = alias[k] ?? k;
      if (!['titre', 'description', 'categorie', 'priorite', 'effort'].includes(field)) die(`Champ non modifiable : ${k}`);
      check(db, field, v.join('='));
      i[field] = v.join('=');
    }
    save(db);
    console.log(line(i));
    break;
  }
  case 'note':
  case 'piste': {
    const i = find(db, pos[0]);
    if (!pos[1]) die(`Usage : ${cmd} IDEE-xxx "texte"`);
    if (cmd === 'note') i.notes.push({ date: today(), texte: pos[1] });
    else i.pistes.push(pos[1]);
    save(db);
    console.log(`${cmd} ajoutée à ${i.id}`);
    break;
  }
  case 'render':
    render(db);
    console.log(`Généré : ${BOARD}`);
    break;
  default:
    die(`Commande inconnue : ${cmd}. Commandes : list, show, add, statut, set, note, piste, render`);
}
