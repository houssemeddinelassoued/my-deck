package guichet.moteurs;

import com.fasterxml.jackson.core.type.TypeReference;
import guichet.Config;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Moteur « claude-cli » : le vrai modèle, via Claude Code en mode non interactif (claude -p) et votre licence.
 * Lancé depuis un dossier temporaire : ni CLAUDE.md, ni hooks, ni accès aux fichiers du dépôt.
 * Pas de boucle d'outils ici : le pipeline passe alors par l'extraction structurée.
 */
public final class MoteurCli implements MoteurClaude {
  private final String modele = System.getenv("GUICHET_MODELE_CLI"); // alias Claude Code : haiku, sonnet, opus… (facultatif)

  @Override
  public String nom() {
    return "claude-cli";
  }

  @Override
  public boolean saitConverser() {
    return false;
  }

  /** Lance claude -p et renvoie sa sortie JSON. Repli « cmd /c » pour une installation npm (claude.cmd). */
  public static Map<String, Object> lancer(List<String> args, String entree) {
    List<String> commande = new ArrayList<>(List.of("claude"));
    commande.addAll(args);
    try {
      Process p;
      try {
        p = new ProcessBuilder(commande).directory(Path.of(System.getProperty("java.io.tmpdir")).toFile()).start();
      } catch (IOException introuvable) {
        List<String> viaCmd = new ArrayList<>(List.of("cmd", "/c"));
        viaCmd.addAll(commande);
        p = new ProcessBuilder(viaCmd).directory(Path.of(System.getProperty("java.io.tmpdir")).toFile()).start();
      }
      p.getOutputStream().write(entree.getBytes(StandardCharsets.UTF_8));
      p.getOutputStream().close();
      String sortie = new String(p.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
      String erreurs = new String(p.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
      if (!p.waitFor(300, TimeUnit.SECONDS) || p.exitValue() != 0) {
        throw new IllegalStateException("claude -p a échoué : " + (erreurs.isBlank() ? sortie : erreurs));
      }
      Map<String, Object> json = Config.JSON.readValue(sortie, new TypeReference<>() {});
      if (Boolean.TRUE.equals(json.get("is_error"))) throw new IllegalStateException("claude -p : " + json.get("result"));
      return json;
    } catch (IOException e) {
      throw new IllegalStateException("claude introuvable ou illisible : " + e.getMessage(), e);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new IllegalStateException(e);
    }
  }

  private List<String> args(List<String> extra) {
    List<String> a = new ArrayList<>(List.of("-p", "--output-format", "json"));
    if (modele != null && !modele.isBlank()) a.addAll(List.of("--model", modele));
    a.addAll(extra);
    return a;
  }

  @Override
  public String appelSimple(String texte) {
    return String.valueOf(lancer(args(List.of()), texte).get("result"));
  }

  @Override
  @SuppressWarnings("unchecked")
  public Map<String, Object> extraire(String prompt, Map<String, Object> schema) {
    Map<String, Object> s = lancer(args(List.of("--json-schema", Config.versJson(schema))), prompt);
    Object structure = s.get("structured_output");
    return structure instanceof Map<?, ?> m ? (Map<String, Object>) m : MoteurApi.versObjet(String.valueOf(s.get("result")));
  }
}
