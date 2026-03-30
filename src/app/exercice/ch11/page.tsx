"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";
export default function Ex11() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }
 return <CodeExercise
  chapter={11} title="Big O — Identifier la complexité" criteria="M4/D3" worldColor="#F97316" totalPoints={50}
  intro="Analysez la complexité Big O de ces extraits de code."
  codeTemplate={`// Extrait 1 : accès direct
int x = arr[___blank1___];  // Complexité : O(___blank1b___)

// Extrait 2 : boucle simple
for (int i = 0; i < n; i++)
    sum += arr[i];  // Complexité : O(___blank2___)

// Extrait 3 : deux boucles imbriquées
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        mat[i][j] = 0;  // Complexité : O(___blank3___)

// Extrait 4 : diviser par 2
while (n > 1) { n = n / 2; count++; }  // O(___blank4___)

// Extrait 5 : HashMap lookup
String val = map.get("key");  // O(___blank5___)`}
  blanks={[
    {id:"blank1",label:"index",answer:"5",hint:"N'importe quel index"},
    {id:"blank1b",label:"complexité",answer:"1",hint:"Accès direct par index"},
    {id:"blank2",label:"boucle",answer:"n",hint:"Une boucle de 0 à n"},
    {id:"blank3",label:"imbriqué",answer:"n²",hint:"n × n"},
    {id:"blank4",label:"division",answer:"log n",hint:"Diviser par 2 à chaque itération"},
    {id:"blank5",label:"hash",answer:"1",hint:"HashMap = accès O(1) moyen"}
  ]}
  questions={[
    {id:"q1",question:"O(2n) = ?",options:["O(2n)","O(n)","O(n²)"],correctIndex:1,explanation:"Les constantes sont ignorées en Big O."},
    {id:"q2",question:"Si O(n²) prend 1s pour n=1000, pour n=2000 ?",options:["2s","4s","8s"],correctIndex:1,explanation:"n×2 → temps ×4 (quadratique)."}
  ]}
/>; }
