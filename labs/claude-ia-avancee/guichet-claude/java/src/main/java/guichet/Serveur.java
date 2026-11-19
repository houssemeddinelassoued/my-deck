package guichet;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import guichet.depot.Depot;
import guichet.depot.DepotNotion;
import guichet.depot.DepotSqlite;
import guichet.depot.Filtre;
import guichet.domaine.Demande;
import guichet.moteurs.MoteurClaude;
import guichet.pipeline.ErreurValidation;
import guichet.pipeline.Traiter;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

/** Serveur HTTP de Guichet : l'API et l'interface web (dossier web/ à la racine du dépôt). node guichet.mjs lancer */
public final class Serveur {
  private Serveur() {}

  private static final MoteurClaude MOTEUR = MoteurClaude.choisir();
  private static Depot depot;
  private static List<Demande.Client> clients;

  public static void main(String[] args) throws IOException {
    int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "3000"));
    String fichier = System.getenv().getOrDefault("GUICHET_DB", Config.chemin("donnees", "guichet.db").toString());
    Depot local = new DepotSqlite(fichier);
    depot = "notion".equals(System.getenv("STOCKAGE")) ? new DepotNotion(local) : local;
    clients = Config.lireListe("donnees", "clients.json").stream().map(Demande.Client::depuis).toList();

    HttpServer serveur = HttpServer.create(new InetSocketAddress(port), 0);
    serveur.createContext("/", Serveur::router);
    serveur.setExecutor(Executors.newFixedThreadPool(8));
    serveur.start();
    System.out.println("Guichet (Java, moteur " + MOTEUR.nom() + ") : http://localhost:" + port);
  }

  private static void envoyer(HttpExchange ex, int statut, String type, byte[] corps) throws IOException {
    ex.getResponseHeaders().set("content-type", type);
    ex.sendResponseHeaders(statut, corps.length);
    try (OutputStream os = ex.getResponseBody()) {
      os.write(corps);
    }
  }

  private static void json(HttpExchange ex, int statut, Object corps) throws IOException {
    envoyer(ex, statut, "application/json; charset=utf-8", Config.versJson(corps).getBytes(StandardCharsets.UTF_8));
  }

  private static void router(HttpExchange ex) throws IOException {
    try {
      String chemin = ex.getRequestURI().getPath();
      String methode = ex.getRequestMethod();
      if (methode.equals("POST") && chemin.equals("/api/demandes")) {
        deposer(ex);
      } else if (methode.equals("GET") && chemin.equals("/api/demandes")) {
        String client = null;
        String q = ex.getRequestURI().getRawQuery();
        if (q != null) for (String p : q.split("&")) if (p.startsWith("client=")) client = URLDecoder.decode(p.substring(7), StandardCharsets.UTF_8);
        json(ex, 200, Filtre.parClient(depot.lister(), client));
      } else if (methode.equals("GET") && chemin.equals("/api/references")) {
        json(ex, 200, Config.lireListe("donnees", "demandes.json"));
      } else if (methode.equals("GET")) {
        Path web = Config.chemin("web").toAbsolutePath().normalize();
        Path f = web.resolve(chemin.equals("/") ? "index.html" : chemin.substring(1)).normalize();
        if (!f.startsWith(web) || !Files.isRegularFile(f)) {
          json(ex, 404, Map.of("erreur", "introuvable"));
          return;
        }
        String type = f.toString().endsWith(".html") ? "text/html" : f.toString().endsWith(".js") ? "text/javascript" : f.toString().endsWith(".css") ? "text/css" : "application/octet-stream";
        envoyer(ex, 200, type + "; charset=utf-8", Files.readAllBytes(f));
      } else {
        json(ex, 405, Map.of("erreur", "méthode non prise en charge"));
      }
    } catch (RuntimeException e) {
      json(ex, 500, Map.of("erreur", String.valueOf(e.getMessage())));
    }
  }

  private static void deposer(HttpExchange ex) throws IOException {
    Map<String, Object> brut = Config.JSON.readValue(ex.getRequestBody(), new TypeReference<>() {});
    Map<String, String> formulaire = new LinkedHashMap<>();
    brut.forEach((k, v) -> formulaire.put(k, v == null ? "" : v.toString()));
    if (formulaire.getOrDefault("message", "").isBlank()) {
      json(ex, 422, Map.of("erreur", "Le message est obligatoire."));
      return;
    }
    try {
      Traiter.Resultat r = Traiter.traiter(formulaire, new Traiter.Dependances(MOTEUR, depot, clients, null));
      json(ex, 201, Map.of("demande", r.demande(), "nouvelle", r.nouvelle()));
    } catch (ErreurValidation e) {
      json(ex, 422, Map.of("erreur", e.getMessage()));
    } catch (AFaire.NonImplemente e) {
      // Atelier 3 en cours : on montre au moins la réponse brute du moteur (A3.1).
      String brute;
      try {
        brute = MOTEUR.appelSimple(formulaire.get("message"));
      } catch (RuntimeException e2) {
        brute = e2.getMessage();
      }
      json(ex, 501, Map.of("erreur", e.getMessage(), "reponse_brute", String.valueOf(brute)));
    } catch (RuntimeException e) {
      System.err.println("Erreur : " + e);
      json(ex, 502, Map.of("erreur", String.valueOf(e.getMessage())));
    }
  }
}
