using Guichet.Moteurs;
using Guichet.Pipeline;

namespace Guichet.Tests;

/// <summary>[A3.2] Extraction structurée : sorties conformes au contrat, refus des demandes incomplètes.</summary>
[Trait("Category", "A3.2")]
public class ExtractionTests
{
    [Fact]
    public async Task DevisSahel()
    {
        var faits = await Extraction.Extraire(new MoteurApi(), Commun.Reference(3));
        Assert.Equal("devis", faits["type"]);
        Assert.Equal("Sahel Logistique", faits["client"]);
    }

    [Fact]
    public async Task DemandeIncompleteRefusee()
    {
        await Assert.ThrowsAsync<ErreurValidation>(() => Extraction.Extraire(new MoteurApi(), Commun.Reference(12)));
    }
}
