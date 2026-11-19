using System.Globalization;
using System.Text;
using System.Text.Json;
using Anthropic.Models.Messages;
using Guichet.Depot;
using Guichet.Domaine;

namespace Guichet.Pipeline;

/// <summary>
/// Atelier 3, étape A3.3 · les outils que Claude peut DEMANDER. C'est ce code qui les exécute.
/// Moindre privilège : chercher, consulter un contrat, enregistrer. Rien pour modifier ou supprimer.
/// </summary>
public static class Outils
{
    public sealed class Contexte(IReadOnlyDictionary<string, string> formulaire, Normalisee normalisee, string cle, Dictionary<string, object?> schema, IDepot depot, List<Client> clients)
    {
        public IReadOnlyDictionary<string, string> Formulaire { get; } = formulaire;
        public Normalisee Normalisee { get; } = normalisee;
        public string Cle { get; } = cle;
        public Dictionary<string, object?> Schema { get; } = schema;
        public IDepot Depot { get; } = depot;
        public List<Client> Clients { get; } = clients;
        public Dictionary<string, object?>? Resultat { get; set; }
        public Exception? DerniereErreur { get; set; }
    }

    private static Tool Outil(string nom, string description, Dictionary<string, object?> proprietes, List<string> requis) => new()
    {
        Name = nom,
        Description = description,
        Strict = true,
        InputSchema = new InputSchema(new Dictionary<string, JsonElement>
        {
            ["type"] = Json.Element("object"),
            ["properties"] = Json.Element(proprietes),
            ["required"] = Json.Element(requis),
            ["additionalProperties"] = Json.Element(false),
        }),
    };

    public static List<Tool> Definitions(Dictionary<string, object?> schema)
    {
        var modele = Contrat.SchemaPourModele(schema);
        var proprietes = new Dictionary<string, object?> { ["client_id"] = new Dictionary<string, object?> { ["type"] = new List<object?> { "string", "null" } } };
        foreach (var (k, v) in (Dictionary<string, object?>)modele["properties"]!) proprietes[k] = v;
        var requis = new List<string> { "client_id" };
        requis.AddRange(((List<object?>)modele["required"]!).Select(x => (string)x!));
        return
        [
            Outil("chercher_client",
                "Retrouve un client d’Oasis Digital par le nom de son entreprise ou par son e-mail. À appeler en premier, avant enregistrer_demande, pour obtenir son identifiant (client_id) et son niveau de contrat.",
                new() { ["recherche"] = new Dictionary<string, object?> { ["type"] = "string", ["description"] = "nom de l’entreprise ou e-mail" } }, ["recherche"]),
            Outil("verifier_contrat",
                "Donne le niveau de contrat (bronze, argent, or) d’un client à partir de son client_id.",
                new() { ["client_id"] = new Dictionary<string, object?> { ["type"] = "string" } }, ["client_id"]),
            Outil("enregistrer_demande",
                "Enregistre la demande qualifiée. À appeler une seule fois, après chercher_client, avec les faits extraits du message et le client_id trouvé (null si le client est inconnu). La priorité définitive est recalculée par le système.",
                proprietes, requis),
        ];
    }

    private static string SansAccents(string? s) =>
        new string((s ?? "").Normalize(NormalizationForm.FormD).Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark).ToArray()).ToLowerInvariant().Trim();

    public static Dictionary<string, object?> ChercherClient(List<Client> clients, string? recherche, string? email)
    {
        var r = SansAccents(recherche);
        var c = (r.Length > 0 ? clients.FirstOrDefault(x => SansAccents(x.Nom).Contains(r) || r.Contains(SansAccents(x.Nom))) : null)
                ?? (email is null ? null : clients.FirstOrDefault(x => email.EndsWith("@" + x.Domaine)));
        return c is null
            ? new() { ["id"] = null, ["trouve"] = false, ["message"] = "Aucun client ne correspond." }
            : new() { ["id"] = c.Id, ["nom"] = c.Nom, ["contrat"] = c.Contrat };
    }

    private static Dictionary<string, object?> Enregistrer(Dictionary<string, object?> entree, Contexte ctx)
    {
        var faits = new Dictionary<string, object?>(entree);
        faits.Remove("client_id", out var clientId);
        var erreurs = Validation.Valider(faits, Contrat.ContratModele(ctx.Schema));
        if (erreurs.Count > 0) throw new ErreurValidation(erreurs);
        var client = ctx.Clients.FirstOrDefault(c => Equals(c.Id, clientId));

        var demande = new Dictionary<string, object?>(faits)
        {
            ["client_id"] = client?.Id,
            ["priorite"] = Priorite.Calculer(faits, client?.Contrat),
            ["resume"] = Texte.TronquerResume(faits.GetValueOrDefault("resume") as string, 280),
            ["email"] = faits.GetValueOrDefault("email") ?? ctx.Normalisee.Email,
            ["telephone"] = faits.GetValueOrDefault("telephone") ?? ctx.Normalisee.Telephone,
            ["cle"] = ctx.Cle,
            ["message"] = ctx.Formulaire.GetValueOrDefault("message"),
            ["date_souhaitee"] = ctx.Normalisee.DateSouhaitee,
            ["budget_montant"] = ctx.Normalisee.Budget?.Montant,
            ["budget_devise"] = ctx.Normalisee.Budget?.Devise,
        };
        // Champs « formulaire » du contrat : recopiés tels quels (A4.2 : site_web…).
        foreach (var champ in Contrat.ChampsDeSource(ctx.Schema, "formulaire"))
        {
            var v = ctx.Formulaire.GetValueOrDefault(champ);
            demande[champ] = string.IsNullOrWhiteSpace(v) ? null : v.Trim();
        }
        ctx.Resultat = ctx.Depot.Inserer(Enrichissement.Enrichir(demande));
        return new() { ["demande"] = ctx.Resultat["id"], ["priorite"] = ctx.Resultat["priorite"] };
    }

    public static object Executer(string nom, Dictionary<string, object?> entree, Contexte ctx) => nom switch
    {
        "chercher_client" => ChercherClient(ctx.Clients, entree.GetValueOrDefault("recherche") as string, ctx.Normalisee.Email),
        "verifier_contrat" => ctx.Clients.FirstOrDefault(x => Equals(x.Id, entree.GetValueOrDefault("client_id"))) is { } c
            ? new Dictionary<string, object?> { ["client_id"] = c.Id, ["contrat"] = c.Contrat }
            : throw new ArgumentException($"client_id inconnu : {entree.GetValueOrDefault("client_id")}"),
        "enregistrer_demande" => Enregistrer(entree, ctx),
        _ => throw new ArgumentException($"Outil inconnu : {nom}"),
    };
}
