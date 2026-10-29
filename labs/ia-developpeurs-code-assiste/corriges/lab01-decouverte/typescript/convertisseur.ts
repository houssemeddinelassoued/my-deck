// Lab 01 — Convertisseur d'unités (corrigé).

export const ZERO_ABSOLU_C = -273.15;
export const KM_PAR_MILE = 1.609344;

export type Unite = 'C' | 'F' | 'km' | 'mi';

export function celsiusVersFahrenheit(c: number): number {
  if (c < ZERO_ABSOLU_C) throw new RangeError(`${c} °C est sous le zéro absolu`);
  return (c * 9) / 5 + 32;
}

export function fahrenheitVersCelsius(f: number): number {
  const c = ((f - 32) * 5) / 9;
  if (c < ZERO_ABSOLU_C) throw new RangeError(`${f} °F est sous le zéro absolu`);
  return c;
}

export function kmVersMiles(km: number): number {
  if (km < 0) throw new RangeError('distance négative');
  return km / KM_PAR_MILE;
}

export function milesVersKm(miles: number): number {
  if (miles < 0) throw new RangeError('distance négative');
  return miles * KM_PAR_MILE;
}

const CONVERSIONS: Record<string, (v: number) => number> = {
  'C>F': celsiusVersFahrenheit,
  'F>C': fahrenheitVersCelsius,
  'km>mi': kmVersMiles,
  'mi>km': milesVersKm,
};
const UNITES = new Set<string>(['C', 'F', 'km', 'mi']);

export function convertir(valeur: number, de: Unite, vers: Unite): number {
  if (de === vers) return valeur;
  const f = CONVERSIONS[`${de}>${vers}`];
  if (!f) throw new RangeError(`conversion ${de} → ${vers} non prise en charge`);
  return f(valeur);
}

export function main(argv: string[]): string {
  if (argv.length !== 3) return 'Usage : node convertisseur.ts <valeur> <de> <vers>   (unités : C, F, km, mi)';
  const [brut, de, vers] = argv;
  const valeur = Number(brut);
  if (Number.isNaN(valeur)) return `Erreur : « ${brut} » n’est pas un nombre`;
  if (!UNITES.has(de) || !UNITES.has(vers)) return 'Erreur : unité inconnue';
  try {
    return `${convertir(valeur, de as Unite, vers as Unite).toFixed(2)} ${vers}`;
  } catch (e) {
    return `Erreur : ${(e as Error).message}`;
  }
}

if (import.meta.main) console.log(main(process.argv.slice(2)));
