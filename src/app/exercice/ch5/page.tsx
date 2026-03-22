"use client";
import CodeExercise from "@/components/CodeExercise";
export default function Ex5() { return <CodeExercise
  chapter={5} title="Spécification formelle — VDM & Notation" criteria="P3" worldColor="#0891B2" totalPoints={60}
  intro="Complétez la spécification impérative ET la notation VDM d'un ADT Stack."
  codeTemplate={`// ═══ NOTATION IMPÉRATIVE ═══
ADT ___blank1___<E>

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
  size() >= ___blank6___

AXIOM: ∀e, pop(push(S,e)) = <e, S>

// ═══ NOTATION VDM ═══
// Invariant VDM :
inv-Stack(s) ___blank7___ len(s) ≥ 0

// Post-condition VDM de pop :
post-pop(s, result) ≜ result = ___blank8___(s)`}
  blanks={[
    {id:"blank1",label:"nom ADT",answer:"Stack",hint:"Quel ADT est LIFO ?"},
    {id:"blank2",label:"principe",answer:"LIFO",hint:"Last In, First Out"},
    {id:"blank3",label:"delta",answer:"1",hint:"La taille augmente de combien ?"},
    {id:"blank4",label:"précondition",answer:"isEmpty()",hint:"On ne peut pas pop si..."},
    {id:"blank5",label:"sans/avec",answer:"sans",hint:"peek() ne modifie pas la pile"},
    {id:"blank6",label:"minimum",answer:"0",hint:"La taille ne peut pas être négative"},
    {id:"blank7",label:"symbole VDM",answer:"≜",hint:"Symbole VDM pour 'est défini comme'"},
    {id:"blank8",label:"fonction VDM",answer:"hd",hint:"hd = head = premier élément (sommet)"}
  ]}
  questions={[
    {id:"q1",question:"Qu'est-ce qu'un langage de spécification non exécutable ?",options:["Un langage lent","Un outil pour décrire formellement sans générer de code","Un bug","Un pseudo-code"],correctIndex:1,explanation:"Il décrit le comportement du système sans produire de code exécutable."},
    {id:"q2",question:"Différence VDM vs SDL :",options:["Identiques","VDM = logique formelle, SDL = diagrammes d'automates","VDM = graphique","SDL = mathématique"],correctIndex:1,explanation:"VDM = logique avec pré/post/invariants. SDL = états/transitions graphiques."},
    {id:"q3",question:"ASN.1 sert à :",options:["Tester","Décrire la structure des données échangées","Dessiner","Compiler"],correctIndex:1,explanation:"ASN.1 = notation standard pour structures de données inter-systèmes."}
  ]}
/>; }
