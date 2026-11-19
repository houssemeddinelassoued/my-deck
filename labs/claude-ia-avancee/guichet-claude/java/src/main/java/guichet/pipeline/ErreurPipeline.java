package guichet.pipeline;

/** Le dialogue avec le modèle n'a pas abouti (arrêt inattendu, trop de tours…) → 502. */
public final class ErreurPipeline extends RuntimeException {
  public ErreurPipeline(String message) {
    super(message);
  }
}
