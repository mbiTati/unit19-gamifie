import java.util.*;

/**
 * ============================================================
 *  EXERCICE COMPLET — Ch.8 : LinkedList + HashMap (P4a)
 *  Gestion de tickets support IT — Helpdesk
 * ============================================================
 *
 *  CONTEXTE :
 *  Une entreprise IT gère les tickets de support. Chaque ticket a :
 *  un ID unique, un titre, une priorité (1=haute, 2=moyenne, 3=basse),
 *  et un statut (ouvert/fermé).
 *
 *  STRUCTURES :
 *  - LinkedList<Ticket> pour stocker les tickets dans l'ordre
 *  - HashMap<String, Ticket> pour recherche rapide par ID
 *
 *  À IMPLÉMENTER :
 *  1. Classe Ticket (id, titre, priorite, statut)
 *  2. Classe GestionTickets avec :
 *     - creerTicket(id, titre, priorite)
 *     - rechercherParId(id) → Ticket [via HashMap O(1)]
 *     - fermerTicket(id) → boolean
 *     - listerOuverts() → List<Ticket>
 *     - listerParPriorite(int p) → List<Ticket>
 *     - supprimerTicket(id) → boolean
 *     - nombreTickets() → int
 *
 *  SCORING : 100 pts | DURÉE : 40 minutes
 * ============================================================
 */

// ═══ CORRECTION ═══

class Ticket {
    private String id;
    private String titre;
    private int priorite; // 1=haute, 2=moyenne, 3=basse
    private boolean ouvert;

    public Ticket(String id, String titre, int priorite) {
        this.id = id;
        this.titre = titre;
        this.priorite = priorite;
        this.ouvert = true;
    }

    public String getId() { return id; }
    public String getTitre() { return titre; }
    public int getPriorite() { return priorite; }
    public boolean isOuvert() { return ouvert; }
    public void fermer() { this.ouvert = false; }

    @Override
    public String toString() {
        String prio = priorite == 1 ? "HAUTE" : priorite == 2 ? "MOYENNE" : "BASSE";
        String statut = ouvert ? "OUVERT" : "FERMÉ";
        return "[" + id + "] " + titre + " | " + prio + " | " + statut;
    }
}

public class GestionTicketsCorrection {
    private LinkedList<Ticket> tickets;
    private HashMap<String, Ticket> indexId;

    public GestionTicketsCorrection() {
        this.tickets = new LinkedList<>();
        this.indexId = new HashMap<>();
    }

    // CREATE
    public boolean creerTicket(String id, String titre, int priorite) {
        if (id == null || titre == null) return false;
        if (indexId.containsKey(id)) return false; // doublon
        Ticket t = new Ticket(id, titre, priorite);
        tickets.add(t);
        indexId.put(id, t);
        return true;
    }

    // READ — O(1) grâce à HashMap
    public Ticket rechercherParId(String id) {
        return indexId.get(id);
    }

    // UPDATE
    public boolean fermerTicket(String id) {
        Ticket t = rechercherParId(id);
        if (t == null || !t.isOuvert()) return false;
        t.fermer();
        return true;
    }

    // READ — filtrer
    public LinkedList<Ticket> listerOuverts() {
        LinkedList<Ticket> result = new LinkedList<>();
        for (Ticket t : tickets) {
            if (t.isOuvert()) result.add(t);
        }
        return result;
    }

    public LinkedList<Ticket> listerParPriorite(int priorite) {
        LinkedList<Ticket> result = new LinkedList<>();
        for (Ticket t : tickets) {
            if (t.getPriorite() == priorite) result.add(t);
        }
        return result;
    }

    // DELETE
    public boolean supprimerTicket(String id) {
        Ticket t = rechercherParId(id);
        if (t == null) return false;
        tickets.remove(t);
        indexId.remove(id);
        return true;
    }

    public int nombreTickets() { return tickets.size(); }

    // SCORING
    public static void main(String[] args) {
        int score = 0;
        GestionTicketsCorrection gt = new GestionTicketsCorrection();

        // Tests
        if (gt.creerTicket("T001", "Écran bleu PC-42", 1)) { score += 10; System.out.println("✅ creerTicket (+10)"); }
        gt.creerTicket("T002", "Imprimante hors ligne", 2);
        gt.creerTicket("T003", "Demande nouveau clavier", 3);

        if (!gt.creerTicket("T001", "Doublon", 1)) { score += 10; System.out.println("✅ Doublon rejeté (+10)"); }
        if (gt.rechercherParId("T001") != null) { score += 10; System.out.println("✅ rechercherParId O(1) (+10)"); }
        if (gt.rechercherParId("T999") == null) { score += 10; System.out.println("✅ recherche inexistant → null (+10)"); }
        if (gt.fermerTicket("T001") && !gt.rechercherParId("T001").isOuvert()) { score += 10; System.out.println("✅ fermerTicket (+10)"); }
        if (gt.listerOuverts().size() == 2) { score += 10; System.out.println("✅ listerOuverts = 2 (+10)"); }
        if (gt.listerParPriorite(1).size() == 1) { score += 10; System.out.println("✅ listerParPriorite (+10)"); }
        if (gt.supprimerTicket("T003") && gt.nombreTickets() == 2) { score += 10; System.out.println("✅ supprimerTicket (+10)"); }
        if (!gt.supprimerTicket("T999")) { score += 10; System.out.println("✅ supprimer inexistant → false (+10)"); }
        if (gt.nombreTickets() == 2) { score += 10; System.out.println("✅ nombreTickets = 2 (+10)"); }

        System.out.println("\n" + "═".repeat(50));
        System.out.printf("  SCORE : %d / 100 pts%n", score);
        System.out.println("═".repeat(50));
    }
}
