using Guichet.Depot;

namespace Guichet.Tests;

/// <summary>[A4.5] Filtre du tableau de bord par client.</summary>
[Trait("Category", "A4.5")]
public class FiltreTests
{
    private static List<Dictionary<string, object?>> Demandes() =>
    [
        new() { ["id"] = "D-1", ["client"] = "Médina Retail" },
        new() { ["id"] = "D-2", ["client"] = "Atlas Industrie" },
        new() { ["id"] = "D-3", ["client"] = "Médina Retail" },
    ];

    private static List<object?> Ids(List<Dictionary<string, object?>> l) => l.Select(d => d["id"]).ToList();

    [Fact]
    public void RecherchePartielle()
    {
        Assert.Equal(["D-1", "D-3"], Ids(Filtre.ParClient(Demandes(), "medina")));
        Assert.Equal(["D-2"], Ids(Filtre.ParClient(Demandes(), "ATLAS")));
    }

    [Fact]
    public void FiltreVide()
    {
        Assert.Equal(3, Filtre.ParClient(Demandes(), "").Count);
        Assert.Equal(3, Filtre.ParClient(Demandes(), null).Count);
    }

    [Fact]
    public void AucunResultat() => Assert.Empty(Filtre.ParClient(Demandes(), "zzz"));
}
