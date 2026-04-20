"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";

export default function Ex2() {
  // AUTH CHECK MOVED TO AFTER HOOKS

  return <CodeExercise
    chapter={2} title="Tracer le Call Stack" criteria="P2" worldColor="#7C3AED" totalPoints={60}
    intro="Analysez le comportement du call stack lors des appels de fonctions et de la récursivité."
    codeTemplate={`static int doubler(int x) {
    return x * 2;
}

static int calculer(int a, int b) {
    int somme = a + b;
    int resultat = ___blank1___(somme);
    return resultat;
}

// Pour calculer(5, 3) :
// somme = 5 + 3 = ___blank2___
// resultat = doubler(8) = ___blank3___

// Fonction récursive
static int factorielle(int n) {
    if (n <= ___blank4___) return 1;  // cas de base
    return n * factorielle(___blank5___);
}

// factorielle(4) = 4 * 3 * 2 * 1 = ___blank6___`}
    blanks={[
      { id: "blank1", label: "appel", answer: "doubler", hint: "Quelle fonction est appelée ?" },
      { id: "blank2", label: "somme", answer: "8", hint: "5 + 3 = ?" },
      { id: "blank3", label: "résultat", answer: "16", hint: "doubler(8) = 8 * 2" },
      { id: "blank4", label: "cas base", answer: "1", hint: "Quand arrêter la récursion ?" },
      { id: "blank5", label: "récursion", answer: "n - 1", hint: "On décrémente n à chaque appel" },
      { id: "blank6", label: "résultat", answer: "24", hint: "4 × 3 × 2 × 1" },
    ]}
    questions={[
      { id: "q1", question: "Quand doubler() s'exécute dans calculer(5,3), combien de frames sont empilés ?", options: ["1", "2", "3", "4"], correctIndex: 2, explanation: "3 frames : main + calculer + doubler." },
      { id: "q2", question: "LIFO signifie :", options: ["Last In, First Out", "List In, File Out", "Last Index, First Output"], correctIndex: 0, explanation: "Last In, First Out — le dernier empilé est le premier dépilé." },
      { id: "q3", question: "Sans cas de base dans une récursion, que se passe-t-il ?", freeAnswer: "StackOverflowError", explanation: "Sans cas de base → appels infinis → le stack déborde → StackOverflowError." },
    ]}
  />;
}
