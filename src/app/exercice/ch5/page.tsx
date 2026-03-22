"use client";
import CodeExercise from "@/components/CodeExercise";
export default function Ex5() { return <CodeExercise
  chapter={5} title="Notation formelle d'un Stack" criteria="P3" worldColor="#0891B2" totalPoints={50}
  intro="Complétez la spécification impérative d'un ADT Stack."
  codeTemplate={`ADT ___blank1___<E>

DESCRIPTION:
  Collection ___blank2___ (Last In, First Out)

OPERATIONS:
  OPERATION push(e: E) → void
    PRE:  aucune
    POST: e au sommet, size = old_size + ___blank3___

  OPERATION pop() → E
    PRE:  ___blank4___ == false
    POST: sommet retiré, size = old_size - 1

  OPERATION peek() → E
    PRE:  isEmpty() == false
    POST: retourne sommet ___blank5___ le retirer

INVARIANTS:
  size() >= ___blank6___`}
  blanks={[
    {id:"blank1",label:"nom ADT",answer:"Stack",hint:"Quel ADT est LIFO ?"},
    {id:"blank2",label:"principe",answer:"LIFO",hint:"Last In, First Out"},
    {id:"blank3",label:"delta",answer:"1",hint:"La taille augmente de combien ?"},
    {id:"blank4",label:"précondition",answer:"isEmpty()",hint:"On ne peut pas pop si..."},
    {id:"blank5",label:"modifier?",answer:"SANS",hint:"peek consulte sans modifier"},
    {id:"blank6",label:"invariant",answer:"0",hint:"La taille ne peut pas être négative"}
  ]}
  questions={[
    {id:"q1",question:"Un axiome du Stack est :",options:["pop(push(S,e)) = <e,S>","push(pop(S)) = S","size(new) = 1","peek(new) = 0"],correctIndex:0,explanation:"Push puis pop retourne l'élément et le stack original."},
    {id:"q2",question:"En Java, l'interface correspond à :",options:["L'implémentation","L'ADT (spécification)","Un package"],correctIndex:1,explanation:"Interface Java = ADT = le QUOI sans le COMMENT."}
  ]}
/>; }
