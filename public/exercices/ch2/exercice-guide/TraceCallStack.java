/**
 * EXERCICE GUIDÉ — Ch.2 : Memory Stack (P2)
 * Tracer le call stack pas à pas
 * SCORING : 60 pts | DURÉE : 20 min
 */
public class TraceCallStack {

    static String formater(String texte) {
        return "[" + texte.toUpperCase() + "]";
    }

    static int doubler(int x) { return x * 2; }

    static int calculer(int a, int b) {
        int somme = a + b;
        int resultat = doubler(somme);
        return resultat;
    }

    // TODO 1 (+10 pts) : Combien de frames quand doubler() s'exécute dans calculer(5,3) ?
    static int reponse_TODO1 = 0; // Remplacez

    // TODO 2 (+10 pts) : Valeur retournée par calculer(5, 3) ?
    static int reponse_TODO2 = 0; // Remplacez

    // TODO 3 (+10 pts) : Ordre de dépilage ? (ex: "doubler,calculer,main")
    static String reponse_TODO3 = ""; // Remplacez

    // TODO 4 (+10 pts) : Écrire une fonction récursive compteur(n) qui affiche n, n-1,...,1, "FIN!"
    static void compteur(int n) {
        // TODO : Complétez (cas de base : n <= 0)
    }

    // TODO 5 (+10 pts) : Profondeur max du stack pour compteur(4) ?
    static int reponse_TODO5 = 0; // Remplacez

    // TODO 6 (+10 pts) : Que se passe-t-il si on oublie le cas de base ?
    static String reponse_TODO6 = ""; // "StackOverflowError" ou autre

    public static void main(String[] args) {
        int score = 0;
        if (reponse_TODO1 == 3) { score += 10; System.out.println("✅ TODO 1 correct (+10)"); }
        else System.out.println("❌ TODO 1 : 3 frames (main+calculer+doubler)");
        if (reponse_TODO2 == 16) { score += 10; System.out.println("✅ TODO 2 correct (+10)"); }
        else System.out.println("❌ TODO 2 : (5+3)*2=16");
        if ("doubler,calculer,main".equals(reponse_TODO3)) { score += 10; System.out.println("✅ TODO 3 correct (+10)"); }
        else System.out.println("❌ TODO 3 : LIFO → doubler,calculer,main");
        System.out.print("TODO 4 compteur(3): "); compteur(3); System.out.println();
        if (reponse_TODO5 == 5) { score += 10; System.out.println("✅ TODO 5 correct (+10)"); }
        else System.out.println("❌ TODO 5 : main+compteur(4)+compteur(3)+compteur(2)+compteur(1)+compteur(0)=6, sans main=5");
        if ("StackOverflowError".equals(reponse_TODO6)) { score += 10; System.out.println("✅ TODO 6 correct (+10)"); }
        else System.out.println("❌ TODO 6 : Sans cas de base → StackOverflowError");
        System.out.printf("\nSCORE : %d / 60 pts\n", score);
    }
}