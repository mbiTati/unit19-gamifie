/**
 * EXERCICE GUIDÉ — Ch.11 : Big O (M4/D3)
 * Identifier et mesurer la complexité
 * SCORING : 60 pts | DURÉE : 20 min
 */
public class AnalyseComplexite {
    // TODO 1 (+10 pts) : Quelle complexité ?
    // for (int i = 0; i < n; i++) { sum += i; }
    static String reponse_TODO1 = ""; // "O(1)", "O(n)", "O(n²)", "O(log n)" ?

    // TODO 2 (+10 pts) : Quelle complexité ?
    // for (int i=0;i<n;i++) for (int j=0;j<n;j++) sum += i+j;
    static String reponse_TODO2 = "";

    // TODO 3 (+10 pts) : Quelle complexité ?
    // HashMap.get(key)
    static String reponse_TODO3 = "";

    // TODO 4 (+10 pts) : Quelle complexité ?
    // LinkedList.get(index) — parcours du début
    static String reponse_TODO4 = "";

    // TODO 5 (+10 pts) : Benchmark — mesurer le temps de recherche
    // dans ArrayList vs HashMap pour n=100000
    static void benchmark() {
        // TODO : créer ArrayList et HashMap de 100000 éléments
        // Mesurer le temps de 1000 recherches avec System.nanoTime()
    }

    // TODO 6 (+10 pts) : Quel ADT choisir pour un annuaire téléphonique ?
    static String reponse_TODO6 = ""; // "ArrayList", "LinkedList", "HashMap" ?

    public static void main(String[] args) {
        int score = 0;
        if ("O(n)".equals(reponse_TODO1)) { score += 10; System.out.println("✅ TODO 1 (+10)"); }
        if ("O(n²)".equals(reponse_TODO2)) { score += 10; System.out.println("✅ TODO 2 (+10)"); }
        if ("O(1)".equals(reponse_TODO3)) { score += 10; System.out.println("✅ TODO 3 (+10)"); }
        if ("O(n)".equals(reponse_TODO4)) { score += 10; System.out.println("✅ TODO 4 (+10)"); }
        if ("HashMap".equals(reponse_TODO6)) { score += 10; System.out.println("✅ TODO 6 (+10)"); }
        System.out.printf("\nSCORE : %d / 60 pts\n", score);
    }
}