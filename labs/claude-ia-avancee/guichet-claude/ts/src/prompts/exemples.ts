// Atelier 1, étape A1.3 · exemples dynamiques (few-shot) choisis par le code selon la demande.
import { lireTexte } from '../config.ts';
import { aCompleter } from '../config.ts';

export interface Exemple {
  id: string;
  type: string;
  texte: string;
  sortie: Record<string, unknown>;
}

const STOP = new Set(['avec', 'pour', 'dans', 'depuis', 'nous', 'notre', 'votre', 'vous', 'sont', 'plus', 'cette', 'mais', 'the', 'and', 'with', 'from', 'this', 'that', 'have', 'been', 'merci', 'bonjour', 'pouvez', 'pourriez']);

/** Mots de 4 lettres ou plus, en minuscules, sans les mots vides. Fourni. */
export function motsCles(texte: string): Set<string> {
  return new Set(
    String(texte ?? '')
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((m) => m.length >= 4 && !STOP.has(m)),
  );
}

export const lireExemples = (): Exemple[] =>
  lireTexte('donnees', 'exemples.jsonl')
    .trim()
    .split(/\r?\n/)
    .map((l) => JSON.parse(l) as Exemple);

/**
 * Les k exemples les plus proches du texte, un seul par type.
 * Score = nombre de mots-clés en commun ; à score égal, l'ordre du fichier est conservé.
 */
export function choisirExemples(texte: string, tous: Exemple[], k = 3): Exemple[] {
  const mots = motsCles(texte);
  const notes = tous.map((ex) => ({ ex, score: aCompleter<number>(`A1.3 : score = mots en commun (${mots.size} mots-clés)`) }));
  notes.sort((a, b) => aCompleter<number>(`A1.3 : ordre (scores ${a.score} et ${b.score})`));
  const choisis: Exemple[] = [];
  for (const { ex } of notes) {
    if (choisis.some((c) => aCompleter<boolean>(`A1.3 : même type que ${c.id} ?`))) continue;
    choisis.push(ex);
    if (choisis.length === k) break;
  }
  return choisis;
}

export function rendreExemples(exemples: Exemple[]): string {
  return exemples.map((e) => `<exemple>\n<entree>${e.texte}</entree>\n<sortie>${JSON.stringify(e.sortie)}</sortie>\n</exemple>`).join('\n');
}
