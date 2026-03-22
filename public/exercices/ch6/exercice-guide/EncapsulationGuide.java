/**
 * EXERCICE GUIDÉ — Ch.6 : Encapsulation (M3)
 * Refactorer un code SANS encapsulation → AVEC encapsulation
 * SCORING : 70 pts | DURÉE : 20 min
 */
public class EncapsulationGuide {

    // ═══ AVANT (MAUVAIS — pas d'encapsulation) ═══
    // public String nom;
    // public double solde;
    // public String email;

    // TODO 1 (+10 pts) : Rendre les attributs private
    String nom;      // → ajouter private
    double solde;    // → ajouter private
    String email;    // → ajouter private

    // TODO 2 (+15 pts) : Créer le constructeur
    // public EncapsulationGuide(String nom, double solde, String email) { ... }

    // TODO 3 (+15 pts) : Créer les getters
    // public String getNom() { return nom; }
    // public double getSolde() { return solde; }
    // public String getEmail() { return email; }

    // TODO 4 (+15 pts) : Créer un setter avec VALIDATION pour solde
    // public void deposer(double montant) — montant doit être > 0
    // public void retirer(double montant) — montant > 0 ET montant <= solde

    // TODO 5 (+15 pts) : Créer un setter avec VALIDATION pour email
    // public void setEmail(String email) — email doit contenir "@"

    public static void main(String[] args) {
        int score = 0;

        EncapsulationGuide compte = new EncapsulationGuide();
        // Test TODO 1-3 : si les attributs sont private, on ne peut y accéder que via getters
        // (vérification manuelle par l'enseignant)
        score += 25;
        System.out.println("✅ TODO 1-3 : Vérifiez que les attributs sont private (+25)");

        // Test TODO 4 : deposer/retirer avec validation
        // compte.deposer(100);
        // if (compte.getSolde() == 100) { score += 15; System.out.println("✅ TODO 4a (+15)"); }
        // compte.retirer(200); // doit être refusé
        // if (compte.getSolde() == 100) { score += 10; System.out.println("✅ TODO 4b : refus retrait (+10)"); }

        // Test TODO 5 : setEmail avec validation
        // compte.setEmail("invalide"); // pas de @, doit être refusé
        // compte.setEmail("ok@mail.com"); // valide

        System.out.printf("\nSCORE : %d / 70 pts\n", score);
        System.out.println("Complétez les TODO et décommentez les tests !");
    }
}