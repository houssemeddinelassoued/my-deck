package guichet.outils;

import guichet.Config;
import guichet.moteurs.MoteurCli;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.function.BiConsumer;
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Atelier 2, étape A2.3 · la boucle générer → vérifier → corriger, avec une limite de tours.
 * Lancer sur une tâche : node guichet.mjs boucle taches/tronquer-resume.md
 */
public final class Boucle {
  private Boucle() {}

  /** Ce qu'ont dit la garde et les tests (renvoyé tel quel au modèle). */
  public record Verification(boolean ok, String sortie) {}

  /** Résultat de la boucle ; l'historique sert à l'humain en cas d'échec. */
  public record Resultat(boolean ok, int tour, List<Verification> historique) {}

  public static Resultat boucle(String tache, BiConsumer<String, String> generer, Supplier<Verification> verifier, int maxTours) {
    List<Verification> historique = new ArrayList<>();
    String retours = "";
    for (int tour = 1; tour <= maxTours; tour++) {
      generer.accept(tache, retours);
      Verification r = verifier.get();
      historique.add(r);
      if (r.ok()) return new Resultat(true, tour, historique);
      // On renvoie la sortie exacte de la garde et des tests, pas un résumé.
      retours = r.sortie();
    }
    // Après maxTours échecs : on s'arrête et on rend l'historique complet à un humain.
    return new Resultat(false, maxTours, historique);
  }

  // ─── Lanceur (fourni) ──────────────────────────────────────────────────────

  private static String executer(List<String> commande) {
    try {
      Process p = new ProcessBuilder(commande).directory(Config.RACINE.toFile()).redirectErrorStream(true).start();
      String sortie = new String(p.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
      return p.waitFor() + "\n" + sortie;
    } catch (IOException | InterruptedException e) {
      return "1\n" + e.getMessage();
    }
  }

  public static void main(String[] args) throws IOException {
    String tache = Files.readString(Path.of(args[0]), StandardCharsets.UTF_8);
    Matcher m = Pattern.compile("^fichier-java:\\s*(.+)$", Pattern.MULTILINE).matcher(tache);
    if (!m.find()) {
      System.out.println("La tâche ne précise pas de « fichier-java: ».");
      System.exit(1);
    }
    String relatif = m.group(1).strip();
    Path cible = Config.RACINE.resolve(relatif);
    int[] tours = {0};

    BiConsumer<String, String> generer = (t, retours) -> {
      tours[0]++;
      System.out.println("Tour " + tours[0] + " : génération" + (retours.isEmpty() ? "" : " avec les retours du tour précédent") + "…");
      try {
        String prompt = String.join("\n", "<tache>", t, "</tache>", "<fichier_actuel chemin=\"" + relatif + "\">", Files.readString(cible), "</fichier_actuel>",
            retours.isEmpty() ? "" : "<retours_de_verification>\n" + retours + "\n</retours_de_verification>\nCorrige le fichier pour que ces vérifications passent.",
            "Réponds uniquement avec le contenu complet du fichier, dans un seul bloc de code Java.");
        String reponse = String.valueOf(MoteurCli.lancer(List.of("-p", "--output-format", "json"), prompt).get("result"));
        Matcher bloc = Pattern.compile("```[\\w-]*\\R([\\s\\S]*?)```").matcher(reponse);
        String code = reponse;
        while (bloc.find()) if (bloc.group(1).length() > code.length() || code == reponse) code = bloc.group(1);
        Files.writeString(cible, code);
        System.out.println("  → " + cible.getFileName() + " réécrit");
      } catch (IOException e) {
        throw new IllegalStateException(e);
      }
    };

    Supplier<Verification> verifier = () -> {
      String garde = executer(List.of("node", "guichet.mjs", "garde"));
      String tests = executer(List.of("node", "guichet.mjs", "tests", "--tag", "BOUCLE", "--detail"));
      boolean ok = garde.startsWith("0") && tests.startsWith("0");
      String sortie = (garde + "\n" + tests).replaceAll("\u001b\\[\\d+m", "");
      System.out.println("  → vérification : " + (ok ? "OK" : "échec"));
      return new Verification(ok, sortie.substring(Math.max(0, sortie.length() - 6000)));
    };

    Resultat r = boucle(tache, generer, verifier, 3);
    if (r.ok()) System.out.println("Réussi en " + r.tour() + " tour(s).");
    else {
      System.out.println("Échec après " + r.tour() + " tours : à vous de regarder. Dernière vérification :\n" + r.historique().get(r.historique().size() - 1).sortie());
      System.exit(1);
    }
  }
}
