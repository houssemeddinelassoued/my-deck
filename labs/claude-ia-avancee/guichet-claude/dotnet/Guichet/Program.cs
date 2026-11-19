// Serveur HTTP de Guichet : l'API et l'interface web (dossier web/ à la racine du dépôt).
//   node guichet.mjs lancer                 (application web)
//   node guichet.mjs boucle <tache.md>      (dotnet run -- boucle <tache.md>)
using Guichet;
using Guichet.Depot;
using Guichet.Domaine;
using Guichet.Moteurs;
using Guichet.Pipeline;
using Microsoft.Extensions.FileProviders;

if (args.Length >= 2 && args[0] == "boucle") return await Guichet.Outils.Boucle.Principal(args[1]);

var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
var moteur = IMoteurClaude.Choisir();
IDepot local = new DepotSqlite(Environment.GetEnvironmentVariable("GUICHET_DB") ?? Config.Chemin("donnees", "guichet.db"));
var depot = Environment.GetEnvironmentVariable("STOCKAGE") == "notion" ? new DepotNotion(local) : local;
var clients = Config.LireListe("donnees", "clients.json").Select(Client.Depuis).ToList();

var builder = WebApplication.CreateBuilder(new WebApplicationOptions { Args = args, ContentRootPath = Config.Chemin("dotnet", "Guichet") });
builder.Logging.SetMinimumLevel(LogLevel.Warning);
var app = builder.Build();

var web = new PhysicalFileProvider(Config.Chemin("web"));
app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = web });
app.UseStaticFiles(new StaticFileOptions { FileProvider = web });

IResult JsonUtf8(object? corps, int statut = 200) => Results.Content(Json.Ecrire(corps), "application/json; charset=utf-8", null, statut);

app.MapGet("/api/demandes", (string? client) => JsonUtf8(Filtre.ParClient(depot.Lister(), client)));
app.MapGet("/api/references", () => JsonUtf8(Config.LireListe("donnees", "demandes.json")));
app.MapPost("/api/demandes", async (HttpRequest req) =>
{
    var brut = Json.Objet(await new StreamReader(req.Body).ReadToEndAsync());
    var formulaire = brut.ToDictionary(kv => kv.Key, kv => kv.Value?.ToString() ?? "");
    if (string.IsNullOrWhiteSpace(formulaire.GetValueOrDefault("message"))) return JsonUtf8(new { erreur = "Le message est obligatoire." }, 422);
    try
    {
        var r = await Traiter.Executer(formulaire, new Traiter.Dependances(moteur, depot, clients));
        return JsonUtf8(new { demande = r.Demande, nouvelle = r.Nouvelle }, 201);
    }
    catch (ErreurValidation e)
    {
        return JsonUtf8(new { erreur = e.Message }, 422);
    }
    catch (NonImplemente e)
    {
        // Atelier 3 en cours : on montre au moins la réponse brute du moteur (A3.1).
        string brute;
        try { brute = await moteur.AppelSimple(formulaire["message"]); }
        catch (Exception e2) { brute = e2.Message; }
        return JsonUtf8(new { erreur = e.Message, reponse_brute = brute }, 501);
    }
    catch (Exception e)
    {
        Console.Error.WriteLine($"Erreur : {e}");
        return JsonUtf8(new { erreur = e.Message }, 502);
    }
});

Console.WriteLine($"Guichet (.NET, moteur {moteur.Nom}) : http://localhost:{port}");
await app.RunAsync($"http://localhost:{port}");
return 0;
