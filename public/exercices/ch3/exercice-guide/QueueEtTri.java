import java.util.ArrayDeque;
import java.util.Queue;
import java.util.Arrays;

/**
 * ============================================================
 *  EXERCICE GUIDÉ — Ch.3 : FIFO Queue + Sorting (M1/M2)
 *  File d'attente cinéma + comparaison de tri
 * ============================================================
 *  SCORING : 80 pts max
 *  DURÉE   : 25 minutes
 * ============================================================
 */
public class QueueEtTri {

    // ═══ PARTIE 1 : Queue FIFO (M1) ═══

    // TODO 1 (+10 pts) : Compléter cette méthode qui simule
    // une file d'attente au cinéma. Retourner l'ordre de service.
    public static String[] simulerFileAttente(String[] clients) {
        Queue<String> file = new ArrayDeque<>();
        String[] ordreService = new String[clients.length];

        // TODO : Enfiler tous les clients
        // TODO : Défiler un par un et remplir ordreService[]

        return ordreService; // doit contenir les clients dans l'ordre FIFO
    }

    // TODO 2 (+10 pts) : Compléter peek sans retirer
    public static String regarderPremier(Queue<String> file) {
        // TODO : retourner le premier élément sans le retirer
        // Indice : utiliser peek()
        return null;
    }

    // ═══ PARTIE 2 : Tri (M2) ═══

    // TODO 3 (+10 pts) : Compléter le Bubble Sort
    public static void bubbleSort(int[] arr) {
        // TODO : deux boucles imbriquées
        // Comparer arr[j] > arr[j+1] et échanger si nécessaire
    }

    // TODO 4 (+10 pts) : Compléter le compteur de comparaisons
    public static int bubbleSortCompteur(int[] arr) {
        int comparaisons = 0;
        // TODO : même code que bubbleSort mais incrémenter comparaisons
        // à chaque comparaison
        return comparaisons;
    }

    // ═══ SCORING ═══
    public static void main(String[] args) {
        int score = 0;

        // Test Queue
        String[] clients = {"Alice", "Bob", "Clara", "David"};
        String[] ordre = simulerFileAttente(clients);
        if (ordre.length == 4 && "Alice".equals(ordre[0]) && "David".equals(ordre[3])) {
            score += 10; System.out.println("✅ TODO 1 : File FIFO correcte (+10)");
        } else System.out.println("❌ TODO 1 : L'ordre doit être Alice, Bob, Clara, David (FIFO)");

        Queue<String> testQ = new ArrayDeque<>(Arrays.asList("Premier", "Deuxième"));
        String premier = regarderPremier(testQ);
        if ("Premier".equals(premier) && testQ.size() == 2) {
            score += 10; System.out.println("✅ TODO 2 : peek() correct (+10)");
        } else System.out.println("❌ TODO 2 : peek() doit retourner le premier SANS le retirer");

        // Test Bubble Sort
        int[] tab1 = {5, 3, 8, 1, 4};
        bubbleSort(tab1);
        if (tab1[0] == 1 && tab1[4] == 8) {
            score += 10; System.out.println("✅ TODO 3 : Bubble Sort fonctionne (+10)");
        } else System.out.println("❌ TODO 3 : Le tableau doit être trié [1,3,4,5,8]");

        int[] tab2 = {5, 3, 8, 1, 4};
        int comps = bubbleSortCompteur(tab2);
        if (comps == 10 && tab2[0] == 1) {
            score += 10; System.out.println("✅ TODO 4 : Compteur = 10 comparaisons (+10)");
        } else System.out.println("❌ TODO 4 : 5 éléments → n(n-1)/2 = 10 comparaisons");

        // TODO 5 (+10 pts) : Benchmark
        System.out.println("\n--- Benchmark (TODO 5) ---");
        int N = 10000;
        int[] grand = new int[N];
        for (int i = 0; i < N; i++) grand[i] = (int)(Math.random() * N);

        // TODO 5 : Mesurer le temps de bubbleSort vs Arrays.sort
        // Utiliser System.nanoTime() avant et après chaque tri
        // Afficher les résultats

        // TODO 6 (+10 pts) : Calculer le ratio
        // Combien de fois Arrays.sort est plus rapide que bubbleSort ?
        // Stocker dans la variable ratio
        int ratio = 0; // Remplacez

        // TODO 7 (+10 pts) : Expliquer pourquoi (en commentaire)
        // Pourquoi Arrays.sort est plus rapide ?
        // Répondez dans la String ci-dessous
        String explication = ""; // Remplacez par votre explication

        // TODO 8 (+10 pts) : Quelle complexité pour bubbleSort ?
        String complexiteBubble = ""; // "O(n)", "O(n log n)", "O(n²)" ?

        if (complexiteBubble.equals("O(n²)")) {
            score += 10; System.out.println("✅ TODO 8 : Bubble Sort = O(n²) (+10)");
        } else System.out.println("❌ TODO 8 : Bubble Sort = O(n²)");

        System.out.println("\n" + "═".repeat(50));
        System.out.printf("  SCORE : %d / 80 pts%n", score);
        System.out.println("═".repeat(50));
    }
}
