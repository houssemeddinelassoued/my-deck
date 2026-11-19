// Le contrat (contrats/demande.schema.json) est relu à chaque appel : le modifier suffit à faire évoluer
// l'application (champs extraits, colonnes de la base, champs recopiés du formulaire).
import { lireJson } from './config.ts';
import type { Schema } from './domaine/validation.ts';

export const chargerSchema = (): Schema => lireJson<Schema>('contrats', 'demande.schema.json');

/** Source d'un champ : « modele » (extrait par Claude, par défaut), « formulaire » ou « code ». */
export const sourceDe = (schema: Schema, champ: string): string => String(schema.properties?.[champ]?.['x-source'] ?? 'modele');
export const champsDeSource = (schema: Schema, source: string): string[] => Object.keys(schema.properties ?? {}).filter((c) => sourceDe(schema, c) === source);

/** Ce que le modèle reçoit : la forme des champs « modele », sans les x-* ni les longueurs (vérifiées par le code). */
export function schemaPourModele(schema: Schema): Schema {
  const properties: Record<string, Record<string, unknown>> = {};
  for (const champ of champsDeSource(schema, 'modele')) {
    const { minLength, maxLength, ...reste } = schema.properties![champ];
    void minLength;
    void maxLength;
    properties[champ] = Object.fromEntries(Object.entries(reste).filter(([c]) => !c.startsWith('x-')));
  }
  const s: Schema = { type: 'object', properties, required: (schema.required ?? []).filter((r) => r in properties) };
  if (schema.additionalProperties === false) s.additionalProperties = false;
  return s;
}

/** Le contrat restreint aux champs « modele » : pour valider ce que Claude a extrait. */
export function contratModele(schema: Schema): Schema {
  const garder = new Set(champsDeSource(schema, 'modele'));
  return {
    ...schema,
    properties: Object.fromEntries(Object.entries(schema.properties ?? {}).filter(([c]) => garder.has(c))),
    required: (schema.required ?? []).filter((r) => garder.has(r)),
  };
}
