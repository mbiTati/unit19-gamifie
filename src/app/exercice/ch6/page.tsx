"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";
export default function Ex6() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }
 return <CodeExercise
  chapter={6} title="Encapsulation & Information Hiding" criteria="M3" worldColor="#0891B2" totalPoints={60}
  intro="Refactorez ce code pour ajouter l'encapsulation, les interfaces et l'information hiding."
  codeTemplate={`// ═══ INTERFACE (ADT = contrat) ═══
public ___blank1___ Stockable {
    void ajouter(String item);
    String retirer();
    boolean estVide();
}

// ═══ IMPLÉMENTATION ENCAPSULÉE ═══
public class Inventaire implements ___blank2___ {
    ___blank3___ ArrayList<String> items;

    public Inventaire() {
        items = new ArrayList<>();
    }

    // Getter — lecture seule
    public int ___blank4___() {
        return items.size();
    }

    // Setter avec VALIDATION
    public void ajouter(String item) {
        if (item != null && !item.___blank5___()) {
            items.add(item);
        }
    }

    // PRE: !estVide()
    // ERROR: si vide → exception
    public String retirer() {
        if (estVide())
            throw new ___blank6___("Inventaire vide !");
        return items.remove(items.size() - 1);
    }

    public boolean estVide() {
        return items.___blank7___();
    }
}`}
  blanks={[
    {id:"blank1",label:"mot-clé",answer:"interface",hint:"Contrat sans implémentation en Java"},
    {id:"blank2",label:"implements",answer:"Stockable",hint:"La classe implémente l'interface"},
    {id:"blank3",label:"accès",answer:"private",hint:"Information hiding : cacher l'implémentation"},
    {id:"blank4",label:"getter",answer:"getTaille",hint:"Convention Java pour les getters"},
    {id:"blank5",label:"validation",answer:"isEmpty",hint:"Vérifier que l'item n'est pas vide"},
    {id:"blank6",label:"exception",answer:"IllegalStateException",hint:"Error-condition → exception"},
    {id:"blank7",label:"méthode",answer:"isEmpty",hint:"Méthode de ArrayList pour vérifier si vide"}
  ]}
  questions={[
    {id:"q1",question:"Pourquoi utiliser une interface Stockable ?",options:["Convention","Séparer le QUOI du COMMENT (ADT)","Performance","Obligatoire"],correctIndex:1,explanation:"Interface = ADT : le contrat public. L'implémentation peut changer sans affecter le client."},
    {id:"q2",question:"Pourquoi ArrayList est private ?",options:["Bug","On pourrait la remplacer par LinkedList sans changer l'interface","Convention","Performance"],correctIndex:1,explanation:"Information hiding : le client ne connaît pas la structure interne."},
    {id:"q3",question:"Lien entre error-condition et exception Java :",options:["Aucun","Violation pré-condition → throw exception","Exception remplace l'encapsulation","Condition remplace l'exception"],correctIndex:1,explanation:"La violation d'une pré-condition se traduit par throw exception en Java."}
  ]}

  mainCode={`import java.util.Scanner;

public class Menu {
    public static void main(String[] args) {
        Inventaire inv = new Inventaire();
        Scanner sc = new Scanner(System.in);
        int choix;
        do {
            System.out.println("\n=== Inventaire ===");
            System.out.println("1. Ajouter un item");
            System.out.println("2. Retirer le dernier");
            System.out.println("3. Afficher la taille");
            System.out.println("0. Quitter");
            System.out.print("Choix : ");
            try {
                choix = sc.nextInt(); sc.nextLine();
            } catch (Exception e) {
                sc.nextLine(); choix = -1; continue;
            }
            switch (choix) {
                case 1:
                    System.out.print("Item : ");
                    inv.ajouter(sc.nextLine());
                    System.out.println("Ajoute !");
                    break;
                case 2:
                    try {
                        System.out.println("Retire : " + inv.retirer());
                    } catch (IllegalStateException e) {
                        System.out.println("Erreur : " + e.getMessage());
                    }
                    break;
                case 3:
                    System.out.println("Taille : " + inv.getTaille());
                    break;
            }
        } while (choix != 0);
        sc.close();
    }
}`}
/>; }
