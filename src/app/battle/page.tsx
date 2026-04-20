"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { C } from "@/lib/theme";

const CATEGORIES = [
  { id: "structures", name: "Structures de donnees", color: C.secondary, questions: [
    {q:"LinkedList.add(0, e) complexite ?",o:["O(1)","O(n)","O(log n)","O(n^2)"],c:0},
    {q:"HashMap.get(key) amorti ?",o:["O(n)","O(1)","O(log n)","O(n^2)"],c:1},
    {q:"Stack.push() complexite ?",o:["O(n)","O(1)","O(log n)","O(n^2)"],c:1},
    {q:"ArrayList vs LinkedList : acces index ?",o:["ArrayList O(1)","LinkedList O(1)","Les deux O(n)","Les deux O(1)"],c:0},
    {q:"BST recherche equilibre ?",o:["O(n)","O(1)","O(log n)","O(n^2)"],c:2},
    {q:"Queue.dequeue() complexite ?",o:["O(n)","O(1)","O(log n)","O(n^2)"],c:1},
    {q:"HashMap collision = ?",o:["Deux cles differentes, meme hash","Deux valeurs identiques","Erreur systeme","Tableau plein"],c:0},
    {q:"Set n'autorise pas les :",o:["null","doublons","types primitifs","strings"],c:1},
  ]},
  { id: "sorting", name: "Algorithmes de tri", color: C.danger, questions: [
    {q:"Bubble Sort pire cas ?",o:["O(n)","O(n log n)","O(n^2)","O(2^n)"],c:2},
    {q:"Quick Sort moyenne ?",o:["O(n^2)","O(n log n)","O(n)","O(log n)"],c:1},
    {q:"Merge Sort est ?",o:["In-place","Stable","Ni l'un ni l'autre","Recursif mais pas stable"],c:1},
    {q:"Insertion Sort meilleur cas ?",o:["O(n^2)","O(n)","O(n log n)","O(1)"],c:1},
    {q:"Quel tri est O(n log n) GARANTI ?",o:["Quick Sort","Bubble Sort","Merge Sort","Insertion Sort"],c:2},
    {q:"Tri stable signifie ?",o:["Rapide","Preserve l'ordre des egaux","In-place","Recursif"],c:1},
  ]},
  { id: "bigo", name: "Big O", color: C.gold, questions: [
    {q:"O(1) signifie ?",o:["Lineaire","Constant","Logarithmique","Quadratique"],c:1},
    {q:"for(i=0;i<n;i++) for(j=0;j<n;j++) = ?",o:["O(n)","O(2n)","O(n^2)","O(n log n)"],c:2},
    {q:"Binary search = ?",o:["O(n)","O(log n)","O(n^2)","O(1)"],c:1},
    {q:"O(n^2) pour n=1000 = ?",o:["1000","10000","1000000","100"],c:2},
    {q:"Terme dominant de 5n^3 + 2n + 1 ?",o:["5n^3","2n","1","n^3"],c:3},
    {q:"O(log n) : quelle operation ?",o:["Parcours tableau","Recherche dichotomique","Tri a bulles","Insertion en tete"],c:1},
  ]},
  { id: "patterns", name: "Design Patterns", color: "#7C3AED", questions: [
    {q:"Singleton garantit ?",o:["Plusieurs instances","Une seule instance","Zero instance","Deux instances"],c:1},
    {q:"Factory Method decide ?",o:["Le type d'objet a creer","Le nombre d'objets","La taille memoire","Le tri"],c:0},
    {q:"Observer = ?",o:["Creation d'objets","Notification automatique des abonnes","Tri d'algorithmes","Adaptation d'interfaces"],c:1},
    {q:"Strategy permet ?",o:["Une seule instance","Changer d'algorithme dynamiquement","Observer des changements","Simplifier une interface"],c:1},
    {q:"Decorator ajoute ?",o:["Des instances","Des responsabilites sans modifier la classe","Des types","Des erreurs"],c:1},
    {q:"Facade fournit ?",o:["Complexite","Interface simplifiee vers sous-systemes","Doublons","Heritage"],c:1},
  ]},
];

export default function BattlePage() {
  const { user: authUser, loading: authLoading, student } = useAuth();
  const [phase, setPhase] = useState<"menu"|"play"|"result">("menu");
  const [catId, setCatId] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [sel, setSel] = useState<number|null>(null);
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState(15);

  const startBattle = (id: string) => {
    const cat = CATEGORIES.find(c => c.id === id);
    if (!cat) return;
    setCatId(id);
    const shuffled = [...cat.questions].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestions(shuffled);
    setIdx(0); setScore(0); setSel(null); setShow(false); setTimer(15);
    setPhase("play");
  };

  useEffect(() => {
    if (phase !== "play" || show) return;
    if (timer <= 0) { setShow(true); setTimeout(() => next(), 1500); return; }
    const t = setTimeout(() => setTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, phase, show]);

  const answer = (i: number) => {
    if (show) return;
    setSel(i);
    setShow(true);
    if (i === questions[idx].c) setScore(s => s + 1);
    setTimeout(() => next(), 1500);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      setPhase("result");
      // Save score
      if (isSupabaseConfigured && student) {
        supabase.from("cq_game_scores").insert({
          student_id: student.id, student_email: student.email,
          game_name: "Battle " + catId, score, max_score: questions.length,
          played_at: new Date().toISOString(),
        }).then(() => {});
      }
      return;
    }
    setIdx(i => i + 1); setSel(null); setShow(false); setTimer(15);
  };

  const btnColors = [C.danger, C.secondary, C.gold, C.success];

  if (authLoading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  if (phase === "menu")
 return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <NavBar />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: C.gold, fontWeight: 600, letterSpacing: 2 }}>BATTLE</div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Algorithm Battle</h1>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>6 questions, 15 secondes par question, 4 categories</p>
        <div style={{ display: "grid", gap: 10 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => startBattle(cat.id)}
              style={{ padding: "16px", background: C.card, border: "2px solid " + cat.color + "30", borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: cat.color }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{cat.questions.length} questions</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (phase === "result") {
    const pct = Math.round(score / questions.length * 100);
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: pct >= 80 ? C.success : pct >= 50 ? C.gold : C.danger }}>{score}/{questions.length}</div>
        <div style={{ fontSize: 16, color: C.muted }}>{pct}%{pct === 100 ? " — Parfait !" : pct >= 80 ? " — Excellent" : pct >= 50 ? " — Pas mal" : " — A revoir"}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={() => startBattle(catId)} style={{ padding: "10px 24px", background: C.accent, color: C.bg, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Rejouer</button>
          <button onClick={() => setPhase("menu")} style={{ padding: "10px 24px", background: C.card, color: C.muted, border: "1px solid " + C.border, borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Menu</button>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const cat = CATEGORIES.find(c => c.id === catId);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 600, marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: cat?.color }}>{cat?.name}</span>
        <span style={{ fontSize: 13, color: C.muted }}>{idx + 1}/{questions.length}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: timer <= 5 ? C.danger : C.gold }}>{timer}s</span>
      </div>
      <div style={{ width: 600, height: 4, background: C.border, borderRadius: 2, marginBottom: 16 }}>
        <div style={{ width: `${(timer / 15) * 100}%`, height: "100%", background: timer <= 5 ? C.danger : C.gold, borderRadius: 2, transition: "width 1s linear" }} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 24, maxWidth: 600 }}>{q.q}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 600 }}>
        {q.o.map((o: string, i: number) => {
          let bg = btnColors[i] + "20";
          let border = btnColors[i] + "40";
          if (show && i === q.c) { bg = C.success + "30"; border = C.success; }
          else if (show && sel === i && i !== q.c) { bg = C.danger + "30"; border = C.danger; }
          return (
            <button key={i} onClick={() => answer(i)}
              style={{ padding: "16px", borderRadius: 10, border: "2px solid " + border, background: bg, color: C.text, fontSize: 15, fontWeight: 600, cursor: show ? "default" : "pointer" }}>
              {o}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: C.accent }}>{score} pts</div>
    </div>
  );
}
