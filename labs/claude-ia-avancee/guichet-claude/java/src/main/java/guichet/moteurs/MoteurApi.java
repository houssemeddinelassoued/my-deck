package guichet.moteurs;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.JsonOutputFormat;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.OutputConfig;
import com.anthropic.models.messages.TextBlock;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.ToolUnion;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import guichet.AFaire;
import guichet.Config;
import java.util.List;
import java.util.Map;

/** Moteur « api » : le SDK officiel. Avec MOTEUR=simu, ANTHROPIC_BASE_URL pointe sur le simulateur. */
public final class MoteurApi implements MoteurClaude {
  private static final String SYSTEME_EXTRACTION = "Tu extrais des informations factuelles de demandes clients. Tu réponds uniquement selon le schéma demandé.";

  private final AnthropicClient client;
  private final String modele;

  /** Le client lit ANTHROPIC_API_KEY et ANTHROPIC_BASE_URL dans l'environnement. */
  public MoteurApi() {
    this(AnthropicOkHttpClient.fromEnv(), Config.MODELE);
  }

  public MoteurApi(AnthropicClient client, String modele) {
    this.client = client;
    this.modele = modele;
  }

  @Override
  public String nom() {
    return "api";
  }

  public static String premierTexte(Message rep) {
    return rep.content().stream().flatMap(b -> b.text().stream()).map(TextBlock::text).findFirst().orElse("");
  }

  static Map<String, Object> versObjet(String json) {
    try {
      return Config.JSON.readValue(json, new TypeReference<>() {});
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("Réponse JSON illisible : " + e.getOriginalMessage(), e);
    }
  }

  static JsonOutputFormat.Schema schemaJson(Map<String, Object> schema) {
    JsonOutputFormat.Schema.Builder b = JsonOutputFormat.Schema.builder();
    schema.forEach((k, v) -> b.putAdditionalProperty(k, JsonValue.from(v)));
    return b.build();
  }

  /** A3.1 · premier appel : une requête minimale, puis le texte du premier bloc « text ». */
  @Override
  public String appelSimple(String texte) {
    Message rep = client.messages().create(AFaire.<MessageCreateParams>completer("A3.1 : paramètres de la requête (model, maxTokens, message) pour « " + texte.substring(0, Math.min(30, texte.length())) + " »"));
    return AFaire.completer("A3.1 : texte du premier bloc « text » de la réponse (stop_reason : " + rep.stopReason() + ")");
  }

  /** A3.2 · sortie structurée : le contrat part dans output_config.format, la réponse est un JSON. */
  @Override
  public Map<String, Object> extraire(String prompt, Map<String, Object> schema) {
    MessageCreateParams params = MessageCreateParams.builder()
        .model(modele)
        .maxTokens(4000L)
        .systemOfTextBlockParams(List.of(TextBlockParam.builder().text(SYSTEME_EXTRACTION).cacheControl(CacheControlEphemeral.builder().build()).build()))
        .outputConfig(AFaire.<OutputConfig>completer("A3.2 : format json_schema avec le schéma (" + schema.size() + " clés)"))
        .addUserMessage(prompt)
        .build();
    Message rep = client.messages().create(params);
    if (AFaire.<Boolean>completer("A3.2 : la réponse est-elle incomplète ? (stop_reason : " + rep.stopReason() + ")")) {
      throw new IllegalStateException("Extraction interrompue : stop_reason = " + rep.stopReason());
    }
    return versObjet(premierTexte(rep));
  }

  /** Un tour de la boucle d'outils (fourni). */
  @Override
  public Message converser(List<TextBlockParam> system, List<Tool> tools, List<MessageParam> messages) {
    return client.messages().create(MessageCreateParams.builder()
        .model(modele)
        .maxTokens(4000L)
        .systemOfTextBlockParams(system)
        .tools(tools.stream().map(ToolUnion::ofTool).toList())
        .messages(messages)
        .build());
  }
}
