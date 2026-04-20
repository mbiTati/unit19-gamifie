const pptxgen = require("pptxgenjs");
const path = require("path");
const OUT = path.join(__dirname, "..", "public", "docs", "pptx");

const BG="0A0F1A", ACCENT="32E0C4", GOLD="F59E0B", TXT="E2E8F0", MUT="94A3B8", CODE="1E293B";

function mk(file, title, sub, color, slides) {
  const p = new pptxgen();
  p.layout = "LAYOUT_16x9";
  // Title slide
  let s = p.addSlide(); s.background = { color: BG };
  s.addText("Unit 19 — Data Structures & Algorithms", { x: 0.5, y: 0.3, w: 9, h: 0.4, fontSize: 10, color: MUT });
  s.addText(title, { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: color, bold: true });
  s.addText(sub, { x: 0.5, y: 3, w: 9, h: 0.5, fontSize: 14, color: MUT });
  s.addText("Ecole Schulz — Mme MBI — BTEC HND", { x: 0.5, y: 5, w: 9, h: 0.4, fontSize: 10, color: MUT });

  slides.forEach(sl => {
    s = p.addSlide(); s.background = { color: BG };
    s.addText(sl.t, { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 22, color: ACCENT, bold: true });
    if (sl.b) {
      const items = sl.b.map((b, i) => ({ text: b, options: { bullet: true, breakLine: i < sl.b.length - 1, fontSize: 13, color: TXT } }));
      s.addText(items, { x: 0.6, y: 1.1, w: 8.8, h: 4, paraSpaceAfter: 6 });
    }
    if (sl.code) {
      s.addText(sl.code, { x: 0.5, y: 1.1, w: 9, h: 4, fontSize: 11, color: ACCENT, fontFace: "Consolas", valign: "top" });
    }
    if (sl.notes) s.addNotes(sl.notes);
  });

  p.writeFile({ fileName: path.join(OUT, file) }).then(() => console.log("  OK: " + file));
}

// LO1 Data Structures
mk("LO1_Array.pptx", "Array", "Structure lineaire a acces direct — LO1", "7C3AED", [
  { t: "Qu'est-ce qu'un Array ?", b: ["Collection ordonnee d'elements du MEME TYPE","Taille FIXE definie a la creation","Acces direct par INDEX : O(1)","Stockage CONTIGU en memoire","Index commence a 0","Types Java : int[], String[], Object[]"] },
  { t: "Code Java", code: "// Declaration\nint[] notes = new int[5];\nnotes[0] = 15;\n\n// Avec valeurs\nString[] noms = {\"Alice\", \"Bob\", \"Charlie\"};\n\n// Parcours\nfor (int i = 0; i < noms.length; i++)\n    System.out.println(noms[i]);\n\n// For-each\nfor (String nom : noms)\n    System.out.println(nom);" },
  { t: "Array multidimensionnel", b: ["2D : int[][] matrice = new int[3][4];","Acces : matrice[ligne][colonne]","Utile : grilles, images, jeux","Complexite parcours : O(n*m)"] },
  { t: "Array vs ArrayList", b: ["Array : taille fixe, types primitifs OK, plus rapide","ArrayList : taille dynamique, objets seulement, add()/remove()","array.length (propriete) vs list.size() (methode)","ArrayList utilise un Array en interne (redimensionne x1.5)"] },
  { t: "Complexite", b: ["Acces index : O(1)","Recherche valeur : O(n)","Insertion milieu : O(n)","Suppression : O(n)","Parcours : O(n)"] },
]);

mk("LO1_Set.pptx", "Set", "Collection sans doublons — LO1", "10B981", [
  { t: "Qu'est-ce qu'un Set ?", b: ["N'autorise PAS les doublons","add() retourne false si deja present","Interface Java : HashSet, TreeSet, LinkedHashSet","Utile : eliminer doublons, verifier appartenance"] },
  { t: "Code Java", code: "Set<String> villes = new HashSet<>();\nvilles.add(\"Geneve\");\nvilles.add(\"Lausanne\");\nvilles.add(\"Geneve\"); // IGNORE\n\nSystem.out.println(villes.size()); // 2\nSystem.out.println(villes.contains(\"Geneve\")); // true\n\n// TreeSet = trie\nSet<Integer> trie = new TreeSet<>();\ntrie.add(30); trie.add(10); trie.add(20);\n// [10, 20, 30]" },
  { t: "HashSet vs TreeSet", b: ["HashSet : O(1), pas d'ordre, utilise hashCode()","TreeSet : O(log n), trie, utilise compareTo()","LinkedHashSet : O(1), ordre d'insertion preserve"] },
]);

mk("LO1_Stack.pptx", "Stack (Pile)", "LIFO — Last In, First Out — LO1", "DC2626", [
  { t: "LIFO : Last In, First Out", b: ["Le DERNIER ajoute = le PREMIER retire","Analogie : pile d'assiettes, Ctrl+Z","Operations : push(), pop(), peek()","Toutes en O(1)"] },
  { t: "Code Java", code: "Stack<Integer> pile = new Stack<>();\npile.push(10);  // [10]\npile.push(20);  // [10, 20]\npile.push(30);  // [10, 20, 30]\n\nint top = pile.peek();  // 30\nint out = pile.pop();   // 30\n// pile = [10, 20]\n\n// ATTENTION: pop() sur pile vide = Exception!" },
  { t: "Call Stack", b: ["JVM utilise un Stack pour les appels de methodes","Chaque appel = un frame empile","return = frame depile","StackOverflowError = recursion infinie"] },
  { t: "Cas d'utilisation", b: ["Evaluation d'expressions postfixees","Parentheses equilibrees","Backtracking (labyrinthe)","Undo/Redo","Navigation arriere (navigateur)"] },
]);

mk("LO1_Queue.pptx", "Queue (File)", "FIFO — First In, First Out — LO1", "3B82F6", [
  { t: "FIFO : First In, First Out", b: ["Le PREMIER ajoute = le PREMIER retire","Analogie : file d'attente","Operations : offer(), poll(), peek()","Implementations : LinkedList, ArrayDeque, PriorityQueue"] },
  { t: "Code Java", code: "Queue<String> file = new LinkedList<>();\nfile.offer(\"Alice\");\nfile.offer(\"Bob\");\nfile.offer(\"Charlie\");\n\nString premier = file.peek();  // Alice\nString sorti = file.poll();    // Alice\n// file = [Bob, Charlie]\n\n// PriorityQueue\nQueue<Integer> pq = new PriorityQueue<>();\npq.offer(30); pq.offer(10); pq.offer(20);\npq.poll(); // 10 (plus petit)" },
  { t: "Stack vs Queue", b: ["Stack LIFO : push/pop — dernier entre, premier sorti","Queue FIFO : offer/poll — premier entre, premier sorti","Stack : Call stack, Undo, DFS","Queue : BFS, impression, buffers, scheduling"] },
]);

mk("LO1_LinkedList.pptx", "LinkedList", "Noeuds et pointeurs — LO1", "32E0C4", [
  { t: "Qu'est-ce qu'une LinkedList ?", b: ["Chaque noeud : valeur + reference vers le suivant","Pas de memoire contigue","Taille DYNAMIQUE","Types : Singly, Doubly, Circular","Insertion tete O(1), acces index O(n)"] },
  { t: "Code Java", code: "LinkedList<String> liste = new LinkedList<>();\nliste.addFirst(\"Alice\"); // [Alice]\nliste.addLast(\"Bob\");    // [Alice, Bob]\nliste.add(1, \"Eve\");     // [Alice, Eve, Bob]\n\nliste.removeFirst();     // [Eve, Bob]\nliste.remove(\"Bob\");     // [Eve]\n\n// Peut servir de Stack OU Queue :\nliste.push(\"top\");       // Stack\nliste.offer(\"end\");      // Queue" },
  { t: "ArrayList vs LinkedList", b: ["ArrayList : acces O(1), insertion O(n), memoire contigue","LinkedList : acces O(n), insertion tete O(1), noeuds disperses","ArrayList meilleur pour lecture, LinkedList pour modification"] },
]);

mk("LO1_Tree.pptx", "Tree (Arbre)", "Structure hierarchique — LO1", "F59E0B", [
  { t: "Qu'est-ce qu'un Tree ?", b: ["Racine + sous-arbres (enfants)","Binary Tree : max 2 enfants","BST : gauche < racine < droite","Hauteur equilibre : h = log2(n)","Parcours : Inordre, Preordre, Postordre"] },
  { t: "BST en Java", code: "class TreeNode {\n    int value;\n    TreeNode left, right;\n    TreeNode(int val) { value = val; }\n}\n\nTreeNode insert(TreeNode root, int val) {\n    if (root == null) return new TreeNode(val);\n    if (val < root.value)\n        root.left = insert(root.left, val);\n    else\n        root.right = insert(root.right, val);\n    return root;\n}" },
  { t: "Types d'arbres", b: ["BST : recherche O(log n)","AVL : BST auto-equilibre","Heap : min/max en O(1)","Trie : prefixes (autocompletion)","B-Tree : bases de donnees"] },
  { t: "Parcours", b: ["Inordre (G-R-D) : donne les elements TRIES","Preordre (R-G-D) : copie de l'arbre","Postordre (G-D-R) : suppression de l'arbre","BFS (niveau par niveau) : utilise une Queue"] },
]);

mk("LO1_Algorithms_Sort.pptx", "Algorithmes de Tri", "Sort: Bubble, Insertion, Quick, Merge, Heap — LO1", "DC2626", [
  { t: "Vue d'ensemble des tris", b: ["Bubble Sort : O(n^2) — compare paires adjacentes","Insertion Sort : O(n^2) — insere a la bonne place","Selection Sort : O(n^2) — selectionne le minimum","Quick Sort : O(n log n) moyen — pivot + partition","Merge Sort : O(n log n) garanti — diviser pour regner","Heap Sort : O(n log n) — utilise un tas"] },
  { t: "Bubble Sort", code: "void bubbleSort(int[] arr) {\n    for (int i = 0; i < arr.length - 1; i++)\n        for (int j = 0; j < arr.length - i - 1; j++)\n            if (arr[j] > arr[j+1]) {\n                int temp = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = temp;\n            }\n}\n// O(n^2) pire/moyen, O(n) meilleur (deja trie)" },
  { t: "Quick Sort", code: "void quickSort(int[] arr, int lo, int hi) {\n    if (lo >= hi) return;\n    int pivot = arr[hi], i = lo;\n    for (int j = lo; j < hi; j++)\n        if (arr[j] < pivot) {\n            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;\n            i++;\n        }\n    int t = arr[i]; arr[i] = arr[hi]; arr[hi] = t;\n    quickSort(arr, lo, i-1);\n    quickSort(arr, i+1, hi);\n}\n// O(n log n) moyen, O(n^2) pire cas" },
  { t: "Merge Sort", code: "void mergeSort(int[] arr, int lo, int hi) {\n    if (lo >= hi) return;\n    int mid = (lo + hi) / 2;\n    mergeSort(arr, lo, mid);\n    mergeSort(arr, mid+1, hi);\n    merge(arr, lo, mid, hi);\n}\n// O(n log n) GARANTI, stable, mais O(n) memoire" },
  { t: "Comparaison", b: ["Bubble/Insertion/Selection : O(n^2) — petits tableaux","Quick Sort : O(n log n) moyen, in-place, le plus utilise","Merge Sort : O(n log n) garanti, stable, memoire O(n)","Heap Sort : O(n log n), in-place mais pas stable","Bucket Sort : O(n) si distribution uniforme"] },
]);

mk("LO1_Algorithms_Search.pptx", "Algorithmes de Recherche", "Search: Linear, Binary, BST, Hashing — LO1", "0891B2", [
  { t: "Types de recherche", b: ["Linear Search : O(n) — parcours sequentiel","Binary Search : O(log n) — tableau TRIE requis","BST Search : O(log n) moyen — arbre binaire","Hash Search : O(1) amorti — table de hachage","DFS/BFS : recherche dans les graphes"] },
  { t: "Linear vs Binary Search", code: "// Linear : O(n)\nint linearSearch(int[] arr, int target) {\n    for (int i = 0; i < arr.length; i++)\n        if (arr[i] == target) return i;\n    return -1;\n}\n\n// Binary : O(log n) — REQUIRES sorted array\nint binarySearch(int[] arr, int target) {\n    int lo = 0, hi = arr.length - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}" },
  { t: "Recherche dans un BST", code: "TreeNode search(TreeNode root, int val) {\n    if (root == null) return null;\n    if (val == root.value) return root;\n    if (val < root.value)\n        return search(root.left, val);\n    else\n        return search(root.right, val);\n}\n// O(log n) si equilibre, O(n) pire cas" },
]);

mk("LO1_Algorithm_Types.pptx", "Types d'Algorithmes", "Recursive, Backtracking, Divide & Conquer, Greedy — LO1", "F59E0B", [
  { t: "Familles d'algorithmes", b: ["Recursive : s'appelle lui-meme (base case + recursive case)","Backtracking : essayer puis revenir en arriere si echec","Divide & Conquer : diviser → resoudre → combiner","Dynamic Programming : memoriser les sous-resultats","Greedy : choisir le meilleur a chaque etape","Brute Force : essayer toutes les possibilites","Branch & Bound : eliminer les branches non prometteuses"] },
  { t: "Recursion", code: "// Factorielle\nint factorial(int n) {\n    if (n <= 1) return 1; // base case\n    return n * factorial(n - 1); // recursive case\n}\n\n// Fibonacci\nint fib(int n) {\n    if (n <= 1) return n;\n    return fib(n-1) + fib(n-2);\n}\n// ATTENTION: fib naif = O(2^n) !" },
  { t: "Divide & Conquer", b: ["Diviser le probleme en sous-problemes plus petits","Resoudre chaque sous-probleme (recursivement)","Combiner les resultats","Exemples : Merge Sort, Quick Sort, Binary Search","Complexite typique : O(n log n)"] },
  { t: "Greedy vs Dynamic Programming", b: ["Greedy : choix optimal LOCAL a chaque etape","Pas toujours optimal GLOBALEMENT","DP : memorise les sous-solutions (memoization)","DP toujours optimal mais plus lent/memoire","Greedy : Dijkstra, Huffman","DP : Fibonacci, sac a dos, plus court chemin"] },
]);

console.log("\nGenerating 8 PPTX for LO1...");
