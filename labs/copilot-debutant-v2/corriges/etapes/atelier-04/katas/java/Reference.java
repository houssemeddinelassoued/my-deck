// Atelier 4 · Bonus : la même règle métier en Java (corrigé).
//
// Écrivez d'abord .github/instructions/java.instructions.md (applyTo: "**/*.java"),
// puis demandez à Copilot d'écrire formaterReference.
// Lancer (sans compilation séparée) : java katas/java/Reference.java

public class Reference {

    /** Erreur métier : porte un code stable. */
    static class ErreurParafo extends IllegalArgumentException {
        final String code;

        ErreurParafo(String code, String message) {
            super(message);
            this.code = code;
        }
    }

    /** formaterReference(42, 2026) → "PAR-2026-0042". Voir src/format.js pour les règles. */
    static String formaterReference(int numero, int annee) {
        if (numero < 1 || numero > 9999) throw new ErreurParafo("NUMERO_INVALIDE", "Le numéro doit être compris entre 1 et 9999.");
        if (annee < 2000 || annee > 2099) throw new ErreurParafo("ANNEE_INVALIDE", "L'année doit être comprise entre 2000 et 2099.");
        return String.format("PAR-%d-%04d", annee, numero);
    }

    // ── Petits tests, sans dépendance ─────────────────────────────────────────
    public static void main(String[] args) {
        verifier("PAR-2026-0042".equals(formaterReference(42, 2026)), "42, 2026 → PAR-2026-0042");
        verifier("PAR-2099-9999".equals(formaterReference(9999, 2099)), "9999, 2099 → PAR-2099-9999");
        verifierErreur(() -> formaterReference(0, 2026), "NUMERO_INVALIDE");
        verifierErreur(() -> formaterReference(10000, 2026), "NUMERO_INVALIDE");
        verifierErreur(() -> formaterReference(1, 1999), "ANNEE_INVALIDE");
        System.out.println("✔ Tous les tests passent.");
    }

    static void verifier(boolean condition, String nom) {
        if (!condition) throw new AssertionError("✖ " + nom);
        System.out.println("✔ " + nom);
    }

    static void verifierErreur(Runnable action, String codeAttendu) {
        try {
            action.run();
        } catch (ErreurParafo e) {
            verifier(codeAttendu.equals(e.code), "erreur " + codeAttendu);
            return;
        }
        throw new AssertionError("✖ erreur " + codeAttendu + " attendue");
    }
}
