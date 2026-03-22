import java.util.*;

/**
 * ============================================================
 *  EXERCICE GUIDÉ — Ch.4 : Shortest Path (D1)
 *  Tracer BFS et Dijkstra sur un graphe
 * ============================================================
 *  SCORING : 70 pts max | DURÉE : 20 minutes
 * ============================================================
 */
public class ShortestPathExercice {

    // ═══ Graphe simplifié avec matrice d'adjacence ═══
    // Sommets : 0=A, 1=B, 2=C, 3=D, 4=E, 5=F
    // -1 = pas d'arête
    static int[][] graphe = {
        //  A   B   C   D   E   F
        {  0,  4,  2, -1, -1, -1 }, // A
        { -1,  0, -1,  5, -1, -1 }, // B
        { -1,  1,  0, -1,  3, -1 }, // C
        { -1, -1, -1,  0, -1,  2 }, // D
        { -1, -1, -1,  1,  0,  6 }, // E
        { -1, -1, -1, -1, -1,  0 }, // F
    };
    static String[] noms = {"A", "B", "C", "D", "E", "F"};

    // TODO 1 (+10 pts) : Compléter BFS (graphe non pondéré)
    // Trouver le chemin avec le MOINS d'arêtes de start à end
    public static List<String> bfs(int start, int end) {
        Queue<Integer> queue = new ArrayDeque<>();
        boolean[] visited = new boolean[6];
        int[] parent = new int[6];
        Arrays.fill(parent, -1);

        // TODO : Enfiler start, marquer comme visité
        // TODO : Tant que queue non vide :
        //   défiler current
        //   si current == end → reconstruire chemin
        //   pour chaque voisin (graphe[current][j] != -1 && !visited)
        //     marquer visité, parent[j] = current, enfiler

        return new ArrayList<>(); // Remplacer
    }

    // TODO 2 (+10 pts) : Compléter Dijkstra
    public static int dijkstra(int start, int end) {
        int[] dist = new int[6];
        boolean[] visited = new boolean[6];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[start] = 0;

        // TODO : Répéter 6 fois :
        //   trouver u = sommet non visité avec dist[u] minimum
        //   marquer u comme visité
        //   pour chaque voisin v de u (graphe[u][v] > 0 && !visited) :
        //     si dist[u] + graphe[u][v] < dist[v] → mettre à jour

        return dist[end]; // distance minimale
    }

    public static void main(String[] args) {
        int score = 0;

        // Test BFS
        List<String> cheminBFS = bfs(0, 5); // A → F
        if (cheminBFS.size() >= 2 && cheminBFS.get(0).equals("A")) {
            score += 10; System.out.println("✅ TODO 1 : BFS trouve un chemin A→F (+10)");
        } else System.out.println("❌ TODO 1 : BFS doit trouver un chemin de A à F");

        // Test Dijkstra
        int distDijkstra = dijkstra(0, 5); // A → F
        if (distDijkstra == 8) {
            score += 10; System.out.println("✅ TODO 2 : Dijkstra A→F = 8 (+10)");
        } else System.out.println("❌ TODO 2 : A→C(2)→E(5)→D(6)→F(8) = distance 8, obtenu: " + distDijkstra);

        // TODO 3 (+10 pts) : Questions théoriques
        // Le chemin le plus court en NOMBRE D'ARÊTES (BFS) est-il le même
        // que le chemin le plus court en DISTANCE (Dijkstra) ?
        String memeCheminBFSDijkstra = ""; // "oui" ou "non"

        // TODO 4 (+10 pts) : Quel est le chemin Dijkstra optimal ?
        String cheminOptimal = ""; // ex: "A-C-E-D-F"

        // TODO 5 (+10 pts) : Complexité de BFS ?
        String complexiteBFS = ""; // "O(V+E)" ou "O(V²)" ?

        // TODO 6 (+10 pts) : Dijkstra fonctionne avec des poids négatifs ?
        String poidsNegatifs = ""; // "oui" ou "non"

        // TODO 7 (+10 pts) : Quelle structure Dijkstra utilise pour optimiser ?
        String structureDijkstra = ""; // "Queue", "Stack", "Priority Queue" ?

        if ("non".equalsIgnoreCase(memeCheminBFSDijkstra)) { score += 10; System.out.println("✅ TODO 3 : non, les chemins sont différents (+10)"); }
        else System.out.println("❌ TODO 3 : BFS minimise les arêtes, Dijkstra les distances → chemins différents");

        if ("A-C-E-D-F".equalsIgnoreCase(cheminOptimal)) { score += 10; System.out.println("✅ TODO 4 : A→C→E→D→F (+10)"); }
        else System.out.println("❌ TODO 4 : Chemin optimal = A-C-E-D-F (distance 8)");

        if ("O(V+E)".equals(complexiteBFS)) { score += 10; System.out.println("✅ TODO 5 : BFS = O(V+E) (+10)"); }
        else System.out.println("❌ TODO 5 : BFS = O(V+E)");

        if ("non".equalsIgnoreCase(poidsNegatifs)) { score += 10; System.out.println("✅ TODO 6 : non, Dijkstra ne gère pas les poids négatifs (+10)"); }
        else System.out.println("❌ TODO 6 : Dijkstra ne fonctionne PAS avec des poids négatifs");

        if ("Priority Queue".equalsIgnoreCase(structureDijkstra)) { score += 10; System.out.println("✅ TODO 7 : Priority Queue (+10)"); }
        else System.out.println("❌ TODO 7 : Dijkstra optimisé utilise une Priority Queue");

        System.out.println("\n" + "═".repeat(50));
        System.out.printf("  SCORE : %d / 70 pts%n", score);
        System.out.println("═".repeat(50));
    }
}
