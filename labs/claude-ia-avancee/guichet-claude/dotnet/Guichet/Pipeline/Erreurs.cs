namespace Guichet.Pipeline;

/// <summary>La sortie du modèle (ou du formulaire) ne respecte pas le contrat → 422.</summary>
public sealed class ErreurValidation(List<string> erreurs) : Exception($"Demande non conforme au contrat : {string.Join(" ; ", erreurs)}")
{
    public IReadOnlyList<string> Erreurs { get; } = erreurs;
}

/// <summary>Le dialogue avec le modèle n'a pas abouti (arrêt inattendu, trop de tours…) → 502.</summary>
public sealed class ErreurPipeline(string message) : Exception(message);
