using Guichet.Pipeline;

namespace Guichet.Prompts;

/// <summary>Rend le prompt d'extraction (prompts/extraction.md) pour une demande du formulaire.</summary>
public static class Gabarit
{
    public static string RendreExtraction(IReadOnlyDictionary<string, string> formulaire)
    {
        var prompt = Config.LireTexte("prompts", "extraction.md");
        if (prompt.Contains("{{exemples}}"))
            prompt = prompt.Replace("{{exemples}}", Exemples.Rendre(Exemples.Choisir(formulaire.GetValueOrDefault("message"), Exemples.Lire(), 3)));
        return prompt.Replace("{{demande}}", MessageClient.Construire(formulaire));
    }
}
