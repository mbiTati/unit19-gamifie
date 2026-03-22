"use client";
import CodeExercise from "@/components/CodeExercise";
export default function Ex10() { return <CodeExercise
  chapter={10} title="Exceptions + JUnit 5" criteria="P5" worldColor="#F97316" totalPoints={60}
  intro="Ajoutez la gestion d'erreurs et écrivez des tests JUnit 5."
  codeTemplate={`// Gestion des exceptions
public void setAge(int age) {
    if (age < 0) {
        ___blank1___ new ___blank2___("Âge négatif !");
    }
    this.age = age;
}

public void lireFichier(String nom) ___blank3___ FileNotFoundException {
    FileReader fr = new FileReader(nom);
}

// try-catch-finally
try {
    int resultat = 10 / 0;
} ___blank4___ (ArithmeticException e) {
    System.out.println("Erreur: " + e.getMessage());
} ___blank5___ {
    System.out.println("Toujours exécuté !");
}

// Test JUnit 5
___blank6___
void testAgeNegatif() {
    assertThrows(IllegalArgumentException.class, () -> {
        personne.setAge(-5);
    });
}`}
  blanks={[
    {id:"blank1",label:"lancer",answer:"throw",hint:"Mot-clé pour LANCER une exception"},
    {id:"blank2",label:"exception",answer:"IllegalArgumentException",hint:"Exception pour argument invalide"},
    {id:"blank3",label:"déclarer",answer:"throws",hint:"Mot-clé pour DÉCLARER dans la signature"},
    {id:"blank4",label:"attraper",answer:"catch",hint:"Bloc pour attraper l'exception"},
    {id:"blank5",label:"toujours",answer:"finally",hint:"Bloc exécuté TOUJOURS"},
    {id:"blank6",label:"annotation",answer:"@Test",hint:"Annotation JUnit 5 pour un test"}
  ]}
  questions={[
    {id:"q1",question:"throw vs throws :",options:["Identiques","throw LANCE, throws DÉCLARE","throw déclare, throws lance"],correctIndex:1,explanation:"throw new Exception() LANCE. throws Exception DÉCLARE dans la signature."},
    {id:"q2",question:"@BeforeEach s'exécute :",options:["Une seule fois","Avant CHAQUE test","Après chaque test"],correctIndex:1,explanation:"@BeforeEach = setup avant chaque @Test."}
  ]}
/>; }
