import java.util.*;

/**
 * ============================================================
 *  EXERCICE GUIDÉ — Ch.11 : Big O + ADT résout un problème (M4/D3)
 *  Analyser la complexité + benchmark
 * ============================================================
 *  SCORING : 70 pts max | DURÉE : 25 minutes
 * ============================================================
 */
public class BigOExercice {

    // TODO 1 (+10 pts) : Quelle est la complexité de cette méthode ?
    // Stockez votre réponse dans la variable
    public static int rechercheLineaire(int[] arr, int cible) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == cible) return i;
        }
        return -1;
    }
    static String complexiteRecherche = ""; // "O(1)", "O(n)", "O(n²)", "O(log n)" ?

    // TODO 2 (+10 pts) : Quelle est la complexité ?
    public static boolean contientDoublon(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) return true;
            }
        }
        return false;
    }
    static String complexiteDoublon = ""; // ?

    // TODO 3 (+10 pts) : Quelle est la complexité ?
    public static int accesHashMap(HashMap<String, Integer> map, String cle) {
        return map.getOrDefault(cle, -1);
    }
    static String complexiteHashMap = ""; // ?

    // TODO 4 (+10 pts) : Compléter cette recherche binaire
    public static int rechercheBinaire(int[] arrTrie, int cible) {
        int lo = 0, hi = arrTrie.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            // TODO : comparer arrTrie[mid] avec cible
            // si arrTrie[mid] == cible → return mid
            // si arrTrie[mid] < cible → lo = mid + 1
            // sinon → hi = mid - 1
        }
        return -1;
    }
    static String complexiteBinaire = ""; // ?

    // TODO 5 (+10 pts) : Benchmark — comparer recherche linéaire vs binaire
    // Compléter le benchmark dans le main

    // TODO 6 (+10 pts) : Quel ADT pour chercher un employé par matricule ?
    static String adtPourRecherche = ""; // "LinkedList", "ArrayList", "HashMap", "Stack" ?

    // TODO 7 (+10 pts) : Pourquoi ?
    static String justification = ""; // Expliquez en 1 phrase

    public static void main(String[] args) {
        int score = 0;

        if ("O(n)".equals(complexiteRecherche)) { score += 10; System.out.println("✅ TODO 1 : O(n) (+10)"); }
        else System.out.println("❌ TODO 1 : recherche linéaire = O(n)");

        if ("O(n²)".equals(complexiteDoublon)) { score += 10; System.out.println("✅ TODO 2 : O(n²) (+10)"); }
        else System.out.println("❌ TODO 2 : deux boucles imbriquées = O(n²)");

        if ("O(1)".equals(complexiteHashMap)) { score += 10; System.out.println("✅ TODO 3 : O(1) (+10)"); }
        else System.out.println("❌ TODO 3 : HashMap.get() = O(1) en moyenne");

        // Test recherche binaire
        int[] triee = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
        if (rechercheBinaire(triee, 7) == 3 && rechercheBinaire(triee, 20) == -1) {
            score += 10; System.out.println("✅ TODO 4 : recherche binaire fonctionne (+10)");
        } else System.out.println("❌ TODO 4 : recherche binaire incorrecte");

        if ("O(log n)".equals(complexiteBinaire)) { score += 5; System.out.println("✅ complexité binaire = O(log n) (+5)"); }

        // TODO 5 : Benchmark
        int N = 1000000;
        int[] grand = new int[N];
        for (int i = 0; i < N; i++) grand[i] = i;

        long start = System.nanoTime();
        rechercheLineaire(grand, N - 1); // pire cas
        long tempsLineaire = (System.nanoTime() - start) / 1000; // µs

        start = System.nanoTime();
        rechercheBinaire(grand, N - 1); // pire cas
        long tempsBinaire = (System.nanoTime() - start) / 1000;

        System.out.printf("\nBenchmark (n=%d): Linéaire=%d µs, Binaire=%d µs%n", N, tempsLineaire, tempsBinaire);
        if (tempsLineaire > 0 && tempsBinaire > 0) {
            score += 10; System.out.println("✅ TODO 5 : Benchmark exécuté (+10)");
        }

        if ("HashMap".equals(adtPourRecherche)) { score += 10; System.out.println("✅ TODO 6 : HashMap (+10)"); }
        else System.out.println("❌ TODO 6 : HashMap = recherche O(1) par clé");

        System.out.println("\n" + "═".repeat(50));
        System.out.printf("  SCORE : %d / 70 pts%n", score);
        System.out.println("═".repeat(50));
    }
}
