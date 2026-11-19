package guichet.moteurs;

import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import java.util.List;
import java.util.Map;

/**
 * L'interface MoteurClaude isole la dépendance au modèle : le pipeline ne sait pas qui lui répond.
 *
 * <pre>
 *   MOTEUR=simu        MoteurApi pointé sur le simulateur local (ANTHROPIC_BASE_URL)
 *   MOTEUR=claude-cli  MoteurCli : claude -p, avec votre licence Claude (pas de boucle d'outils)
 *   MOTEUR=api         MoteurApi sur l'API réelle (ANTHROPIC_API_KEY)
 * </pre>
 */
public interface MoteurClaude {
  String nom();

  /** Un appel minimal : un texte en entrée, le texte de la réponse en sortie. */
  String appelSimple(String texte);

  /** Sortie structurée : un objet JSON conforme au schéma fourni. */
  Map<String, Object> extraire(String prompt, Map<String, Object> schema);

  /** Ce moteur sait-il mener une boucle d'outils ? (non pour claude-cli) */
  default boolean saitConverser() {
    return true;
  }

  /** Un tour de conversation avec outils. */
  default Message converser(List<TextBlockParam> system, List<Tool> tools, List<MessageParam> messages) {
    throw new UnsupportedOperationException(nom() + " ne mène pas de boucle d'outils");
  }

  static MoteurClaude choisir() {
    return "claude-cli".equals(System.getenv("MOTEUR")) ? new MoteurCli() : new MoteurApi();
  }
}
