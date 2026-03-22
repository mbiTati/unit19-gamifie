"use client";
import { useState } from "react";

interface Question { question: string; code?: string; options: string[]; correctIndex: number; explanation: string; }

const QUESTIONS: Question[] = [
  { question: "Que signifie O(n) ?", options: ["Le programme prend exactement n secondes", "Le temps d'exécution croît proportionnellement à n", "Le programme fait n opérations exactement", "Le programme est rapide"], correctIndex: 1, explanation: "O(n) = notation asymptotique. Elle décrit la TENDANCE de croissance, pas le temps exact. Si n double, le temps double approximativement." },
  { question: "Classez du plus rapide au plus lent : O(1), O(n²), O(log n), O(n)", options: ["O(1) < O(log n) < O(n) < O(n²)", "O(n²) < O(n) < O(log n) < O(1)", "O(1) < O(n) < O(log n) < O(n²)", "O(log n) < O(1) < O(n) < O(n²)"], correctIndex: 0, explanation: "O(1) constant < O(log n) logarithmique < O(n) linéaire < O(n²) quadratique. Plus c'est bas, plus c'est rapide !" },
  { question: "Si un algorithme O(n²) prend 1 seconde pour n=1000, combien pour n=2000 ?", options: ["2 secondes", "4 secondes", "8 secondes", "1000 secondes"], correctIndex: 1, explanation: "O(n²) : si n double (×2), le temps quadruple (×4). 2000² / 1000² = 4. Donc ~4 secondes." },
  { code: "for (int i = 1; i < n; i *= 2) {\n  System.out.println(i);\n}", question: "Quelle est la complexité ?", options: ["O(n)", "O(n²)", "O(log n)", "O(2^n)"], correctIndex: 2, explanation: "i est multiplié par 2 à chaque itération. Il faut log₂(n) itérations pour atteindre n → O(log n)." },
  { question: "Que signifie 'asymptotique' dans Big O ?", options: ["Exact pour toutes les tailles", "Le comportement quand n devient TRÈS GRAND", "Le meilleur cas uniquement", "La moyenne de tous les cas"], correctIndex: 1, explanation: "Asymptotique = on s'intéresse au comportement quand n → ∞. Les constantes et termes mineurs disparaissent." },
  { question: "Pourquoi O(2n) = O(n) ?", options: ["C'est une erreur mathématique", "Les constantes sont ignorées en notation Big O", "2n est toujours égal à n", "C'est une simplification pour les débutants"], correctIndex: 1, explanation: "En Big O, on ignore les constantes multiplicatives car elles n'affectent pas la tendance de croissance. 2n croît au même rythme que n." },
  { question: "Quelle est la différence entre O (Big O) et Ω (Big Omega) ?", options: ["O = pire cas, Ω = meilleur cas", "O = borne supérieure, Ω = borne inférieure", "Aucune différence", "O = temps, Ω = espace"], correctIndex: 1, explanation: "O donne la borne supérieure (au pire). Ω donne la borne inférieure (au mieux). Θ (Theta) donne les deux à la fois (borne serrée)." },
  { question: "Un algorithme O(n log n) avec n=1 million fait environ combien d'opérations ?", options: ["1 million", "20 millions", "1 billion", "6 milliards"], correctIndex: 1, explanation: "n log₂(n) = 1,000,000 × log₂(1,000,000) ≈ 1,000,000 × 20 = 20 millions. Très raisonnable !" },
  { code: "// Algorithme A : O(n²) — 1 seconde pour n=1000\n// Algorithme B : O(n log n) — 1 seconde pour n=1000\n// Pour n = 1,000,000 ?", question: "Lequel est le plus rapide pour n = 1 million ?", options: ["A : ~1000 sec, B : ~20 sec", "A : ~1,000,000 sec, B : ~20 sec", "Égalité", "Impossible à dire"], correctIndex: 1, explanation: "A : O(n²) → (10⁶)²/10³² = 10⁶ secondes (~11 jours !). B : O(n log n) → 10⁶×20/10³×10 = 20 sec. La complexité COMPTE pour les grands n !" },
  { question: "Quelle complexité est considérée 'efficace' pour un algorithme de tri ?", options: ["O(n²)", "O(n log n)", "O(n³)", "O(2^n)"], correctIndex: 1, explanation: "O(n log n) est la borne inférieure théorique pour le tri par comparaison. Merge Sort, Quick Sort (moyen), et Heap Sort atteignent cette borne." },
];

export default function Ch12Game() {
  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!started) return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
      <div style={{ fontSize: 14, color: "#854F0B", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 4 — Chapitre 12</div>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1B2A4A", margin: "0.5rem 0" }}>Analyse asymptotique</h1>
      <p style={{ color: "#64748B", fontSize: 16, marginBottom: 24 }}>Critère P6 — 10 questions sur Big O, Omega, Theta</p>
      <button onClick={() => setStarted(true)} style={{ padding: "12px 32px", background: "#854F0B", color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Commencer</button>
    </div>
  );

  if (qIdx >= QUESTIONS.length) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: pct >= 70 ? "#16A34A" : "#F97316" }}>{score}/{QUESTIONS.length}</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#1B2A4A" }}>{pct}%</div>
        <button onClick={() => { setQIdx(0); setScore(0); setStarted(false); }} style={{ marginTop: 16, padding: "10px 24px", background: "#854F0B", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Rejouer</button>
      </div>
    );
  }

  const q = QUESTIONS[qIdx];
  return (
    <div style={{ maxWidth: 650, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{qIdx + 1}/{QUESTIONS.length} | Score: {score}</div>
      <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, marginBottom: 16 }}>
        <div style={{ height: 4, background: "#854F0B", borderRadius: 2, width: `${((qIdx + 1) / QUESTIONS.length) * 100}%` }} />
      </div>
      {q.code && <div style={{ background: "#1E293B", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}><pre style={{ fontSize: 13, color: "#E2E8F0", fontFamily: "Consolas, monospace", margin: 0, whiteSpace: "pre-wrap" as const }}>{q.code}</pre></div>}
      <p style={{ fontSize: 16, fontWeight: 600, color: "#1B2A4A", marginBottom: 12 }}>{q.question}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {q.options.map((opt, idx) => {
          let bg = "white", border = "#E2E8F0";
          if (showFeedback) { if (idx === q.correctIndex) { bg = "#F0FDF4"; border = "#16A34A"; } else if (idx === selected) { bg = "#FEF2F2"; border = "#DC2626"; } }
          return <button key={idx} onClick={() => { if (showFeedback) return; setSelected(idx); setShowFeedback(true); if (idx === q.correctIndex) setScore(s => s + 1); }} disabled={showFeedback} style={{ padding: "10px 14px", border: `2px solid ${border}`, borderRadius: 8, background: bg, cursor: showFeedback ? "default" : "pointer", textAlign: "left" as const, fontSize: 14 }}>{opt}</button>;
        })}
      </div>
      {showFeedback && (
        <>
          <div style={{ marginTop: 10, padding: "8px 12px", background: "#F0FDF4", borderRadius: 8, fontSize: 13, color: "#166534", border: "1px solid #86EFAC" }}>{q.explanation}</div>
          <button onClick={() => { setQIdx(i => i + 1); setSelected(null); setShowFeedback(false); }} style={{ marginTop: 10, width: "100%", padding: "10px", background: "#854F0B", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Suivant →</button>
        </>
      )}
    </div>
  );
}
