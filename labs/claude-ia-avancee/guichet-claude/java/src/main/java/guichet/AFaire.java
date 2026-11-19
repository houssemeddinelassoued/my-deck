package guichet;

/** Marque un trou de l'énoncé : le code compile, mais lève une erreur claire à l'exécution. */
public final class AFaire {
  private AFaire() {}

  public static final class NonImplemente extends RuntimeException {
    public NonImplemente(String quoi) {
      super("À compléter · " + quoi);
    }
  }

  public static <T> T completer(String quoi) {
    throw new NonImplemente(quoi);
  }
}
