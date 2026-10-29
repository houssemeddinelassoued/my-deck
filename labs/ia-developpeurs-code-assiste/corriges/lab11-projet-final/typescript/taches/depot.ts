// Lecture et écriture du fichier JSON des tâches.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import type { Tache } from './modele.ts';

// Node exécute le TypeScript en supprimant les types : pas de « constructor(readonly x) ».
export class TacheIntrouvable extends Error {
  constructor(ident: number) {
    super(`tâche ${ident} introuvable`);
  }
}

export class Depot {
  readonly fichier: string;
  dernierId = 0;
  taches: Tache[] = [];

  constructor(fichier: string) {
    this.fichier = fichier;
    if (existsSync(fichier)) {
      const d = JSON.parse(readFileSync(fichier, 'utf8'));
      this.dernierId = d.dernierId;
      this.taches = d.taches;
    }
  }

  enregistrer(): void {
    writeFileSync(this.fichier, JSON.stringify({ dernierId: this.dernierId, taches: this.taches }, null, 2));
  }

  ajouter(champs: Omit<Tache, 'id' | 'terminee'>): Tache {
    const t: Tache = { id: ++this.dernierId, ...champs, terminee: false }; // jamais réutilisé
    this.taches.push(t);
    return t;
  }

  trouver(ident: number): Tache {
    const t = this.taches.find((x) => x.id === ident);
    if (!t) throw new TacheIntrouvable(ident);
    return t;
  }

  supprimer(ident: number): void {
    this.taches.splice(this.taches.indexOf(this.trouver(ident)), 1);
  }
}
