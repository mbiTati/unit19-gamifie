/**
 * EXERCICE COMPLET — Ch.3 : Comparaison de tris (M2)
 * Implémenter Bubble Sort et Quick Sort, les comparer
 * SCORING : 100 pts | DURÉE : 30-45 min
 */
public class ComparaisonTri {

    static int comparaisonsBubble = 0;
    static int comparaisonsQuick = 0;

    // TODO 1 (+25 pts) : Implémenter Bubble Sort
    static void bubbleSort(int[] arr) {
        comparaisonsBubble = 0;
        // TODO : deux boucles imbriquées, comparer et échanger
        // Incrémenter comparaisonsBubble à chaque comparaison
    }

    // TODO 2 (+25 pts) : Implémenter Quick Sort
    static void quickSort(int[] arr, int lo, int hi) {
        // TODO : partition + appels récursifs
    }
    static int partition(int[] arr, int lo, int hi) {
        comparaisonsQuick++;
        // TODO : pivot = arr[hi], partitionner, retourner index pivot
        return lo;
    }

    // TODO 3 (+25 pts) : Benchmark — mesurer le temps pour n=1000,5000,10000
    static void benchmark() {
        // TODO : utiliser System.nanoTime() pour mesurer
    }

    // TODO 4 (+25 pts) : Répondre aux questions
    // Q1 : Pour n=10000, quel tri est le plus rapide ?
    static String reponse_Q1 = ""; // "bubble" ou "quick"
    // Q2 : Quel est le ratio approximatif de comparaisons ?
    static int reponse_Q2_ratio = 0; // ex: 770

    public static void main(String[] args) {
        int score = 0;
        int[] test = {5, 3, 8, 1, 4, 7, 2, 6};
        int[] copie = test.clone();
        bubbleSort(copie);
        boolean sorted = true;
        for (int i = 0; i < copie.length - 1; i++) if (copie[i] > copie[i+1]) sorted = false;
        if (sorted) { score += 25; System.out.println("✅ TODO 1 : Bubble Sort fonctionne (+25)"); }
        else System.out.println("❌ TODO 1 : Le tableau n'est pas trié");
        copie = test.clone();
        comparaisonsQuick = 0;
        quickSort(copie, 0, copie.length - 1);
        sorted = true;
        for (int i = 0; i < copie.length - 1; i++) if (copie[i] > copie[i+1]) sorted = false;
        if (sorted) { score += 25; System.out.println("✅ TODO 2 : Quick Sort fonctionne (+25)"); }
        else System.out.println("❌ TODO 2");
        if ("quick".equals(reponse_Q1)) { score += 25; System.out.println("✅ TODO 4 Q1 (+25)"); }
        System.out.printf("\nSCORE : %d / 100 pts\n", score);
    }
}