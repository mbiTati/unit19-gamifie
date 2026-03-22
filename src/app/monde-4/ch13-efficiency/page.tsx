"use client";
import { useState } from "react";

interface Question { question: string; code?: string; options: string[]; correctIndex: number; explanation: string; }

const QUESTIONS: Question[] = [
  { question: "Quelles sont les deux dimensions pour mesurer l'efficacité d'un algorithme ?", options: ["Vitesse et beauté du code", "Temps d'exécution et espace mémoire", "Nombre de lignes et nombre de fichiers", "CPU et GPU"], correctIndex: 1, explanation: "Les deux mesures fondamentales : complexité temporelle (combien de temps) et complexité spatiale (combien de mémoire)." },
  { question: "Comment mesurer le temps d'exécution en Java ?", options: ["System.currentTimeMillis()", "System.nanoTime()", "Les deux fonctionnent, nanoTime est plus précis", "On ne peut pas mesurer"], correctIndex: 2, explanation: "Les deux marchent. nanoTime() est plus précis (nanosecondes vs millisecondes). Pour un benchmark fiable, exécuter plusieurs fois et faire la moyenne." },
  { code: "long start = System.nanoTime();\n// ... algorithme ...\nlong end = System.nanoTime();\nlong duree = (end - start) / 1_000_000; // ms", question: "Que mesure ce code ?", options: ["La complexité Big O", "Le temps réel d'exécution en millisecondes", "Le nombre d'opérations", "La mémoire utilisée"], correctIndex: 1, explanation: "C'est un benchmark : on mesure le temps RÉEL d'exécution. C'est complémentaire à l'analyse Big O (théorique)." },
  { question: "Pourquoi un algorithme O(n) peut parfois être plus lent qu'un O(n²) ?", options: ["C'est impossible", "Pour de petits n, les constantes cachées peuvent dominer", "Big O est toujours faux", "Ça dépend du langage"], correctIndex: 1, explanation: "Big O ignore les constantes. Un O(n) avec constante 1000 est plus lent qu'un O(n²) pour n < 1000. C'est pourquoi on mesure aussi en pratique !" },
  { question: "Quelle est la complexité spatiale d'un tableau de n éléments ?", options: ["O(1)", "O(n)", "O(n²)", "O(log n)"], correctIndex: 1, explanation: "Un tableau de n éléments utilise n cases mémoire → O(n) en espace. Un seul entier = O(1)." },
  { question: "Merge Sort a une meilleure complexité temporelle que Bubble Sort, mais quel est son inconvénient ?", options: ["Il est instable", "Il utilise O(n) mémoire supplémentaire", "Il ne fonctionne qu'avec des entiers", "Il est plus difficile à coder"], correctIndex: 1, explanation: "Merge Sort est O(n log n) en temps mais O(n) en espace (tableaux temporaires). Bubble Sort est O(n²) en temps mais O(1) en espace. C'est un trade-off !" },
  { question: "Comment mesurer la mémoire utilisée en Java ?", options: ["System.nanoTime()", "Runtime.getRuntime().totalMemory() - freeMemory()", "Memory.used()", "On ne peut pas"], correctIndex: 1, explanation: "Runtime.getRuntime() donne accès aux infos mémoire de la JVM. totalMemory() - freeMemory() = mémoire utilisée." },
  { question: "Quel est le meilleur moyen de comparer deux algorithmes en pratique ?", options: ["Compter les lignes de code", "Exécuter les deux sur les mêmes données et mesurer le temps", "Demander à un expert", "Regarder la complexité Big O uniquement"], correctIndex: 1, explanation: "Le benchmark empirique (même données, même machine, plusieurs exécutions) complète l'analyse théorique Big O. Les deux ensemble donnent la meilleure image." },
];

export default function Ch13Game() {
  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!started) return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
      <div style={{ fontSize: 14, color: "#854F0B", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 4 — Chapitre 13</div>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1B2A4A", margin: "0.5rem 0" }}>Mesurer l'efficacité</h1>
      <p style={{ color: "#64748B", fontSize: 16, marginBottom: 24 }}>Critère P7 — Temps, espace, benchmarks</p>
      <button onClick={() => setStarted(true)} style={{ padding: "12px 32px", background: "#854F0B", color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Commencer</button>
    </div>
  );

  if (qIdx >= QUESTIONS.length) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: pct >= 70 ? "#16A34A" : "#F97316" }}>{score}/{QUESTIONS.length}</div>
        <button onClick={() => { setQIdx(0); setScore(0); setStarted(false); }} style={{ marginTop: 16, padding: "10px 24px", background: "#854F0B", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Rejouer</button>
      </div>
    );
  }

  const q = QUESTIONS[qIdx];
  return (
    <div style={{ maxWidth: 650, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{qIdx + 1}/{QUESTIONS.length} | Score: {score}</div>
      <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, marginBottom: 16 }}><div style={{ height: 4, background: "#854F0B", borderRadius: 2, width: `${((qIdx + 1) / QUESTIONS.length) * 100}%` }} /></div>
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
