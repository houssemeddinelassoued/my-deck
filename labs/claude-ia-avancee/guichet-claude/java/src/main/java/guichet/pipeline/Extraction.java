package guichet.pipeline;

import guichet.Contrat;
import guichet.domaine.Validation;
import guichet.moteurs.MoteurClaude;
import guichet.prompts.Gabarit;
import java.util.List;
import java.util.Map;

/** Atelier 3, étape A3.2 · extraction structurée : le modèle reçoit la forme, le code vérifie le contrat. */
public final class Extraction {
  private Extraction() {}

  public static Map<String, Object> extraire(MoteurClaude moteur, Map<String, String> formulaire) {
    Map<String, Object> schema = Contrat.chargerSchema();
    Map<String, Object> sortie = moteur.extraire(Gabarit.rendreExtraction(formulaire), Contrat.schemaPourModele(schema));
    List<String> erreurs = Validation.valider(sortie, Contrat.contratModele(schema));
    if (!erreurs.isEmpty()) throw new ErreurValidation(erreurs);
    return sortie;
  }
}
