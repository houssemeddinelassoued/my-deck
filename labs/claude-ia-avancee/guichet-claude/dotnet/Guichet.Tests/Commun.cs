using Guichet.Depot;
using Guichet.Domaine;
using Guichet.Moteurs;
using Guichet.Pipeline;

namespace Guichet.Tests;

/// <summary>Outils partagés par les tests : les cas viennent de donnees/, communs aux 4 stacks.</summary>
public static class Commun
{
    public static Dictionary<string, object?> Cas(string fichier) => Config.LireObjet("donnees", fichier);

    public static IEnumerable<object[]> Liste(string fichier) =>
        ((List<object?>)Cas(fichier)["cas"]!).Select(c => new object[] { new CasDeTest((Dictionary<string, object?>)c!) });

    public static Dictionary<string, string> Reference(int id)
    {
        var d = Config.LireListe("donnees", "demandes.json").Cast<Dictionary<string, object?>>().First(x => Convert.ToInt32(x["id"]) == id);
        return ((Dictionary<string, object?>)d["formulaire"]!).ToDictionary(kv => kv.Key, kv => kv.Value?.ToString() ?? "");
    }

    public static Traiter.Dependances Dependances(IDepot depot) =>
        new(new MoteurApi(), depot, Config.LireListe("donnees", "clients.json").Select(Client.Depuis).ToList(), new DateOnly(2026, 11, 14));
}

/// <summary>Un cas de test lisible dans l'explorateur de tests.</summary>
public sealed record CasDeTest(Dictionary<string, object?> Donnees)
{
    public object? this[string cle] => Donnees.GetValueOrDefault(cle);
    public override string ToString() => Json.Ecrire(Donnees);
}
