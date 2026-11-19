namespace Guichet.Pipeline;

/// <summary>Atelier 3, étape A3.4 · comment le texte du client est présenté au modèle.</summary>
public static class MessageClient
{
    private static readonly string[] Champs = ["nom", "entreprise", "email", "telephone", "message"];

    // Provisoire : le texte du client est posé tel quel, au milieu de nos consignes.
    public static string Construire(IReadOnlyDictionary<string, string> formulaire) =>
        string.Join("\n", Champs.Select(c => $"{c}: {formulaire.GetValueOrDefault(c) ?? ""}"));
}
