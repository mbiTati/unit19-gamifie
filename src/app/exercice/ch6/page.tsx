"use client";
import CodeExercise from "@/components/CodeExercise";
export default function Ex6() { return <CodeExercise
  chapter={6} title="Encapsulation — Refactoring" criteria="M3" worldColor="#0891B2" totalPoints={50}
  intro="Refactorez ce code pour ajouter l'encapsulation correcte."
  codeTemplate={`// AVANT (mauvais — pas d'encapsulation)
public class Compte {
    public String nom;      // → doit être ___blank1___
    public double solde;    // → doit être ___blank1___
}

// APRÈS (avec encapsulation)
public class Compte {
    ___blank1___ String nom;
    ___blank1___ double solde;

    // Getter
    public String ___blank2___() {
        return nom;
    }

    // Setter avec VALIDATION
    public void deposer(double montant) {
        if (montant ___blank3___ 0) {
            this.solde += montant;
        }
    }

    public boolean retirer(double montant) {
        if (montant > 0 && montant ___blank4___ solde) {
            this.solde -= montant;
            return ___blank5___;
        }
        return false;
    }
}`}
  blanks={[
    {id:"blank1",label:"accès",answer:"private",hint:"Le modificateur le plus restrictif"},
    {id:"blank2",label:"getter",answer:"getNom",hint:"Convention Java pour les getters"},
    {id:"blank3",label:"validation",answer:">",hint:"Le montant doit être positif"},
    {id:"blank4",label:"condition",answer:"<=",hint:"On ne peut pas retirer plus que le solde"},
    {id:"blank5",label:"succès",answer:"true",hint:"Le retrait a réussi"}
  ]}
  questions={[
    {id:"q1",question:"L'avantage principal de l'encapsulation :",options:["Code plus court","Changer l'implémentation sans affecter le client","Programme plus rapide","Obligatoire en Java"],correctIndex:1,explanation:"Changement transparent = la puissance de l'encapsulation."},
    {id:"q2",question:"Information hiding signifie :",options:["Chiffrer les données","Cacher l'implémentation derrière une interface","Supprimer les commentaires"],correctIndex:1,explanation:"Exposer le QUOI, cacher le COMMENT."}
  ]}
/>; }
