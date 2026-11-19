// Erreurs métier du pipeline, traduites en codes HTTP par le serveur.

/** La sortie du modèle (ou du formulaire) ne respecte pas le contrat → 422. */
export class ErreurValidation extends Error {
  readonly erreurs: string[];
  constructor(erreurs: string[]) {
    super(`Demande non conforme au contrat : ${erreurs.join(' ; ')}`);
    this.name = 'ErreurValidation';
    this.erreurs = erreurs;
  }
}

/** Le dialogue avec le modèle n'a pas abouti (arrêt inattendu, trop de tours…) → 502. */
export class ErreurPipeline extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErreurPipeline';
  }
}
