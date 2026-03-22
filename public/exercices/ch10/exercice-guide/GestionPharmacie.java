/**
 * ============================================================
 *  EXERCICE GUIDÉ — Ch.10 : Exceptions + JUnit 5 (P5)
 *  Gestion de pharmacie avec error handling et tests
 * ============================================================
 *  SCORING : 80 pts max | DURÉE : 30 minutes
 * ============================================================
 */
import java.util.LinkedList;

public class GestionPharmacie {
    private LinkedList<Medicament> stock;

    public GestionPharmacie() {
        this.stock = new LinkedList<>();
    }

    // TODO 1 (+10 pts) : Ajouter avec vérification (throw si null)
    public void ajouter(Medicament m) {
        // TODO : si m == null → throw new IllegalArgumentException("Médicament null")
        // TODO : si doublon (même nom) → throw new IllegalArgumentException("Doublon")
        // TODO : sinon ajouter
    }

    // TODO 2 (+10 pts) : Chercher avec gestion d'erreur
    public Medicament chercher(String nom) {
        // TODO : si nom == null → throw new IllegalArgumentException("Nom null")
        // TODO : parcourir et retourner le médicament ou null
        return null;
    }

    // TODO 3 (+10 pts) : Supprimer avec try-catch
    public boolean supprimer(String nom) {
        // TODO : try { chercher, si trouvé → supprimer, return true }
        //        catch (IllegalArgumentException e) { return false; }
        return false;
    }

    // TODO 4 (+10 pts) : Vendre avec vérification de stock
    public void vendre(String nom, int quantite) throws Exception {
        // TODO : chercher le médicament
        // TODO : si non trouvé → throw new Exception("Médicament non trouvé")
        // TODO : si quantite > stock → throw new Exception("Stock insuffisant")
        // TODO : sinon → décrémenter la quantité
    }

    public int getTaille() { return stock.size(); }
    public LinkedList<Medicament> getStock() { return stock; }

    // ═══ SCORING ═══
    public static void main(String[] args) {
        int score = 0;
        GestionPharmacie gp = new GestionPharmacie();

        // Test TODO 1
        try {
            gp.ajouter(new Medicament("Doliprane", 3.50, 100));
            if (gp.getTaille() == 1) { score += 5; System.out.println("✅ ajouter fonctionne (+5)"); }
        } catch (Exception e) { System.out.println("❌ TODO 1 : ajouter a planté"); }

        try {
            gp.ajouter(null);
            System.out.println("❌ TODO 1 : null devrait lancer une exception");
        } catch (IllegalArgumentException e) {
            score += 5; System.out.println("✅ ajouter(null) → exception (+5)");
        }

        // Test TODO 2
        Medicament found = gp.chercher("Doliprane");
        if (found != null && found.getNom().equals("Doliprane")) {
            score += 5; System.out.println("✅ chercher fonctionne (+5)");
        } else System.out.println("❌ TODO 2 : chercher ne fonctionne pas");

        try {
            gp.chercher(null);
            System.out.println("❌ TODO 2 : null devrait lancer une exception");
        } catch (IllegalArgumentException e) {
            score += 5; System.out.println("✅ chercher(null) → exception (+5)");
        }

        // Test TODO 3
        gp.ajouter(new Medicament("Aspirine", 2.80, 50));
        if (gp.supprimer("Aspirine") && gp.getTaille() == 1) {
            score += 10; System.out.println("✅ TODO 3 : supprimer avec try-catch (+10)");
        } else System.out.println("❌ TODO 3 : supprimer ne fonctionne pas");

        // Test TODO 4
        try {
            gp.vendre("Doliprane", 5);
            Medicament m = gp.chercher("Doliprane");
            if (m != null && m.getQuantite() == 95) {
                score += 10; System.out.println("✅ TODO 4 : vendre fonctionne (+10)");
            }
        } catch (Exception e) { System.out.println("❌ TODO 4 : vendre a planté : " + e.getMessage()); }

        try {
            gp.vendre("Doliprane", 9999);
            System.out.println("❌ TODO 4 : stock insuffisant devrait lancer exception");
        } catch (Exception e) {
            score += 10; System.out.println("✅ vendre stock insuffisant → exception (+10)");
        }

        try {
            gp.vendre("Inexistant", 1);
            System.out.println("❌ TODO 4 : médicament inexistant devrait lancer exception");
        } catch (Exception e) {
            score += 10; System.out.println("✅ vendre inexistant → exception (+10)");
        }

        // TODO 5 (+10 pts) : Écrire ci-dessous la différence entre throw et throws
        // en commentaire (10 pts bonus si correct)
        // throw = ...
        // throws = ...

        // TODO 6 (+10 pts) : Écrire un test JUnit pour tester ajouter(null)
        // @Test
        // void testAjouterNull() {
        //     GestionPharmacie gp = new GestionPharmacie();
        //     assertThrows(IllegalArgumentException.class, () -> {
        //         gp.ajouter(null);
        //     });
        // }
        // Recopiez ce test dans un fichier GestionPharmacieTest.java

        System.out.println("\n" + "═".repeat(50));
        System.out.printf("  SCORE : %d / 80 pts%n", score);
        System.out.println("═".repeat(50));
    }
}

// Classe Medicament
class Medicament {
    private String nom;
    private double prix;
    private int quantite;

    public Medicament(String nom, double prix, int quantite) {
        this.nom = nom;
        this.prix = prix;
        this.quantite = quantite;
    }

    public String getNom() { return nom; }
    public double getPrix() { return prix; }
    public int getQuantite() { return quantite; }
    public void setQuantite(int q) { this.quantite = q; }

    @Override
    public String toString() { return nom + " (" + prix + "€, stock:" + quantite + ")"; }
}
