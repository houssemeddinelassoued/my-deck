// TaskFlow · modèle de ticket, variante Java — CORRIGÉ. JDK 21+.
// Exécuter sans compilation séparée :   java katas/java/Ticket.java
// La méthode main() contient les tests d'acceptation : « 6/6 OK » attendu.

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public record Ticket(int id, String titre, String type, int priorite, Integer points, String statut, String creeLe) {

    // 1. Constantes : TYPES, STATUTS, PRIORITES, POINTS_VALIDES (Set.of(...), donc immuables)
    static final Set<String> TYPES = Set.of("story", "bug", "tache");
    static final Set<String> STATUTS = Set.of("backlog", "afaire", "encours", "termine");
    static final Set<Integer> PRIORITES = Set.of(1, 2, 3);
    static final Set<Integer> POINTS_VALIDES = Set.of(1, 2, 3, 5, 8, 13);


    // 2. static boolean estPointsValide(Integer points) : null ou valeur de POINTS_VALIDES
    static boolean estPointsValide(Integer points) {
        return points == null || POINTS_VALIDES.contains(points);
    }


    // 3. static List<String> valider(String titre, String type, int priorite, Integer points, String statut)
    //    toutes les erreurs, dans l'ordre : "titre invalide" (3 à 80 caractères après strip),
    //    "type invalide", "priorite invalide", "points invalides", "statut invalide"
    static List<String> valider(String titre, String type, int priorite, Integer points, String statut) {
        List<String> erreurs = new ArrayList<>();
        String t = titre == null ? "" : titre.strip();
        if (t.length() < 3 || t.length() > 80) erreurs.add("titre invalide");
        if (!TYPES.contains(type)) erreurs.add("type invalide");
        if (!PRIORITES.contains(priorite)) erreurs.add("priorite invalide");
        if (!estPointsValide(points)) erreurs.add("points invalides");
        if (!STATUTS.contains(statut)) erreurs.add("statut invalide");
        return erreurs;
    }


    // 4. static Ticket creer(int id, String titre, String aujourdHui)
    //    défauts : type "tache", priorité 2, points null, statut "backlog" ; titre nettoyé ;
    //    IllegalArgumentException("Ticket invalide : ...") si la validation échoue
    static Ticket creer(int id, String titre, String aujourdHui) {
        List<String> erreurs = valider(titre, "tache", 2, null, "backlog");
        if (!erreurs.isEmpty()) throw new IllegalArgumentException("Ticket invalide : " + String.join(", ", erreurs));
        return new Ticket(id, titre.strip(), "tache", 2, null, "backlog", aujourdHui);
    }


    // ── Tests d'acceptation (ne pas modifier) ───────────────────────────────
    public static void main(String[] args) {
        List<String> echecs = new ArrayList<>();
        verifier(echecs, "points valides", estPointsValide(null) && estPointsValide(13) && !estPointsValide(4));
        verifier(echecs, "ticket valide", valider("Connexion SSO", "story", 1, 5, "backlog").isEmpty());
        verifier(echecs, "toutes les erreurs", valider("", "epic", 4, 4, "fini").equals(
                List.of("titre invalide", "type invalide", "priorite invalide", "points invalides", "statut invalide")));
        Ticket t = creer(13, "  Export CSV  ", "2026-11-03");
        verifier(echecs, "défauts", t.equals(new Ticket(13, "Export CSV", "tache", 2, null, "backlog", "2026-11-03")));
        verifier(echecs, "constantes immuables", estImmuable(POINTS_VALIDES));
        boolean leve = false;
        try { creer(1, "ab", "2026-11-03"); } catch (IllegalArgumentException e) { leve = e.getMessage().contains("titre invalide"); }
        verifier(echecs, "erreur explicite", leve);
        System.out.println(echecs.isEmpty() ? "6/6 OK" : "Échecs : " + echecs);
    }

    private static void verifier(List<String> echecs, String nom, boolean ok) {
        if (!ok) echecs.add(nom);
    }

    private static boolean estImmuable(Set<Integer> s) {
        try { s.add(99); return false; } catch (UnsupportedOperationException e) { return true; }
    }
}
