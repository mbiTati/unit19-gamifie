/**
 * EXERCICE GUIDÉ — Ch.4 : Shortest Path (D1)
 * Tracer Dijkstra sur papier + vérifier en Java
 * SCORING : 60 pts | DURÉE : 20 min
 */
public class TraceDijkstra {
    // Graphe : A→B(4), A→C(2), C→B(1), B→D(5), C→D(7)
    // TODO 1 (+15 pts) : Distance la plus courte de A à D ?
    static int reponse_TODO1 = 0; // Remplacez

    // TODO 2 (+15 pts) : Quel est le chemin ? (ex: "A,C,B,D")
    static String reponse_TODO2 = ""; // Remplacez

    // TODO 3 (+15 pts) : Quel sommet est visité en 2ème (après A) ?
    static String reponse_TODO3 = ""; // "B" ou "C" ?

    // TODO 4 (+15 pts) : Si on utilisait BFS (sans poids), quel serait le chemin A→D ?
    static String reponse_TODO4 = ""; // Chemin BFS

    public static void main(String[] args) {
        int score = 0;
        if (reponse_TODO1 == 8) { score += 15; System.out.println("✅ TODO 1 : Distance = 8 (A→C→B→D = 2+1+5) (+15)"); }
        else System.out.println("❌ TODO 1 : A→C(2)→B(1)→D(5) = 8, pas A→B(4)→D(5)=9");
        if ("A,C,B,D".equals(reponse_TODO2)) { score += 15; System.out.println("✅ TODO 2 (+15)"); }
        else System.out.println("❌ TODO 2 : Chemin = A,C,B,D");
        if ("C".equals(reponse_TODO3)) { score += 15; System.out.println("✅ TODO 3 : C visité en 2ème (distance 2 < 4) (+15)"); }
        else System.out.println("❌ TODO 3 : Dijkstra choisit le sommet le plus PROCHE → C(2) avant B(4)");
        if ("A,B,D".equals(reponse_TODO4)) { score += 15; System.out.println("✅ TODO 4 : BFS = A→B→D (2 arêtes) (+15)"); }
        else System.out.println("❌ TODO 4 : BFS ignore les poids → chemin le plus court en arêtes");
        System.out.printf("\nSCORE : %d / 60 pts\n", score);
    }
}