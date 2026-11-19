using System.Diagnostics;
using System.Text.RegularExpressions;
using Guichet.Moteurs;

namespace Guichet.Outils;

/// <summary>
/// Atelier 2, étape A2.3 · la boucle générer → vérifier → corriger, avec une limite de tours.
/// Lancer sur une tâche : node guichet.mjs boucle taches/tronquer-resume.md
/// </summary>
public static class Boucle
{
    /// <summary>Ce qu'ont dit la garde et les tests (renvoyé tel quel au modèle).</summary>
    public sealed record Verification(bool Ok, string Sortie);

    /// <summary>Résultat de la boucle ; l'historique sert à l'humain en cas d'échec.</summary>
    public sealed record Resultat(bool Ok, int Tour, List<Verification> Historique);

    public static async Task<Resultat> Executer(string tache, Func<string, string, Task> generer, Func<Task<Verification>> verifier, int maxTours = 3)
    {
        var historique = new List<Verification>();
        var retours = "";
        for (var tour = 1; tour <= maxTours; tour++)
        {
            await generer(tache, retours);
            var r = await verifier();
            historique.Add(r);
            if (AFaire.Completer<bool>($"A2.3 : condition de sortie (tour {tour})")) return new Resultat(true, tour, historique);
            retours = AFaire.Completer<string>("A2.3 : que renvoie-t-on au modèle pour le tour suivant ?");
        }
        return AFaire.Completer<Resultat>($"A2.3 : résultat d’échec après {maxTours} tours, avec ce qu’il faut à un humain");
    }

    // ─── Lanceur (fourni) ────────────────────────────────────────────────────

    private static async Task<(int Code, string Sortie)> Lancer(params string[] args)
    {
        var psi = new ProcessStartInfo("node") { RedirectStandardOutput = true, RedirectStandardError = true, UseShellExecute = false, WorkingDirectory = Config.Racine };
        psi.ArgumentList.Add(Path.Combine(Config.Racine, "guichet.mjs"));
        foreach (var a in args) psi.ArgumentList.Add(a);
        using var p = Process.Start(psi)!;
        var sortie = await p.StandardOutput.ReadToEndAsync() + await p.StandardError.ReadToEndAsync();
        await p.WaitForExitAsync();
        return (p.ExitCode, sortie);
    }

    public static async Task<int> Principal(string fichierTache)
    {
        var tache = await File.ReadAllTextAsync(fichierTache);
        var m = Regex.Match(tache, @"^fichier-dotnet:\s*(.+)$", RegexOptions.Multiline);
        if (!m.Success)
        {
            Console.WriteLine("La tâche ne précise pas de « fichier-dotnet: ».");
            return 1;
        }
        var relatif = m.Groups[1].Value.Trim();
        var cible = Path.Combine(Config.Racine, relatif);
        var tours = 0;

        async Task Generer(string t, string retours)
        {
            tours++;
            Console.WriteLine($"Tour {tours} : génération{(retours.Length > 0 ? " avec les retours du tour précédent" : "")}…");
            var prompt = string.Join("\n", "<tache>", t, "</tache>", $"<fichier_actuel chemin=\"{relatif}\">", await File.ReadAllTextAsync(cible), "</fichier_actuel>",
                retours.Length > 0 ? $"<retours_de_verification>\n{retours}\n</retours_de_verification>\nCorrige le fichier pour que ces vérifications passent." : "",
                "Réponds uniquement avec le contenu complet du fichier, dans un seul bloc de code C#.");
            var reponse = (await MoteurCli.Lancer(["-p", "--output-format", "json"], prompt)).GetValueOrDefault("result") as string ?? "";
            var blocs = Regex.Matches(reponse, @"```[\w#-]*\r?\n([\s\S]*?)```").Select(x => x.Groups[1].Value).ToList();
            var code = blocs.Count > 0 ? blocs.MaxBy(b => b.Length)! : reponse;
            await File.WriteAllTextAsync(cible, code);
            Console.WriteLine($"  → {Path.GetFileName(cible)} réécrit");
        }

        async Task<Verification> Verifier()
        {
            var garde = await Lancer("garde");
            var tests = await Lancer("tests", "--tag", "BOUCLE", "--detail");
            var sortie = Regex.Replace(garde.Sortie + "\n" + tests.Sortie, @"\x1b\[\d+m", "");
            var v = new Verification(garde.Code == 0 && tests.Code == 0, sortie[Math.Max(0, sortie.Length - 6000)..]);
            Console.WriteLine($"  → vérification : {(v.Ok ? "OK" : "échec")}");
            return v;
        }

        var r = await Executer(tache, Generer, Verifier);
        if (r.Ok)
        {
            Console.WriteLine($"Réussi en {r.Tour} tour(s).");
            return 0;
        }
        Console.WriteLine($"Échec après {r.Tour} tours : à vous de regarder. Dernière vérification :\n{r.Historique.LastOrDefault()?.Sortie}");
        return 1;
    }
}
