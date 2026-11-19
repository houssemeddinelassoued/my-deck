using System.Text.RegularExpressions;

namespace Guichet.Domaine;

/// <summary>
/// Défi final (Atelier 5) · langue de la demande et équipe de routage.
/// Heuristique déterministe et testable : on compte les mots-outils de chaque langue.
/// Voir decisions/langue.md pour les pistes écartées (appel au modèle, bibliothèque externe).
/// </summary>
public static class Langue
{
    private static readonly HashSet<string> En = ["the", "is", "are", "our", "your", "you", "we", "it", "and", "to", "of", "an", "for", "with", "has", "have", "been", "since", "could", "would", "when", "can", "please", "hello", "about", "this", "that", "not", "be", "on", "in", "at", "whole"];
    private static readonly HashSet<string> Fr = ["le", "la", "les", "de", "des", "du", "un", "une", "et", "est", "sont", "ne", "pas", "plus", "notre", "nos", "votre", "vous", "nous", "depuis", "pour", "avec", "sur", "dans", "merci", "bonjour", "à", "au", "aux", "ce", "cette", "qui", "que", "en"];

    public static string Detecter(string? texte)
    {
        var mots = Regex.Split((texte ?? "").ToLowerInvariant(), @"[^\p{L}]+").Where(m => m.Length > 0).ToList();
        var en = mots.Count(En.Contains);
        var fr = mots.Count(Fr.Contains);
        return en > fr ? "en" : "fr";
    }

    public static string EquipePour(string langue) => langue == "en" ? "Europe" : "Tunis";
}
