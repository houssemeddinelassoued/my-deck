using Guichet.Outils;

namespace Guichet.Tests;

/// <summary>[A2.3] Boucle générer → vérifier → corriger, avec un générateur et un vérificateur simulés.</summary>
[Trait("Category", "A2.3")]
public class BoucleTests
{
    [Fact]
    public async Task SArreteAuPremierTourVert()
    {
        var tours = 0;
        var r = await Boucle.Executer("t", (_, _) => { tours++; return Task.CompletedTask; }, () => Task.FromResult(new Boucle.Verification(tours == 2, $"sortie {tours}")));
        Assert.True(r.Ok);
        Assert.Equal(2, r.Tour);
    }

    [Fact]
    public async Task RenvoieLaSortieExacte()
    {
        var recus = new List<string>();
        var n = 0;
        await Boucle.Executer("t", (_, retours) => { recus.Add(retours); return Task.CompletedTask; }, () =>
        {
            n++;
            return Task.FromResult(new Boucle.Verification(n == 3, $"✗ sql-concatene ligne {n}"));
        });
        Assert.Equal(["", "✗ sql-concatene ligne 1", "✗ sql-concatene ligne 2"], recus);
    }

    [Fact]
    public async Task EchoueApresTroisTours()
    {
        var r = await Boucle.Executer("t", (_, _) => Task.CompletedTask, () => Task.FromResult(new Boucle.Verification(false, "rouge")));
        Assert.False(r.Ok);
        Assert.Equal(3, r.Historique.Count);
    }
}
