// L'interface MoteurClaude isole la dépendance au modèle : le pipeline ne sait pas qui lui répond.
//   MOTEUR=simu        MoteurApi pointé sur le simulateur local (ANTHROPIC_BASE_URL)
//   MOTEUR=claude-cli  MoteurCli : claude -p, avec votre licence Claude (pas de boucle d'outils)
//   MOTEUR=api         MoteurApi sur l'API réelle (ANTHROPIC_API_KEY)
import type Anthropic from '@anthropic-ai/sdk';
import { MoteurApi } from './api.ts';
import { MoteurCli } from './cli.ts';

export interface Requete {
  system: Anthropic.TextBlockParam[];
  tools: Anthropic.Tool[];
  messages: Anthropic.MessageParam[];
}

export interface MoteurClaude {
  readonly nom: string;
  /** Un appel minimal : un texte en entrée, le texte de la réponse en sortie. */
  appelSimple(texte: string): Promise<string>;
  /** Sortie structurée : un objet JSON conforme au schéma fourni. */
  extraire(prompt: string, schema: object): Promise<unknown>;
  /** Un tour de conversation avec outils (absent pour claude-cli). */
  converser?(requete: Requete): Promise<Anthropic.Message>;
}

export function choisirMoteur(): MoteurClaude {
  switch (process.env.MOTEUR ?? 'simu') {
    case 'claude-cli':
      return new MoteurCli();
    default:
      return new MoteurApi();
  }
}
