using System.Text.RegularExpressions;
using Microsoft.Data.Sqlite;

namespace Guichet.Depot;

/// <summary>
/// Stockage SQLite (Microsoft.Data.Sqlite). Les colonnes suivent le contrat : un champ ajouté au schéma devient
/// une colonne au prochain enregistrement. Requêtes toujours paramétrées.
/// </summary>
public sealed class DepotSqlite : IDepot
{
    private static readonly (string Nom, string Type)[] Coeur =
    [
        ("id", "TEXT PRIMARY KEY"), ("cle", "TEXT"), ("cree_le", "TEXT NOT NULL"), ("statut", "TEXT NOT NULL DEFAULT 'ouverte'"),
        ("client_id", "TEXT"), ("message", "TEXT"), ("date_souhaitee", "TEXT"), ("budget_montant", "REAL"), ("budget_devise", "TEXT"),
    ];

    private readonly SqliteConnection db;
    private readonly HashSet<string> booleens = [];
    private readonly object verrou = new();

    public DepotSqlite(string fichier)
    {
        db = new SqliteConnection(fichier == ":memory:" ? "Data Source=:memory:" : $"Data Source={fichier}");
        db.Open();
        Executer(string.Join("", "CREATE TABLE IF NOT EXISTS demandes (", string.Join(", ", Coeur.Select(c => c.Nom + " " + c.Type)), ")"));
        // A3.5 : la base refuse deux demandes avec la même clé, même en cas de course.
        try { Executer("CREATE UNIQUE INDEX IF NOT EXISTS ux_demandes_cle ON demandes(cle)"); }
        catch (SqliteException e) { Console.Error.WriteLine($"Index d'unicité non créé (doublons déjà présents ?) : {e.Message}"); }
        Migrer();
    }

    private void Executer(string sql)
    {
        using var cmd = db.CreateCommand();
        cmd.CommandText = sql;
        cmd.ExecuteNonQuery();
    }

    private static string TypeSql(Dictionary<string, object?> d)
    {
        var t = d.GetValueOrDefault("type") ?? "string";
        var types = t is List<object?> l ? l : [t];
        return types.Contains("integer") || types.Contains("boolean") ? "INTEGER" : types.Contains("number") ? "REAL" : "TEXT";
    }

    /// <summary>Ajoute les colonnes des champs du contrat qui n'existent pas encore.</summary>
    private HashSet<string> Migrer()
    {
        var existantes = new HashSet<string>();
        using (var cmd = db.CreateCommand())
        {
            cmd.CommandText = "PRAGMA table_info(demandes)";
            using var r = cmd.ExecuteReader();
            while (r.Read()) existantes.Add(r.GetString(1));
        }
        foreach (var (champ, d) in Contrat.Proprietes(Contrat.ChargerSchema()))
        {
            var t = d.GetValueOrDefault("type");
            if (t is "boolean" || (t is List<object?> l && l.Contains("boolean"))) booleens.Add(champ);
            if (!existantes.Contains(champ) && Regex.IsMatch(champ, "^[a-z_][a-z0-9_]*$"))
            {
                Executer(string.Join(" ", "ALTER TABLE demandes ADD COLUMN", champ, TypeSql(d)));
                existantes.Add(champ);
            }
        }
        return existantes;
    }

    private List<Dictionary<string, object?>> Requete(string sql, params object?[] valeurs)
    {
        using var cmd = db.CreateCommand();
        cmd.CommandText = sql;
        for (var i = 0; i < valeurs.Length; i++) cmd.Parameters.AddWithValue($"$p{i}", valeurs[i] ?? DBNull.Value);
        using var r = cmd.ExecuteReader();
        var out_ = new List<Dictionary<string, object?>>();
        while (r.Read())
        {
            var d = new Dictionary<string, object?>();
            for (var i = 0; i < r.FieldCount; i++)
            {
                object? v = r.IsDBNull(i) ? null : r.GetValue(i);
                if (v is not null && booleens.Contains(r.GetName(i))) v = Convert.ToInt64(v) != 0;
                d[r.GetName(i)] = v;
            }
            out_.Add(d);
        }
        return out_;
    }

    private string ProchainId()
    {
        var r = Requete("SELECT MAX(CAST(SUBSTR(id, 3) AS INTEGER)) AS n FROM demandes WHERE id LIKE 'D-%'");
        var n = r.Count > 0 && r[0]["n"] is { } v ? Convert.ToInt64(v) : 2000;
        return $"D-{n + 1}";
    }

    public Dictionary<string, object?> Inserer(Dictionary<string, object?> demande)
    {
        lock (verrou)
        {
            var colonnes = Migrer();
            var ligne = new Dictionary<string, object?>(demande) { ["id"] = ProchainId(), ["cree_le"] = DateTime.UtcNow.ToString("o"), ["statut"] = "ouverte" };
            var champs = ligne.Keys.Where(colonnes.Contains).ToList();
            // Noms de colonnes issus du contrat (jamais du client) ; valeurs toujours passées en paramètres.
            var sql = string.Join("", "INSERT INTO demandes (", string.Join(", ", champs), ") VALUES (", string.Join(", ", champs.Select((_, i) => string.Concat("$p", i.ToString()))), ")");
            using (var cmd = db.CreateCommand())
            {
                cmd.CommandText = sql;
                for (var i = 0; i < champs.Count; i++)
                {
                    var v = ligne[champs[i]];
                    cmd.Parameters.AddWithValue("$p" + i, v is bool b ? (b ? 1 : 0) : v ?? DBNull.Value);
                }
                cmd.ExecuteNonQuery();
            }
            return Requete("SELECT * FROM demandes WHERE id = $p0", ligne["id"])[0];
        }
    }

    public List<Dictionary<string, object?>> Lister()
    {
        lock (verrou) return Requete("SELECT * FROM demandes ORDER BY cree_le DESC, id DESC");
    }

    public Dictionary<string, object?>? ParCle(string cle)
    {
        lock (verrou) return Requete("SELECT * FROM demandes WHERE cle = $p0", cle).FirstOrDefault();
    }
}
