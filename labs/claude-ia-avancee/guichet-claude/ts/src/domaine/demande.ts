// Types du domaine Guichet. Le contrat de référence est contrats/demande.schema.json.

/** Ce que le client saisit dans le formulaire web (tout est texte libre). */
export interface DemandeBrute {
  nom?: string;
  entreprise?: string;
  email?: string;
  telephone?: string;
  date_souhaitee?: string;
  budget?: string;
  message: string;
  [champ: string]: string | undefined;
}

export interface Budget {
  montant: number;
  devise: 'TND' | 'EUR';
}

/** Résultat de normaliserDemande : chaque champ est propre, ou null s'il est illisible. */
export interface DemandeNormalisee {
  email: string | null;
  telephone: string | null; // E.164 : +216XXXXXXXX ou +33XXXXXXXXX
  date_souhaitee: string | null; // AAAA-MM-JJ
  budget: Budget | null;
}

export type TypeDemande = 'incident' | 'evolution' | 'devis' | 'question';
export type Priorite = 'P1' | 'P2' | 'P3';
export type Contrat = 'bronze' | 'argent' | 'or';

/** Ce que Claude extrait d'une demande (champs « modèle » du contrat). */
export interface Faits {
  type: TypeDemande;
  priorite?: Priorite;
  client: string;
  contact: string | null;
  email: string | null;
  telephone: string | null;
  utilisateurs_touches: number | null;
  panne_totale: boolean;
  resume: string;
}

/** Une demande enregistrée : faits + priorité calculée + champs du formulaire et du code. */
export type Demande = Record<string, unknown> & { id: string; cree_le: string; statut: string };

export interface Client {
  id: string;
  nom: string;
  domaine: string;
  contrat: Contrat;
}
