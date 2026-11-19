using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Anthropic.Models.Messages;
using Guichet.Depot;
using Guichet.Domaine;
using Guichet.Moteurs;
using Guichet.Prompts;

namespace Guichet.Pipeline;

/// <summary>Atelier 3, étape A3.3 · le pipeline : formulaire → normalisation → Claude (boucle d'outils) → base.</summary>
public static class Traiter
{
    public sealed record Dependances(IMoteurClaude Moteur, IDepot Depot, List<Client> Clients, DateOnly? Aujourdhui = null);

    public sealed record Resultat(Dictionary<string, object?> Demande, bool Nouvelle);

    private const string Systeme =
        "Tu enregistres les demandes clients du portail Guichet d’Oasis Digital. Utilise chercher_client pour retrouver le client, puis enregistrer_demande une seule fois avec les faits extraits. Termine par une phrase courte qui confirme l’enregistrement.";
    private const int MaxTours = 6;

    /// <summary>Clé d'idempotence : la même demande (e-mail + texte) donne toujours la même clé.</summary>
    public static string CleIdempotence(string? email, string? message)
    {
        var texte = Regex.Replace((message ?? "").Trim().ToLowerInvariant(), @"\s+", " ");
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes($"{(email ?? "").ToLowerInvariant()}|{texte}"))).ToLowerInvariant();
    }

    /// <summary>Reconstruit un bloc de réponse en paramètre de message (le SDK C# n'a pas de ToParam).</summary>
    public static ContentBlockParam? EnParametre(ContentBlock bloc)
    {
        if (bloc.TryPickText(out var texte)) return new TextBlockParam { Text = texte.Text };
        if (bloc.TryPickThinking(out var reflexion)) return new ThinkingBlockParam { Thinking = reflexion.Thinking, Signature = reflexion.Signature };
        if (bloc.TryPickRedactedThinking(out var masque)) return new RedactedThinkingBlockParam { Data = masque.Data };
        if (bloc.TryPickToolUse(out var appel)) return new ToolUseBlockParam { ID = appel.ID, Name = appel.Name, Input = appel.Input };
        return null;
    }

    public static async Task<Resultat> Executer(IReadOnlyDictionary<string, string> formulaire, Dependances deps)
    {
        var normalisee = Normaliseur.Normaliser(formulaire, deps.Aujourdhui ?? Config.Aujourdhui());
        var cle = CleIdempotence(normalisee.Email ?? formulaire.GetValueOrDefault("email"), formulaire.GetValueOrDefault("message"));
        if (deps.Depot.ParCle(cle) is { } deja) return new Resultat(deja, false);

        var ctx = new Outils.Contexte(formulaire, normalisee, cle, Contrat.ChargerSchema(), deps.Depot, deps.Clients);

        // Moteur sans boucle d'outils (claude-cli) : extraction structurée, puis les mêmes outils côté code.
        if (!deps.Moteur.SaitConverser)
        {
            var faits = await Extraction.Extraire(deps.Moteur, formulaire);
            var client = Outils.ChercherClient(deps.Clients, faits.GetValueOrDefault("client") as string, normalisee.Email);
            Outils.Executer("enregistrer_demande", new Dictionary<string, object?>(faits) { ["client_id"] = client["id"] }, ctx);
            return new Resultat(ctx.Resultat!, true);
        }

        var system = new List<TextBlockParam> { new() { Text = Systeme, CacheControl = new CacheControlEphemeral() } };
        var tools = Outils.Definitions(ctx.Schema);
        var messages = new List<MessageParam> { new UserMessageParam { Content = Gabarit.RendreExtraction(formulaire) } };

        for (var tour = 0; tour < MaxTours; tour++)
        {
            var rep = await deps.Moteur.Converser(system, tools, messages);
            var stop = rep.StopReason.Raw();
            if (stop == "end_turn") break;
            if (stop != "tool_use") throw new ErreurPipeline($"Arrêt inattendu du modèle : {stop}");
            // Tous les blocs de la réponse (texte, réflexion, tool_use) retournent dans l'historique.
            messages.Add(new AssistantMessageParam { Content = rep.Content.Select(EnParametre).OfType<ContentBlockParam>().ToList() });

            var resultats = new List<ContentBlockParam>();
            foreach (var bloc in rep.Content)
            {
                if (!bloc.TryPickToolUse(out var appel)) continue;
                try
                {
                    var entree = appel.Input.ToDictionary(kv => kv.Key, kv => Json.VersObjet(kv.Value));
                    var sortie = Outils.Executer(appel.Name, entree, ctx);
                    resultats.Add(new ToolResultBlockParam { ToolUseID = appel.ID, Content = Json.Ecrire(sortie) });
                }
                catch (Exception e)
                {
                    ctx.DerniereErreur = e;
                    // On ne lève pas : on signale l'erreur à Claude, qui peut corriger son appel.
                    resultats.Add(new ToolResultBlockParam { ToolUseID = appel.ID, IsError = true, Content = e.Message });
                }
            }
            // Tous les résultats dans UN seul message user.
            messages.Add(new UserMessageParam { Content = resultats });
        }

        if (ctx.Resultat is null) throw ctx.DerniereErreur ?? new ErreurPipeline("Le modèle n’a enregistré aucune demande.");
        return new Resultat(ctx.Resultat, true);
    }
}
