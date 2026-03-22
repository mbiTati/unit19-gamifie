/**
 * EXERCICE GUIDÉ — Ch.12 : Analyse asymptotique (P6)
 * Analyser 8 extraits de code et donner leur Big O
 * SCORING : 80 pts | DURÉE : 20 min
 */
public class BigOAnalyse {

    // Extrait 1 : int x = arr[5];
    static String rep1 = ""; // "O(1)", "O(n)", "O(n²)", "O(log n)"

    // Extrait 2 : for (int i=0; i<n; i++) sum += arr[i];
    static String rep2 = "";

    // Extrait 3 : for (int i=0;i<n;i++) for(int j=0;j<n;j++) mat[i][j]=0;
    static String rep3 = "";

    // Extrait 4 : while (n > 1) { n = n / 2; count++; }
    static String rep4 = "";

    // Extrait 5 : HashMap.get("key")
    static String rep5 = "";

    // Extrait 6 : for(int i=0;i<n;i++) for(int j=0;j<n;j++) for(int k=0;k<n;k++) sum++;
    static String rep6 = "";

    // Extrait 7 : Arrays.sort(tableau) — Java utilise TimSort
    static String rep7 = "";

    // Extrait 8 : LinkedList.get(n/2) — accès au milieu
    static String rep8 = "";

    public static void main(String[] args) {
        int score = 0;
        String[] corrects = {"O(1)", "O(n)", "O(n²)", "O(log n)", "O(1)", "O(n³)", "O(n log n)", "O(n)"};
        String[] reps = {rep1, rep2, rep3, rep4, rep5, rep6, rep7, rep8};
        String[] descs = {"arr[5]", "boucle simple", "2 boucles imbriquées", "diviser par 2",
                          "HashMap.get", "3 boucles", "Arrays.sort", "LinkedList.get(n/2)"};

        for (int i = 0; i < 8; i++) {
            if (corrects[i].equals(reps[i])) {
                score += 10;
                System.out.printf("✅ Extrait %d (%s) = %s (+10)%n", i+1, descs[i], corrects[i]);
            } else {
                System.out.printf("❌ Extrait %d (%s) : votre réponse \"%s\", correct = %s%n", i+1, descs[i], reps[i], corrects[i]);
            }
        }
        System.out.printf("\nSCORE : %d / 80 pts\n", score);
    }
}