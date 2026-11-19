// [A2.1] Validation par le contrat : chaque cas de donnees/validation-cas.json.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cas } from './commun.ts';
import { chargerSchema } from '../src/contrat.ts';
import { validerDemande } from '../src/domaine/validation.ts';

interface Cas {
  nom: string;
  modifs?: Record<string, unknown>;
  supprimer?: string[];
  valide: boolean;
}
const { base, cas: liste } = cas<{ base: Record<string, unknown>; cas: Cas[] }>('validation-cas.json');

for (const c of liste) {
  test(`[A2.1] ${c.nom} → ${c.valide ? 'valide' : 'refusé'}`, () => {
    const objet: Record<string, unknown> = { ...base, ...(c.modifs ?? {}) };
    for (const k of c.supprimer ?? []) delete objet[k];
    const erreurs = validerDemande(objet, chargerSchema());
    assert.equal(erreurs.length === 0, c.valide, `écarts trouvés : ${JSON.stringify(erreurs)}`);
  });
}
