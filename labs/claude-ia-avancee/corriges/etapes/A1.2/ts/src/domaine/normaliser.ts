// Atelier 1 · version de référence (corrigé). En atelier, ce fichier est généré par Claude à partir du prompt v3.
import type { Budget, DemandeBrute, DemandeNormalisee } from './demande.ts';

const vide = (s: string | undefined): boolean => !s || !s.trim();
const espaces = (s: string): string => s.replace(/[  ]/g, ' ');

export function normaliserTelephone(brut: string | undefined): string | null {
  if (vide(brut)) return null;
  const t = espaces(brut!).replace(/\(0\)/g, '').replace(/[\s.\-()]/g, '');
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^(?:\+|00)216(\d{8})$/))) return `+216${m[1]}`;
  if (/^[2-9]\d{7}$/.test(t)) return `+216${t}`;
  if ((m = t.match(/^(?:\+|00)33(\d{9})$/))) return `+33${m[1]}`;
  if ((m = t.match(/^0(\d{9})$/))) return `+33${m[1]}`;
  return null;
}

export function normaliserEmail(brut: string | undefined): string | null {
  if (vide(brut)) return null;
  const e = espaces(brut!).replace(/\s+/g, '').toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(e) ? e : null;
}

const iso = (a: number, m: number, j: number): string | null => {
  const d = new Date(Date.UTC(a, m - 1, j));
  if (d.getUTCFullYear() !== a || d.getUTCMonth() !== m - 1 || d.getUTCDate() !== j) return null;
  return d.toISOString().slice(0, 10);
};

export function normaliserDate(brut: string | undefined, aujourdhui: string): string | null {
  if (vide(brut)) return null;
  const t = espaces(brut!).trim().toLowerCase();
  const [a, m, j] = aujourdhui.split('-').map(Number);
  const decaler = (n: number): string => new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10);
  if (t === "aujourd'hui" || t === 'aujourd’hui') return decaler(0);
  if (t === 'demain') return decaler(1);
  if (t === 'hier') return decaler(-1);
  let r: RegExpMatchArray | null;
  if ((r = t.match(/^(\d{4})-(\d{2})-(\d{2})$/))) return iso(+r[1], +r[2], +r[3]);
  if ((r = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) return iso(+r[3], +r[2], +r[1]);
  if ((r = t.match(/^(\d{1,2})\/(\d{1,2})$/))) return iso(a, +r[2], +r[1]);
  return null;
}

export function normaliserBudget(brut: string | undefined): Budget | null {
  if (vide(brut)) return null;
  const t = espaces(brut!).toLowerCase();
  const devise = /\b(dt|tnd|dinars?)\b/.test(t) ? 'TND' : /€|\beur\b|\beuros?\b/.test(t) ? 'EUR' : null;
  const n = t.match(/\d[\d\s.,]*/);
  if (!devise || !n) return null;
  let s = n[0].trim().replace(/\s+/g, '');
  if (s.includes('.') && s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (s.includes(',')) s = s.replace(',', '.');
  const montant = Number(s);
  return Number.isFinite(montant) ? { montant, devise } : null;
}

export function normaliserDemande(brute: DemandeBrute, aujourdhui: string): DemandeNormalisee {
  return {
    email: normaliserEmail(brute.email),
    telephone: normaliserTelephone(brute.telephone),
    date_souhaitee: normaliserDate(brute.date_souhaitee, aujourdhui),
    budget: normaliserBudget(brute.budget),
  };
}
