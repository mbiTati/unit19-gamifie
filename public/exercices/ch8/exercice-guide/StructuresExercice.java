import java.util.LinkedList;
import java.util.HashMap;

/**
 * ============================================================
 *  EXERCICE GUIDÉ — Ch.8 : LinkedList + HashMap (P4a)
 *  Gestion des employés (LinkedList) + Annuaire (HashMap)
 * ============================================================
 *  SCORING : 80 pts max | DURÉE : 30 minutes
 * ============================================================
 */
public class StructuresExercice {

    // ═══ PARTIE 1 : LinkedList — Gestion employés ═══

    static LinkedList<String> employes = new LinkedList<>();

    // TODO 1 (+10 pts) : Ajouter un employé EN FIN de liste
    public static void ajouterEmploye(String nom) {
        // Indice : employes.addLast(nom) ou employes.add(nom)
    }

    // TODO 2 (+10 pts) : Supprimer un employé par nom
    public static boolean supprimerEmploye(String nom) {
        // Indice : employes.remove(nom)
        return false;
    }

    // TODO 3 (+10 pts) : Chercher un employé (retourner true/false)
    public static boolean employeExiste(String nom) {
        // Indice : employes.contains(nom)
        return false;
    }

    // TODO 4 (+10 pts) : Retourner le premier employé sans le supprimer
    public static String premierEmploye() {
        // Indice : employes.getFirst() — attention si liste vide !
        return null;
    }

    // ═══ PARTIE 2 : HashMap — Annuaire téléphonique ═══

    static HashMap<String, String> annuaire = new HashMap<>();

    // TODO 5 (+10 pts) : Ajouter un contact (nom → téléphone)
    public static void ajouterContact(String nom, String telephone) {
        // Indice : annuaire.put(nom, telephone)
    }

    // TODO 6 (+10 pts) : Chercher un téléphone par nom
    public static String chercherTelephone(String nom) {
        // Indice : annuaire.get(nom) — retourne null si pas trouvé
        return null;
    }

    // TODO 7 (+10 pts) : Supprimer un contact
    public static boolean supprimerContact(String nom) {
        // Indice : annuaire.remove(nom) retourne la valeur supprimée ou null
        return false;
    }

    // TODO 8 (+10 pts) : Vérifier si un nom existe dans l'annuaire
    public static boolean contactExiste(String nom) {
        // Indice : annuaire.containsKey(nom)
        return false;
    }

    // ═══ SCORING ═══
    public static void main(String[] args) {
        int score = 0;

        // Tests LinkedList
        ajouterEmploye("Alice");
        ajouterEmploye("Bob");
        ajouterEmploye("Clara");

        if (employes.size() == 3 && employes.getLast().equals("Clara")) {
            score += 10; System.out.println("✅ TODO 1 : ajouterEmploye fonctionne (+10)");
        } else System.out.println("❌ TODO 1");

        if (supprimerEmploye("Bob") && employes.size() == 2) {
            score += 10; System.out.println("✅ TODO 2 : supprimerEmploye fonctionne (+10)");
        } else System.out.println("❌ TODO 2");

        if (employeExiste("Alice") && !employeExiste("Bob")) {
            score += 10; System.out.println("✅ TODO 3 : employeExiste fonctionne (+10)");
        } else System.out.println("❌ TODO 3");

        if ("Alice".equals(premierEmploye()) && employes.size() == 2) {
            score += 10; System.out.println("✅ TODO 4 : premierEmploye fonctionne (+10)");
        } else System.out.println("❌ TODO 4");

        // Tests HashMap
        ajouterContact("Alice", "0612345678");
        ajouterContact("Bob", "0698765432");

        if (annuaire.size() == 2) {
            score += 10; System.out.println("✅ TODO 5 : ajouterContact fonctionne (+10)");
        } else System.out.println("❌ TODO 5");

        if ("0612345678".equals(chercherTelephone("Alice")) && chercherTelephone("Zoe") == null) {
            score += 10; System.out.println("✅ TODO 6 : chercherTelephone fonctionne (+10)");
        } else System.out.println("❌ TODO 6");

        if (supprimerContact("Bob") && annuaire.size() == 1) {
            score += 10; System.out.println("✅ TODO 7 : supprimerContact fonctionne (+10)");
        } else System.out.println("❌ TODO 7");

        if (contactExiste("Alice") && !contactExiste("Bob")) {
            score += 10; System.out.println("✅ TODO 8 : contactExiste fonctionne (+10)");
        } else System.out.println("❌ TODO 8");

        System.out.println("\n" + "═".repeat(50));
        System.out.printf("  SCORE : %d / 80 pts%n", score);
        System.out.println("═".repeat(50));
    }
}
