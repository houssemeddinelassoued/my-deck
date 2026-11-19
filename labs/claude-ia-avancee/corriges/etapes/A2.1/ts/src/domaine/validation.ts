// Atelier 2, étape A2.1 · validation stricte par le contrat (sous-ensemble de JSON Schema).
// Renvoie la liste des écarts : vide = conforme. Ne lève jamais d'exception pour une donnée invalide.

export interface Propriete {
  type?: string | string[];
  enum?: unknown[];
  minLength?: number;
  maxLength?: number;
  description?: string;
  [cle: string]: unknown;
}
export interface Schema {
  type?: string;
  properties?: Record<string, Propriete>;
  required?: string[];
  additionalProperties?: boolean;
  [cle: string]: unknown;
}

export const typeJson = (v: unknown): string =>
  v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v === 'number' ? 'number' : typeof v;

export function validerDemande(objet: unknown, schema: Schema): string[] {
  if (typeJson(objet) !== 'object') return ['la sortie n’est pas un objet JSON'];
  const o = objet as Record<string, unknown>;
  const props = schema.properties ?? {};
  const erreurs: string[] = [];

  for (const r of schema.required ?? []) if (!(r in o)) erreurs.push(`${r} : champ requis manquant`);

  if (schema.additionalProperties === false) {
    for (const k of Object.keys(o)) {
      if (!(k in props)) erreurs.push(`${k} : champ non prévu par le contrat`);
    }
  }

  for (const [k, def] of Object.entries(props)) {
    if (!(k in o)) continue;
    const v = o[k];
    const types = def.type === undefined ? null : ([] as string[]).concat(def.type);
    if (types && !types.some((t) => t === typeJson(v) || (t === 'number' && typeJson(v) === 'integer'))) {
      erreurs.push(`${k} : type ${typeJson(v)} au lieu de ${types.join(' | ')}`);
    }
    if (def.enum && !def.enum.includes(v)) {
      erreurs.push(`${k} : valeur « ${String(v)} » hors liste (${def.enum.join(', ')})`);
    }
    if (typeof v === 'string' && def.minLength !== undefined && v.length < def.minLength) {
      erreurs.push(`${k} : trop court (minimum ${def.minLength})`);
    }
    if (typeof v === 'string' && def.maxLength !== undefined && v.length > def.maxLength) {
      erreurs.push(`${k} : trop long (maximum ${def.maxLength})`);
    }
  }
  return erreurs;
}
