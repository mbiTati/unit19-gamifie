"use client";
import { useState } from "react";

interface Question { question: string; options: string[]; correctIndex: number; explanation: string; category: "M5" | "D4"; }

const QUESTIONS: Question[] = [
  { category: "M5", question: "Qu'est-ce qu'un 'trade-off' lors du choix d'un ADT ?", options: ["Un bug dans le code", "Un compromis entre avantages et inconvénients", "Un type de variable", "Un algorithme de tri"], correctIndex: 1, explanation: "Trade-off = compromis. Choisir ArrayList (accès rapide O(1) mais insertion lente O(n)) vs LinkedList (insertion rapide O(1) mais accès lent O(n))." },
  { category: "M5", question: "ArrayList vs LinkedList : quel est le trade-off principal ?", options: ["ArrayList est gratuit, LinkedList est payant", "ArrayList : accès rapide O(1) / insertion lente O(n) — LinkedList : inverse", "ArrayList est en Java, LinkedList en Python", "Aucune différence"], correctIndex: 1, explanation: "C'est LE trade-off classique. Si vous accédez souvent par index → ArrayList. Si vous insérez/supprimez souvent → LinkedList." },
  { category: "M5", question: "HashMap vs TreeMap : quel trade-off ?", options: ["HashMap : O(1) mais pas d'ordre — TreeMap : O(log n) mais trié", "HashMap est plus ancien", "TreeMap utilise moins de mémoire", "Aucun trade-off"], correctIndex: 0, explanation: "HashMap est plus rapide (O(1)) mais ne garantit pas d'ordre. TreeMap est plus lent (O(log n)) mais les clés sont triées. Besoin de tri ? → TreeMap." },
  { category: "M5", question: "Espace vs Temps : que signifie ce trade-off ?", options: ["Il faut choisir entre un grand bureau et un petit", "On peut souvent accélérer un algorithme en utilisant plus de mémoire, et vice versa", "Le temps et l'espace sont identiques", "C'est un concept physique"], correctIndex: 1, explanation: "Exemple : cache (HashMap) = plus de mémoire mais accès O(1) vs recalculer à chaque fois = moins de mémoire mais plus lent." },
  { category: "M5", question: "Pour une application de messagerie temps réel, quel ADT pour les messages ?", options: ["Stack — le dernier message en premier", "Queue — les messages dans l'ordre d'envoi", "Set — pas de doublons", "Map — recherche par ID"], correctIndex: 1, explanation: "Queue FIFO : les messages sont affichés dans l'ordre d'envoi. Trade-off : si on veut aussi chercher par ID → combiner Queue + Map." },
  { category: "D4", question: "Qu'est-ce que l'indépendance d'implémentation ?", options: ["Ne pas dépendre d'Internet", "Le code client utilise l'ADT sans connaître son implémentation interne", "Coder sans IDE", "Ne pas utiliser de bibliothèques"], correctIndex: 1, explanation: "Si votre code utilise List<E>, il fonctionne avec ArrayList OU LinkedList. Vous pouvez changer l'implémentation SANS modifier le code client." },
  { category: "D4", question: "Quel est le 1er avantage de l'indépendance d'implémentation ?", options: ["Le code est plus court", "On peut optimiser en changeant l'implémentation sans réécrire le code client", "Le programme est plus joli", "C'est obligatoire en Java"], correctIndex: 1, explanation: "Si votre app est lente avec LinkedList, passez à ArrayList : changez UNE ligne (le new) et tout le reste fonctionne. C'est la puissance de l'abstraction." },
  { category: "D4", question: "Quel est le 2e avantage : testabilité ?", options: ["On ne peut pas tester", "On peut tester avec une implémentation simple (mock) puis déployer avec la vraie", "Les tests sont plus lents", "Il faut plus de tests"], correctIndex: 1, explanation: "En développement, on peut utiliser une implémentation simple (ex: ArrayList) pour les tests, puis passer à une version optimisée en production." },
  { category: "D4", question: "Quel est le 3e avantage : réutilisabilité ?", options: ["Le code est jetable", "Les algorithmes écrits pour l'ADT fonctionnent avec TOUTE implémentation", "On ne réutilise jamais du code", "C'est un mythe"], correctIndex: 1, explanation: "Un algorithme de tri écrit pour List<E> fonctionne avec ArrayList, LinkedList, ou toute future implémentation de List. Code une fois, utilise partout !" },
  { category: "D4", question: "En Java, quel mot-clé incarne l'indépendance d'implémentation ?", options: ["class", "interface", "abstract", "final"], correctIndex: 1, explanation: "L'interface Java (List, Map, Queue) EST l'ADT. Le code client programme contre l'interface, pas contre la classe concrète. C'est le principe 'program to an interface'." },
];

export default function Ch14Game() {
  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!started) return (
    <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
      <div style={{ fontSize: 14, color: "#854F0B", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 4 — Chapitre 14/15</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1E3A5F", margin: "0.5rem 0" }}>Trade-offs + Indépendance d'implémentation</h1>
      <p style={{ color: "#64748B", fontSize: 16, marginBottom: 24 }}>Critères M5 + D4 — 10 questions</p>
      <button onClick={() => setStarted(true)} style={{ padding: "12px 32px", background: "#854F0B", color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Commencer</button>
    </div>
  );

  if (qIdx >= QUESTIONS.length) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: pct >= 70 ? "#16A34A" : "#F97316" }}>{score}/{QUESTIONS.length}</div>
        <button onClick={() => { setQIdx(0); setScore(0); setStarted(false); }} style={{ marginTop: 16, padding: "10px 24px", background: "#854F0B", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Rejouer</button>
      </div>
    );
  }

  const q = QUESTIONS[qIdx];
  return (
    <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748B", marginBottom: 8 }}>
        <span>{qIdx + 1}/{QUESTIONS.length} | Score: {score}</span>
        <span style={{ background: q.category === "M5" ? "#FAEEDA" : "#EDE9FE", color: q.category === "M5" ? "#854F0B" : "#7C3AED", padding: "2px 8px", borderRadius: 4, fontWeight: 600, fontSize: 11 }}>{q.category}</span>
      </div>
      <div style={{ height: 4, background: "#1E3A5F", borderRadius: 2, marginBottom: 16 }}><div style={{ height: 4, background: "#854F0B", borderRadius: 2, width: `${((qIdx + 1) / QUESTIONS.length) * 100}%` }} /></div>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#1E3A5F", marginBottom: 12 }}>{q.question}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {q.options.map((opt, idx) => {
          let bg = "white", border = "#1E3A5F";
          if (showFeedback) { if (idx === q.correctIndex) { bg = "#F0FDF4"; border = "#16A34A"; } else if (idx === selected) { bg = "#FEF2F2"; border = "#DC2626"; } }
          return <button key={idx} onClick={() => { if (showFeedback) return; setSelected(idx); setShowFeedback(true); if (idx === q.correctIndex) setScore(s => s + 1); }} disabled={showFeedback} style={{ padding: "10px 14px", border: `2px solid ${border}`, borderRadius: 8, background: bg, cursor: showFeedback ? "default" : "pointer", textAlign: "left" as const, fontSize: 14 }}>{opt}</button>;
        })}
      </div>
      {showFeedback && (
        <>
          <div style={{ marginTop: 10, padding: "8px 12px", background: "#16A34A20", borderRadius: 8, fontSize: 13, color: "#166534", border: "1px solid #86EFAC" }}>{q.explanation}</div>
          <button onClick={() => { setQIdx(i => i + 1); setSelected(null); setShowFeedback(false); }} style={{ marginTop: 10, width: "100%", padding: "10px", background: "#854F0B", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Suivant →</button>
        </>
      )}
    </div>
  );
}
