// La tâche et ses règles d'ordre et d'affichage.

export const PRIORITES = ['haute', 'normale', 'basse'] as const;
export type Priorite = (typeof PRIORITES)[number];

export type Tache = {
  id: number;
  titre: string;
  priorite: Priorite;
  echeance: string | null; // AAAA-MM-JJ : l'ordre alphabétique est l'ordre chronologique
  etiquettes: string[];
  terminee: boolean;
};

/** Priorité, puis échéance la plus proche (sans échéance en dernier), puis identifiant. */
export function comparer(a: Tache, b: Tache): number {
  return (
    PRIORITES.indexOf(a.priorite) - PRIORITES.indexOf(b.priorite) ||
    (a.echeance ?? '9999-12-31').localeCompare(b.echeance ?? '9999-12-31') ||
    a.id - b.id
  );
}

export function enLigne(t: Tache): string {
  const etiquettes = t.etiquettes.map((e) => `#${e}`).join(' ');
  return `${t.terminee ? '[x]' : '[ ]'} ${String(t.id).padEnd(2)} ${t.priorite.padEnd(8)} ${(t.echeance ?? '—').padEnd(10)}  ${t.titre}  ${etiquettes}`.trimEnd();
}

export function dateValide(texte: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texte)) return false;
  const d = new Date(`${texte}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(texte);
}
