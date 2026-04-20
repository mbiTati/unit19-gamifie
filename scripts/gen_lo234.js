const pptxgen = require("pptxgenjs");
const path = require("path");
const OUT = path.join(__dirname, "..", "public", "docs", "pptx");
const BG="0A0F1A",ACCENT="32E0C4",GOLD="F59E0B",TXT="E2E8F0",MUT="94A3B8";

function mk(file, title, sub, color, slides) {
  const p = new pptxgen(); p.layout = "LAYOUT_16x9";
  let s = p.addSlide(); s.background = { color: BG };
  s.addText("Unit 19", { x: 0.5, y: 0.3, w: 9, h: 0.4, fontSize: 10, color: MUT });
  s.addText(title, { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 32, color: color, bold: true });
  s.addText(sub, { x: 0.5, y: 3, w: 9, h: 0.5, fontSize: 14, color: MUT });
  s.addText("Ecole Schulz — Mme MBI", { x: 0.5, y: 5, w: 9, h: 0.4, fontSize: 10, color: MUT });
  slides.forEach(sl => {
    s = p.addSlide(); s.background = { color: BG };
    s.addText(sl.t, { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 22, color: ACCENT, bold: true });
    if (sl.b) { const items = sl.b.map((b,i)=>({text:b,options:{bullet:true,breakLine:i<sl.b.length-1,fontSize:13,color:TXT}})); s.addText(items, { x: 0.6, y: 1.1, w: 8.8, h: 4, paraSpaceAfter: 6 }); }
    if (sl.code) { s.addText(sl.code, { x: 0.5, y: 1.1, w: 9, h: 4, fontSize: 11, color: ACCENT, fontFace: "Consolas", valign: "top" }); }
  });
  p.writeFile({ fileName: path.join(OUT, file) }).then(() => console.log("  OK: " + file));
}

// LO2
mk("LO2_ADT_Formal_Notation.pptx", "ADT & Notation Formelle", "ASN.1, specification formelle — LO2", "0891B2", [
  { t: "Specification des ADT", b: ["ADT = Abstract Data Type : QUOI sans COMMENT","Definit les operations, pas l'implementation","Notation formelle : description mathematique precise","ASN.1 : Abstract Syntax Notation One (standard ISO)","Permet de verifier la coherence avant de coder"] },
  { t: "Exemple : Stack en notation formelle", code: "ADT Stack<T>\n  Preconditions:\n    - push(e): none\n    - pop(): not empty()\n    - peek(): not empty()\n  Postconditions:\n    - push(e): size' = size + 1, top' = e\n    - pop(): size' = size - 1, returns old top\n    - peek(): size unchanged, returns top\n  Error conditions:\n    - pop() on empty: EmptyStackException\n    - peek() on empty: EmptyStackException" },
]);

mk("LO2_SDL_VDM.pptx", "SDL & VDM", "Langages de specification non executables — LO2", "0891B2", [
  { t: "SDL (Specification & Description Language)", b: ["Langage graphique pour decrire les systemes reactifs","Diagrammes d'etat-transition","Utilise dans les telecoms (ITU-T)","Processus, signaux, etats, transitions","Permet de modeliser le comportement avant de coder"] },
  { t: "VDM (Vienna Development Method)", b: ["Methode formelle de specification","Types : ensembles, sequences, maps","Operations avec pre/post conditions","Invariants de donnees","Raffinement : specification → implementation","Proof obligations : prouver la coherence"] },
]);

mk("LO2_Design_Patterns_Complete.pptx", "Design Patterns Complet", "10 patterns : Creation, Structure, Comportement — LO2", "7C3AED", [
  { t: "3 Categories de Patterns", b: ["CREATION : comment creer des objets","  Singleton, Factory Method, Builder","STRUCTURE : comment organiser les classes","  Adapter, Composite, Decorator, Facade","COMPORTEMENT : comment communiquer","  Observer, Strategy, Visitor"] },
  { t: "Singleton", code: "public class Database {\n    private static Database instance;\n    private Database() {} // prive !\n    public static Database getInstance() {\n        if (instance == null)\n            instance = new Database();\n        return instance;\n    }\n}\n// UNE seule instance dans toute l'app" },
  { t: "Factory Method", code: "interface Animal { void parler(); }\nclass Chien implements Animal {\n    public void parler() { System.out.println(\"Woof\"); }\n}\nclass Chat implements Animal {\n    public void parler() { System.out.println(\"Miaou\"); }\n}\nclass AnimalFactory {\n    public static Animal creer(String type) {\n        if (type.equals(\"chien\")) return new Chien();\n        if (type.equals(\"chat\")) return new Chat();\n        throw new IllegalArgumentException();\n    }\n}" },
  { t: "Observer", code: "interface Observer { void update(String msg); }\nclass Canal {\n    List<Observer> abonnes = new ArrayList<>();\n    public void abonner(Observer o) { abonnes.add(o); }\n    public void publier(String msg) {\n        for (Observer o : abonnes) o.update(msg);\n    }\n}\n// Quand Canal publie, TOUS les abonnes sont notifies" },
  { t: "Strategy", code: "interface TriStrategy { void trier(int[] arr); }\nclass BubbleSort implements TriStrategy { ... }\nclass QuickSort implements TriStrategy { ... }\n\nclass Trieur {\n    private TriStrategy strategy;\n    public void setStrategy(TriStrategy s) {\n        this.strategy = s;\n    }\n    public void executer(int[] arr) {\n        strategy.trier(arr);\n    }\n}\n// Changer d'algorithme a runtime" },
]);

mk("LO2_Encapsulation_Interfaces.pptx", "Encapsulation & Interfaces", "Information hiding, couplage faible — LO2", "0891B2", [
  { t: "Encapsulation", b: ["Attributs PRIVATE + getters/setters PUBLIC","Protege les donnees internes","Controle l'acces (validation dans les setters)","Reduit le couplage entre les classes","Principe : cacher le COMMENT, exposer le QUOI"] },
  { t: "Information Hiding", b: ["Cacher les details d'implementation","Le client utilise l'INTERFACE, pas l'implementation","Permet de changer l'implementation sans casser le client","Exemple : List<E> peut etre ArrayList OU LinkedList","4 niveaux : public > protected > package > private"] },
  { t: "Interfaces en Java", code: "interface Stockable {\n    void ajouter(Object item);\n    Object retirer();\n    int taille();\n}\n\nclass MaListe implements Stockable {\n    public void ajouter(Object item) { ... }\n    public Object retirer() { ... }\n    public int taille() { ... }\n}\n\n// Utilisation via l'interface :\nStockable s = new MaListe();\ns.ajouter(\"test\");" },
]);

mk("LO2_Pre_Post_Conditions.pptx", "Pre/Post/Error Conditions", "Contrats de programmation — LO2", "F59E0B", [
  { t: "Conditions de creation", b: ["Preconditions : conditions AVANT l'execution","Postconditions : garanties APRES l'execution","Error conditions : que faire si precondition violee","Design by Contract (Bertrand Meyer)","Documente le comportement attendu"] },
  { t: "Exemple complet", code: "/**\n * Precondition: index >= 0 && index < size()\n * Postcondition: element at index is returned\n *                size unchanged\n * Error: IndexOutOfBoundsException if violated\n */\npublic E get(int index) {\n    if (index < 0 || index >= size)\n        throw new IndexOutOfBoundsException(\n            \"Index: \" + index + \", Size: \" + size);\n    return elements[index];\n}" },
]);

// LO3
mk("LO3_HashMap.pptx", "HashMap (Table de Hachage)", "Cle-valeur en O(1) — LO3", "F97316", [
  { t: "Qu'est-ce qu'un HashMap ?", b: ["Structure cle-valeur : put(key, value) / get(key)","Acces O(1) amorti grace au HASHING","hashCode() calcule l'index du bucket","Collision : 2 cles differentes → meme bucket","Resolution : chainage (LinkedList) ou open addressing"] },
  { t: "Code Java", code: "Map<String, Integer> ages = new HashMap<>();\nages.put(\"Alice\", 20);\nages.put(\"Bob\", 22);\n\nint age = ages.get(\"Alice\"); // 20\nages.containsKey(\"Bob\"); // true\nages.remove(\"Bob\");\n\n// Parcours\nfor (Map.Entry<String, Integer> e : ages.entrySet())\n    System.out.println(e.getKey() + \" : \" + e.getValue());" },
  { t: "Complexite", b: ["put(k,v) : O(1) amorti","get(k) : O(1) amorti","remove(k) : O(1) amorti","Pire cas (toutes les collisions) : O(n)","Facteur de charge : size/capacity → rehash si > 0.75"] },
]);

mk("LO3_Graph_Algorithms.pptx", "Algorithmes de Graphes", "BFS, DFS, Dijkstra — LO3", "F97316", [
  { t: "Representations", b: ["Matrice d'adjacence : tableau 2D (O(V^2) memoire)","Liste d'adjacence : tableau de listes (O(V+E) memoire)","Graphe oriente / non oriente","Graphe pondere / non pondere"] },
  { t: "BFS (Breadth-First Search)", code: "void bfs(Graph g, int start) {\n    Queue<Integer> queue = new LinkedList<>();\n    Set<Integer> visited = new HashSet<>();\n    queue.offer(start);\n    visited.add(start);\n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        System.out.print(node + \" \");\n        for (int neighbor : g.adj(node))\n            if (!visited.contains(neighbor)) {\n                visited.add(neighbor);\n                queue.offer(neighbor);\n            }\n    }\n}\n// O(V + E), utilise une QUEUE" },
  { t: "DFS (Depth-First Search)", code: "void dfs(Graph g, int node, Set<Integer> visited) {\n    visited.add(node);\n    System.out.print(node + \" \");\n    for (int neighbor : g.adj(node))\n        if (!visited.contains(neighbor))\n            dfs(g, neighbor, visited);\n}\n// O(V + E), utilise la RECURSION (pile d'appels)" },
]);

mk("LO3_Testing_JUnit.pptx", "Testing & JUnit 5", "Tests unitaires, debugging — LO3", "F97316", [
  { t: "Pourquoi tester ?", b: ["Verifier que le code fait ce qu'il doit","Detecter les bugs TOT (moins cher a corriger)","Documenter le comportement attendu","Faciliter le refactoring en securite","Types : unitaire, integration, systeme, acceptance"] },
  { t: "JUnit 5 en Java", code: "import org.junit.jupiter.api.*;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass StackTest {\n    Stack<Integer> stack;\n    \n    @BeforeEach\n    void setup() { stack = new Stack<>(); }\n    \n    @Test\n    void testPush() {\n        stack.push(42);\n        assertEquals(1, stack.size());\n    }\n    \n    @Test\n    void testPopEmpty() {\n        assertThrows(EmptyStackException.class,\n            () -> stack.pop());\n    }\n}" },
  { t: "Exceptions en Java", code: "// throw = LANCE une exception\n// throws = DECLARE qu'une methode peut lancer\n\npublic void retirer(int montant) throws SoldeInsuffisant {\n    if (montant > solde)\n        throw new SoldeInsuffisant(\"Solde: \" + solde);\n    solde -= montant;\n}\n\n// try/catch/finally\ntry {\n    compte.retirer(1000);\n} catch (SoldeInsuffisant e) {\n    System.out.println(e.getMessage());\n} finally {\n    System.out.println(\"Toujours execute\");\n}" },
]);

// LO4
mk("LO4_Big_O_Notation.pptx", "Big O Notation", "Analyse asymptotique — LO4", "D97706", [
  { t: "Qu'est-ce que Big O ?", b: ["Mesure la CROISSANCE du temps d'execution","Ignore les constantes et les termes inferieurs","O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)","Pire cas (worst case) par defaut","n = taille de l'entree"] },
  { t: "Les complexites courantes", b: ["O(1) Constant : acces tableau, HashMap.get()","O(log n) Logarithmique : binary search","O(n) Lineaire : parcours de liste","O(n log n) Linearithmique : merge sort, quick sort","O(n^2) Quadratique : double boucle, bubble sort","O(2^n) Exponentiel : fibonacci naif, backtracking"] },
  { t: "Comment determiner Big O", code: "// O(1) — pas de boucle\nint x = arr[5];\n\n// O(n) — une boucle\nfor (int i = 0; i < n; i++) { ... }\n\n// O(n^2) — boucles imbriquees\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++) { ... }\n\n// O(log n) — divise par 2 a chaque etape\nwhile (n > 1) { n = n / 2; }\n\n// O(n log n) — boucle * log\n// = merge sort, quick sort" },
  { t: "Regles de calcul", b: ["Regle 1 : ignorer les constantes (3n → O(n))","Regle 2 : garder le terme dominant (n^2 + n → O(n^2))","Regle 3 : boucles sequentielles s'additionnent (O(n) + O(m))","Regle 4 : boucles imbriquees se multiplient (O(n) * O(m))","Regle 5 : appels recursifs → arbre de recursion"] },
]);

mk("LO4_Benchmark.pptx", "Benchmark & Mesure", "Runtime, memoire, performance — LO4", "D97706", [
  { t: "Mesurer l'efficacite", b: ["Temps d'execution : System.nanoTime()","Memoire : Runtime.getRuntime().totalMemory()","Benchmark = mesure empirique (pas theorique)","Dependances : compilateur, OS, hardware, JVM warmup","Toujours tester avec des tailles croissantes (n=100, 1000, 10000)"] },
  { t: "Code Java : benchmark", code: "long start = System.nanoTime();\n\n// Code a mesurer\nfor (int i = 0; i < n; i++) {\n    list.add(i);\n}\n\nlong end = System.nanoTime();\nlong ms = (end - start) / 1_000_000;\nSystem.out.println(\"Temps: \" + ms + \" ms\");\n\n// Memoire\nRuntime rt = Runtime.getRuntime();\nlong used = rt.totalMemory() - rt.freeMemory();\nSystem.out.println(\"Memoire: \" + used/1024 + \" KB\");" },
  { t: "Trade-offs", b: ["Temps vs Memoire : HashMap rapide mais gourmand","Simplicite vs Performance : ArrayList simple, TreeMap trie","Flexibilite vs Vitesse : interface vs implementation directe","Garbage collection : impact sur la performance","Parallelisme : multithread peut accelerer OU ralentir"] },
]);

console.log("\nGenerating LO2-LO4 PPTX...");
