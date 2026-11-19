// Stockage SQLite (node:sqlite, sans dépendance). Les colonnes suivent le contrat : un champ ajouté au
// schéma devient une colonne au prochain enregistrement. Requêtes toujours paramétrées.
import { DatabaseSync } from 'node:sqlite';
import { chargerSchema } from '../contrat.ts';
import type { Demande } from '../domaine/demande.ts';
import type { Depot } from './depot.ts';

const COEUR: Record<string, string> = {
  id: 'TEXT PRIMARY KEY',
  cle: 'TEXT',
  cree_le: 'TEXT NOT NULL',
  statut: "TEXT NOT NULL DEFAULT 'ouverte'",
  client_id: 'TEXT',
  message: 'TEXT',
  date_souhaitee: 'TEXT',
  budget_montant: 'REAL',
  budget_devise: 'TEXT',
};

const typeSql = (def: { type?: string | string[] }): string => {
  const t = ([] as string[]).concat(def.type ?? 'string');
  return t.includes('integer') || t.includes('boolean') ? 'INTEGER' : t.includes('number') ? 'REAL' : 'TEXT';
};

export class DepotSqlite implements Depot {
  private readonly db: DatabaseSync;
  private booleens = new Set<string>();

  constructor(fichier: string) {
    this.db = new DatabaseSync(fichier);
    const colonnes = Object.entries(COEUR).map(([c, t]) => `${c} ${t}`).join(', ');
    this.db.exec(['CREATE TABLE IF NOT EXISTS demandes (', colonnes, ')'].join(''));
    // A3.5 : la base refuse deux demandes avec la même clé, même en cas de course.
    try {
      this.db.exec('CREATE UNIQUE INDEX IF NOT EXISTS ux_demandes_cle ON demandes(cle)');
    } catch (e) {
      console.warn(`Index d'unicité non créé (doublons déjà présents ?) : ${(e as Error).message}`);
    }
    this.migrer();
  }

  /** Ajoute les colonnes des champs du contrat qui n'existent pas encore. */
  private migrer(): string[] {
    const schema = chargerSchema();
    const existantes = new Set((this.db.prepare('PRAGMA table_info(demandes)').all() as { name: string }[]).map((c) => c.name));
    for (const [champ, def] of Object.entries(schema.properties ?? {})) {
      if (([] as string[]).concat((def.type as string | string[]) ?? []).includes('boolean')) this.booleens.add(champ);
      if (!existantes.has(champ) && /^[a-z_][a-z0-9_]*$/.test(champ)) {
        this.db.exec(['ALTER TABLE demandes ADD COLUMN ', champ, ' ', typeSql(def as { type?: string | string[] })].join(''));
        existantes.add(champ);
      }
    }
    return [...existantes];
  }

  private versDemande(ligne: Record<string, unknown> | undefined): Demande | null {
    if (!ligne) return null;
    const d: Record<string, unknown> = { ...ligne };
    for (const b of this.booleens) if (b in d && d[b] !== null) d[b] = Boolean(d[b]);
    return d as Demande;
  }

  private prochainId(): string {
    const r = this.db.prepare("SELECT MAX(CAST(SUBSTR(id, 3) AS INTEGER)) AS n FROM demandes WHERE id LIKE 'D-%'").get() as { n: number | null };
    return `D-${(r.n ?? 2000) + 1}`;
  }

  inserer(demande: Record<string, unknown>): Demande {
    const colonnes = new Set(this.migrer());
    const ligne: Record<string, unknown> = { ...demande, id: this.prochainId(), cree_le: new Date().toISOString(), statut: 'ouverte' };
    const champs = Object.keys(ligne).filter((c) => colonnes.has(c));
    const valeurs = champs.map((c) => {
      const v = ligne[c];
      return typeof v === 'boolean' ? (v ? 1 : 0) : v === undefined ? null : (v as string | number | null);
    });
    // Noms de colonnes issus du contrat (jamais du client) ; valeurs toujours passées en paramètres.
    const sql = ['INSERT INTO demandes (', champs.join(', '), ') VALUES (', champs.map(() => '?').join(', '), ')'].join('');
    this.db.prepare(sql).run(...valeurs);
    return this.versDemande(this.db.prepare('SELECT * FROM demandes WHERE id = ?').get(ligne.id as string) as Record<string, unknown>)!;
  }

  lister(): Demande[] {
    return (this.db.prepare('SELECT * FROM demandes ORDER BY cree_le DESC, id DESC').all() as Record<string, unknown>[]).map((l) => this.versDemande(l)!);
  }

  parCle(cle: string): Demande | null {
    return this.versDemande(this.db.prepare('SELECT * FROM demandes WHERE cle = ?').get(cle) as Record<string, unknown> | undefined);
  }
}
