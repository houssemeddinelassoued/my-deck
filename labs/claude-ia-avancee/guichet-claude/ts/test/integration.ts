// Outils des tests d'intégration (simulateur + base en mémoire).
import { lireJson } from '../src/config.ts';
import type { Client } from '../src/domaine/demande.ts';
import { DepotSqlite } from '../src/depot/sqlite.ts';
import { MoteurApi } from '../src/moteurs/api.ts';
import type { Dependances } from '../src/pipeline/traiter.ts';

export const dependances = (): Dependances & { depot: DepotSqlite } => ({
  moteur: new MoteurApi(),
  depot: new DepotSqlite(':memory:'),
  clients: lireJson<Client[]>('donnees', 'clients.json'),
  aujourdhui: '2026-11-14',
});
