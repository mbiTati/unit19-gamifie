"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";
export default function Ex12() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }
 return <CodeExercise
  chapter={12} title="Analyse asymptotique" criteria="P6" worldColor="#16A34A" totalPoints={50}
  intro="Maîtrisez les notations O, Omega, Theta."
  codeTemplate={`// Les 3 notations
// O (Big O)  = borne ___blank1___  (au pire)
// Ω (Omega)  = borne ___blank2___  (au mieux)
// Θ (Theta)  = borne ___blank3___  (exacte)

// Classement (rapide → lent)
// O(1) < O(___blank4___) < O(n) < O(n log n) < O(___blank5___) < O(2ⁿ)

// Règles :
// O(3n + 5) = O(___blank6___)     // ignorer constantes
// O(n² + n) = O(___blank7___)     // garder terme dominant`}
  blanks={[
    {id:"blank1",label:"borne",answer:"supérieure",hint:"Le pire cas"},
    {id:"blank2",label:"borne",answer:"inférieure",hint:"Le meilleur cas"},
    {id:"blank3",label:"borne",answer:"serrée",hint:"Exactement cet ordre"},
    {id:"blank4",label:"entre 1 et n",answer:"log n",hint:"Recherche binaire"},
    {id:"blank5",label:"après n log n",answer:"n²",hint:"Deux boucles imbriquées"},
    {id:"blank6",label:"simplifié",answer:"n",hint:"On ignore le 3 et le 5"},
    {id:"blank7",label:"dominant",answer:"n²",hint:"n² domine n"}
  ]}
  questions={[
    {id:"q1",question:"O(n log n) pour n=1M ≈ ?",options:["1 million","20 millions","1 milliard"],correctIndex:1,explanation:"10⁶ × 20 = 20 millions."}
  ]}
/>; }
