"use client";
import { useState } from "react";

interface SpecPart { id: string; label: string; content: string; hint: string; }

const CORRECT_SPEC: SpecPart[] = [
  { id: "name", label: "Nom de l'ADT", content: "Stack<E>", hint: "Type générique avec E" },
  { id: "desc", label: "Description", content: "Collection LIFO (Last In, First Out). Le dernier élément ajouté est le premier retiré.", hint: "Quel est le principe fondamental ?" },
  { id: "type", label: "Type de données", content: "E — type générique (Integer, String, Object...)", hint: "Quel type d'éléments stocke-t-on ?" },
  { id: "ops", label: "Opérations", content: "push(e: E) → void | pop() → E | peek() → E | isEmpty() → boolean | size() → int", hint: "Les 5 opérations fondamentales" },
  { id: "pre", label: "Préconditions", content: "pop() : isEmpty() == false | peek() : isEmpty() == false", hint: "Quand est-ce qu'on ne peut PAS appeler certaines opérations ?" },
  { id: "post", label: "Postconditions", content: "push(e) : e est au sommet, size += 1 | pop() : sommet retiré, size -= 1", hint: "Qu'est-ce qui est garanti APRÈS l'appel ?" },
  { id: "inv", label: "Invariants", content: "size >= 0 | pop/peek impossible si vide | push puis pop retourne le même élément", hint: "Qu'est-ce qui est TOUJOURS vrai ?" },
];

interface QuizQ { question: string; options: string[]; correctIndex: number; explanation: string; }

const NOTATION_QUIZ: QuizQ[] = [
  { question: "En notation impérative, comment spécifier que pop() nécessite un stack non vide ?", options: ["pop() requires !empty()", "PRE: isEmpty() == false", "if (!empty) then pop()", "pop() throws EmptyException"], correctIndex: 1, explanation: "En notation impérative, on utilise PRE (précondition) pour exprimer les conditions requises avant l'appel." },
  { question: "Quelle est la notation correcte pour la postcondition de push(e) ?", options: ["POST: e est ajouté quelque part", "POST: top() == e AND size() == old_size + 1", "RETURN: true", "POST: stack changed"], correctIndex: 1, explanation: "La postcondition doit être précise : le nouvel élément est au sommet ET la taille a augmenté de 1." },
  { question: "Comment exprime-t-on un invariant de classe en notation formelle ?", options: ["INVARIANT: size() >= 0", "ALWAYS: positive size", "RULE: no negative", "CHECK: size > 0"], correctIndex: 0, explanation: "Le mot-clé INVARIANT introduit une propriété qui doit être vraie à tout moment, entre chaque opération." },
  { question: "Quelle notation formelle décrit la signature de pop() ?", options: ["pop() : void", "pop() → E", "pop(stack) = element", "E pop()"], correctIndex: 1, explanation: "En notation ADT : nom_opération(paramètres) → type_retour. pop() ne prend rien et retourne un E." },
  { question: "Comment spécifier que push puis pop est l'identité (ne change pas le stack) ?", options: ["push then pop = nothing", "POST: pop(push(s, e)) == e AND stack unchanged", "push(pop()) = identity", "AXIOM: for all e, pop(push(S,e)) = <e, S>"], correctIndex: 3, explanation: "C'est un AXIOME : pousser e puis dépiler retourne e et le stack original S. C'est la propriété fondamentale du LIFO." },
  { question: "En pseudo-code impératif, comment définir l'opération push ?", options: ["push = add to random position", "OPERATION push(e: E)\n  PRE: none\n  POST: top = e, size = size + 1", "function push(e) { array.push(e) }", "push(Element e) throws Exception"], correctIndex: 1, explanation: "La notation impérative structure chaque opération avec OPERATION, PRE, POST — sans détail d'implémentation." },
];

type Phase = "menu" | "builder" | "quiz" | "results";

export default function Ch5Game() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [builderStep, setBuilderStep] = useState(0);
  const [builderRevealed, setBuilderRevealed] = useState<boolean[]>(new Array(CORRECT_SPEC.length).fill(false));
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (phase === "menu") {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 14, color: "#0F6E56", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 2 — Chapitre 5</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1B2A4A", margin: "0.5rem 0" }}>Notation formelle d'un Stack</h1>
          <p style={{ color: "#64748B", fontSize: 16 }}>Critère P3 — Spécifier un ADT en notation impérative</p>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <button onClick={() => { setPhase("builder"); setBuilderStep(0); setBuilderRevealed(new Array(7).fill(false)); }}
            style={{ padding: "1.5rem", border: "2px solid #0F6E56", borderRadius: 12, background: "#E1F5EE", cursor: "pointer", textAlign: "left" as const }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#0F6E56" }}>Jeu 1 — Construire une spec pas à pas</div>
            <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Complétez la spécification formelle d'un Stack partie par partie</div>
          </button>
          <button onClick={() => { setPhase("quiz"); setQuizIdx(0); setScore(0); setSelected(null); setShowFeedback(false); }}
            style={{ padding: "1.5rem", border: "2px solid #7C3AED", borderRadius: 12, background: "#EDE9FE", cursor: "pointer", textAlign: "left" as const }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#7C3AED" }}>Jeu 2 — Quiz notation formelle</div>
            <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>6 questions sur les conventions de notation impérative</div>
          </button>
        </div>
      </div>
    );
  }

  if (phase === "builder") {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <button onClick={() => setPhase("menu")} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 12 }}>← Retour</button>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F6E56", marginBottom: 16 }}>Construisez la spec d'un Stack</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {CORRECT_SPEC.map((part, i) => (
            <div key={part.id} style={{ border: `1px solid ${builderRevealed[i] ? "#0F6E56" : "#E2E8F0"}`, borderRadius: 10, padding: "12px 16px", background: builderRevealed[i] ? "#F0FDF4" : "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: "#1B2A4A", fontSize: 14 }}>{part.label}</span>
                {!builderRevealed[i] && (
                  <button onClick={() => { const r = [...builderRevealed]; r[i] = true; setBuilderRevealed(r); }}
                    style={{ padding: "4px 12px", background: "#0F6E56", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Révéler
                  </button>
                )}
              </div>
              {!builderRevealed[i] && <div style={{ fontSize: 13, color: "#64748B", marginTop: 4, fontStyle: "italic" }}>Indice : {part.hint}</div>}
              {builderRevealed[i] && (
                <div style={{ marginTop: 6, padding: "8px 10px", background: "#1E293B", borderRadius: 6 }}>
                  <code style={{ fontSize: 13, color: "#E2E8F0", fontFamily: "Consolas, monospace", whiteSpace: "pre-wrap" as const }}>{part.content}</code>
                </div>
              )}
            </div>
          ))}
        </div>
        {builderRevealed.every(Boolean) && (
          <div style={{ marginTop: 16, padding: "1rem", background: "#F0FDF4", borderRadius: 10, border: "1px solid #86EFAC", textAlign: "center" as const }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#166534" }}>Spécification complète ! Recopiez-la sur papier pour votre devoir.</div>
          </div>
        )}
      </div>
    );
  }

  if (phase === "quiz") {
    if (quizIdx >= NOTATION_QUIZ.length) {
      const pct = Math.round((score / NOTATION_QUIZ.length) * 100);
      return (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
          <div style={{ fontSize: 60, fontWeight: 800, color: pct >= 70 ? "#16A34A" : "#F97316" }}>{score}/{NOTATION_QUIZ.length}</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#1B2A4A", margin: "0.5rem 0" }}>{pct}%</div>
          <button onClick={() => setPhase("menu")} style={{ marginTop: 16, padding: "10px 24px", border: "1px solid #0F6E56", borderRadius: 8, background: "white", color: "#0F6E56", fontWeight: 600, cursor: "pointer" }}>Retour</button>
        </div>
      );
    }
    const q = NOTATION_QUIZ[quizIdx];
    return (
      <div style={{ maxWidth: 650, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <button onClick={() => setPhase("menu")} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 8 }}>← Retour</button>
        <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{quizIdx + 1}/{NOTATION_QUIZ.length} | Score: {score}</div>
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
                disabled={showFeedback} style={{ padding: "10px 14px", border: `2px solid ${border}`, borderRadius: 8, background: bg, cursor: showFeedback ? "default" : "pointer", textAlign: "left" as const, fontSize: 14, color: "#334155", whiteSpace: "pre-wrap" as const }}>
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

  return null;
}
