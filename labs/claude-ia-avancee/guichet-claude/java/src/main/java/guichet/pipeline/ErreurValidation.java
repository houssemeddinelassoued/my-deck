package guichet.pipeline;

import java.util.List;

/** La sortie du modèle (ou du formulaire) ne respecte pas le contrat → 422. */
public final class ErreurValidation extends RuntimeException {
  private final List<String> erreurs;

  public ErreurValidation(List<String> erreurs) {
    super("Demande non conforme au contrat : " + String.join(" ; ", erreurs));
    this.erreurs = List.copyOf(erreurs);
  }

  public List<String> erreurs() {
    return erreurs;
  }
}
