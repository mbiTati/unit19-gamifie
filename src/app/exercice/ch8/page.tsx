"use client";
import CodeExercise from "@/components/CodeExercise";
export default function Ex8() { return <CodeExercise
  chapter={8} title="LinkedList + HashMap" criteria="P4a" worldColor="#F97316" totalPoints={60}
  intro="Implémentez un système de gestion d'employés avec LinkedList et HashMap."
  codeTemplate={`import java.util.LinkedList;
import java.util.HashMap;

public class GestionEmployes {
    private ___blank1___<String> noms = new LinkedList<>();
    private ___blank2___<String, String> annuaire = new HashMap<>();

    public void ajouter(String matricule, String nom) {
        noms.___blank3___(nom);
        annuaire.___blank4___(matricule, nom);
    }

    // Recherche O(1) par matricule
    public String chercher(String matricule) {
        return annuaire.___blank5___(matricule);
    }

    public boolean supprimer(String matricule) {
        String nom = annuaire.___blank6___(matricule);
        if (nom != null) {
            noms.remove(nom);
            return true;
        }
        return false;
    }
}`}
  blanks={[
    {id:"blank1",label:"type liste",answer:"LinkedList",hint:"Liste chaînée"},
    {id:"blank2",label:"type map",answer:"HashMap",hint:"Table clé-valeur"},
    {id:"blank3",label:"ajouter liste",answer:"add",hint:"Ajouter à la LinkedList"},
    {id:"blank4",label:"ajouter map",answer:"put",hint:"Ajouter à la HashMap"},
    {id:"blank5",label:"chercher",answer:"get",hint:"Récupérer par clé"},
    {id:"blank6",label:"supprimer",answer:"remove",hint:"Supprimer et retourner la valeur"}
  ]}
  questions={[
    {id:"q1",question:"Complexité de HashMap.get() en moyenne ?",options:["O(n)","O(log n)","O(1)","O(n²)"],correctIndex:2,explanation:"Hash → accès direct O(1) en moyenne."},
    {id:"q2",question:"LinkedList.get(index) est O(n) car :",options:["Le tableau est plein","Il faut parcourir noeud par noeud","La mémoire est lente"],correctIndex:1,explanation:"Pas d'accès direct — il faut suivre les pointeurs un par un."}
  ]}
/>; }
