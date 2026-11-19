package guichet.depot;

import guichet.Config;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

/**
 * Option STOCKAGE=notion : la base SQLite reste la référence (lecture, idempotence), et chaque nouvelle demande
 * est recopiée dans une base Notion. Prérequis (annexe B du guide) : une intégration interne (NOTION_TOKEN)
 * partagée avec une base (NOTION_BASE) qui a les propriétés : Nom (titre), Priorité (sélection), Type (sélection),
 * Client (texte), Résumé (texte).
 */
public final class DepotNotion implements Depot {
  private final Depot local;
  private final String jeton = System.getenv().getOrDefault("NOTION_TOKEN", "");
  private final String base = System.getenv().getOrDefault("NOTION_BASE", "");
  private final HttpClient http = HttpClient.newHttpClient();

  public DepotNotion(Depot local) {
    this.local = local;
    if (jeton.isBlank() || base.isBlank()) throw new IllegalStateException("STOCKAGE=notion : NOTION_TOKEN et NOTION_BASE doivent être définis (fichier .env).");
  }

  private static Map<String, Object> texte(Object v) {
    String s = v == null ? "" : v.toString();
    return Map.of("rich_text", List.of(Map.of("text", Map.of("content", s.substring(0, Math.min(1900, s.length()))))));
  }

  @Override
  public Map<String, Object> inserer(Map<String, Object> demande) {
    Map<String, Object> d = local.inserer(demande);
    Map<String, Object> corps = Map.of(
        "parent", Map.of("database_id", base),
        "properties", Map.of(
            "Nom", Map.of("title", List.of(Map.of("text", Map.of("content", d.get("id") + " · " + d.getOrDefault("client", ""))))),
            "Priorité", Map.of("select", Map.of("name", String.valueOf(d.getOrDefault("priorite", "P3")))),
            "Type", Map.of("select", Map.of("name", String.valueOf(d.getOrDefault("type", "question")))),
            "Client", texte(d.get("client")),
            "Résumé", texte(d.get("resume"))));
    HttpRequest req = HttpRequest.newBuilder(URI.create("https://api.notion.com/v1/pages"))
        .header("Authorization", "Bearer " + jeton)
        .header("Notion-Version", "2022-06-28")
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(Config.versJson(corps)))
        .build();
    http.sendAsync(req, HttpResponse.BodyHandlers.ofString()).thenAccept(r -> {
      if (r.statusCode() >= 300) System.err.println("Copie Notion de " + d.get("id") + " impossible : HTTP " + r.statusCode());
    });
    return d;
  }

  @Override
  public List<Map<String, Object>> lister() {
    return local.lister();
  }

  @Override
  public Map<String, Object> parCle(String cle) {
    return local.parCle(cle);
  }
}
