"use client";
import { markStepComplete } from "@/lib/progressTracker";
import { useAuth } from "@/components/AuthProvider";
import CommentWidget from "@/components/CommentWidget";
import Link from "next/link";
import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";

interface StackFrame {
  fn: string;
  vars: string;
  color: string;
}

interface Step {
  label: string;
  codeLine: string;
  stack: StackFrame[];
  explanation: string;
}

const COLORS = {
  purple: "#9333EA", blue: "#2563EB", green: "#16A34A",
  orange: "#EA580C", red: "#DC2626", gray: "#64748B",
};

const SCENARIOS = [
  {
    title: "Scénario 1 : 3 fonctions en chaîne",
    code: `static int additionner(int x, int y) {\n  return x + y;\n}\n\nstatic int calculer(int a, int b) {\n  int somme = additionner(a, b);\n  return somme * 2;\n}\n\npublic static void main(String[] args) {\n  int resultat = calculer(5, 3);\n  System.out.println(resultat);\n}`,
    steps: [
      { label: "Démarrage", codeLine: "main() commence", stack: [{ fn: "main()", vars: "args=[]", color: COLORS.purple }], explanation: "main() est empilé. C'est toujours le premier frame." },
      { label: "Appel calculer()", codeLine: "int resultat = calculer(5, 3);", stack: [{ fn: "calculer(5, 3)", vars: "a=5, b=3", color: COLORS.blue }, { fn: "main()", vars: "resultat=?", color: COLORS.purple }], explanation: "calculer() est empilé AU-DESSUS de main(). main() est en pause." },
      { label: "Appel additionner()", codeLine: "int somme = additionner(a, b);", stack: [{ fn: "additionner(5, 3)", vars: "x=5, y=3", color: COLORS.green }, { fn: "calculer(5, 3)", vars: "a=5, b=3, somme=?", color: COLORS.blue }, { fn: "main()", vars: "resultat=?", color: COLORS.purple }], explanation: "3 frames empilés ! Profondeur maximale atteinte." },
      { label: "Retour additionner", codeLine: "return 5 + 3; → 8", stack: [{ fn: "calculer(5, 3)", vars: "a=5, b=3, somme=8", color: COLORS.blue }, { fn: "main()", vars: "resultat=?", color: COLORS.purple }], explanation: "additionner() retourne 8. Son frame est dépilé (pop)." },
      { label: "Retour calculer", codeLine: "return 8 * 2; → 16", stack: [{ fn: "main()", vars: "resultat=16", color: COLORS.purple }], explanation: "calculer() retourne 16. Son frame est dépilé." },
      { label: "Fin", codeLine: "System.out.println(16);", stack: [{ fn: "main()", vars: "resultat=16", color: COLORS.purple }], explanation: "main() affiche 16. Le programme se termine." },
    ] as Step[],
  },
  {
    title: "Scénario 2 : Récursivité (factorielle)",
    code: `static int fact(int n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}\n\npublic static void main(String[] args) {\n  int r = fact(4);\n  System.out.println(r);\n}`,
    steps: [
      { label: "Démarrage", codeLine: "int r = fact(4);", stack: [{ fn: "main()", vars: "r=?", color: COLORS.purple }], explanation: "main() appelle fact(4)." },
      { label: "fact(4)", codeLine: "4 > 1 → return 4 * fact(3)", stack: [{ fn: "fact(4)", vars: "n=4", color: COLORS.blue }, { fn: "main()", vars: "r=?", color: COLORS.purple }], explanation: "n=4 > 1, donc on appelle fact(3). Un nouveau frame." },
      { label: "fact(3)", codeLine: "3 > 1 → return 3 * fact(2)", stack: [{ fn: "fact(3)", vars: "n=3", color: COLORS.green }, { fn: "fact(4)", vars: "n=4", color: COLORS.blue }, { fn: "main()", vars: "r=?", color: COLORS.purple }], explanation: "Encore un frame ! Le stack grandit." },
      { label: "fact(2)", codeLine: "2 > 1 → return 2 * fact(1)", stack: [{ fn: "fact(2)", vars: "n=2", color: COLORS.orange }, { fn: "fact(3)", vars: "n=3", color: COLORS.green }, { fn: "fact(4)", vars: "n=4", color: COLORS.blue }, { fn: "main()", vars: "r=?", color: COLORS.purple }], explanation: "4 frames empilés ! Encore un appel..." },
      { label: "fact(1) — cas de base", codeLine: "1 <= 1 → return 1", stack: [{ fn: "fact(1) → 1", vars: "n=1  base", color: COLORS.red }, { fn: "fact(2)", vars: "n=2", color: COLORS.orange }, { fn: "fact(3)", vars: "n=3", color: COLORS.green }, { fn: "fact(4)", vars: "n=4", color: COLORS.blue }, { fn: "main()", vars: "r=?", color: COLORS.purple }], explanation: "CAS DE BASE atteint ! On arrête de s'enfoncer. Maintenant on remonte." },
      { label: "Dépilage : 2*1=2", codeLine: "fact(2) = 2 * 1 = 2", stack: [{ fn: "fact(2) → 2", vars: "2*1=2", color: COLORS.orange }, { fn: "fact(3)", vars: "n=3", color: COLORS.green }, { fn: "fact(4)", vars: "n=4", color: COLORS.blue }, { fn: "main()", vars: "r=?", color: COLORS.purple }], explanation: "fact(1) dépilé. fact(2) calcule 2*1 = 2." },
      { label: "Dépilage : 3*2=6", codeLine: "fact(3) = 3 * 2 = 6", stack: [{ fn: "fact(3) → 6", vars: "3*2=6", color: COLORS.green }, { fn: "fact(4)", vars: "n=4", color: COLORS.blue }, { fn: "main()", vars: "r=?", color: COLORS.purple }], explanation: "fact(2) dépilé. fact(3) calcule 3*2 = 6." },
      { label: "Dépilage : 4*6=24", codeLine: "fact(4) = 4 * 6 = 24", stack: [{ fn: "fact(4) → 24", vars: "4*6=24", color: COLORS.blue }, { fn: "main()", vars: "r=?", color: COLORS.purple }], explanation: "fact(3) dépilé. fact(4) calcule 4*6 = 24." },
      { label: "Résultat final", codeLine: "r = 24 → println(24)", stack: [{ fn: "main()", vars: "r=24", color: COLORS.purple }], explanation: "Tout est dépilé. fact(4) = 24. LIFO en action !" },
    ] as Step[],
  },
];

export default function Ch2Game() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  // Track visit
  useEffect(() => { markStepComplete("ch2", "visited"); }, []);


  const [scenarioIdx, setScenarioIdx] = useState<number | null>(null);
  const [stepIdx, setStepIdx] = useState(0);

  if (scenarioIdx === null) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 14, color: "#2563EB", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 1 — Chapitre 2</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#E2E8F0", margin: "0.5rem 0" }}>Memory Stack & Function Calls</h1>
          <p style={{ color: "#64748B", fontSize: 16 }}>Simulateur interactif du call stack</p>
          <a href="/fiches/Ch2_Fiche_Memo_Memory_Stack.pdf" target="_blank" rel="noopener" style={{ display:"inline-block", marginTop:8, padding:"6px 14px", background:"#1E293B", border:"1px solid #1E3A5F", borderRadius:8, fontSize:12, color:"#94A3B8", textDecoration:"none" }}>Fiche memo PDF</a>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {SCENARIOS.map((sc, i) => (
            <button key={i} onClick={() => { setScenarioIdx(i); setStepIdx(0); }}
              style={{ padding: "1.5rem", border: "2px solid #2563EB", borderRadius: 12, background: "#E6F1FB", cursor: "pointer", textAlign: "left" as const }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#2563EB" }}>{sc.title}</div>
              <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Visualisez le call stack étape par étape</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const scenario = SCENARIOS[scenarioIdx];
  const step = scenario.steps[stepIdx];
  const maxDepth = Math.max(...scenario.steps.map((s) => s.stack.length));

  return (
    <div style={{ maxWidth: 750, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <button onClick={() => setScenarioIdx(null)} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer" }}>← Retour</button>
        <span style={{ fontSize: 13, color: "#2563EB", fontWeight: 600 }}>Étape {stepIdx + 1}/{scenario.steps.length}</span>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#E2E8F0", marginBottom: 4 }}>{step.label}</h2>

      <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, marginBottom: "1rem" }}>
        <div style={{ height: 4, background: "#2563EB", borderRadius: 2, width: `${((stepIdx + 1) / scenario.steps.length) * 100}%`, transition: "width 0.3s" }} />
      </div>

      {/* Code line highlight */}
      <div style={{ background: "#1E293B", borderRadius: 8, padding: "0.5rem 1rem", marginBottom: "1rem" }}>
        <code style={{ fontSize: 14, color: "#F97316" }}>{step.codeLine}</code>
      </div>

      {/* Stack visualization */}
      <div style={{ display: "flex", gap: 24, marginBottom: "1rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>Call Stack :</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {step.stack.map((frame, i) => (
              <div key={i} style={{
                background: frame.color, borderRadius: 8, padding: "10px 14px",
                transition: "all 0.3s",
                border: i === 0 ? "2px solid #1B2A4A" : "none",
              }}>
                <div style={{ color: "white", fontWeight: 700, fontSize: 15, fontFamily: "Consolas, monospace" }}>{frame.fn}</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "Consolas, monospace" }}>{frame.vars}</div>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, maxDepth - step.stack.length) }).map((_, i) => (
              <div key={`empty-${i}`} style={{ background: "#F0F4F8", borderRadius: 8, padding: "10px 14px", border: "1px dashed #E2E8F0" }}>
                <div style={{ color: "#CBD5E1", fontSize: 13, fontStyle: "italic" }}>(vide)</div>
              </div>
            ))}
          </div>
          {step.stack.length > 0 && (
            <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 600, marginTop: 4 }}>↑ TOP (sommet)</div>
          )}
        </div>

        {/* Explanation */}
        <div style={{ flex: 1 }}>
          <div style={{ background: "#10B98120", border: "1px solid #86EFAC", borderRadius: 10, padding: "1rem" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#166534", marginBottom: 4 }}>Explication :</div>
            <div style={{ fontSize: 14, color: "#E2E8F0", lineHeight: 1.5 }}>{step.explanation}</div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "#64748B" }}>
            Profondeur : <strong>{step.stack.length}</strong> frame{step.stack.length > 1 ? "s" : ""}
            {step.stack.length === maxDepth && <span style={{ color: "#DC2626", fontWeight: 600 }}> (max!)</span>}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0}
          style={{ padding: "0.6rem 1.5rem", border: "1px solid #E2E8F0", borderRadius: 8, background: "#111827", cursor: stepIdx === 0 ? "default" : "pointer", opacity: stepIdx === 0 ? 0.4 : 1, fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>
          ← Précédent
        </button>
        <button onClick={() => setStepIdx(Math.min(scenario.steps.length - 1, stepIdx + 1))} disabled={stepIdx === scenario.steps.length - 1}
          style={{ padding: "0.6rem 1.5rem", border: "none", borderRadius: 8, background: "#2563EB", cursor: stepIdx === scenario.steps.length - 1 ? "default" : "pointer", opacity: stepIdx === scenario.steps.length - 1 ? 0.4 : 1, fontSize: 14, fontWeight: 600, color: "white" }}>
          Suivant →
        </button>
      </div>
    </div>
  );
}
