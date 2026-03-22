/**
 * EXERCICE GUIDÉ — Ch.3 : FIFO Queue (M1)
 * File d'attente au cinéma
 * SCORING : 70 pts | DURÉE : 20 min
 */
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueCinema {

    // TODO 1 (+10 pts) : Créer une Queue de String avec ArrayDeque
    static Queue<String> file = null; // Remplacez null

    // TODO 2 (+10 pts) : Ajouter 3 clients (Alice, Bob, Clara) avec offer()
    static void ajouterClients() {
        // TODO : Complétez
    }

    // TODO 3 (+10 pts) : Servir le premier client (poll) et retourner son nom
    static String servirClient() {
        // TODO : Complétez
        return null;
    }

    // TODO 4 (+10 pts) : Consulter le prochain sans le retirer (peek)
    static String consulterProchain() {
        // TODO : Complétez
        return null;
    }

    // TODO 5 (+10 pts) : Servir tous les clients un par un (boucle while !isEmpty)
    static void servirTous() {
        // TODO : Complétez — afficher "Servi : [nom]" pour chaque client
    }

    // TODO 6 (+10 pts) : Implémenter une file prioritaire
    // Les clients VIP passent devant (indice : utiliser une 2e queue)
    static Queue<String> fileVIP = null; // Remplacez null
    static Queue<String> fileNormale = null; // Remplacez null

    static String servirPrioritaire() {
        // TODO : servir d'abord la fileVIP, sinon la fileNormale
        return null;
    }

    // TODO 7 (+10 pts) : Quelle est la complexité de offer() dans ArrayDeque ?
    static String reponse_TODO7 = ""; // "O(1)" ou "O(n)" ?

    public static void main(String[] args) {
        int score = 0;
        // Tests...
        file = new ArrayDeque<>();
        if (file != null) { score += 10; System.out.println("✅ TODO 1 (+10)"); }
        ajouterClients();
        if (file != null && file.size() == 3) { score += 10; System.out.println("✅ TODO 2 (+10)"); }
        else System.out.println("❌ TODO 2");
        String premier = servirClient();
        if ("Alice".equals(premier)) { score += 10; System.out.println("✅ TODO 3 : Alice servie (+10)"); }
        else System.out.println("❌ TODO 3 : FIFO → Alice d'abord");
        String prochain = consulterProchain();
        if ("Bob".equals(prochain) && file.size() == 2) { score += 10; System.out.println("✅ TODO 4 (+10)"); }
        else System.out.println("❌ TODO 4");
        if ("O(1)".equals(reponse_TODO7)) { score += 10; System.out.println("✅ TODO 7 : O(1) amorti (+10)"); }
        else System.out.println("❌ TODO 7 : ArrayDeque.offer() = O(1) amorti");
        System.out.printf("\nSCORE : %d / 70 pts\n", score);
    }
}