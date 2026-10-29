// Commandes de la ligne de commande :  npm run taches -- lister
import { parseArgs } from 'node:util';
import { Depot, TacheIntrouvable } from './depot.ts';
import { comparer, dateValide, enLigne, PRIORITES, type Priorite, type Tache } from './modele.ts';

export type Resultat = { code: number; sortie: string };

class ErreurArguments extends Error {}

const afficher = (taches: Tache[]) => taches.toSorted(comparer).map(enLigne).join('\n') || 'Aucune tâche.';

function priorite(texte: string | undefined): Priorite | undefined {
  if (texte === undefined) return undefined;
  if (!(PRIORITES as readonly string[]).includes(texte)) throw new ErreurArguments(`priorité invalide : ${texte}`);
  return texte as Priorite;
}

function dateIso(texte: string | undefined): string | null {
  if (texte === undefined) return null;
  if (!dateValide(texte)) throw new ErreurArguments(`date invalide : ${texte} (AAAA-MM-JJ attendu)`);
  return texte;
}

function ident(texte: string | undefined): number {
  const n = Number(texte);
  if (!Number.isInteger(n)) throw new ErreurArguments('identifiant entier attendu');
  return n;
}

const champCsv = (v: string) => (/[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v);

function exporterCsv(taches: Tache[]): string {
  const lignes = taches.map((t) =>
    [String(t.id), t.titre, t.priorite, t.echeance ?? '', t.etiquettes.join(';'), t.terminee ? 'oui' : 'non'].map(champCsv).join(','),
  );
  return ['id,titre,priorite,echeance,etiquettes,terminee', ...lignes].join('\n');
}

function executer(argv: string[], depot: Depot): string {
  const [commande, ...reste] = argv;
  const { values: o, positionals: p } = parseArgs({
    args: reste,
    allowPositionals: true,
    options: {
      priorite: { type: 'string' },
      echeance: { type: 'string' },
      etiquette: { type: 'string', multiple: true },
      toutes: { type: 'boolean' },
      aujourdhui: { type: 'string' },
      format: { type: 'string' },
    },
  });
  switch (commande) {
    case 'ajouter': {
      const titre = (p[0] ?? '').trim();
      if (!titre) throw new ErreurArguments('le titre est vide');
      const t = depot.ajouter({ titre, priorite: priorite(o.priorite) ?? 'normale', echeance: dateIso(o.echeance), etiquettes: o.etiquette ?? [] });
      return `Tâche ${t.id} ajoutée : ${t.titre}`;
    }
    case 'lister': {
      const pr = priorite(o.priorite);
      return afficher(
        depot.taches.filter(
          (t) => (o.toutes || !t.terminee) && (!o.etiquette || o.etiquette.every((e) => t.etiquettes.includes(e))) && (!pr || t.priorite === pr),
        ),
      );
    }
    case 'terminer':
      depot.trouver(ident(p[0])).terminee = true;
      return `Tâche ${p[0]} terminée`;
    case 'supprimer':
      depot.supprimer(ident(p[0]));
      return `Tâche ${p[0]} supprimée`;
    case 'en-retard': {
      const jour = dateIso(o.aujourdhui) ?? new Date().toISOString().slice(0, 10);
      return afficher(depot.taches.filter((t) => !t.terminee && t.echeance !== null && t.echeance < jour));
    }
    case 'exporter':
      if (o.format === 'json') return JSON.stringify(depot.taches, null, 2);
      if (o.format === 'csv') return exporterCsv(depot.taches);
      throw new ErreurArguments('--format json ou csv attendu');
    default:
      throw new ErreurArguments(`commande inconnue : ${commande ?? '(aucune)'}`);
  }
}

/** Exécute une commande et retourne le code de sortie et le texte à afficher. */
export function main(argv: string[], fichier: string): Resultat {
  const depot = new Depot(fichier);
  try {
    const sortie = executer(argv, depot);
    depot.enregistrer();
    return { code: 0, sortie };
  } catch (e) {
    if (e instanceof TacheIntrouvable) return { code: 1, sortie: `Erreur : ${e.message}` };
    return { code: 2, sortie: `Erreur : ${(e as Error).message}` };
  }
}

if (import.meta.main) {
  const { code, sortie } = main(process.argv.slice(2), 'taches.json');
  console.log(sortie);
  process.exitCode = code;
}
