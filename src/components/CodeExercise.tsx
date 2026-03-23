"use client";
import { useState } from "react";
import Link from "next/link";

const BG = "#0B1120";
const CARD = "#111827";
const CARD2 = "#1E293B";
const BORDER = "#1E3A5F";
const TEXT = "#E2E8F0";
const MUTED = "#94A3B8";
const DIM = "#64748B";
const GREEN = "#16A34A";
const RED = "#DC2626";
const ORANGE = "#F97316";
const CODE_BG = "#0D1117";

export interface CodeBlank {
  id: string;
  label: string;
  answer: string;
  hint?: string;
}

export interface ExQuestion {
  id: string;
  question: string;
  options?: string[];
  correctIndex?: number;
  freeAnswer?: string;
  explanation: string;
}

interface Props {
  chapter: number;
  title: string;
  criteria: string;
  worldColor: string;
  intro: string;
  codeTemplate: string;
  blanks: CodeBlank[];
  questions: ExQuestion[];
  totalPoints: number;
  mainCode?: string;
}

export default function CodeExercise({ chapter, title, criteria, worldColor, intro, codeTemplate, blanks, questions, totalPoints, mainCode }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [qAnswers, setQAnswers] = useState<Record<string, number | string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showMain, setShowMain] = useState(false);

  const blankScore = blanks.reduce((sum, b) => {
    return sum + (submitted && answers[b.id]?.trim().toLowerCase() === b.answer.toLowerCase() ? Math.floor(totalPoints * 0.6 / blanks.length) : 0);
  }, 0);

  const qScore = questions.reduce((sum, q) => {
    if (!submitted) return 0;
    if (q.options && q.correctIndex !== undefined) {
      return sum + (qAnswers[q.id] === q.correctIndex ? Math.floor(totalPoints * 0.4 / questions.length) : 0);
    }
    if (q.freeAnswer) {
      return sum + (String(qAnswers[q.id] || "").trim().toLowerCase() === q.freeAnswer.toLowerCase() ? Math.floor(totalPoints * 0.4 / questions.length) : 0);
    }
    return sum;
  }, 0);

  const score = blankScore + qScore;

  // Render code with blanks replaced by inputs
  const renderCode = () => {
    let code = codeTemplate;
    const parts: (string | { blankId: string })[] = [];
    let remaining = code;

    blanks.forEach(b => {
      const placeholder = `___${b.id}___`;
      const idx = remaining.indexOf(placeholder);
      if (idx >= 0) {
        parts.push(remaining.substring(0, idx));
        parts.push({ blankId: b.id });
        remaining = remaining.substring(idx + placeholder.length);
      }
    });
    parts.push(remaining);

    return parts.map((p, i) => {
      if (typeof p === "string") {
        return <span key={i} style={{ whiteSpace: "pre" as const }}>{p}</span>;
      }
      const blank = blanks.find(b => b.id === p.blankId)!;
      const isCorrect = submitted && answers[blank.id]?.trim().toLowerCase() === blank.answer.toLowerCase();
      const isWrong = submitted && !isCorrect;
      return (
        <span key={i} style={{ display: "inline-block", position: "relative" as const }}>
          <input
            value={answers[blank.id] || ""}
            onChange={e => setAnswers({ ...answers, [blank.id]: e.target.value })}
            disabled={submitted}
            placeholder={blank.label}
            style={{
              width: Math.max(blank.answer.length * 10, 80),
              padding: "2px 6px",
              fontSize: 13,
              fontFamily: "Consolas, monospace",
              background: submitted ? (isCorrect ? "#16A34A20" : "#DC262620") : "#1E293B",
              color: submitted ? (isCorrect ? "#86EFAC" : "#FCA5A5") : "#F97316",
              border: `1px solid ${submitted ? (isCorrect ? GREEN : RED) : "#F9731660"}`,
              borderRadius: 4,
              outline: "none",
            }}
          />
          {isWrong && <span style={{ position: "absolute" as const, top: -16, left: 0, fontSize: 10, color: RED }}>{blank.answer}</span>}
        </span>
      );
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", color: TEXT }}>
      {/* Header */}
      <Link href="/" style={{ fontSize: 13, color: DIM, textDecoration: "none" }}>← Retour au hub</Link>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: worldColor, background: `${worldColor}20`, padding: "2px 8px", borderRadius: 4 }}>{criteria}</span>
        <span style={{ fontSize: 11, color: DIM }}>Exercice interactif</span>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 4 }}>Ch.{chapter} — {title}</h1>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>{intro}</p>

      {/* Score bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "10px 14px", background: CARD, borderRadius: 10, border: `1px solid ${BORDER}` }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, background: CARD2, borderRadius: 3 }}>
            <div style={{ height: 6, background: submitted ? (score >= totalPoints * 0.7 ? GREEN : ORANGE) : worldColor, borderRadius: 3, width: `${submitted ? (score / totalPoints) * 100 : 0}%`, transition: "width 0.5s" }} />
          </div>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: submitted ? (score >= totalPoints * 0.7 ? GREEN : ORANGE) : DIM }}>
          {submitted ? `${score}/${totalPoints} pts` : `${totalPoints} pts`}
        </span>
      </div>

      {/* Code editor */}
      <div style={{ background: CODE_BG, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", background: "#161B22", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F85149" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F0B72F" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3FB950" }} />
          </div>
          <span style={{ fontSize: 11, color: DIM }}>Complétez les trous</span>
          <button onClick={() => setShowHints(!showHints)} style={{ fontSize: 11, color: ORANGE, background: "transparent", border: `1px solid ${ORANGE}40`, borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}>
            {showHints ? "Masquer indices" : "💡 Indices"}
          </button>
        </div>
        <pre style={{ padding: "14px 16px", margin: 0, fontSize: 13, fontFamily: "Consolas, monospace", color: TEXT, lineHeight: 1.6, overflowX: "auto" as const }}>
          {renderCode()}
        </pre>
      </div>

      {/* Hints */}
      {showHints && (
        <div style={{ background: `${ORANGE}10`, border: `1px solid ${ORANGE}30`, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
          {blanks.map(b => b.hint && (
            <div key={b.id} style={{ fontSize: 12, color: ORANGE, marginBottom: 4 }}>
              💡 <strong>{b.label}</strong> : {b.hint}
            </div>
          ))}
        </div>
      )}

      {/* Questions */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 10 }}>Questions</h2>
        {questions.map((q, qi) => (
          <div key={q.id} style={{ background: CARD, borderRadius: 10, border: `1px solid ${BORDER}`, padding: "12px 14px", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: TEXT, marginBottom: 8 }}>{qi + 1}. {q.question}</div>
            {q.options ? (
              <div style={{ display: "grid", gap: 6 }}>
                {q.options.map((opt, oi) => {
                  let bg = CARD2, bd = BORDER;
                  if (submitted) {
                    if (oi === q.correctIndex) { bg = `${GREEN}15`; bd = GREEN; }
                    else if (qAnswers[q.id] === oi) { bg = `${RED}15`; bd = RED; }
                  }
                  return (
                    <button key={oi} onClick={() => !submitted && setQAnswers({ ...qAnswers, [q.id]: oi })}
                      disabled={submitted}
                      style={{ padding: "8px 12px", background: qAnswers[q.id] === oi ? `${worldColor}20` : bg, border: `1px solid ${qAnswers[q.id] === oi && !submitted ? worldColor : bd}`, borderRadius: 6, color: TEXT, fontSize: 12, textAlign: "left" as const, cursor: submitted ? "default" : "pointer" }}>
                      <span style={{ fontWeight: 600, marginRight: 6, color: worldColor }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                value={String(qAnswers[q.id] || "")}
                onChange={e => setQAnswers({ ...qAnswers, [q.id]: e.target.value })}
                disabled={submitted}
                placeholder="Votre réponse..."
                style={{ width: "100%", padding: "8px 12px", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT, fontSize: 13, outline: "none" }}
              />
            )}
            {submitted && <div style={{ marginTop: 6, fontSize: 12, color: GREEN, background: `${GREEN}10`, padding: "6px 10px", borderRadius: 6 }}>{q.explanation}</div>}
          </div>
        ))}
      </div>

      {/* Submit */}
      {!submitted ? (
        <button onClick={() => setSubmitted(true)} style={{ width: "100%", padding: "12px", background: worldColor, color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
          Valider mes réponses
        </button>
      ) : (
        <div style={{ textAlign: "center" as const, padding: "1.5rem", background: CARD, borderRadius: 12, border: `1px solid ${score >= totalPoints * 0.7 ? GREEN : ORANGE}` }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: score >= totalPoints * 0.7 ? GREEN : ORANGE }}>{score}/{totalPoints}</div>
          <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>{score >= totalPoints * 0.7 ? "Excellent ! 🎉" : score >= totalPoints * 0.4 ? "Bien, continuez ! 💪" : "Révisez et réessayez 📖"}</div>
          <button onClick={() => { setSubmitted(false); setAnswers({}); setQAnswers({}); setShowMain(false); }} style={{ marginTop: 12, padding: "8px 20px", background: worldColor, color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Recommencer</button>
        </div>
      )}

      {/* Main / Menu complet */}
      {mainCode && submitted && (
        <div style={{ marginTop: 16 }}>
          <button onClick={() => setShowMain(!showMain)} style={{ width: "100%", padding: "10px", background: showMain ? "#DC262620" : "#16A34A20", border: "1px solid " + (showMain ? "#DC2626" : "#16A34A"), borderRadius: 8, fontSize: 13, fontWeight: 600, color: showMain ? "#DC2626" : "#16A34A", cursor: "pointer" }}>
            {showMain ? "Cacher le code complet (Main + Menu)" : "Voir le code complet avec Main et Menu"}
          </button>
          {showMain && (
            <div style={{ marginTop: 8, background: "#0D1117", borderRadius: 10, padding: "12px", maxHeight: 400, overflowY: "auto" as const, border: "1px solid #1E3A5F" }}>
              <pre style={{ fontSize: 11, color: "#A5F3FC", fontFamily: "Consolas, monospace", margin: 0, whiteSpace: "pre-wrap" as const }}>{mainCode}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
