import java.util.*;

/**
 * ============================================================
 *  EXERCICE COMPLET — Ch.10 : Exceptions + JUnit 5 (P5)
 *  Système de commande restaurant avec gestion d'erreurs
 * ============================================================
 *
 *  CONTEXTE : Un restaurant gère ses commandes. Chaque commande a :
 *  un numéro, le nom du client, une liste de plats, un statut.
 *  
 *  EXCEPTIONS À GÉRER :
 *  - CommandeNotFoundException (commande inexistante)
 *  - PlatIndisponibleException (plat non disponible)
 *  - CommandeDejaFermeeException (modifier une commande fermée)
 *
 *  TESTS JUNIT 5 À ÉCRIRE :
 *  - testCreerCommande
 *  - testAjouterPlat
 *  - testAjouterPlatCommandeFermee → assertThrows
 *  - testFermerCommande
 *  - testRechercherInexistante → assertThrows
 *  - testCalculerTotal
 *
 *  SCORING : 100 pts | DURÉE : 45 minutes
 * ============================================================
 */

// ═══ CORRECTION ═══

class Plat {
    private String nom;
    private double prix;

    public Plat(String nom, double prix) {
        this.nom = nom;
        this.prix = prix;
    }
    public String getNom() { return nom; }
    public double getPrix() { return prix; }
    public String toString() { return nom + " (" + prix + "€)"; }
}

class Commande {
    private int numero;
    private String client;
    private LinkedList<Plat> plats;
    private boolean fermee;

    public Commande(int numero, String client) {
        this.numero = numero;
        this.client = client;
        this.plats = new LinkedList<>();
        this.fermee = false;
    }

    public int getNumero() { return numero; }
    public String getClient() { return client; }
    public LinkedList<Plat> getPlats() { return plats; }
    public boolean isFermee() { return fermee; }
    public void fermer() { this.fermee = true; }

    public double getTotal() {
        double total = 0;
        for (Plat p : plats) total += p.getPrix();
        return total;
    }

    public String toString() {
        return "Cmd#" + numero + " " + client + " | " + plats.size() + " plats | " +
               String.format("%.2f€", getTotal()) + " | " + (fermee ? "FERMÉE" : "OUVERTE");
    }
}

public class GestionRestaurantCorrection {
    private LinkedList<Commande> commandes;
    private HashMap<String, Double> menu; // plats disponibles

    public GestionRestaurantCorrection() {
        this.commandes = new LinkedList<>();
        this.menu = new HashMap<>();
        // Menu par défaut
        menu.put("Pizza", 12.50);
        menu.put("Burger", 10.00);
        menu.put("Salade", 8.50);
        menu.put("Pâtes", 11.00);
        menu.put("Dessert", 6.00);
    }

    // CREATE — avec validation
    public Commande creerCommande(String client) {
        if (client == null || client.trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom du client ne peut pas être vide");
        }
        int numero = commandes.size() + 1;
        Commande c = new Commande(numero, client);
        commandes.add(c);
        return c;
    }

    // UPDATE — ajouter un plat avec exceptions
    public void ajouterPlat(int numCommande, String nomPlat) throws Exception {
        Commande c = rechercherCommande(numCommande);

        if (c.isFermee()) {
            throw new Exception("Commande #" + numCommande + " est déjà fermée");
        }
        if (!menu.containsKey(nomPlat)) {
            throw new Exception("Plat '" + nomPlat + "' non disponible au menu");
        }

        c.getPlats().add(new Plat(nomPlat, menu.get(nomPlat)));
    }

    // READ — avec exception si non trouvée
    public Commande rechercherCommande(int numero) throws Exception {
        for (Commande c : commandes) {
            if (c.getNumero() == numero) return c;
        }
        throw new Exception("Commande #" + numero + " non trouvée");
    }

    // UPDATE — fermer
    public void fermerCommande(int numero) throws Exception {
        Commande c = rechercherCommande(numero);
        if (c.isFermee()) {
            throw new Exception("Commande déjà fermée");
        }
        c.fermer();
    }

    // READ — total
    public double calculerTotal(int numero) throws Exception {
        return rechercherCommande(numero).getTotal();
    }

    public int nombreCommandes() { return commandes.size(); }

    // SCORING
    public static void main(String[] args) {
        int score = 0;
        GestionRestaurantCorrection gr = new GestionRestaurantCorrection();

        // Test creerCommande
        try {
            Commande c = gr.creerCommande("Alice");
            if (c != null && c.getClient().equals("Alice")) { score += 10; System.out.println("✅ creerCommande (+10)"); }
        } catch (Exception e) { System.out.println("❌ creerCommande"); }

        try { gr.creerCommande(null); System.out.println("❌ creerCommande(null) devrait lancer exception"); }
        catch (IllegalArgumentException e) { score += 10; System.out.println("✅ creerCommande(null) → exception (+10)"); }

        // Test ajouterPlat
        try {
            gr.ajouterPlat(1, "Pizza");
            gr.ajouterPlat(1, "Dessert");
            Commande c = gr.rechercherCommande(1);
            if (c.getPlats().size() == 2) { score += 10; System.out.println("✅ ajouterPlat (+10)"); }
        } catch (Exception e) { System.out.println("❌ ajouterPlat : " + e.getMessage()); }

        try { gr.ajouterPlat(1, "Sushi"); System.out.println("❌ plat inexistant devrait lancer exception"); }
        catch (Exception e) { score += 10; System.out.println("✅ plat inexistant → exception (+10)"); }

        // Test fermerCommande
        try {
            gr.fermerCommande(1);
            Commande c = gr.rechercherCommande(1);
            if (c.isFermee()) { score += 10; System.out.println("✅ fermerCommande (+10)"); }
        } catch (Exception e) { System.out.println("❌ fermerCommande"); }

        // Test ajouter à commande fermée
        try { gr.ajouterPlat(1, "Burger"); System.out.println("❌ ajout à cmd fermée devrait lancer exception"); }
        catch (Exception e) { score += 10; System.out.println("✅ ajout cmd fermée → exception (+10)"); }

        // Test rechercherCommande inexistante
        try { gr.rechercherCommande(999); System.out.println("❌ cmd inexistante devrait lancer exception"); }
        catch (Exception e) { score += 10; System.out.println("✅ cmd inexistante → exception (+10)"); }

        // Test calculerTotal
        try {
            double total = gr.calculerTotal(1);
            if (Math.abs(total - 18.50) < 0.01) { score += 10; System.out.println("✅ total = 18.50€ (+10)"); }
            else System.out.println("❌ total attendu 18.50, obtenu " + total);
        } catch (Exception e) { System.out.println("❌ calculerTotal"); }

        // Test fermer une commande déjà fermée
        try { gr.fermerCommande(1); System.out.println("❌ re-fermer devrait lancer exception"); }
        catch (Exception e) { score += 10; System.out.println("✅ re-fermer → exception (+10)"); }

        // Test try-catch-finally
        try {
            gr.ajouterPlat(999, "Pizza");
        } catch (Exception e) {
            score += 10; System.out.println("✅ try-catch bien géré (+10)");
        } finally {
            // finally s'exécute toujours
        }

        System.out.println("\n" + "═".repeat(50));
        System.out.printf("  SCORE : %d / 100 pts%n", score);
        System.out.println("═".repeat(50));
    }
}
