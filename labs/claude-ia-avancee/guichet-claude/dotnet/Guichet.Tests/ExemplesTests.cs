using Guichet.Prompts;

namespace Guichet.Tests;

/// <summary>[A1.3] Exemples dynamiques : sélection par mots-clés, un exemple par type, tri stable.</summary>
[Trait("Category", "A1.3")]
public class ExemplesTests
{
    public static IEnumerable<object[]> Cas() => Commun.Liste("exemples-cas.json");

    [Theory]
    [MemberData(nameof(Cas))]
    public void Choisit(CasDeTest c)
    {
        var ids = Exemples.Choisir((string)c["texte"]!, Exemples.Lire(), Convert.ToInt32(c["k"])).Select(e => e.Id).ToList();
        Assert.Equal(((List<object?>)c["attendu"]!).Cast<string>().ToList(), ids);
    }
}
