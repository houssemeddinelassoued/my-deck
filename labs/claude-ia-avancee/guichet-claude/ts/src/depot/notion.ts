// Option STOCKAGE=notion : la base SQLite reste la référence (lecture, idempotence), et chaque nouvelle
// demande est recopiée dans une base Notion. Prérequis (annexe B du guide) : une intégration interne
// (NOTION_TOKEN) partagée avec une base (NOTION_BASE) qui a les propriétés : Nom (titre), Priorité (sélection),
// Type (sélection), Client (texte), Résumé (texte).
import type { Demande } from '../domaine/demande.ts';
import type { Depot } from './depot.ts';

const texte = (v: unknown) => ({ rich_text: [{ text: { content: String(v ?? '').slice(0, 1900) } }] });

export class DepotNotion implements Depot {
  private readonly local: Depot;
  private readonly jeton: string;
  private readonly base: string;

  constructor(local: Depot) {
    this.local = local;
    this.jeton = process.env.NOTION_TOKEN ?? '';
    this.base = process.env.NOTION_BASE ?? '';
    if (!this.jeton || !this.base) throw new Error('STOCKAGE=notion : NOTION_TOKEN et NOTION_BASE doivent être définis (fichier .env).');
  }

  inserer(demande: Record<string, unknown>): Demande {
    const d = this.local.inserer(demande);
    void this.copierDansNotion(d).catch((e) => console.error(`Copie Notion de ${d.id} impossible : ${(e as Error).message}`));
    return d;
  }

  lister(): Demande[] {
    return this.local.lister();
  }

  parCle(cle: string): Demande | null {
    return this.local.parCle(cle);
  }

  private async copierDansNotion(d: Demande): Promise<void> {
    const rep = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: { authorization: `Bearer ${this.jeton}`, 'notion-version': '2022-06-28', 'content-type': 'application/json' },
      body: JSON.stringify({
        parent: { database_id: this.base },
        properties: {
          Nom: { title: [{ text: { content: `${d.id} · ${String(d.client ?? '')}` } }] },
          Priorité: { select: { name: String(d.priorite ?? 'P3') } },
          Type: { select: { name: String(d.type ?? 'question') } },
          Client: texte(d.client),
          Résumé: texte(d.resume),
        },
      }),
    });
    if (!rep.ok) throw new Error(`HTTP ${rep.status} : ${(await rep.text()).slice(0, 200)}`);
  }
}
