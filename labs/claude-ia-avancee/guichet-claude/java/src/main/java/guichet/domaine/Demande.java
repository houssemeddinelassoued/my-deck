package guichet.domaine;

import java.util.Map;

/**
 * Types du domaine Guichet. Le contrat de référence est contrats/demande.schema.json.
 *
 * <p>Une demande brute (formulaire) est une {@code Map<String, String>} : nom, entreprise, email, telephone,
 * date_souhaitee, budget, message. Les faits extraits par Claude et les demandes enregistrées sont des
 * {@code Map<String, Object>} dont les clés suivent le contrat.
 */
public final class Demande {
  private Demande() {}

  /** Budget normalisé : montant et devise (TND ou EUR). */
  public record Budget(double montant, String devise) {}

  /** Résultat de Normaliseur.normaliser : chaque champ est propre, ou null s'il est illisible. */
  public record Normalisee(
      String email, // minuscules, ou null
      String telephone, // E.164 : +216XXXXXXXX ou +33XXXXXXXXX, ou null
      String dateSouhaitee, // AAAA-MM-JJ, ou null
      Budget budget // ou null
      ) {}

  /** Un client d'Oasis Digital (donnees/clients.json). */
  public record Client(String id, String nom, String domaine, String contrat) {
    public static Client depuis(Map<String, Object> m) {
      return new Client((String) m.get("id"), (String) m.get("nom"), (String) m.get("domaine"), (String) m.get("contrat"));
    }
  }
}
