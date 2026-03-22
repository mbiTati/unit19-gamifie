"use client";
import { useState } from "react";

interface CodeBug { id: string; title: string; code: string; bugLine: number; explanation: string; fix: string; concept: string; }

const BUGS: CodeBug[] = [
  { id: "b1", title: "NullPointerException", code: "String nom = null;\nint len = nom.length();", bugLine: 2, explanation: "nom est null, on ne peut pas appeler .length() dessus", fix: "if (nom != null) {\n  int len = nom.length();\n}", concept: "Vérifier null avant d'appeler une méthode" },
  { id: "b2", title: "ArrayIndexOutOfBoundsException", code: "int[] tab = {1, 2, 3};\nint val = tab[3];", bugLine: 2, explanation: "tab a 3 éléments (index 0-2), tab[3] n'existe pas", fix: "int val = tab[2]; // dernier index valide", concept: "Index max = tableau.length - 1" },
  { id: "b3", title: "ArithmeticException", code: "int a = 10;\nint b = 0;\nint c = a / b;", bugLine: 3, explanation: "Division par zéro ! b vaut 0", fix: "if (b != 0) {\n  int c = a / b;\n} else {\n  System.out.println(\"Division impossible\");\n}", concept: "Toujours vérifier le diviseur" },
  { id: "b4", title: "Try-Catch manquant", code: "Scanner sc = new Scanner(System.in);\nint age = sc.nextInt();\n// Si l'utilisateur tape \"abc\" → crash", bugLine: 2, explanation: "nextInt() lance InputMismatchException si l'entrée n'est pas un entier", fix: "try {\n  int age = sc.nextInt();\n} catch (InputMismatchException e) {\n  System.out.println(\"Entrez un nombre !\");\n}", concept: "try-catch pour les entrées utilisateur" },
  { id: "b5", title: "Throws déclaration", code: "public void lireFichier(String nom) {\n  FileReader fr = new FileReader(nom);\n  // Erreur compilation !\n}", bugLine: 2, explanation: "FileReader lance une checked exception (FileNotFoundException) qu'il faut déclarer ou attraper", fix: "public void lireFichier(String nom)\n    throws FileNotFoundException {\n  FileReader fr = new FileReader(nom);\n}", concept: "throws pour les checked exceptions" },
];

interface JUnitQ { question: string; code?: string; options: string[]; correctIndex: number; explanation: string; }

const JUNIT_QUIZ: JUnitQ[] = [
  { question: "Quelle annotation JUnit 5 marque une méthode de test ?", options: ["@Test", "@JUnit", "@RunWith", "@Testing"], correctIndex: 0, explanation: "En JUnit 5 (Jupiter), c'est @Test de org.junit.jupiter.api.Test" },
  { question: "Quelle assertion vérifie qu'une exception est lancée ?", options: ["assertEquals(exception)", "assertThrows(Exception.class, () -> ...)", "try-catch dans le test", "assertException()"], correctIndex: 1, explanation: "assertThrows est la façon JUnit 5 de tester les exceptions. assertThrows(IllegalArgumentException.class, () -> method())" },
  { question: "À quoi sert @BeforeEach ?", options: ["Exécuter après chaque test", "Exécuter une seule fois avant tous les tests", "Exécuter avant CHAQUE méthode de test", "Ignorer le test"], correctIndex: 2, explanation: "@BeforeEach exécute la méthode avant chaque test — idéal pour initialiser les données de test (setup)." },
  { code: "@Test\nvoid testAjouter() {\n  GestionStock gs = new GestionStock();\n  gs.ajouter(new Produit(\"P1\", 10));\n  assertEquals(1, gs.getTaille());\n}", question: "Que vérifie ce test ?", options: ["Que le produit a le bon prix", "Qu'après ajout d'un produit, la taille est 1", "Que GestionStock n'est pas null", "Que Produit existe"], correctIndex: 1, explanation: "assertEquals(1, gs.getTaille()) vérifie que la taille est bien 1 après un ajout. C'est un test de postcondition." },
  { question: "Quelle est la différence entre throw et throws ?", options: ["Aucune différence", "throw LANCE une exception, throws DÉCLARE qu'une méthode peut lancer", "throw est JUnit 4, throws est JUnit 5", "throws lance, throw déclare"], correctIndex: 1, explanation: "throw new Exception() LANCE l'exception. throws Exception dans la signature DÉCLARE que la méthode peut en lancer une." },
  { question: "Que fait finally dans try-catch-finally ?", options: ["S'exécute uniquement si pas d'exception", "S'exécute TOUJOURS, exception ou pas", "S'exécute uniquement si exception", "Remplace le catch"], correctIndex: 1, explanation: "Le bloc finally s'exécute TOUJOURS — parfait pour fermer des ressources (fichiers, connexions)." },
];

export default function Ch10Game() {
  const [mode, setMode] = useState<"menu" | "debug" | "junit">("menu");
  const [bugIdx, setBugIdx] = useState(0);
  const [showFix, setShowFix] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (mode === "menu") return (
    <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: 14, color: "#993C1D", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 3 — Chapitre 10</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1E3A5F", margin: "0.5rem 0" }}>Exceptions + JUnit 5</h1>
        <p style={{ color: "#64748B", fontSize: 16 }}>Critère P5 — Error handling et tests</p>
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <button onClick={() => { setMode("debug"); setBugIdx(0); setShowFix(false); }} style={{ padding: "1.5rem", border: "2px solid #DC2626", borderRadius: 12, background: "#DC262620", cursor: "pointer", textAlign: "left" as const }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#DC2626" }}>Jeu 1 — Chasseur de bugs</div>
          <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>5 bugs classiques Java — trouvez l'erreur et le fix</div>
        </button>
        <button onClick={() => { setMode("junit"); setQuizIdx(0); setScore(0); setSelected(null); setShowFeedback(false); }} style={{ padding: "1.5rem", border: "2px solid #7C3AED", borderRadius: 12, background: "#EDE9FE", cursor: "pointer", textAlign: "left" as const }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#7C3AED" }}>Jeu 2 — Quiz JUnit 5</div>
          <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>6 questions sur @Test, assertThrows, @BeforeEach, throw/throws</div>
        </button>
      </div>
    </div>
  );

  if (mode === "debug") {
    const bug = BUGS[bugIdx];
    return (
      <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <button onClick={() => setMode("menu")} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 8 }}>← Retour</button>
        <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>Bug {bugIdx + 1}/{BUGS.length}</div>
        <div style={{ background: "#DC262620", border: "2px solid #DC2626", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, color: "#DC2626", fontSize: 16 }}>{bug.title}</span>
          <span style={{ fontSize: 12, color: "#64748B", marginLeft: 8 }}>({bug.concept})</span>
        </div>
        <div style={{ background: "#1E293B", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
          {bug.code.split("\n").map((line, i) => (
            <div key={i} style={{ fontSize: 13, fontFamily: "Consolas, monospace", color: i + 1 === bug.bugLine ? "#F87171" : "#1E3A5F", background: i + 1 === bug.bugLine ? "#7F1D1D44" : "transparent", padding: "2px 4px", borderRadius: 3 }}>
              <span style={{ color: "#64748B", marginRight: 8, fontSize: 11 }}>{i + 1}</span>{line}
            </div>
          ))}
        </div>
        {!showFix ? (
          <button onClick={() => setShowFix(true)} style={{ width: "100%", padding: "10px", background: "#DC2626", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Voir l'explication + fix</button>
        ) : (
          <>
            <div style={{ background: "#16A34A20", border: "1px solid #86EFAC", borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
              <div style={{ fontWeight: 600, color: "#166534", fontSize: 14, marginBottom: 4 }}>Explication :</div>
              <div style={{ fontSize: 13, color: "#1E3A5F" }}>{bug.explanation}</div>
            </div>
            <div style={{ background: "#1E293B", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 600, marginBottom: 4 }}>FIX :</div>
              <pre style={{ fontSize: 13, color: "#86EFAC", fontFamily: "Consolas, monospace", margin: 0, whiteSpace: "pre-wrap" as const }}>{bug.fix}</pre>
            </div>
            <button onClick={() => { if (bugIdx < BUGS.length - 1) { setBugIdx(i => i + 1); setShowFix(false); } else setMode("menu"); }}
              style={{ width: "100%", padding: "10px", background: "#993C1D", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              {bugIdx < BUGS.length - 1 ? "Bug suivant →" : "Terminé !"}
            </button>
          </>
        )}
      </div>
    );
  }

  // JUnit quiz
  if (quizIdx >= JUNIT_QUIZ.length) {
    return (
      <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: score >= 4 ? "#16A34A" : "#F97316" }}>{score}/{JUNIT_QUIZ.length}</div>
        <button onClick={() => setMode("menu")} style={{ marginTop: 16, padding: "10px 24px", background: "#7C3AED", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Retour</button>
      </div>
    );
  }
  const q = JUNIT_QUIZ[quizIdx];
  return (
    <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <button onClick={() => setMode("menu")} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 8 }}>← Retour</button>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{quizIdx + 1}/{JUNIT_QUIZ.length} | Score: {score}</div>
      {q.code && <div style={{ background: "#1E293B", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}><pre style={{ fontSize: 12, color: "#1E3A5F", fontFamily: "Consolas, monospace", margin: 0, whiteSpace: "pre-wrap" as const }}>{q.code}</pre></div>}
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
          <button onClick={() => { setQuizIdx(i => i + 1); setSelected(null); setShowFeedback(false); }} style={{ marginTop: 10, width: "100%", padding: "10px", background: "#7C3AED", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Suivant →</button>
        </>
      )}
    </div>
  );
}
