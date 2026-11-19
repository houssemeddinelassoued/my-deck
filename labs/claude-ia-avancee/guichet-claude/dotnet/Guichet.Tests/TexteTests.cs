using Guichet.Domaine;

namespace Guichet.Tests;

/// <summary>[BOUCLE] Tâche de la boucle : TronquerResume (donnees/texte-cas.json).</summary>
[Trait("Category", "BOUCLE")]
public class TexteTests
{
    public static IEnumerable<object[]> Cas() => Commun.Liste("texte-cas.json");

    [Theory]
    [MemberData(nameof(Cas))]
    public void Tronque(CasDeTest c)
    {
        var max = Convert.ToInt32(c["max"]);
        var r = Texte.TronquerResume((string)c["texte"]!, max);
        Assert.Equal((string)c["attendu"]!, r);
        Assert.True(r.Length <= max);
    }
}
