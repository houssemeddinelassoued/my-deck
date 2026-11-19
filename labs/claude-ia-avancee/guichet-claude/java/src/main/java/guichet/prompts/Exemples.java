package guichet.prompts;

import com.fasterxml.jackson.core.type.TypeReference;
import guichet.AFaire;
import guichet.Config;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/** Atelier 1, étape A1.3 · exemples dynamiques (few-shot) choisis par le code selon la demande. */
public final class Exemples {
  private Exemples() {}

  public record Exemple(String id, String type, String texte, Map<String, Object> sortie) {}

  private record Note(Exemple ex, int score) {}

  private static final Set<String> STOP = Set.of("avec", "pour", "dans", "depuis", "nous", "notre", "votre", "vous", "sont", "plus", "cette", "mais", "the", "and", "with", "from", "this", "that", "have", "been", "merci", "bonjour", "pouvez", "pourriez");

  /** Mots de 4 lettres ou plus, en minuscules, sans les mots vides. Fourni. */
  public static Set<String> motsCles(String texte) {
    return Arrays.stream((texte == null ? "" : texte).toLowerCase(Locale.ROOT).split("[^\\p{L}\\p{N}]+"))
        .filter(m -> m.length() >= 4 && !STOP.contains(m))
        .collect(Collectors.toSet());
  }

  public static List<Exemple> lire() {
    List<Exemple> out = new ArrayList<>();
    for (String ligne : Config.lireTexte("donnees", "exemples.jsonl").strip().split("\\R")) {
      try {
        out.add(Config.JSON.readValue(ligne, new TypeReference<Exemple>() {}));
      } catch (IOException e) {
        throw new UncheckedIOException(e);
      }
    }
    return out;
  }

  /**
   * Les k exemples les plus proches du texte, un seul par type.
   * Score = nombre de mots-clés en commun ; à score égal, l'ordre du fichier est conservé.
   */
  public static List<Exemple> choisir(String texte, List<Exemple> tous, int k) {
    Set<String> mots = motsCles(texte);
    List<Note> notes = new ArrayList<>();
    for (Exemple ex : tous) notes.add(new Note(ex, AFaire.<Integer>completer("A1.3 : score = mots en commun (" + mots.size() + " mots-clés)")));
    notes.sort(AFaire.<Comparator<Note>>completer("A1.3 : ordre de tri"));
    List<Exemple> choisis = new ArrayList<>();
    for (Note n : notes) {
      if (choisis.stream().anyMatch(c -> AFaire.<Boolean>completer("A1.3 : même type que " + c.id() + " ?"))) continue;
      choisis.add(n.ex());
      if (choisis.size() == k) break;
    }
    return choisis;
  }

  public static String rendre(List<Exemple> exemples) {
    return exemples.stream()
        .map(e -> "<exemple>\n<entree>" + e.texte() + "</entree>\n<sortie>" + Config.versJson(e.sortie()) + "</sortie>\n</exemple>")
        .collect(Collectors.joining("\n"));
  }
}
