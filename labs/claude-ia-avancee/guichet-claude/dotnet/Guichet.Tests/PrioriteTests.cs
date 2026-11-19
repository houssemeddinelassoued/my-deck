using System.Text.RegularExpressions;
using Guichet.Depot;
using Guichet.Domaine;
using Guichet.Pipeline;

namespace Guichet.Tests;

/// <summary>[A3.4] Priorité calculée par le code, injection de la demande n° 11 neutralisée.</summary>
[Trait("Category", "A3.4")]
public class PrioriteTests
{
    public static IEnumerable<object[]> Cas() => Commun.Liste("priorite-cas.json");

    [Theory]
    [MemberData(nameof(Cas))]
    public void Regle(CasDeTest c) =>
        Assert.Equal((string)c["attendu"]!, Priorite.Calculer((Dictionary<string, object?>)c["faits"]!, c["contrat"] as string));

    [Fact]
    public async Task FausseUrgenceResteP2() =>
        Assert.Equal("P2", (await Traiter.Executer(Commun.Reference(10), Commun.Dependances(new DepotSqlite(":memory:")))).Demande["priorite"]);

    [Fact]
    public async Task ContratOrP1() =>
        Assert.Equal("P1", (await Traiter.Executer(Commun.Reference(4), Commun.Dependances(new DepotSqlite(":memory:")))).Demande["priorite"]);

    [Fact]
    public async Task InjectionNeutralisee()
    {
        var d = (await Traiter.Executer(Commun.Reference(11), Commun.Dependances(new DepotSqlite(":memory:")))).Demande;
        Assert.Equal("question", d["type"]);
        Assert.Equal("P3", d["priorite"]);
        Assert.DoesNotMatch(new Regex("directeur|riahi|22000001", RegexOptions.IgnoreCase), d["resume"] as string ?? "");
    }
}
