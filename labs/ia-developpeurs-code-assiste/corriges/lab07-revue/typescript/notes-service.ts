// Service de notes personnelles (corrigé après revue).
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const SCHEMA = `
create table if not exists users (id integer primary key, email text unique, password text);
create table if not exists notes (id integer primary key, owner integer, contenu text);
`;

// Lu à l'exécution, jamais dans le code ni dans Git.
const secret = () => {
  const s = process.env.NOTES_SECRET;
  if (!s) throw new Error('NOTES_SECRET manquant');
  return s;
};

function hacher(motDePasse: string, sel = randomBytes(16)): string {
  return `scrypt$${sel.toString('hex')}$${scryptSync(motDePasse, sel, 32).toString('hex')}`;
}

function verifier(motDePasse: string, stocke: string): boolean {
  const [, sel, empreinte] = stocke.split('$');
  const calcule = scryptSync(motDePasse, Buffer.from(sel, 'hex'), 32);
  return timingSafeEqual(calcule, Buffer.from(empreinte, 'hex'));
}

type Utilisateur = { id: number; password: string };
type Note = { contenu: string };

export class NotesService {
  bd: DatabaseSync;

  constructor(cheminBd = ':memory:') {
    this.bd = new DatabaseSync(cheminBd);
    this.bd.exec(SCHEMA);
  }

  inscrire(email: string, motDePasse: string): number {
    const r = this.bd.prepare('insert into users (email, password) values (?, ?)').run(email, hacher(motDePasse));
    return Number(r.lastInsertRowid);
  }

  connecter(email: string, motDePasse: string): number | null {
    const row = this.bd.prepare('select id, password from users where email = ?').get(email) as Utilisateur | undefined;
    return row && verifier(motDePasse, row.password) ? row.id : null;
  }

  ajouterNote(userId: number, contenu: string): number {
    const r = this.bd.prepare('insert into notes (owner, contenu) values (?, ?)').run(userId, contenu);
    return Number(r.lastInsertRowid);
  }

  lireNote(userId: number, noteId: number): string | null {
    const row = this.bd.prepare('select contenu from notes where id = ? and owner = ?').get(noteId, userId) as Note | undefined;
    return row ? row.contenu : null;
  }

  jeton(userId: number): string {
    return createHmac('sha256', secret()).update(String(userId)).digest('hex');
  }
}
