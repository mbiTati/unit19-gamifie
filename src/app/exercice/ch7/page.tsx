"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";
export default function Ex7() {
  // AUTH CHECK MOVED TO AFTER HOOKS
 return <CodeExercise
  chapter={7} title="ADT → POO — Conditions" criteria="D2" worldColor="#0891B2" totalPoints={50}
  intro="Traduisez les conditions formelles d'un ADT en code Java."
  codeTemplate={`// ADT Stack : spécification formelle → Java
public class Stack<E> {
    private ___blank1___<E> elements;
    private int top;

    public Stack() {
        elements = new ArrayList<>();
        top = ___blank2___;
    }

    // PRE: aucune | POST: e au sommet, size += 1
    public void push(E e) {
        elements.add(e);
        top___blank3___;
    }

    // PRE: isEmpty() == false
    // ERROR-CONDITION: si vide → exception
    public E pop() {
        if (___blank4___())
            throw new ___blank5___("Stack vide !");
        E element = elements.remove(top);
        top--;
        return element;
    }

    // INVARIANT: size() >= 0
    public int size() {
        return top + ___blank6___;
    }
}`}
  blanks={[
    {id:"blank1",label:"collection",answer:"ArrayList",hint:"Quelle collection Java pour stocker les éléments ?"},
    {id:"blank2",label:"initial",answer:"-1",hint:"Index initial quand la pile est vide"},
    {id:"blank3",label:"incrément",answer:"++",hint:"Le sommet monte de 1"},
    {id:"blank4",label:"précondition",answer:"isEmpty",hint:"Vérifier la pré-condition avant pop"},
    {id:"blank5",label:"exception",answer:"EmptyStackException",hint:"Error-condition → exception Java"},
    {id:"blank6",label:"taille",answer:"1",hint:"Si top=0, size=1 (un élément)"}
  ]}
  questions={[
    {id:"q1",question:"La pré-condition de pop() se traduit en Java par :",options:["Un commentaire","Un if + throw exception","Un return null","Ignorer"],correctIndex:1,explanation:"Pré-condition violée = throw exception. C'est la traduction Java des error-conditions."},
    {id:"q2",question:"L'invariant size() >= 0 est garanti par :",options:["Un test unitaire","La logique interne du code (top commence à -1, incrémenté par push)","Une annotation @Invariant","Le compilateur"],correctIndex:1,explanation:"L'invariant est garanti par le design du code, pas par un mécanisme externe."},
    {id:"q3",question:"Pourquoi ArrayList est private ?",options:["Convention","Encapsulation : cacher l'implémentation interne","Performance","Obligatoire pour les génériques"],correctIndex:1,explanation:"Information hiding : on pourrait remplacer ArrayList par LinkedList sans changer l'interface."}
  ]}

  mainCode={`import java.util.Scanner;

public class Menu {
    public static void main(String[] args) {
        Stack<String> stack = new Stack<>();
        Scanner sc = new Scanner(System.in);
        int choix;
        do {
            System.out.println("\n=== Stack Demo ===");
            System.out.println("1. Push");
            System.out.println("2. Pop");
            System.out.println("3. Afficher taille");
            System.out.println("0. Quitter");
            System.out.print("Choix : ");
            try {
                choix = sc.nextInt(); sc.nextLine();
            } catch (Exception e) {
                sc.nextLine(); choix = -1; continue;
            }
            switch (choix) {
                case 1:
                    System.out.print("Element : ");
                    stack.push(sc.nextLine());
                    System.out.println("Empile !");
                    break;
                case 2:
                    try {
                        System.out.println("Depile : " + stack.pop());
                    } catch (Exception e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 3:
                    System.out.println("Taille : " + stack.size());
                    break;
            }
        } while (choix != 0);
        sc.close();
    }
}`}
/>; }
