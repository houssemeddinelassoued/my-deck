package guichet.pipeline;

import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.Tool;
import guichet.Contrat;
import guichet.depot.Depot;
import guichet.domaine.Demande;
import guichet.domaine.Enrichissement;
import guichet.domaine.Priorite;
import guichet.domaine.Texte;
import guichet.domaine.Validation;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Atelier 3, étape A3.3 · les outils que Claude peut DEMANDER. C'est ce code qui les exécute.
 * Moindre privilège : chercher, consulter un contrat, enregistrer. Rien pour modifier ou supprimer.
 */
public final class Outils {
  private Outils() {}

  public static final class Contexte {
    public final Map<String, String> formulaire;
    public final Demande.Normalisee normalisee;
    public final String cle;
    public final Map<String, Object> schema;
    public final Depot depot;
    public final List<Demande.Client> clients;
    public Map<String, Object> resultat;
    public RuntimeException derniereErreur;

    public Contexte(Map<String, String> formulaire, Demande.Normalisee normalisee, String cle, Map<String, Object> schema, Depot depot, List<Demande.Client> clients) {
      this.formulaire = formulaire;
      this.normalisee = normalisee;
      this.cle = cle;
      this.schema = schema;
      this.depot = depot;
      this.clients = clients;
    }
  }

  @SuppressWarnings("unchecked")
  private static Tool outil(String nom, String description, Map<String, Object> inputSchema) {
    Tool.InputSchema.Properties.Builder props = Tool.InputSchema.Properties.builder();
    ((Map<String, Object>) inputSchema.get("properties")).forEach((k, v) -> props.putAdditionalProperty(k, JsonValue.from(v)));
    return Tool.builder()
        .name(nom)
        .description(description)
        .strict(true)
        .inputSchema(Tool.InputSchema.builder()
            .properties(props.build())
            .required((List<String>) inputSchema.get("required"))
            .putAdditionalProperty("additionalProperties", JsonValue.from(false))
            .build())
        .build();
  }

  @SuppressWarnings("unchecked")
  public static List<Tool> definitions(Map<String, Object> schema) {
    Map<String, Object> modele = Contrat.schemaPourModele(schema);
    Map<String, Object> proprietes = new LinkedHashMap<>();
    proprietes.put("client_id", Map.of("type", List.of("string", "null")));
    proprietes.putAll((Map<String, Object>) modele.get("properties"));
    List<String> requis = new ArrayList<>(List.of("client_id"));
    requis.addAll((List<String>) modele.get("required"));
    return List.of(
        outil("chercher_client",
            "Retrouve un client d’Oasis Digital par le nom de son entreprise ou par son e-mail. À appeler en premier, avant enregistrer_demande, pour obtenir son identifiant (client_id) et son niveau de contrat.",
            Map.of("properties", Map.of("recherche", Map.of("type", "string", "description", "nom de l’entreprise ou e-mail")), "required", List.of("recherche"))),
        outil("verifier_contrat",
            "Donne le niveau de contrat (bronze, argent, or) d’un client à partir de son client_id.",
            Map.of("properties", Map.of("client_id", Map.of("type", "string")), "required", List.of("client_id"))),
        outil("enregistrer_demande",
            "Enregistre la demande qualifiée. À appeler une seule fois, après chercher_client, avec les faits extraits du message et le client_id trouvé (null si le client est inconnu). La priorité définitive est recalculée par le système.",
            Map.of("properties", proprietes, "required", requis)));
  }

  private static String sansAccents(String s) {
    return Normalizer.normalize(s == null ? "" : s, Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT).strip();
  }

  public static Map<String, Object> chercherClient(List<Demande.Client> clients, String recherche, String email) {
    String r = sansAccents(recherche);
    Demande.Client trouve = null;
    if (!r.isEmpty()) {
      for (Demande.Client c : clients) {
        String n = sansAccents(c.nom());
        if (n.contains(r) || r.contains(n)) {
          trouve = c;
          break;
        }
      }
    }
    if (trouve == null && email != null) {
      for (Demande.Client c : clients) if (email.endsWith("@" + c.domaine())) trouve = c;
    }
    Map<String, Object> out = new LinkedHashMap<>();
    if (trouve == null) {
      out.put("id", null);
      out.put("trouve", false);
      out.put("message", "Aucun client ne correspond.");
    } else {
      out.put("id", trouve.id());
      out.put("nom", trouve.nom());
      out.put("contrat", trouve.contrat());
    }
    return out;
  }

  private static Map<String, Object> enregistrer(Map<String, Object> entree, Contexte ctx) {
    Map<String, Object> faits = new LinkedHashMap<>(entree);
    Object clientId = faits.remove("client_id");
    List<String> erreurs = Validation.valider(faits, Contrat.contratModele(ctx.schema));
    if (!erreurs.isEmpty()) throw new ErreurValidation(erreurs);
    Demande.Client client = ctx.clients.stream().filter(c -> c.id().equals(clientId)).findFirst().orElse(null);

    Map<String, Object> demande = new LinkedHashMap<>(faits);
    demande.put("client_id", client == null ? null : client.id());
    demande.put("priorite", Priorite.calculer(faits, client == null ? null : client.contrat()));
    demande.put("resume", Texte.tronquerResume(String.valueOf(faits.get("resume")), 280));
    if (faits.get("email") == null) demande.put("email", ctx.normalisee.email());
    if (faits.get("telephone") == null) demande.put("telephone", ctx.normalisee.telephone());
    demande.put("cle", ctx.cle);
    demande.put("message", ctx.formulaire.get("message"));
    demande.put("date_souhaitee", ctx.normalisee.dateSouhaitee());
    demande.put("budget_montant", ctx.normalisee.budget() == null ? null : ctx.normalisee.budget().montant());
    demande.put("budget_devise", ctx.normalisee.budget() == null ? null : ctx.normalisee.budget().devise());
    // Champs « formulaire » du contrat : recopiés tels quels (A4.2 : site_web…).
    for (String champ : Contrat.champsDeSource(ctx.schema, "formulaire")) {
      String v = ctx.formulaire.get(champ);
      demande.put(champ, v == null || v.isBlank() ? null : v.strip());
    }
    ctx.resultat = ctx.depot.inserer(Enrichissement.enrichir(demande));
    Map<String, Object> retour = new LinkedHashMap<>();
    retour.put("demande", ctx.resultat.get("id"));
    retour.put("priorite", ctx.resultat.get("priorite"));
    return retour;
  }

  public static Object executer(String nom, Map<String, Object> entree, Contexte ctx) {
    return switch (nom) {
      case "chercher_client" -> chercherClient(ctx.clients, String.valueOf(entree.getOrDefault("recherche", "")), ctx.normalisee.email());
      case "verifier_contrat" -> {
        Demande.Client c = ctx.clients.stream().filter(x -> x.id().equals(entree.get("client_id"))).findFirst()
            .orElseThrow(() -> new IllegalArgumentException("client_id inconnu : " + entree.get("client_id")));
        yield Map.of("client_id", c.id(), "contrat", c.contrat());
      }
      case "enregistrer_demande" -> enregistrer(entree, ctx);
      default -> throw new IllegalArgumentException("Outil inconnu : " + nom);
    };
  }
}
