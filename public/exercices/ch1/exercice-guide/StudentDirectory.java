/**
 * ============================================================
 *  EXERCICE GUIDÉ — Ch.1 : Design Specification (P1)
 *  ADT StudentDirectory — Annuaire d'étudiants
 * ============================================================
 *  OBJECTIF : Compléter la spécification ET l'implémentation
 *  SCORING  : Chaque TODO complété = +10 points (80 pts max)
 *  DURÉE    : 20-30 minutes
 * ============================================================
 */

import java.util.LinkedList;

public class StudentDirectory {

    // ╔══════════════════════════════════════════════╗
    // ║   STRUCTURE DE DONNÉES                       ║
    // ╚══════════════════════════════════════════════╝
    private LinkedList<Etudiant> etudiants;

    public StudentDirectory() {
        this.etudiants = new LinkedList<>();
    }

    // ╔══════════════════════════════════════════════╗
    // ║   OPÉRATION 1 : INSCRIRE (CREATE)            ║
    // ║   Pré  : e != null, e.matricule != null      ║
    // ║   Post : si matricule unique -> ajouté, true  ║
    // ║          si doublon -> non ajouté, false       ║
    // ╚══════════════════════════════════════════════╝
    public boolean inscrire(Etudiant e) {
        // TODO 1 (+10 pts) : Vérifier la précondition (e != null)
        // TODO 2 (+10 pts) : Vérifier l'invariant (pas de doublon de matricule)
        //                     Utiliser rechercherParMatricule()
        // TODO 3 (+10 pts) : Ajouter l'étudiant et retourner true

        return false; // Remplacer cette ligne
    }

    // ╔══════════════════════════════════════════════╗
    // ║   OPÉRATION 2 : RECHERCHER (READ)            ║
    // ║   Pré  : matricule != null                    ║
    // ║   Post : retourne l'Etudiant ou null          ║
    // ╚══════════════════════════════════════════════╝
    public Etudiant rechercherParMatricule(String matricule) {
        // TODO 4 (+10 pts) : Parcourir la liste et chercher par matricule
        //   Indice : utiliser une boucle for-each et .getMatricule().equals(...)

        return null; // Remplacer cette ligne
    }

    // ╔══════════════════════════════════════════════╗
    // ║   OPÉRATION 3 : LISTER PAR CLASSE (READ)     ║
    // ║   Pré  : classe != null                       ║
    // ║   Post : retourne la liste des étudiants      ║
    // ╚══════════════════════════════════════════════╝
    public LinkedList<Etudiant> listerParClasse(String classe) {
        // TODO 5 (+10 pts) : Créer une nouvelle liste, parcourir et filtrer
        //   Indice : for (Etudiant e : etudiants) { if e.getClasse()... }

        return new LinkedList<>(); // Remplacer cette ligne
    }

    // ╔══════════════════════════════════════════════╗
    // ║   OPÉRATION 4 : SUPPRIMER (DELETE)            ║
    // ║   Pré  : matricule != null                    ║
    // ║   Post : si trouvé -> supprimé, true          ║
    // ╚══════════════════════════════════════════════╝
    public boolean supprimer(String matricule) {
        // TODO 6 (+10 pts) : Utiliser rechercherParMatricule, puis remove()

        return false; // Remplacer cette ligne
    }

    // ╔══════════════════════════════════════════════╗
    // ║   OPÉRATIONS UTILITAIRES                      ║
    // ╚══════════════════════════════════════════════╝
    // TODO 7 (+10 pts) : Compléter nombreEtudiants()
    public int nombreEtudiants() {
        return 0; // Remplacer
    }

    // TODO 8 (+10 pts) : Compléter estVide()
    public boolean estVide() {
        return true; // Remplacer
    }

    // ╔══════════════════════════════════════════════╗
    // ║   SCORING — Exécuter pour voir votre score    ║
    // ╚══════════════════════════════════════════════╝
    public static void main(String[] args) {
        int score = 0;
        int total = 80;
        StudentDirectory dir = new StudentDirectory();

        // Test inscrire
        Etudiant e1 = new Etudiant("M001", "Dupont", "Marie", "BTS2A");
        Etudiant e2 = new Etudiant("M002", "Martin", "Lucas", "BTS2B");
        Etudiant e3 = new Etudiant("M003", "Durand", "Emma", "BTS2A");

        if (dir.inscrire(e1)) { score += 10; System.out.println("✅ TODO 1-3 : inscrire fonctionne (+10)"); }
        else System.out.println("❌ TODO 1-3 : inscrire ne fonctionne pas");

        dir.inscrire(e2);
        dir.inscrire(e3);

        if (!dir.inscrire(e1)) { score += 10; System.out.println("✅ Doublon rejeté (+10)"); }
        else System.out.println("❌ Le doublon n'est pas rejeté");

        // Test rechercher
        if (dir.rechercherParMatricule("M001") != null) { score += 10; System.out.println("✅ TODO 4 : rechercherParMatricule fonctionne (+10)"); }
        else System.out.println("❌ TODO 4 : rechercherParMatricule échoue");

        if (dir.rechercherParMatricule("M999") == null) { score += 10; System.out.println("✅ Recherche introuvable retourne null (+10)"); }
        else System.out.println("❌ Recherche introuvable ne retourne pas null");

        // Test listerParClasse
        LinkedList<Etudiant> bts2a = dir.listerParClasse("BTS2A");
        if (bts2a.size() == 2) { score += 10; System.out.println("✅ TODO 5 : listerParClasse fonctionne (+10)"); }
        else System.out.println("❌ TODO 5 : listerParClasse échoue (attendu 2, obtenu " + bts2a.size() + ")");

        // Test supprimer
        if (dir.supprimer("M002")) { score += 10; System.out.println("✅ TODO 6 : supprimer fonctionne (+10)"); }
        else System.out.println("❌ TODO 6 : supprimer échoue");

        // Test utilitaires
        if (dir.nombreEtudiants() == 2) { score += 10; System.out.println("✅ TODO 7 : nombreEtudiants fonctionne (+10)"); }
        else System.out.println("❌ TODO 7 : nombreEtudiants échoue");

        if (!dir.estVide()) { score += 10; System.out.println("✅ TODO 8 : estVide fonctionne (+10)"); }
        else System.out.println("❌ TODO 8 : estVide échoue");

        // RÉSULTAT
        System.out.println("\n" + "═".repeat(50));
        System.out.printf("  SCORE : %d / %d pts%n", score, total);
        if (score == total) System.out.println("  🏆 PARFAIT ! Tous les TODO sont complétés !");
        else if (score >= 60) System.out.println("  ⭐ Très bien ! Continuez !");
        else if (score >= 40) System.out.println("  👍 Bon début, complétez les TODO restants");
        else System.out.println("  💪 Courage, relisez le cours et réessayez !");
        System.out.println("═".repeat(50));
    }
}
