// Atelier 3, étape A3.3 · les outils que Claude peut DEMANDER. C'est ce code qui les exécute.
// Moindre privilège : chercher, consulter un contrat, enregistrer. Rien pour modifier ou supprimer.
import type Anthropic from '@anthropic-ai/sdk';
import { champsDeSource, contratModele, schemaPourModele } from '../contrat.ts';
import type { Client, Contrat, Demande, DemandeBrute, DemandeNormalisee, Faits } from '../domaine/demande.ts';
import { enrichir } from '../domaine/enrichissement.ts';
import { calculerPriorite } from '../domaine/priorite.ts';
import { tronquerResume } from '../domaine/texte.ts';
import { validerDemande, type Schema } from '../domaine/validation.ts';
import type { Depot } from '../depot/depot.ts';
import { ErreurValidation } from './erreurs.ts';

export interface Contexte {
  formulaire: DemandeBrute;
  normalisee: DemandeNormalisee;
  cle: string;
  schema: Schema;
  depot: Depot;
  clients: Client[];
  resultat: Demande | null;
  derniereErreur: Error | null;
}

export function definitionsOutils(schema: Schema): Anthropic.Tool[] {
  const modele = schemaPourModele(schema);
  return [
    {
      name: 'chercher_client',
      description:
        'Retrouve un client d’Oasis Digital par le nom de son entreprise ou par son e-mail. À appeler en premier, avant enregistrer_demande, pour obtenir son identifiant (client_id) et son niveau de contrat.',
      strict: true,
      input_schema: { type: 'object', properties: { recherche: { type: 'string', description: 'nom de l’entreprise ou e-mail' } }, required: ['recherche'], additionalProperties: false },
    },
    {
      name: 'verifier_contrat',
      description: 'Donne le niveau de contrat (bronze, argent, or) d’un client à partir de son client_id.',
      strict: true,
      input_schema: { type: 'object', properties: { client_id: { type: 'string' } }, required: ['client_id'], additionalProperties: false },
    },
    {
      name: 'enregistrer_demande',
      description:
        'Enregistre la demande qualifiée. À appeler une seule fois, après chercher_client, avec les faits extraits du message et le client_id trouvé (null si le client est inconnu). La priorité définitive est recalculée par le système.',
      strict: true,
      input_schema: {
        type: 'object',
        properties: { client_id: { type: ['string', 'null'] }, ...(modele.properties as Record<string, object>) },
        required: ['client_id', ...(modele.required ?? [])],
        additionalProperties: false,
      },
    },
  ] as Anthropic.Tool[];
}

const sansAccents = (s: string): string => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

export function chercherClient(clients: Client[], recherche: string, email: string | null): Record<string, unknown> {
  const r = sansAccents(recherche);
  const parNom = r ? clients.find((c) => sansAccents(c.nom).includes(r) || r.includes(sansAccents(c.nom))) : undefined;
  const parEmail = email ? clients.find((c) => email.endsWith(`@${c.domaine}`)) : undefined;
  const c = parNom ?? parEmail;
  return c ? { id: c.id, nom: c.nom, contrat: c.contrat } : { id: null, trouve: false, message: 'Aucun client ne correspond.' };
}

function enregistrer(input: Record<string, unknown>, ctx: Contexte): Record<string, unknown> {
  const { client_id: clientId, ...faits } = input;
  const erreurs = validerDemande(faits, contratModele(ctx.schema));
  if (erreurs.length) throw new ErreurValidation(erreurs);
  const f = faits as unknown as Faits;
  const client = ctx.clients.find((c) => c.id === clientId) ?? null;
  const demande: Record<string, unknown> = {
    ...f,
    client_id: client?.id ?? null,
    priorite: calculerPriorite(f, (client?.contrat ?? null) as Contrat | null),
    resume: tronquerResume(f.resume, 280),
    email: f.email ?? ctx.normalisee.email,
    telephone: f.telephone ?? ctx.normalisee.telephone,
    cle: ctx.cle,
    message: ctx.formulaire.message,
    date_souhaitee: ctx.normalisee.date_souhaitee,
    budget_montant: ctx.normalisee.budget?.montant ?? null,
    budget_devise: ctx.normalisee.budget?.devise ?? null,
  };
  // Champs « formulaire » du contrat : recopiés tels quels (A4.2 : site_web…).
  for (const champ of champsDeSource(ctx.schema, 'formulaire')) {
    const v = ctx.formulaire[champ];
    demande[champ] = v && v.trim() ? v.trim() : null;
  }
  ctx.resultat = ctx.depot.inserer(enrichir(demande));
  return { demande: ctx.resultat.id, priorite: ctx.resultat.priorite };
}

export async function executerOutil(nom: string, input: Record<string, unknown>, ctx: Contexte): Promise<unknown> {
  switch (nom) {
    case 'chercher_client':
      return chercherClient(ctx.clients, String(input.recherche ?? ''), ctx.normalisee.email);
    case 'verifier_contrat': {
      const c = ctx.clients.find((x) => x.id === input.client_id);
      if (!c) throw new Error(`client_id inconnu : ${String(input.client_id)}`);
      return { client_id: c.id, contrat: c.contrat };
    }
    case 'enregistrer_demande':
      return enregistrer(input, ctx);
    default:
      throw new Error(`Outil inconnu : ${nom}`);
  }
}
