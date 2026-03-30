"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";

export default function Ex3() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  return <CodeExercise
    chapter={3} title="Queue FIFO + Comparaison de tris" criteria="M1/M2" worldColor="#7C3AED" totalPoints={60}
    intro="Complétez le code d'une Queue et d'un Bubble Sort, puis comparez les performances."
    codeTemplate={`// Queue FIFO avec ArrayDeque
Queue<String> file = new ___blank1___<>();

file.___blank2___("Alice");   // ajouter en fin
file.___blank2___("Bob");
file.___blank2___("Clara");

String premier = file.___blank3___();  // retirer du début → "Alice"
String prochain = file.___blank4___(); // consulter sans retirer → "Bob"

// Bubble Sort
void bubbleSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++)
        for (int j = 0; j < arr.length - 1 - ___blank5___; j++)
            if (arr[j] > arr[___blank6___]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
}`}
    blanks={[
      { id: "blank1", label: "implémentation", answer: "ArrayDeque", hint: "Implémentation recommandée de Queue en Java" },
      { id: "blank2", label: "enfiler", answer: "offer", hint: "Méthode pour ajouter dans une Queue" },
      { id: "blank3", label: "défiler", answer: "poll", hint: "Retirer et retourner le premier élément" },
      { id: "blank4", label: "consulter", answer: "peek", hint: "Voir le premier SANS le retirer" },
      { id: "blank5", label: "optimisation", answer: "i", hint: "Les i derniers éléments sont déjà triés" },
      { id: "blank6", label: "voisin", answer: "j + 1", hint: "On compare arr[j] avec son voisin de droite" },
    ]}
    questions={[
      { id: "q1", question: "FIFO signifie :", options: ["First In, First Out", "Fast In, Fast Out", "File In, File Out"], correctIndex: 0, explanation: "First In, First Out — le premier entré est le premier sorti." },
      { id: "q2", question: "Complexité moyenne du Quick Sort ?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctIndex: 1, explanation: "Quick Sort = O(n log n) en moyenne, bien plus rapide que Bubble Sort O(n²)." },
      { id: "q3", question: "Pour n=10000, Quick Sort est environ combien de fois plus rapide que Bubble Sort ?", options: ["10x", "100x", "770x", "10000x"], correctIndex: 2, explanation: "~100M comparaisons (Bubble) vs ~130K (Quick) ≈ 770x plus rapide." },
    ]}
  />;
}
