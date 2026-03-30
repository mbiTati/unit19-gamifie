"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";
export default function Ex9() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }
 return <CodeExercise
  chapter={9} title="BST + Insertion Sort" criteria="P4b" worldColor="#F97316" totalPoints={60}
  intro="Implémentez un arbre binaire de recherche et un tri par insertion."
  codeTemplate={`class TreeNode {
    int value;
    TreeNode left, right;
    TreeNode(int v) { this.value = v; }
}

// Insertion récursive dans un BST
TreeNode insert(TreeNode node, int val) {
    if (node == ___blank1___) return new TreeNode(val);
    if (val ___blank2___ node.value)
        node.left = insert(node.___blank3___, val);
    else if (val > node.value)
        node.right = insert(node.right, val);
    return node;
}

// Parcours inorder (donne les éléments triés!)
void inorder(TreeNode node) {
    if (node == null) return;
    inorder(node.___blank3___);
    System.out.print(node.value + " ");
    inorder(node.___blank4___);
}

// Insertion Sort
void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[___blank5___];
        int j = i - 1;
        while (j >= 0 && arr[j] > ___blank6___) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`}
  blanks={[
    {id:"blank1",label:"base",answer:"null",hint:"Cas de base de la récursion"},
    {id:"blank2",label:"comparaison",answer:"<",hint:"BST: gauche < racine"},
    {id:"blank3",label:"direction",answer:"left",hint:"Le sous-arbre gauche"},
    {id:"blank4",label:"direction2",answer:"right",hint:"Le sous-arbre droit"},
    {id:"blank5",label:"index",answer:"i",hint:"L'élément à insérer"},
    {id:"blank6",label:"clé",answer:"key",hint:"On compare avec l'élément à insérer"}
  ]}
  questions={[
    {id:"q1",question:"Inorder sur un BST donne :",options:["Éléments aléatoires","Éléments TRIÉS","La racine d'abord"],correctIndex:1,explanation:"Gauche-Racine-Droite sur un BST = trié croissant."},
    {id:"q2",question:"Insertion Sort au meilleur cas :",options:["O(n²)","O(n log n)","O(n)"],correctIndex:2,explanation:"O(n) si le tableau est déjà trié — aucun décalage nécessaire."}
  ]}
/>; }
