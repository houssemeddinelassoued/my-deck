package guichet.pipeline;

import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlock;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.StopReason;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlock;
import com.fasterxml.jackson.core.type.TypeReference;
import guichet.Config;
import guichet.Contrat;
import guichet.depot.Depot;
import guichet.domaine.Demande;
import guichet.domaine.Normaliseur;
import guichet.moteurs.MoteurClaude;
import guichet.prompts.Gabarit;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Atelier 3, étape A3.3 · le pipeline : formulaire → normalisation → Claude (boucle d'outils) → base. */
public final class Traiter {
  private Traiter() {}

  public record Dependances(MoteurClaude moteur, Depot depot, List<Demande.Client> clients, LocalDate aujourdhui) {}

  public record Resultat(Map<String, Object> demande, boolean nouvelle) {}

  private static final String SYSTEME =
      "Tu enregistres les demandes clients du portail Guichet d’Oasis Digital. Utilise chercher_client pour retrouver le client, puis enregistrer_demande une seule fois avec les faits extraits. Termine par une phrase courte qui confirme l’enregistrement.";
  private static final int MAX_TOURS = 6;

  /** Clé d'idempotence : la même demande (e-mail + texte) donne toujours la même clé. */
  public static String cleIdempotence(String email, String message) {
    String texte = (message == null ? "" : message).strip().toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
    try {
      byte[] h = MessageDigest.getInstance("SHA-256").digest(((email == null ? "" : email.toLowerCase(Locale.ROOT)) + "|" + texte).getBytes(StandardCharsets.UTF_8));
      return HexFormat.of().formatHex(h);
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }

  public static Resultat traiter(Map<String, String> formulaire, Dependances deps) {
    Demande.Normalisee normalisee = Normaliseur.normaliser(formulaire, deps.aujourdhui() == null ? Config.aujourdhui() : deps.aujourdhui());
    String cle = cleIdempotence(normalisee.email() != null ? normalisee.email() : formulaire.get("email"), formulaire.get("message"));
    Map<String, Object> deja = deps.depot().parCle(cle);
    if (deja != null) return new Resultat(deja, false);

    Outils.Contexte ctx = new Outils.Contexte(formulaire, normalisee, cle, Contrat.chargerSchema(), deps.depot(), deps.clients());

    // Moteur sans boucle d'outils (claude-cli) : extraction structurée, puis les mêmes outils côté code.
    if (!deps.moteur().saitConverser()) {
      Map<String, Object> faits = Extraction.extraire(deps.moteur(), formulaire);
      Map<String, Object> client = Outils.chercherClient(deps.clients(), String.valueOf(faits.get("client")), normalisee.email());
      Map<String, Object> entree = new LinkedHashMap<>();
      entree.put("client_id", client.get("id"));
      entree.putAll(faits);
      Outils.executer("enregistrer_demande", entree, ctx);
      return new Resultat(ctx.resultat, true);
    }

    List<TextBlockParam> system = List.of(TextBlockParam.builder().text(SYSTEME).cacheControl(CacheControlEphemeral.builder().build()).build());
    List<Tool> tools = Outils.definitions(ctx.schema);
    List<MessageParam> messages = new ArrayList<>(List.of(MessageParam.ofUser(Gabarit.rendreExtraction(formulaire))));

    for (int tour = 0; tour < MAX_TOURS; tour++) {
      Message rep = deps.moteur().converser(system, tools, messages);
      String stop = rep.stopReason().map(StopReason::asString).orElse("?");
      if (stop.equals("end_turn")) break;
      if (!stop.equals("tool_use")) throw new ErreurPipeline("Arrêt inattendu du modèle : " + stop);
      // Tous les blocs de la réponse (texte, réflexion, tool_use) retournent dans l'historique.
      messages.add(rep.toParam());

      List<ContentBlockParam> resultats = new ArrayList<>();
      for (ContentBlock bloc : rep.content()) {
        if (!bloc.isToolUse()) continue;
        ToolUseBlock appel = bloc.asToolUse();
        try {
          Object sortie = Outils.executer(appel.name(), appel._input().convert(new TypeReference<Map<String, Object>>() {}), ctx);
          resultats.add(ContentBlockParam.ofToolResult(ToolResultBlockParam.builder().toolUseId(appel.id()).content(Config.versJson(sortie)).build()));
        } catch (RuntimeException e) {
          ctx.derniereErreur = e;
          // On ne lève pas : on signale l'erreur à Claude, qui peut corriger son appel.
          resultats.add(ContentBlockParam.ofToolResult(ToolResultBlockParam.builder().toolUseId(appel.id()).isError(true).content(String.valueOf(e.getMessage())).build()));
        }
      }
      // Tous les résultats dans UN seul message user.
      messages.add(MessageParam.ofUserOfContentBlockParams(resultats));
    }

    if (ctx.resultat == null) throw ctx.derniereErreur != null ? ctx.derniereErreur : new ErreurPipeline("Le modèle n’a enregistré aucune demande.");
    return new Resultat(ctx.resultat, true);
  }
}
