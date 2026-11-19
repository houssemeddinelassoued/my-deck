// Moteur « api » : le SDK officiel. Avec MOTEUR=simu, ANTHROPIC_BASE_URL pointe sur le simulateur.
import Anthropic from '@anthropic-ai/sdk';
import { aCompleter, MODELE } from '../config.ts';
import type { MoteurClaude, Requete } from './moteur.ts';

const SYSTEME_EXTRACTION = 'Tu extrais des informations factuelles de demandes clients. Tu réponds uniquement selon le schéma demandé.';

export const premierTexte = (rep: Anthropic.Message): string => {
  for (const bloc of rep.content) if (bloc.type === 'text') return bloc.text;
  return '';
};

export class MoteurApi implements MoteurClaude {
  readonly nom = 'api';
  readonly client: Anthropic;
  readonly modele: string;

  constructor(options: { baseURL?: string; modele?: string } = {}) {
    // Sans options, le client lit ANTHROPIC_API_KEY et ANTHROPIC_BASE_URL dans l'environnement.
    this.client = new Anthropic(options.baseURL ? { baseURL: options.baseURL } : {});
    this.modele = options.modele ?? MODELE;
  }

  /** A3.1 · premier appel : une requête minimale, puis le texte du premier bloc « text ». */
  async appelSimple(texte: string): Promise<string> {
    const rep = await this.client.messages.create({
      model: this.modele,
      max_tokens: 1000,
      messages: [{ role: 'user', content: texte }],
    });
    return premierTexte(rep);
  }

  /** A3.2 · sortie structurée : le contrat part dans output_config.format, la réponse est un JSON. */
  async extraire(prompt: string, schema: object): Promise<unknown> {
    const rep = await this.client.messages.create({
      model: this.modele,
      max_tokens: 4000,
      system: [{ type: 'text', text: SYSTEME_EXTRACTION, cache_control: { type: 'ephemeral' } }],
      output_config: aCompleter(`A3.2 : format json_schema avec le schéma (${Object.keys(schema).length} clés)`),
      messages: [{ role: 'user', content: prompt }],
    } as Anthropic.MessageCreateParamsNonStreaming);
    if (aCompleter<boolean>(`A3.2 : la réponse est-elle incomplète ? (stop_reason : ${rep.stop_reason})`)) {
      throw new Error(`Extraction interrompue : stop_reason = ${rep.stop_reason}`);
    }
    return JSON.parse(premierTexte(rep));
  }

  /** Un tour de la boucle d'outils (fourni). */
  async converser(requete: Requete): Promise<Anthropic.Message> {
    return this.client.messages.create({ model: this.modele, max_tokens: 4000, system: requete.system, tools: requete.tools, messages: requete.messages });
  }
}
