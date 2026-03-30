"use client";
import { useAuth } from "@/components/AuthProvider";
import CommentWidget from "@/components/CommentWidget";
import Link from "next/link";
import { useState, useCallback } from "react";
import TopBar from "@/components/TopBar";

interface Question { id: string; question: string; code?: string; options: string[]; correctIndex: number; explanation: string; chapter: string; }

const QUESTIONS: Question[] = [
  { id: "b1", chapter: "Ch.1", question: "Quelle est la différence fondamentale entre un ADT et une structure de données concrète ?", options: ["L'ADT est en Java, la structure en Python", "L'ADT définit QUOI, la structure définit COMMENT", "Aucune différence", "L'ADT est plus rapide"], correctIndex: 1, explanation: "L'ADT est la spécification abstraite (opérations), la structure concrète est l'implémentation (ArrayList, LinkedList...)." },
  { id: "b2", chapter: "Ch.1", question: "Qu'est-ce qu'un invariant ?", options: ["Le constructeur", "Une variable qui ne change pas", "Une règle TOUJOURS vraie sur la structure", "Un type de boucle"], correctIndex: 2, explanation: "Un invariant est une propriété qui reste vraie à tout moment. Ex: size >= 0, pas de doublons dans un Set." },
  { id: "b3", chapter: "Ch.1", question: "Quelle opération n'appartient PAS à l'ADT Stack ?", options: ["push()", "pop()", "get(index)", "peek()"], correctIndex: 2, explanation: "get(index) est une opération de List. Un Stack ne permet l'accès QU'AU sommet (LIFO)." },
  { id: "b4", chapter: "Ch.2", question: "Que contient un stack frame ?", options: ["Uniquement les variables locales", "Adresse retour + paramètres + variables locales + valeur retour", "Le code source de la fonction", "Les objets créés avec new"], correctIndex: 1, explanation: "Chaque frame contient tout ce dont la fonction a besoin : adresse de retour, paramètres, variables locales, et espace pour le résultat." },
  { id: "b5", chapter: "Ch.2", question: "Pourquoi le call stack utilise-t-il LIFO ?", options: ["Par convention Java", "La dernière fonction appelée doit terminer en premier", "Pour économiser de la mémoire", "C'est aléatoire en fait"], correctIndex: 1, explanation: "LIFO est naturel pour les appels : si A appelle B qui appelle C, C doit finir avant B, qui finit avant A." },
  { id: "b6", chapter: "Ch.2", question: "Que cause une récursion sans cas de base ?", options: ["Le programme tourne en boucle infinie", "StackOverflowError — le stack déborde", "Le Garbage Collector nettoie", "Rien de grave"], correctIndex: 1, explanation: "Chaque appel récursif empile un frame. Sans cas de base, les frames s'accumulent jusqu'au débordement." },
  { id: "b7", chapter: "Ch.2", code: "static int f(int n) {\n  if (n <= 0) return 0;\n  return n + f(n-1);\n}", question: "Pour f(3), combien de frames sont empilés au maximum ?", options: ["2", "3", "4", "5"], correctIndex: 2, explanation: "f(3) appelle f(2) appelle f(1) appelle f(0). Au moment de f(0), il y a 4 frames : main + f(3) + f(2) + f(1) + f(0) = 5, mais sans main c'est 4." },
  { id: "b8", chapter: "Ch.3", question: "FIFO signifie :", options: ["First In, First Out", "Fast Input, Fast Output", "File In, File Out", "First Index, Final Output"], correctIndex: 0, explanation: "FIFO = First In, First Out. Le premier élément entré est le premier sorti, comme une file d'attente." },
  { id: "b9", chapter: "Ch.3", question: "Quelle implémentation Java de Queue utilise un tableau circulaire ?", options: ["LinkedList", "PriorityQueue", "ArrayDeque", "ArrayList"], correctIndex: 2, explanation: "ArrayDeque utilise un tableau circulaire avec pointeurs head/tail. O(1) pour enqueue et dequeue." },
  { id: "b10", chapter: "Ch.3", question: "Quelle est la complexité moyenne du Quick Sort ?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctIndex: 1, explanation: "Quick Sort a une complexité moyenne de O(n log n), ce qui le rend beaucoup plus rapide que Bubble Sort O(n²)." },
  { id: "b11", chapter: "Ch.3", question: "Bubble Sort est stable. Que signifie 'stable' pour un tri ?", options: ["Il ne plante jamais", "Les éléments égaux gardent leur ordre relatif", "Il trie toujours correctement", "Il utilise peu de mémoire"], correctIndex: 1, explanation: "Un tri stable préserve l'ordre relatif des éléments de même valeur. Important quand on trie par plusieurs critères." },
  { id: "b12", chapter: "Ch.4", question: "L'algorithme de Dijkstra sert à :", options: ["Trier un tableau", "Trouver le plus court chemin dans un graphe pondéré", "Chercher un élément dans une liste", "Compresser des données"], correctIndex: 1, explanation: "Dijkstra trouve le chemin le plus court entre un noeud source et tous les autres noeuds d'un graphe pondéré (poids positifs)." },
  { id: "b13", chapter: "Ch.4", question: "Dijkstra ne fonctionne PAS avec :", options: ["Des graphes non orientés", "Des poids négatifs", "Plus de 10 noeuds", "Des chaînes de caractères"], correctIndex: 1, explanation: "Dijkstra suppose que les poids sont positifs. Avec des poids négatifs, il faut utiliser Bellman-Ford." },
  { id: "b14", chapter: "Ch.1", question: "En Java, List est :", options: ["Une classe", "Une interface (ADT)", "Un mot-clé", "Un package"], correctIndex: 1, explanation: "List est une interface Java = l'ADT. ArrayList et LinkedList sont des classes = les implémentations concrètes." },
  { id: "b15", chapter: "Ch.3", question: "Pour 10 000 éléments, Quick Sort fait environ combien de comparaisons ?", options: ["10 000", "130 000", "100 000 000", "10 000 000 000"], correctIndex: 1, explanation: "O(n log n) = 10000 × log2(10000) ≈ 10000 × 13 ≈ 130 000. Bubble Sort ferait ~100 millions !" },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function BossLO1() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  const [started, setStarted] = useState(false);
  const [questions] = useState(() => shuffleArray(QUESTIONS).slice(0, 12));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const startQuiz = useCallback(() => {
    setStarted(true);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowFeedback(false);
    setFinished(false);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(180);
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); setFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
    setTimerId(id);
  }, []);

  const handleAnswer = (idx: number) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    const correct = idx === questions[current].correctIndex;
    if (correct) {
      const bonus = streak >= 2 ? 15 : 10;
      setScore(s => s + bonus);
      setStreak(s => { const n = s + 1; setMaxStreak(m => Math.max(m, n)); return n; });
    } else { setStreak(0); }
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      if (timerId) clearInterval(timerId);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  if (!started) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}></div>
        <div style={{ fontSize: 14, color: "#DC2626", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Boss Fight</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#E2E8F0", margin: "0.5rem 0" }}>Monde 1 — LO1</h1>
        <p style={{ color: "#64748B", fontSize: 16, marginBottom: 24 }}>12 questions couvrant les chapitres 1-4. Temps limité : 3 minutes. Bonus streak !</p>
        <button onClick={startQuiz} style={{ padding: "12px 32px", background: "#DC2626", color: "white", border: "none", borderRadius: 10, fontSize: 18, fontWeight: 700, cursor: "pointer" }}>Commencer le boss</button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / (questions.length * 10)) * 100);
    const grade = pct >= 90 ? "S" : pct >= 75 ? "A" : pct >= 60 ? "B" : pct >= 40 ? "C" : "D";
    const gradeColor = pct >= 75 ? "#16A34A" : pct >= 50 ? "#F97316" : "#DC2626";
    return (
      <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
        <div style={{ fontSize: 80, fontWeight: 800, color: gradeColor }}>{grade}</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: "#E2E8F0", margin: "0.5rem 0" }}>{score} points</div>
        <div style={{ fontSize: 14, color: "#64748B" }}>Meilleure série : {maxStreak} | Temps restant : {timeLeft}s</div>
        <div style={{ marginTop: 24 }}>
          <button onClick={startQuiz} style={{ padding: "10px 24px", background: "#DC2626", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 15 }}>Rejouer</button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;

  return (
    <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#64748B" }}>{current + 1}/{questions.length} | {q.chapter}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: timeLeft < 30 ? "#DC2626" : "#64748B" }}>{min}:{sec.toString().padStart(2, "0")}</span>
        <span style={{ fontSize: 13, color: "#DC2626", fontWeight: 600 }}>{score} pts {streak >= 2 ? `x${streak}` : ""}</span>
      </div>
      <div style={{ height: 4, background: "#1E3A5F30", borderRadius: 2, marginBottom: 16 }}>
        <div style={{ height: 4, background: "#DC2626", borderRadius: 2, width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>
      {q.code && (
        <div style={{ background: "#1E293B", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: 12 }}>
          <pre style={{ fontSize: 13, color: "#A5F3FC", fontFamily: "Consolas, monospace", margin: 0, whiteSpace: "pre-wrap" as const }}>{q.code}</pre>
        </div>
      )}
      <p style={{ fontSize: 16, fontWeight: 600, color: "#E2E8F0", marginBottom: 12, lineHeight: 1.4 }}>{q.question}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.correctIndex;
          const isSelected = selected === idx;
          let bg = "#111827", border = "#1E3A5F";
          if (showFeedback) {
            if (isCorrect) { bg = "#10B98120"; border = "#16A34A"; }
            else if (isSelected) { bg = "#EF444420"; border = "#DC2626"; }
          }
          return (
            <button key={idx} onClick={() => handleAnswer(idx)} disabled={showFeedback}
              style={{ padding: "10px 14px", border: `2px solid ${border}`, borderRadius: 8, background: bg, cursor: showFeedback ? "default" : "pointer", textAlign: "left" as const, fontSize: 14, color: "#94A3B8" }}>
              <span style={{ fontWeight: 600, marginRight: 8, color: "#7C3AED" }}>{String.fromCharCode(65 + idx)}.</span>{opt}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <>
          <div style={{ marginTop: 10, padding: "8px 12px", background: "#16A34A15", borderRadius: 8, fontSize: 13, color: "#16A34A", border: "1px solid #16A34A40" }}>{q.explanation}</div>
          <button onClick={next} style={{ marginTop: 10, width: "100%", padding: "10px", background: "#DC2626", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
            {current + 1 < questions.length ? "Suivant →" : "Résultats"}
          </button>
        </>
      )}
    </div>
  );
}
