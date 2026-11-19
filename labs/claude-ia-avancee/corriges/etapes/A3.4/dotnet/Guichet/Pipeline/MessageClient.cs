using System.Text.RegularExpressions;

namespace Guichet.Pipeline;

/// <summary>
/// Atelier 3, étape A3.4 · comment le texte du client est présenté au modèle.
/// Le texte du formulaire est une DONNÉE non fiable : il est délimité, et le prompt le dit.
/// </summary>
public static class MessageClient
{
    private static readonly string[] Champs = ["nom", "entreprise", "email", "telephone", "message"];

    // On retire toute balise que le client aurait glissée pour « sortir » du bloc.
    private static string Propre(string? s) => Regex.Replace(s ?? "", "</?demande_client>", "", RegexOptions.IgnoreCase);

    public static string Construire(IReadOnlyDictionary<string, string> formulaire) =>
        string.Join("\n", ["<demande_client>", .. Champs.Select(c => $"{c}: {Propre(formulaire.GetValueOrDefault(c))}"), "</demande_client>"]);
}
