// Atelier 3, étape A3.3 · le pipeline : formulaire → normalisation → Claude (boucle d'outils) → base.
import crypto from 'node:crypto';
import type Anthropic from '@anthropic-ai/sdk';
import { aCompleter, aujourdhui as dateDuJour } from '../config.ts';
import { chargerSchema } from '../contrat.ts';
import type { Client, Demande, DemandeBrute } from '../domaine/demande.ts';
import { normaliserDemande } from '../domaine/normaliser.ts';
import type { Depot } from '../depot/depot.ts';
import type { MoteurClaude } from '../moteurs/moteur.ts';
import { rendreExtraction } from '../prompts/gabarit.ts';
import { ErreurPipeline } from './erreurs.ts';
import { extraire } from './extraire.ts';
import { chercherClient, definitionsOutils, executerOutil, type Contexte } from './outils.ts';

export interface Dependances {
  moteur: MoteurClaude;
  depot: Depot;
  clients: Client[];
  aujourdhui?: string;
}

const SYSTEME =
  'Tu enregistres les demandes clients du portail Guichet d’Oasis Digital. Utilise chercher_client pour retrouver le client, puis enregistrer_demande une seule fois avec les faits extraits. Termine par une phrase courte qui confirme l’enregistrement.';

const MAX_TOURS = 6;

/** Clé d'idempotence : la même demande (e-mail + texte) donne toujours la même clé. */
export function cleIdempotence(email: string | null, message: string): string {
  return crypto.createHash('sha256').update(`${(email ?? '').toLowerCase()}|${message.trim().toLowerCase().replace(/\s+/g, ' ')}`).digest('hex');
}

export async function traiter(formulaire: DemandeBrute, deps: Dependances): Promise<{ demande: Demande; nouvelle: boolean }> {
  const normalisee = normaliserDemande(formulaire, deps.aujourdhui ?? dateDuJour());
  const cle = cleIdempotence(normalisee.email ?? formulaire.email ?? null, formulaire.message ?? '');
  const deja = deps.depot.parCle(cle);
  if (deja) return { demande: deja, nouvelle: false };

  const ctx: Contexte = { formulaire, normalisee, cle, schema: chargerSchema(), depot: deps.depot, clients: deps.clients, resultat: null, derniereErreur: null };

  // Moteur sans boucle d'outils (claude-cli) : extraction structurée, puis les mêmes outils côté code.
  if (!deps.moteur.converser) {
    const faits = await extraire(deps.moteur, formulaire);
    const client = chercherClient(deps.clients, faits.client, normalisee.email);
    await executerOutil('enregistrer_demande', { client_id: client.id ?? null, ...faits }, ctx);
    return { demande: ctx.resultat!, nouvelle: true };
  }

  const system: Anthropic.TextBlockParam[] = [{ type: 'text', text: SYSTEME, cache_control: { type: 'ephemeral' } }];
  const tools = definitionsOutils(ctx.schema);
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: rendreExtraction(formulaire) }];

  for (let tour = 0; tour < MAX_TOURS; tour++) {
    const rep = await deps.moteur.converser({ system, tools, messages });
    if (aCompleter<boolean>(`A3.3 : fin normale du dialogue ? (stop_reason : ${rep.stop_reason})`)) break;
    if (rep.stop_reason !== 'tool_use') throw new ErreurPipeline(`Arrêt inattendu du modèle : ${rep.stop_reason}`);
    messages.push({ role: 'assistant', content: aCompleter<Anthropic.ContentBlockParam[]>('A3.3 : que renvoie-t-on comme message assistant ?') });

    const resultats: Anthropic.ToolResultBlockParam[] = [];
    for (const appel of rep.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')) {
      try {
        const sortie = await executerOutil(appel.name, appel.input as Record<string, unknown>, ctx);
        resultats.push({ type: 'tool_result', tool_use_id: appel.id, content: JSON.stringify(sortie) });
      } catch (e) {
        ctx.derniereErreur = e as Error;
        resultats.push(aCompleter<Anthropic.ToolResultBlockParam>(`A3.3 : signaler l’erreur de l’outil ${appel.name} à Claude`));
      }
    }
    messages.push({ role: 'user', content: aCompleter<Anthropic.ToolResultBlockParam[]>(`A3.3 : un seul message pour les ${resultats.length} résultat(s)`) });
  }

  if (!ctx.resultat) throw ctx.derniereErreur ?? new ErreurPipeline('Le modèle n’a enregistré aucune demande.');
  return { demande: ctx.resultat, nouvelle: true };
}
