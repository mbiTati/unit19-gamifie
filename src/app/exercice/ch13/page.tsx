"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";
export default function Ex13() {
  // AUTH CHECK MOVED TO AFTER HOOKS
 return <CodeExercise
  chapter={13} title="Mesurer l'efficacité" criteria="P7" worldColor="#16A34A" totalPoints={50}
  intro="Deux méthodes pour mesurer l'efficacité : théorique + empirique."
  codeTemplate={`// Méthode 1 : Analyse théorique (Big O)
// Compter les opérations en fonction de n

// Méthode 2 : Benchmark empirique
long start = System.___blank1___();
// ... algorithme ...
long end = System.___blank1___();
long dureeMs = (end - start) / ___blank2___;

// Mesurer la mémoire
Runtime rt = Runtime.___blank3___();
long memoire = (rt.totalMemory() - rt.___blank4___()) / 1024;

System.out.println("Temps: " + dureeMs + " ms");
System.out.println("Mémoire: " + memoire + " KB");`}
  blanks={[
    {id:"blank1",label:"timer",answer:"nanoTime",hint:"Mesure en nanosecondes"},
    {id:"blank2",label:"conversion",answer:"1_000_000",hint:"Nano → milli : diviser par 1 million"},
    {id:"blank3",label:"runtime",answer:"getRuntime",hint:"Accès aux infos de la JVM"},
    {id:"blank4",label:"mémoire libre",answer:"freeMemory",hint:"Mémoire non utilisée"}
  ]}
  questions={[
    {id:"q1",question:"Les deux méthodes sont :",options:["Identiques","Complémentaires — Big O + benchmark","Contradictoires"],correctIndex:1,explanation:"Théorique (tendance) + empirique (temps réel) = analyse complète."},
    {id:"q2",question:"Pourquoi un O(n) peut être plus lent qu'un O(n²) pour petit n ?",options:["Impossible","Les constantes cachées dominent","Big O est faux"],correctIndex:1,explanation:"Big O ignore les constantes. Un O(n) avec constante 1000 > O(n²) pour n<1000."}
  ]}
/>; }
