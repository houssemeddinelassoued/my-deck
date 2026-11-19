package guichet.domaine;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Atelier 1 · version de référence (corrigé). En atelier, ce fichier est généré par Claude à partir du prompt v3. */
public final class Normaliseur {
  private Normaliseur() {}

  private static boolean vide(String s) {
    return s == null || s.isBlank();
  }

  private static String espaces(String s) {
    return s.replace(' ', ' ').replace(' ', ' ');
  }

  public static String telephone(String brut) {
    if (vide(brut)) return null;
    String t = espaces(brut).replace("(0)", "").replaceAll("[\\s.\\-()]", "");
    Matcher m;
    if ((m = Pattern.compile("^(?:\\+|00)216(\\d{8})$").matcher(t)).matches()) return "+216" + m.group(1);
    if (t.matches("^[2-9]\\d{7}$")) return "+216" + t;
    if ((m = Pattern.compile("^(?:\\+|00)33(\\d{9})$").matcher(t)).matches()) return "+33" + m.group(1);
    if ((m = Pattern.compile("^0(\\d{9})$").matcher(t)).matches()) return "+33" + m.group(1);
    return null;
  }

  public static String email(String brut) {
    if (vide(brut)) return null;
    String e = espaces(brut).replaceAll("\\s+", "").toLowerCase(Locale.ROOT);
    return e.matches("^[^@\\s]+@[^@\\s]+\\.[a-z]{2,}$") ? e : null;
  }

  private static String iso(int a, int m, int j) {
    try {
      return LocalDate.of(a, m, j).toString();
    } catch (DateTimeException e) {
      return null;
    }
  }

  public static String date(String brut, LocalDate aujourdhui) {
    if (vide(brut)) return null;
    String t = espaces(brut).trim().toLowerCase(Locale.ROOT);
    switch (t) {
      case "aujourd'hui", "aujourd’hui" -> {
        return aujourdhui.toString();
      }
      case "demain" -> {
        return aujourdhui.plusDays(1).toString();
      }
      case "hier" -> {
        return aujourdhui.minusDays(1).toString();
      }
      default -> {}
    }
    Matcher m;
    if ((m = Pattern.compile("^(\\d{4})-(\\d{2})-(\\d{2})$").matcher(t)).matches()) return iso(Integer.parseInt(m.group(1)), Integer.parseInt(m.group(2)), Integer.parseInt(m.group(3)));
    if ((m = Pattern.compile("^(\\d{1,2})/(\\d{1,2})/(\\d{4})$").matcher(t)).matches()) return iso(Integer.parseInt(m.group(3)), Integer.parseInt(m.group(2)), Integer.parseInt(m.group(1)));
    if ((m = Pattern.compile("^(\\d{1,2})/(\\d{1,2})$").matcher(t)).matches()) return iso(aujourdhui.getYear(), Integer.parseInt(m.group(2)), Integer.parseInt(m.group(1)));
    return null;
  }

  public static Demande.Budget budget(String brut) {
    if (vide(brut)) return null;
    String t = espaces(brut).toLowerCase(Locale.ROOT);
    String devise;
    if (Pattern.compile("\\b(dt|tnd|dinars?)\\b").matcher(t).find()) devise = "TND";
    else if (Pattern.compile("€|\\beur\\b|\\beuros?\\b").matcher(t).find()) devise = "EUR";
    else return null;
    Matcher n = Pattern.compile("\\d[\\d\\s.,]*").matcher(t);
    if (!n.find()) return null;
    String s = n.group().trim().replaceAll("\\s+", "");
    if (s.contains(".") && s.contains(",")) s = s.replace(".", "").replace(',', '.');
    else if (s.contains(",")) s = s.replace(',', '.');
    try {
      return new Demande.Budget(Double.parseDouble(s), devise);
    } catch (NumberFormatException e) {
      return null;
    }
  }

  public static Demande.Normalisee normaliser(Map<String, String> brute, LocalDate aujourdhui) {
    return new Demande.Normalisee(
        email(brute.get("email")), telephone(brute.get("telephone")), date(brute.get("date_souhaitee"), aujourdhui), budget(brute.get("budget")));
  }
}
