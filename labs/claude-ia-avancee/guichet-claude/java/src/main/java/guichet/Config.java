package guichet;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

/** Chemins et réglages communs. GUICHET_RACINE est fourni par node guichet.mjs. */
public final class Config {
  private Config() {}

  public static final ObjectMapper JSON = new ObjectMapper();
  public static final Path RACINE = racine();
  public static final String MODELE = System.getenv().getOrDefault("GUICHET_MODELE", "claude-sonnet-5-5");

  private static Path racine() {
    String r = System.getenv("GUICHET_RACINE");
    if (r != null && !r.isBlank()) return Path.of(r);
    return Path.of("").toAbsolutePath().getParent();
  }

  public static Path chemin(String... parties) {
    return RACINE.resolve(Path.of("", parties));
  }

  public static String lireTexte(String... parties) {
    try {
      return Files.readString(chemin(parties), StandardCharsets.UTF_8);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  public static Map<String, Object> lireObjet(String... parties) {
    return lireJson(new TypeReference<>() {}, parties);
  }

  public static List<Map<String, Object>> lireListe(String... parties) {
    return lireJson(new TypeReference<>() {}, parties);
  }

  public static <T> T lireJson(TypeReference<T> type, String... parties) {
    try {
      return JSON.readValue(lireTexte(parties), type);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  public static String versJson(Object o) {
    try {
      return JSON.writeValueAsString(o);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  /** Date du jour à Tunis. */
  public static LocalDate aujourdhui() {
    return LocalDate.now(ZoneId.of("Africa/Tunis"));
  }
}
