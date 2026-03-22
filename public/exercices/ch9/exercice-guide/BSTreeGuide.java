/**
 * EXERCICE GUIDÉ — Ch.9 : Tree + Sorting (P4b)
 * Implémenter un BST et Insertion Sort
 * SCORING : 80 pts | DURÉE : 25 min
 */
public class BSTreeGuide {

    static class TreeNode {
        int value;
        TreeNode left, right;
        TreeNode(int v) { this.value = v; }
    }

    static TreeNode root = null;

    // TODO 1 (+20 pts) : Implémenter insert (récursif)
    static TreeNode insert(TreeNode node, int val) {
        // Si node est null → créer un nouveau TreeNode
        // Si val < node.value → insérer à gauche
        // Si val > node.value → insérer à droite
        // Retourner node
        return null; // Remplacez
    }

    // TODO 2 (+20 pts) : Implémenter inorder (parcours trié)
    static void inorder(TreeNode node) {
        // Si node est null → return
        // Récursion gauche, afficher node.value, récursion droite
    }

    // TODO 3 (+20 pts) : Implémenter insertionSort
    static void insertionSort(int[] arr) {
        // Pour i de 1 à arr.length-1 :
        //   key = arr[i], j = i-1
        //   Tant que j >= 0 && arr[j] > key : décaler arr[j+1] = arr[j], j--
        //   arr[j+1] = key
    }

    // TODO 4 (+20 pts) : Comparer BST inorder vs insertionSort
    // Les deux donnent un résultat trié — quelle est la différence de complexité ?
    static String reponse_TODO4 = ""; // "BST: O(n log n) moyen, InsertionSort: O(n²) moyen"

    public static void main(String[] args) {
        int score = 0;

        // Test TODO 1
        root = insert(null, 10);
        root = insert(root, 5);
        root = insert(root, 15);
        root = insert(root, 3);
        root = insert(root, 7);
        if (root != null && root.value == 10 && root.left != null && root.left.value == 5) {
            score += 20; System.out.println("✅ TODO 1 : BST insert fonctionne (+20)");
        } else System.out.println("❌ TODO 1 : insert ne fonctionne pas");

        // Test TODO 2
        System.out.print("Inorder : ");
        inorder(root); // Devrait afficher : 3 5 7 10 15
        System.out.println();

        // Test TODO 3
        int[] arr = {64, 25, 12, 22, 11};
        insertionSort(arr);
        boolean sorted = true;
        for (int i = 0; i < arr.length - 1; i++) if (arr[i] > arr[i+1]) sorted = false;
        if (sorted) { score += 20; System.out.println("✅ TODO 3 : insertionSort fonctionne (+20)"); }
        else System.out.println("❌ TODO 3 : tableau non trié");

        // Test TODO 4
        if (reponse_TODO4.contains("log n") && reponse_TODO4.contains("n²")) {
            score += 20; System.out.println("✅ TODO 4 : comparaison correcte (+20)");
        } else System.out.println("❌ TODO 4 : BST O(n log n) moyen vs InsertionSort O(n²)");

        System.out.printf("\nSCORE : %d / 80 pts\n", score);
    }
}