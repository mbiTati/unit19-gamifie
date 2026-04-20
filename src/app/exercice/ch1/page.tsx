"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";

export default function Ex1() {
  // AUTH CHECK MOVED TO AFTER HOOKS

  return <CodeExercise
    chapter={1} title="Design Specification d'un ADT" criteria="P1" worldColor="#7C3AED" totalPoints={60}
    intro="Complétez le code d'un répertoire d'étudiants en utilisant une LinkedList. Chaque trou correspond à une opération fondamentale de l'ADT List."
    codeTemplate={`import java.util.___blank1___;

public class StudentDirectory {
    private ___blank2___ etudiants;

    public StudentDirectory() {
        etudiants = new ___blank3___();
    }

    // CREATE : ajouter un étudiant
    public void ajouter(String nom) {
        etudiants.___blank4___(nom);
    }

    // READ : chercher un étudiant par index
    public String getEtudiant(int index) {
        return etudiants.___blank5___(index);
    }

    // DELETE : supprimer un étudiant
    public boolean supprimer(String nom) {
        return etudiants.___blank6___(nom);
    }

    // Taille de la liste
    public int getTaille() {
        return etudiants.___blank7___();
    }
}`}
    blanks={[
      { id: "blank1", label: "import", answer: "LinkedList", hint: "Quelle collection Java pour une liste chaînée ?" },
      { id: "blank2", label: "type", answer: "LinkedList<String>", hint: "Type générique avec String" },
      { id: "blank3", label: "constructeur", answer: "LinkedList<>", hint: "Instanciation avec diamond operator" },
      { id: "blank4", label: "ajouter", answer: "add", hint: "Méthode pour ajouter un élément à une List" },
      { id: "blank5", label: "lire", answer: "get", hint: "Méthode pour accéder par index" },
      { id: "blank6", label: "supprimer", answer: "remove", hint: "Méthode pour supprimer un objet" },
      { id: "blank7", label: "taille", answer: "size", hint: "Méthode pour connaître le nombre d'éléments" },
    ]}
    questions={[
      { id: "q1", question: "Quel est le principe d'un ADT ?", options: ["Définir le code Java exact", "Définir les opérations possibles SANS l'implémentation", "Définir la base de données", "Définir l'interface graphique"], correctIndex: 1, explanation: "Un ADT définit le QUOI (opérations) sans le COMMENT (implémentation)." },
      { id: "q2", question: "Quelle est la complexité de LinkedList.get(index) ?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctIndex: 1, explanation: "LinkedList.get(i) parcourt la liste du début → O(n). ArrayList.get(i) serait O(1)." },
      { id: "q3", question: "Qu'est-ce qu'une précondition ?", options: ["Le code qui s'exécute après", "Une condition qui DOIT être vraie AVANT l'appel", "Le constructeur", "Un type de boucle"], correctIndex: 1, explanation: "PRE = ce qui doit être vrai avant d'appeler l'opération. Ex: !isEmpty() pour pop()." },
    ]}
  
  mainCode={`import java.util.Scanner;

public class Menu {
    public static void main(String[] args) {
        StudentDirectory dir = new StudentDirectory();
        Scanner sc = new Scanner(System.in);
        int choix;
        do {
            System.out.println("\n=== Repertoire Etudiants ===");
            System.out.println("1. Ajouter un etudiant");
            System.out.println("2. Afficher un etudiant");
            System.out.println("3. Supprimer un etudiant");
            System.out.println("4. Afficher la taille");
            System.out.println("0. Quitter");
            System.out.print("Choix : ");
            try {
                choix = sc.nextInt(); sc.nextLine();
            } catch (Exception e) {
                sc.nextLine(); choix = -1; continue;
            }
            switch (choix) {
                case 1:
                    System.out.print("Nom : ");
                    dir.ajouter(sc.nextLine());
                    System.out.println("Ajoute !");
                    break;
                case 2:
                    System.out.print("Index : ");
                    try {
                        System.out.println(dir.getEtudiant(sc.nextInt()));
                    } catch (Exception e) {
                        System.out.println("Index invalide !");
                    }
                    sc.nextLine();
                    break;
                case 3:
                    System.out.print("Nom : ");
                    System.out.println(dir.supprimer(sc.nextLine()) ? "Supprime" : "Non trouve");
                    break;
                case 4:
                    System.out.println("Taille : " + dir.getTaille());
                    break;
            }
        } while (choix != 0);
        sc.close();
    }
}`}
/>;
}
