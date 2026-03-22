"use client";
import { useState } from "react";

interface Argument { id: string; title: string; adtConcept: string; oopEvolution: string; example: string; }

const ARGUMENTS: Argument[] = [
  { id: "a1", title: "Encapsulation des données", adtConcept: "L'ADT regroupe données + opérations en une seule unité", oopEvolution: "En POO, c'est la CLASSE : attributs (données) + méthodes (opérations)", example: "ADT Stack → class Stack { private int[] data; public void push(int e); }" },
  { id: "a2", title: "Abstraction et interface", adtConcept: "L'ADT définit une interface publique (QUOI) sans montrer l'implémentation (COMMENT)", oopEvolution: "En POO, c'est l'INTERFACE Java : List<E> définit add(), get()... sans dire comment", example: "ADT List → interface List<E> → class ArrayList implements List<E>" },
  { id: "a3", title: "Modification d'état", adtConcept: "Les opérations de l'ADT impératif MODIFIENT l'état interne (push modifie la pile)", oopEvolution: "En POO, les méthodes modifient les attributs de l'objet (mutabilité)", example: "push(e) modifie top → this.data[++top] = e modifie l'objet" },
  { id: "a4", title: "Réutilisabilité", adtConcept: "Un ADT est défini une fois et réutilisé dans différents contextes", oopEvolution: "En POO, les classes sont réutilisables, extensibles (héritage), composables", example: "ADT Stack réutilisé pour : navigation web, undo/redo, parsing" },
  { id: "a5", title: "Typage et contrats", adtConcept: "L'ADT définit des signatures, préconditions, postconditions = un CONTRAT", oopEvolution: "En POO, les interfaces définissent des contrats que les classes doivent respecter", example: "PRE: !isEmpty() pour pop() → en Java: if (isEmpty()) throw new EmptyStackException()" },
];

interface QuizQ { question: string; options: string[]; correctIndex: number; explanation: string; }

const QUIZ: QuizQ[] = [
  { question: "Pourquoi dit-on que les ADT impératifs sont la BASE de la POO ?", options: ["Parce que Java a été inventé après les ADT", "Parce que les concepts fondamentaux de la POO (encapsulation, abstraction, contrats) viennent directement des ADT", "Parce que ADT et POO sont la même chose", "C'est un abus de langage"], correctIndex: 1, explanation: "Les ADT ont formalisé l'encapsulation données+opérations, l'abstraction, et les contrats bien avant la POO. La POO a hérité et étendu ces concepts." },
  { question: "Quelle est la différence principale entre un ADT impératif et une classe POO ?", options: ["Aucune différence", "L'ADT n'a pas d'héritage ni de polymorphisme", "La classe est plus lente", "L'ADT est en pseudo-code"], correctIndex: 1, explanation: "L'ADT définit encapsulation + contrats. La POO AJOUTE l'héritage, le polymorphisme, et les relations entre objets. La POO est un ADT + des mécanismes supplémentaires." },
  { question: "En quoi l'interface Java est-elle l'héritière directe de l'ADT ?", options: ["Elle compile en bytecode", "Elle définit les opérations possibles sans implémentation, comme un ADT", "Elle est plus rapide qu'une classe", "Elle n'a aucun rapport"], correctIndex: 1, explanation: "L'interface Java = spécification pure des opérations. C'est exactement ce qu'est un ADT : le QUOI sans le COMMENT." },
  { question: "Qu'apporte la POO PAR RAPPORT aux ADT ?", options: ["Rien de plus", "L'héritage (réutiliser et étendre), le polymorphisme (traiter différentes implémentations de la même façon)", "La vitesse d'exécution", "La possibilité de compiler"], correctIndex: 1, explanation: "La POO étend les ADT avec l'héritage (class Stack extends AbstractCollection) et le polymorphisme (List<E> list = new ArrayList<>() OU new LinkedList<>())." },
];

export default function Ch7Game() {
  const [phase, setPhase] = useState<"menu" | "args" | "quiz">("menu");
  const [expandedArg, setExpandedArg] = useState<string | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (phase === "menu") {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 14, color: "#0F6E56", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 2 — Chapitre 7</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1B2A4A", margin: "0.5rem 0" }}>Les ADT impératifs : base de la POO</h1>
          <p style={{ color: "#64748B", fontSize: 16 }}>Critère D2 — Discussion argumentée</p>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <button onClick={() => setPhase("args")} style={{ padding: "1.5rem", border: "2px solid #0F6E56", borderRadius: 12, background: "#E1F5EE", cursor: "pointer", textAlign: "left" as const }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#0F6E56" }}>Jeu 1 — Les 5 arguments clés</div>
            <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Explorez chaque argument : concept ADT → évolution POO → exemple</div>
          </button>
          <button onClick={() => { setPhase("quiz"); setQuizIdx(0); setScore(0); setSelected(null); setShowFeedback(false); }}
            style={{ padding: "1.5rem", border: "2px solid #7C3AED", borderRadius: 12, background: "#EDE9FE", cursor: "pointer", textAlign: "left" as const }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#7C3AED" }}>Jeu 2 — Quiz discussion</div>
            <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>4 questions pour préparer votre argumentation écrite</div>
          </button>
        </div>
      </div>
    );
  }

  if (phase === "args") {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <button onClick={() => setPhase("menu")} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 12 }}>← Retour</button>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F6E56", marginBottom: 16 }}>5 arguments : ADT → POO</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {ARGUMENTS.map((arg) => (
            <div key={arg.id} style={{ border: `1px solid ${expandedArg === arg.id ? "#0F6E56" : "#E2E8F0"}`, borderRadius: 10, overflow: "hidden" }}>
              <button onClick={() => setExpandedArg(expandedArg === arg.id ? null : arg.id)}
                style={{ width: "100%", padding: "12px 16px", background: expandedArg === arg.id ? "#E1F5EE" : "white", border: "none", cursor: "pointer", textAlign: "left" as const, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: "#1B2A4A", fontSize: 15 }}>{arg.title}</span>
                <span style={{ color: "#64748B" }}>{expandedArg === arg.id ? "▲" : "▼"}</span>
              </button>
              {expandedArg === arg.id && (
                <div style={{ padding: "0 16px 16px" }}>
                  <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                    <div style={{ padding: "10px 12px", background: "#EDE9FE", borderRadius: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#7C3AED", textTransform: "uppercase" as const }}>Concept ADT</div>
                      <div style={{ fontSize: 14, color: "#334155", marginTop: 2 }}>{arg.adtConcept}</div>
                    </div>
                    <div style={{ textAlign: "center" as const, color: "#64748B", fontSize: 18 }}>↓</div>
                    <div style={{ padding: "10px 12px", background: "#E1F5EE", borderRadius: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#0F6E56", textTransform: "uppercase" as const }}>Évolution POO</div>
                      <div style={{ fontSize: 14, color: "#334155", marginTop: 2 }}>{arg.oopEvolution}</div>
                    </div>
                    <div style={{ padding: "8px 12px", background: "#1E293B", borderRadius: 6 }}>
                      <code style={{ fontSize: 12, color: "#E2E8F0", fontFamily: "Consolas, monospace" }}>{arg.example}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Quiz phase
  if (quizIdx >= QUIZ.length) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: score >= 3 ? "#16A34A" : "#F97316" }}>{score}/{QUIZ.length}</div>
        <button onClick={() => setPhase("menu")} style={{ marginTop: 16, padding: "10px 24px", background: "#0F6E56", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Retour</button>
      </div>
    );
  }

  const q = QUIZ[quizIdx];
  return (
    <div style={{ maxWidth: 650, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <button onClick={() => setPhase("menu")} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 8 }}>← Retour</button>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#1B2A4A", marginBottom: 12 }}>{q.question}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {q.options.map((opt, idx) => {
          let bg = "white", border = "#E2E8F0";
          if (showFeedback) {
            if (idx === q.correctIndex) { bg = "#F0FDF4"; border = "#16A34A"; }
            else if (idx === selected) { bg = "#FEF2F2"; border = "#DC2626"; }
          }
          return (
            <button key={idx} onClick={() => { if (showFeedback) return; setSelected(idx); setShowFeedback(true); if (idx === q.correctIndex) setScore(s => s + 1); }}
              disabled={showFeedback} style={{ padding: "10px 14px", border: `2px solid ${border}`, borderRadius: 8, background: bg, cursor: showFeedback ? "default" : "pointer", textAlign: "left" as const, fontSize: 14 }}>
              {opt}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <>
          <div style={{ marginTop: 10, padding: "8px 12px", background: "#F0FDF4", borderRadius: 8, fontSize: 13, color: "#166534", border: "1px solid #86EFAC" }}>{q.explanation}</div>
          <button onClick={() => { setQuizIdx(i => i + 1); setSelected(null); setShowFeedback(false); }}
            style={{ marginTop: 10, width: "100%", padding: "10px", background: "#7C3AED", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Suivant →</button>
        </>
      )}
    </div>
  );
}
