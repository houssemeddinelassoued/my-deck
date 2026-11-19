// Moteur « claude-cli » : le vrai modèle, via Claude Code en mode non interactif (claude -p) et votre licence.
// Lancé depuis un dossier temporaire : ni CLAUDE.md, ni hooks, ni accès aux fichiers du dépôt.
// Pas de boucle d'outils ici : le pipeline passe alors par l'extraction structurée.
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import type { MoteurClaude } from './moteur.ts';

interface SortieClaude {
  result?: string;
  structured_output?: unknown;
  is_error?: boolean;
}

function lancer(args: string[], entree: string): SortieClaude {
  const options = { cwd: os.tmpdir(), input: entree, encoding: 'utf8' as const, timeout: 300_000, maxBuffer: 64 * 1024 * 1024 };
  let r = spawnSync('claude', args, options);
  if (process.platform === 'win32' && (r.error as NodeJS.ErrnoException | undefined)?.code === 'ENOENT') {
    // Installation npm (claude.cmd) : il faut un shell, avec des guillemets échappés.
    r = spawnSync(['claude', ...args.map((a) => `"${a.replace(/"/g, '\\"')}"`)].join(' '), [], { ...options, shell: true });
  }
  if (r.error || r.status !== 0) throw new Error(`claude -p a échoué : ${r.error?.message ?? (r.stderr || r.stdout || '').slice(0, 300)}`);
  const sortie = JSON.parse(r.stdout) as SortieClaude;
  if (sortie.is_error) throw new Error(`claude -p : ${sortie.result}`);
  return sortie;
}

export class MoteurCli implements MoteurClaude {
  readonly nom = 'claude-cli';
  readonly modele = process.env.GUICHET_MODELE_CLI; // alias Claude Code : haiku, sonnet, opus… (facultatif)

  private args(extra: string[]): string[] {
    return ['-p', '--output-format', 'json', ...(this.modele ? ['--model', this.modele] : []), ...extra];
  }

  async appelSimple(texte: string): Promise<string> {
    return lancer(this.args([]), texte).result ?? '';
  }

  async extraire(prompt: string, schema: object): Promise<unknown> {
    const s = lancer(this.args(['--json-schema', JSON.stringify(schema)]), prompt);
    return s.structured_output ?? JSON.parse(s.result ?? 'null');
  }
}
