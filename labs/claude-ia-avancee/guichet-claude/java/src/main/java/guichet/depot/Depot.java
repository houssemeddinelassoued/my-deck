package guichet.depot;

import java.util.List;
import java.util.Map;

public interface Depot {
  /** Enregistre une demande et la renvoie complétée (id, cree_le, statut). */
  Map<String, Object> inserer(Map<String, Object> demande);

  /** Toutes les demandes, les plus récentes d'abord. */
  List<Map<String, Object>> lister();

  /** La demande déjà enregistrée avec cette clé d'idempotence, ou null. */
  Map<String, Object> parCle(String cle);
}
