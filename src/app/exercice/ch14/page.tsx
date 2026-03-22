"use client";
import CodeExercise from "@/components/CodeExercise";
export default function Ex14() { return <CodeExercise
  chapter={14} title="Trade-offs + Indépendance" criteria="M5/D4" worldColor="#16A34A" totalPoints={50}
  intro="Analysez les compromis et l'indépendance d'implémentation."
  codeTemplate={`// Trade-off : ArrayList vs LinkedList
// ArrayList  : accès O(___blank1___), insertion O(___blank2___)
// LinkedList : accès O(___blank2___), insertion O(___blank1___)

// Indépendance d'implémentation
// Avant :
List<String> list = new ___blank3___<>();
// Après (changement transparent !) :
List<String> list = new ___blank4___<>();

// Le code client ne change PAS car on programme
// contre l'___blank5___, pas la classe concrète

// 3 avantages :
// 1. ___blank6___ transparente
// 2. Testabilité
// 3. Réutilisabilité`}
  blanks={[
    {id:"blank1",label:"rapide",answer:"1",hint:"Accès constant"},
    {id:"blank2",label:"lent",answer:"n",hint:"Parcours linéaire"},
    {id:"blank3",label:"avant",answer:"ArrayList",hint:"Implémentation courante"},
    {id:"blank4",label:"après",answer:"LinkedList",hint:"Autre implémentation de List"},
    {id:"blank5",label:"principe",answer:"interface",hint:"Program to an..."},
    {id:"blank6",label:"avantage1",answer:"Optimisation",hint:"Changer l'implémentation pour aller plus vite"}
  ]}
  questions={[
    {id:"q1",question:"HashMap vs TreeMap — trade-off :",options:["Pas de différence","HashMap O(1) pas d'ordre / TreeMap O(log n) trié","TreeMap plus rapide"],correctIndex:1,explanation:"Vitesse vs ordre trié."},
    {id:"q2",question:"'Program to an interface' signifie :",options:["Coder sans IDE","Utiliser l'interface, pas la classe concrète","Ne pas utiliser de librairies"],correctIndex:1,explanation:"Le code client dépend de List, pas de ArrayList."}
  ]}
/>; }
