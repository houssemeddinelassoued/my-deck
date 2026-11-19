package guichet.depot;

import guichet.Contrat;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Stockage SQLite (pilote JDBC xerial). Les colonnes suivent le contrat : un champ ajouté au schéma devient
 * une colonne au prochain enregistrement. Requêtes toujours paramétrées.
 */
public final class DepotSqlite implements Depot {
  private static final Map<String, String> COEUR = new LinkedHashMap<>();

  static {
    COEUR.put("id", "TEXT PRIMARY KEY");
    COEUR.put("cle", "TEXT");
    COEUR.put("cree_le", "TEXT NOT NULL");
    COEUR.put("statut", "TEXT NOT NULL DEFAULT 'ouverte'");
    COEUR.put("client_id", "TEXT");
    COEUR.put("message", "TEXT");
    COEUR.put("date_souhaitee", "TEXT");
    COEUR.put("budget_montant", "REAL");
    COEUR.put("budget_devise", "TEXT");
  }

  private final Connection db;
  private final Set<String> booleens = new HashSet<>();

  public DepotSqlite(String fichier) {
    try {
      db = DriverManager.getConnection("jdbc:sqlite:" + fichier);
      List<String> colonnes = new ArrayList<>();
      COEUR.forEach((c, t) -> colonnes.add(c + " " + t));
      try (Statement st = db.createStatement()) {
        st.executeUpdate(String.join("", "CREATE TABLE IF NOT EXISTS demandes (", String.join(", ", colonnes), ")"));
      }
      // A3.5 : la base refuse deux demandes avec la même clé, même en cas de course.
      try (Statement st = db.createStatement()) {
        st.executeUpdate("CREATE UNIQUE INDEX IF NOT EXISTS ux_demandes_cle ON demandes(cle)");
      } catch (SQLException e) {
        System.err.println("Index d'unicité non créé (doublons déjà présents ?) : " + e.getMessage());
      }
      migrer();
    } catch (SQLException e) {
      throw new IllegalStateException("Base SQLite inaccessible : " + e.getMessage(), e);
    }
  }

  private static String typeSql(Map<String, Object> d) {
    Object t = d.getOrDefault("type", "string");
    List<?> types = t instanceof List<?> l ? l : List.of(t);
    return types.contains("integer") || types.contains("boolean") ? "INTEGER" : types.contains("number") ? "REAL" : "TEXT";
  }

  /** Ajoute les colonnes des champs du contrat qui n'existent pas encore. */
  private Set<String> migrer() throws SQLException {
    Set<String> existantes = new HashSet<>();
    try (Statement st = db.createStatement(); ResultSet rs = st.executeQuery("PRAGMA table_info(demandes)")) {
      while (rs.next()) existantes.add(rs.getString("name"));
    }
    for (var e : Contrat.proprietes(Contrat.chargerSchema()).entrySet()) {
      String champ = e.getKey();
      Object t = e.getValue().get("type");
      if (t != null && (t.equals("boolean") || (t instanceof List<?> l && l.contains("boolean")))) booleens.add(champ);
      if (!existantes.contains(champ) && champ.matches("[a-z_][a-z0-9_]*")) {
        try (Statement st = db.createStatement()) {
          st.executeUpdate(String.join(" ", "ALTER TABLE demandes ADD COLUMN", champ, typeSql(e.getValue())));
        }
        existantes.add(champ);
      }
    }
    return existantes;
  }

  private Map<String, Object> versDemande(ResultSet rs) throws SQLException {
    ResultSetMetaData md = rs.getMetaData();
    Map<String, Object> d = new LinkedHashMap<>();
    for (int i = 1; i <= md.getColumnCount(); i++) {
      String c = md.getColumnName(i);
      Object v = rs.getObject(i);
      if (v != null && booleens.contains(c)) v = ((Number) v).intValue() != 0;
      d.put(c, v);
    }
    return d;
  }

  private List<Map<String, Object>> requete(String sql, Object... valeurs) throws SQLException {
    try (PreparedStatement ps = db.prepareStatement(sql)) {
      for (int i = 0; i < valeurs.length; i++) ps.setObject(i + 1, valeurs[i]);
      try (ResultSet rs = ps.executeQuery()) {
        List<Map<String, Object>> out = new ArrayList<>();
        while (rs.next()) out.add(versDemande(rs));
        return out;
      }
    }
  }

  private String prochainId() throws SQLException {
    try (Statement st = db.createStatement(); ResultSet rs = st.executeQuery("SELECT MAX(CAST(SUBSTR(id, 3) AS INTEGER)) FROM demandes WHERE id LIKE 'D-%'")) {
      long n = rs.next() ? rs.getLong(1) : 0;
      return "D-" + ((n == 0 ? 2000 : n) + 1);
    }
  }

  @Override
  public synchronized Map<String, Object> inserer(Map<String, Object> demande) {
    try {
      Set<String> colonnes = migrer();
      Map<String, Object> ligne = new LinkedHashMap<>(demande);
      ligne.put("id", prochainId());
      ligne.put("cree_le", Instant.now().toString());
      ligne.put("statut", "ouverte");
      List<String> champs = ligne.keySet().stream().filter(colonnes::contains).toList();
      // Noms de colonnes issus du contrat (jamais du client) ; valeurs toujours passées en paramètres.
      String sql = String.join("", "INSERT INTO demandes (", String.join(", ", champs), ") VALUES (", String.join(", ", Collections.nCopies(champs.size(), "?")), ")");
      try (PreparedStatement ps = db.prepareStatement(sql)) {
        for (int i = 0; i < champs.size(); i++) {
          Object v = ligne.get(champs.get(i));
          ps.setObject(i + 1, v instanceof Boolean b ? (b ? 1 : 0) : v);
        }
        ps.executeUpdate();
      }
      return requete("SELECT * FROM demandes WHERE id = ?", ligne.get("id")).get(0);
    } catch (SQLException e) {
      throw new IllegalStateException("Enregistrement impossible : " + e.getMessage(), e);
    }
  }

  @Override
  public synchronized List<Map<String, Object>> lister() {
    try {
      return requete("SELECT * FROM demandes ORDER BY cree_le DESC, id DESC");
    } catch (SQLException e) {
      throw new IllegalStateException(e);
    }
  }

  @Override
  public synchronized Map<String, Object> parCle(String cle) {
    try {
      List<Map<String, Object>> r = requete("SELECT * FROM demandes WHERE cle = ?", cle);
      return r.isEmpty() ? null : r.get(0);
    } catch (SQLException e) {
      throw new IllegalStateException(e);
    }
  }
}
