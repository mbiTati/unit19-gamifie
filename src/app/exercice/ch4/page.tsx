"use client";
import { useAuth } from "@/components/AuthProvider";
import CodeExercise from "@/components/CodeExercise";
export default function Ex4() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }
 return <CodeExercise chapter={4} title="Shortest Path — Dijkstra" criteria="D1" worldColor="#7C3AED" totalPoints={50}
intro="Tracez l'algorithme de Dijkstra sur un graphe pondéré."
codeTemplate={`// Algorithme de Dijkstra\n// Graphe : A→B(4), A→C(2), C→B(1), B→D(5), C→D(7)\n\n// Init : distance[A] = ___blank1___, autres = ___blank2___\n\n// Étape 1 : Visiter A (dist 0)\n//   B = 0+4 = 4, C = 0+2 = 2\n\n// Étape 2 : Visiter ___blank3___ (dist ___blank4___)\n//   B = 2+1 = 3 (mieux que 4!), D = 2+7 = 9\n\n// Étape 3 : Visiter B (dist ___blank5___)\n//   D = 3+5 = ___blank6___ (mieux que 9!)\n\n// Chemin : A → C → B → D = ___blank6___`}
blanks={[
  {id:"blank1",label:"départ",answer:"0",hint:"Distance du départ à lui-même"},
  {id:"blank2",label:"infini",answer:"∞",hint:"Distance inconnue"},
  {id:"blank3",label:"sommet",answer:"C",hint:"Le plus proche non visité"},
  {id:"blank4",label:"dist",answer:"2",hint:"A→C = 2"},
  {id:"blank5",label:"dist B",answer:"3",hint:"Via C: 2+1"},
  {id:"blank6",label:"dist D",answer:"8",hint:"Via B: 3+5"},
]}
questions={[
  {id:"q1",question:"Dijkstra utilise quelle structure ?",options:["Stack","Queue FIFO","Priority Queue","ArrayList"],correctIndex:2,explanation:"Priority Queue — toujours le sommet le plus proche."},
  {id:"q2",question:"BFS fonctionne avec des graphes :",options:["Pondérés","Non pondérés","Les deux"],correctIndex:1,explanation:"BFS = poids tous à 1. Poids variables → Dijkstra."},
]} />; }
