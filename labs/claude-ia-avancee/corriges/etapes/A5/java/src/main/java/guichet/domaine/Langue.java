package guichet.domaine;

import java.util.Locale;
import java.util.Set;

/**
 * Défi final (Atelier 5) · langue de la demande et équipe de routage.
 * Heuristique déterministe et testable : on compte les mots-outils de chaque langue.
 * Voir decisions/langue.md pour les pistes écartées (appel au modèle, bibliothèque externe).
 */
public final class Langue {
  private Langue() {}

  private static final Set<String> EN = Set.of("the", "is", "are", "our", "your", "you", "we", "it", "and", "to", "of", "an", "for", "with", "has", "have", "been", "since", "could", "would", "when", "can", "please", "hello", "about", "this", "that", "not", "be", "on", "in", "at", "whole");
  private static final Set<String> FR = Set.of("le", "la", "les", "de", "des", "du", "un", "une", "et", "est", "sont", "ne", "pas", "plus", "notre", "nos", "votre", "vous", "nous", "depuis", "pour", "avec", "sur", "dans", "merci", "bonjour", "à", "au", "aux", "ce", "cette", "qui", "que", "en");

  public static String detecter(String texte) {
    int en = 0;
    int fr = 0;
    for (String m : (texte == null ? "" : texte).toLowerCase(Locale.ROOT).split("[^\\p{L}]+")) {
      if (EN.contains(m)) en++;
      if (FR.contains(m)) fr++;
    }
    return en > fr ? "en" : "fr";
  }

  public static String equipePour(String langue) {
    return "en".equals(langue) ? "Europe" : "Tunis";
  }
}
