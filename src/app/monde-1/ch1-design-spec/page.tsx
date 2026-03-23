"use client";
import Link from "next/link";
import { useState, useCallback } from "react";

type ADTName = "List" | "Stack" | "Queue" | "Map" | "Set";

interface Operation {
  id: string;
  name: string;
  correctADT: ADTName;
  description: string;
}

const OPERATIONS: Operation[] = [
  { id: "o1", name: "push(e)", correctADT: "Stack", description: "Empiler un élément au sommet" },
  { id: "o2", name: "pop()", correctADT: "Stack", description: "Dépiler l'élément du sommet" },
  { id: "o3", name: "enqueue(e)", correctADT: "Queue", description: "Ajouter en fin de file" },
  { id: "o4", name: "dequeue()", correctADT: "Queue", description: "Retirer du début de file" },
  { id: "o5", name: "get(index)", correctADT: "List", description: "Accéder par position" },
  { id: "o6", name: "put(key, val)", correctADT: "Map", description: "Associer une valeur à une clé" },
  { id: "o7", name: "add(e)", correctADT: "Set", description: "Ajouter sans doublons" },
  { id: "o8", name: "peek()", correctADT: "Stack", description: "Consulter le sommet sans retirer" },
  { id: "o9", name: "containsKey(k)", correctADT: "Map", description: "Vérifier si une clé existe" },
  { id: "o10", name: "remove(index)", correctADT: "List", description: "Supprimer par position" },
  { id: "o11", name: "front()", correctADT: "Queue", description: "Consulter le premier élément" },
  { id: "o12", name: "contains(e)", correctADT: "Set", description: "Vérifier l'appartenance" },
];

const ADTS: { name: ADTName; color: string; bgColor: string; icon: string; subtitle: string }[] = [
  { name: "List", color: "#065A82", bgColor: "#E6F1FB", icon: "L", subtitle: "Ordonnée, accès par index" },
  { name: "Stack", color: "#028090", bgColor: "#E1F5EE", icon: "S", subtitle: "LIFO — dernier entré, premier sorti" },
  { name: "Queue", color: "#00A896", bgColor: "#E1F5EE", icon: "Q", subtitle: "FIFO — premier entré, premier sorti" },
  { name: "Map", color: "#F97316", bgColor: "#FFF7ED", icon: "M", subtitle: "Paires clé → valeur" },
  { name: "Set", color: "#7C3AED", bgColor: "#EDE9FE", icon: "{}",subtitle: "Pas de doublons" },
];

interface QuizQuestion {
  operation: Operation;
  choices: ADTName[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuiz(): QuizQuestion[] {
  const shuffled = shuffleArray(OPERATIONS);
  return shuffled.map((op) => {
    const wrong = ADTS.filter((a) => a.name !== op.correctADT)
      .map((a) => a.name);
    const wrongChoices = shuffleArray(wrong).slice(0, 3);
    const choices = shuffleArray([op.correctADT, ...wrongChoices]);
    return { operation: op, choices };
  });
}

// Precondition/Postcondition quiz
interface SpecQuestion {
  id: string;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SPEC_QUESTIONS: SpecQuestion[] = [
  {
    id: "s1",
    question: "Qu'est-ce qu'une PRÉCONDITION ?",
    options: [
      "Ce qui est vrai AVANT d'appeler l'opération",
      "Ce qui est vrai APRÈS l'appel",
      "Le type de retour de la méthode",
      "Le nom de la classe Java",
    ],
    correctIndex: 0,
    explanation: "La précondition est la condition qui doit être vraie AVANT l'appel. Ex: pour pop(), la pile ne doit pas être vide.",
  },
  {
    id: "s2",
    question: "Pour l'opération pop() d'un Stack, quelle est la précondition ?",
    options: [
      "Le stack contient au moins 1 élément",
      "Le stack est vide",
      "L'élément est un entier",
      "Le stack a été trié",
    ],
    correctIndex: 0,
    explanation: "pop() ne peut être appelé que si isEmpty() == false, sinon c'est une erreur.",
  },
  {
    id: "s3",
    question: "Qu'est-ce qu'un INVARIANT ?",
    options: [
      "Une condition temporaire",
      "Le constructeur de la classe",
      "Une règle qui est TOUJOURS vraie",
      "Un type de boucle en Java",
    ],
    correctIndex: 2,
    explanation: "Un invariant est une propriété qui reste vraie à tout moment. Ex: size() >= 0 pour un Stack.",
  },
  {
    id: "s4",
    question: "Quelle est la différence entre un ADT et une structure de données concrète ?",
    options: [
      "Aucune différence",
      "L'ADT définit QUOI, la structure définit COMMENT",
      "L'ADT est en Java, la structure en Python",
      "La structure est abstraite, l'ADT est concret",
    ],
    correctIndex: 1,
    explanation: "L'ADT est la spécification (opérations possibles), la structure concrète est l'implémentation (ArrayList, LinkedList...).",
  },
  {
    id: "s5",
    code: `public boolean ajouter(Contact c) {\n  if (c == null) return false;\n  if (rechercher(c.getEmail()) != null)\n    return false;\n  contacts.add(c);\n  return true;\n}`,
    question: "Dans ce code, quelle ligne vérifie l'INVARIANT 'pas de doublons' ?",
    options: [
      "if (c == null) return false;",
      "if (rechercher(c.getEmail()) != null) return false;",
      "contacts.add(c);",
      "return true;",
    ],
    correctIndex: 1,
    explanation: "La recherche par email avant ajout garantit l'invariant 'pas de doublons d'email'.",
  },
  {
    id: "s6",
    question: "Quel ADT utiliser pour une file d'attente au cinéma ?",
    options: ["Stack", "Queue", "Map", "Set"],
    correctIndex: 1,
    explanation: "Une file d'attente = FIFO (First In, First Out). Le premier arrivé est le premier servi → Queue.",
  },
];

type Phase = "menu" | "quiz-adt" | "quiz-spec" | "results";

export default function Ch1Game() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [specQuestions] = useState(SPEC_QUESTIONS);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const startQuizADT = useCallback(() => {
    setQuestions(generateQuiz());
    setCurrentQ(0);
    setScore(0);
    setTotalAnswered(0);
    setSelected(null);
    setShowFeedback(false);
    setStreak(0);
    setMaxStreak(0);
    setPhase("quiz-adt");
  }, []);

  const startQuizSpec = useCallback(() => {
    setCurrentQ(0);
    setScore(0);
    setTotalAnswered(0);
    setSelected(null);
    setShowFeedback(false);
    setStreak(0);
    setMaxStreak(0);
    setPhase("quiz-spec");
  }, []);

  const handleAnswer = (index: number, isCorrect: boolean) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
    setTotalAnswered((p) => p + 1);
    if (isCorrect) {
      setScore((p) => p + 1);
      setStreak((p) => {
        const ns = p + 1;
        setMaxStreak((m) => Math.max(m, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    const total = phase === "quiz-adt" ? questions.length : specQuestions.length;
    if (currentQ + 1 >= total) {
      setPhase("results");
    } else {
      setCurrentQ((p) => p + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  const getGrade = () => {
    const total = phase === "results" ? totalAnswered : 0;
    if (total === 0) return { label: "—", color: "#64748B" };
    const pct = (score / total) * 100;
    if (pct >= 90) return { label: "S", color: "#16A34A" };
    if (pct >= 75) return { label: "A", color: "#028090" };
    if (pct >= 60) return { label: "B", color: "#F97316" };
    if (pct >= 40) return { label: "C", color: "#EAB308" };
    return { label: "D", color: "#DC2626" };
  };

  // MENU
  if (phase === "menu") {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{padding:"8px 0 0"}}><Link href="/" style={{fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Retour accueil</Link></div>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 14, color: "#028090", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 1 — Chapitre 1</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1B2A4A", margin: "0.5rem 0" }}>Design Specification des ADT</h1>
          <p style={{ color: "#64748B", fontSize: 16 }}>Critère P1 — Mini-jeux interactifs</p>
          <a href="/fiches/Ch1_Fiche_Memo_ADT.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <button onClick={startQuizADT} style={{ padding: "1.5rem", border: "2px solid #028090", borderRadius: 12, background: "#E1F5EE", cursor: "pointer", textAlign: "left" as const }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#028090" }}>Jeu 1 — Quelle opération pour quel ADT ?</div>
            <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>12 questions — Associer chaque opération au bon ADT</div>
          </button>
          <button onClick={startQuizSpec} style={{ padding: "1.5rem", border: "2px solid #7C3AED", borderRadius: 12, background: "#EDE9FE", cursor: "pointer", textAlign: "left" as const }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#7C3AED" }}>Jeu 2 — Préconditions et Design Spec</div>
            <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>6 questions — Comprendre les specs et le lien avec le code</div>
          </button>
        </div>
      </div>
    );
  }

  // RESULTS
  if (phase === "results") {
    const grade = getGrade();
    const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
        <div style={{ fontSize: 80, fontWeight: 800, color: grade.color, lineHeight: 1 }}>{grade.label}</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: "#1B2A4A", margin: "1rem 0" }}>{score} / {totalAnswered} correct ({pct}%)</div>
        <div style={{ fontSize: 16, color: "#64748B", marginBottom: "2rem" }}>
          Meilleure série : {maxStreak} {maxStreak > 3 ? "" : ""}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => setPhase("menu")} style={{ padding: "0.75rem 1.5rem", border: "2px solid #028090", borderRadius: 8, background: "#111827", color: "#028090", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>Retour au menu</button>
          <button onClick={startQuizADT} style={{ padding: "0.75rem 1.5rem", border: "none", borderRadius: 8, background: "#028090", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>Rejouer</button>
        </div>
      </div>
    );
  }

  // QUIZ ADT
  if (phase === "quiz-adt") {
    const q = questions[currentQ];
    if (!q) return null;
    const total = questions.length;
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Question {currentQ + 1}/{total}</span>
          <span style={{ fontSize: 13, color: "#028090", fontWeight: 600 }}>Score: {score} {streak >= 3 ? `x${streak}` : ""}</span>
        </div>
        <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, marginBottom: "1.5rem" }}>
          <div style={{ height: 4, background: "#028090", borderRadius: 2, width: `${((currentQ + 1) / total) * 100}%`, transition: "width 0.3s" }} />
        </div>
        <div style={{ background: "#1E293B", borderRadius: 12, padding: "1.5rem", marginBottom: "1rem", textAlign: "center" as const }}>
          <code style={{ fontSize: 26, color: "#F97316", fontWeight: 700 }}>{q.operation.name}</code>
          <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 8 }}>{q.operation.description}</div>
        </div>
        <p style={{ fontSize: 16, color: "#1B2A4A", fontWeight: 500, marginBottom: "0.75rem" }}>À quel ADT appartient cette opération ?</p>
        <div style={{ display: "grid", gap: 10 }}>
          {q.choices.map((choice, idx) => {
            const adt = ADTS.find((a) => a.name === choice)!;
            const isCorrect = choice === q.operation.correctADT;
            const isSelected = selected === idx;
            let borderColor = adt.color;
            let bg = "#111827";
            if (showFeedback) {
              if (isCorrect) { borderColor = "#16A34A"; bg = "#F0FDF4"; }
              else if (isSelected && !isCorrect) { borderColor = "#DC2626"; bg = "#FEF2F2"; }
              else { bg = "#F8FAFC"; borderColor = "#E2E8F0"; }
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx, isCorrect)} disabled={showFeedback}
                style={{ padding: "0.75rem 1rem", border: `2px solid ${borderColor}`, borderRadius: 10, background: bg, cursor: showFeedback ? "default" : "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" as const, opacity: showFeedback && !isCorrect && !isSelected ? 0.5 : 1, transition: "all 0.2s" }}>
                <span style={{ fontSize: 22 }}>{adt.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: adt.color, fontSize: 16 }}>{adt.name}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{adt.subtitle}</div>
                </div>
                {showFeedback && isCorrect && <span style={{ marginLeft: "auto", fontSize: 20 }}></span>}
                {showFeedback && isSelected && !isCorrect && <span style={{ marginLeft: "auto", fontSize: 20 }}></span>}
              </button>
            );
          })}
        </div>
        {showFeedback && (
          <button onClick={nextQuestion} style={{ marginTop: "1rem", width: "100%", padding: "0.75rem", border: "none", borderRadius: 8, background: "#028090", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
            {currentQ + 1 < total ? "Question suivante →" : "Voir les résultats"}
          </button>
        )}
      </div>
    );
  }

  // QUIZ SPEC
  if (phase === "quiz-spec") {
    const q = specQuestions[currentQ];
    if (!q) return null;
    const total = specQuestions.length;
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>Question {currentQ + 1}/{total}</span>
          <span style={{ fontSize: 13, color: "#7C3AED", fontWeight: 600 }}>Score: {score}</span>
        </div>
        <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, marginBottom: "1.5rem" }}>
          <div style={{ height: 4, background: "#7C3AED", borderRadius: 2, width: `${((currentQ + 1) / total) * 100}%`, transition: "width 0.3s" }} />
        </div>
        {q.code && (
          <div style={{ background: "#1E293B", borderRadius: 10, padding: "1rem", marginBottom: "1rem" }}>
            <pre style={{ fontSize: 13, color: "#E2E8F0", fontFamily: "Consolas, monospace", margin: 0, whiteSpace: "pre-wrap" as const }}>{q.code}</pre>
          </div>
        )}
        <p style={{ fontSize: 17, color: "#1B2A4A", fontWeight: 600, marginBottom: "1rem", lineHeight: 1.4 }}>{q.question}</p>
        <div style={{ display: "grid", gap: 10 }}>
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correctIndex;
            const isSelected = selected === idx;
            let borderColor = "#E2E8F0";
            let bg = "#111827";
            if (showFeedback) {
              if (isCorrect) { borderColor = "#16A34A"; bg = "#F0FDF4"; }
              else if (isSelected) { borderColor = "#DC2626"; bg = "#FEF2F2"; }
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx, isCorrect)} disabled={showFeedback}
                style={{ padding: "0.75rem 1rem", border: `2px solid ${borderColor}`, borderRadius: 10, background: bg, cursor: showFeedback ? "default" : "pointer", textAlign: "left" as const, fontSize: 15, color: "#E2E8F0", transition: "all 0.2s" }}>
                <span style={{ fontWeight: 500, marginRight: 8, color: "#7C3AED" }}>{String.fromCharCode(65 + idx)}.</span>
                {opt}
                {showFeedback && isCorrect && <span style={{ float: "right" as const, color: "#16A34A" }}></span>}
                {showFeedback && isSelected && !isCorrect && <span style={{ float: "right" as const, color: "#DC2626" }}></span>}
              </button>
            );
          })}
        </div>
        {showFeedback && (
          <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#F0FDF4", borderRadius: 8, border: "1px solid #86EFAC", fontSize: 14, color: "#166534" }}>
            {q.explanation}
          </div>
        )}
        {showFeedback && (
          <button onClick={nextQuestion} style={{ marginTop: "0.75rem", width: "100%", padding: "0.75rem", border: "none", borderRadius: 8, background: "#7C3AED", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
            {currentQ + 1 < total ? "Question suivante →" : "Voir les résultats"}
          </button>
        )}
      </div>
    );
  }

  return null;
}
