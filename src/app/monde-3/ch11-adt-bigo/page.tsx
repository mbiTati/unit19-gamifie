"use client";
import { useState } from "react";

interface BigOQ { code: string; question: string; options: string[]; correctIndex: number; explanation: string; }

const BIGO_QUESTIONS: BigOQ[] = [
  { code: "for (int i = 0; i < n; i++) {\n  System.out.println(i);\n}", question: "Quelle est la complexité ?", options: ["O(1)", "O(n)", "O(n²)", "O(log n)"], correctIndex: 1, explanation: "Une seule boucle de 0 à n → O(n). Le nombre d'opérations croît linéairement avec n." },
  { code: "for (int i = 0; i < n; i++) {\n  for (int j = 0; j < n; j++) {\n    System.out.println(i + j);\n  }\n}", question: "Quelle est la complexité ?", options: ["O(n)", "O(n²)", "O(n³)", "O(2n)"], correctIndex: 1, explanation: "Deux boucles imbriquées de 0 à n → n × n = O(n²). Quadratique !" },
  { code: "int x = arr[0];\nint y = arr[arr.length - 1];\nreturn x + y;", question: "Quelle est la complexité ?", options: ["O(1)", "O(n)", "O(n²)", "O(log n)"], correctIndex: 0, explanation: "Accès direct par index + addition. Aucune boucle. Temps constant → O(1)." },
  { code: "int lo = 0, hi = n - 1;\nwhile (lo <= hi) {\n  int mid = (lo + hi) / 2;\n  if (arr[mid] == target) return mid;\n  if (arr[mid] < target) lo = mid + 1;\n  else hi = mid - 1;\n}", question: "Quelle est la complexité ?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correctIndex: 2, explanation: "Recherche binaire : on divise l'espace de recherche par 2 à chaque itération → O(log n)." },
  { code: "for (int i = 0; i < n; i++) {\n  for (int j = 0; j < n; j++) {\n    for (int k = 0; k < n; k++) {\n      sum += i + j + k;\n    }\n  }\n}", question: "Quelle est la complexité ?", options: ["O(n²)", "O(n³)", "O(n log n)", "O(3n)"], correctIndex: 1, explanation: "Trois boucles imbriquées : n × n × n = O(n³). Cubique — très lent pour de grands n !" },
  { code: "HashMap<String, Integer> map = new HashMap<>();\nmap.put(\"alice\", 25);\nint age = map.get(\"alice\");", question: "Quelle est la complexité de get() dans un HashMap ?", options: ["O(n)", "O(log n)", "O(1) en moyenne", "O(n²)"], correctIndex: 2, explanation: "HashMap utilise une fonction de hachage → accès direct en O(1) en moyenne. Pire cas O(n) si beaucoup de collisions." },
  { code: "LinkedList<String> list = new LinkedList<>();\nlist.add(\"Alice\");\nlist.add(\"Bob\");\nString first = list.getFirst();", question: "Complexité de getFirst() dans LinkedList ?", options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], correctIndex: 1, explanation: "getFirst() accède directement au premier noeud (la tête) → O(1). Mais get(index) serait O(n) car il faut parcourir !" },
  { code: "// Tri d'un tableau de n éléments\nArrays.sort(arr);", question: "Quelle est la complexité de Arrays.sort() en Java ?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctIndex: 1, explanation: "Java utilise TimSort (hybride merge sort + insertion sort) → O(n log n) en moyenne et au pire." },
];

interface ADTChoice { scenario: string; options: string[]; correctIndex: number; explanation: string; }

const ADT_CHOICES: ADTChoice[] = [
  { scenario: "Gérer une file d'attente au cinéma (premier arrivé, premier servi)", options: ["Stack", "Queue", "Map", "Set"], correctIndex: 1, explanation: "FIFO = Queue ! Le premier client arrivé est servi en premier." },
  { scenario: "Stocker des contacts avec recherche rapide par email", options: ["LinkedList", "ArrayList", "HashMap", "Stack"], correctIndex: 2, explanation: "HashMap : clé = email, valeur = Contact. Recherche O(1) par clé !" },
  { scenario: "Implémenter le bouton 'Annuler' (Ctrl+Z) dans un éditeur de texte", options: ["Queue", "Stack", "Set", "List"], correctIndex: 1, explanation: "Stack LIFO : la dernière action est la première annulée. push(action) puis pop() pour annuler." },
  { scenario: "Vérifier si un étudiant est déjà inscrit (pas de doublons)", options: ["List", "Queue", "Stack", "Set"], correctIndex: 3, explanation: "Set garantit l'unicité. contains() vérifie si l'élément existe déjà avant d'ajouter." },
  { scenario: "Gérer les pages d'un navigateur web (page précédente / page suivante)", options: ["Queue", "Deux Stacks", "HashMap", "ArrayList"], correctIndex: 1, explanation: "Deux stacks : un pour l'historique arrière, un pour l'historique avant. Naviguer = pop d'un stack et push dans l'autre." },
];

export default function Ch11Game() {
  const [mode, setMode] = useState<"menu" | "bigo" | "adt">("menu");
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = mode === "bigo" ? BIGO_QUESTIONS : ADT_CHOICES;
  const totalQ = questions.length;

  if (mode === "menu") return (
    <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: 14, color: "#993C1D", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 3 — Chapitre 11</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1E3A5F", margin: "0.5rem 0" }}>ADT + Big O</h1>
        <p style={{ color: "#64748B", fontSize: 16 }}>Critères M4 (ADT résout un problème) + D3 (évaluer la complexité)</p>
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <button onClick={() => { setMode("bigo"); setQIdx(0); setScore(0); setSelected(null); setShowFeedback(false); }} style={{ padding: "1.5rem", border: "2px solid #854F0B", borderRadius: 12, background: "#FAEEDA", cursor: "pointer", textAlign: "left" as const }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#854F0B" }}>Jeu 1 — Identifier la complexité Big O</div>
          <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>8 extraits de code — quelle est la complexité ?</div>
        </button>
        <button onClick={() => { setMode("adt"); setQIdx(0); setScore(0); setSelected(null); setShowFeedback(false); }} style={{ padding: "1.5rem", border: "2px solid #993C1D", borderRadius: 12, background: "#FAECE7", cursor: "pointer", textAlign: "left" as const }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#993C1D" }}>Jeu 2 — Quel ADT pour quel problème ?</div>
          <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>5 scénarios d'entreprise — choisissez le bon ADT</div>
        </button>
      </div>
    </div>
  );

  if (qIdx >= totalQ) {
    const pct = Math.round((score / totalQ) * 100);
    return (
      <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: pct >= 70 ? "#16A34A" : "#F97316" }}>{score}/{totalQ}</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#1E3A5F" }}>{pct}%</div>
        <button onClick={() => setMode("menu")} style={{ marginTop: 16, padding: "10px 24px", background: "#993C1D", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Retour</button>
      </div>
    );
  }

  const q = questions[qIdx];
  const isBigO = mode === "bigo";
  const bq = isBigO ? q as BigOQ : null;
  const aq = !isBigO ? q as ADTChoice : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0B1120", color: "#E2E8F0", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <button onClick={() => setMode("menu")} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 8 }}>← Retour</button>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{qIdx + 1}/{totalQ} | Score: {score}</div>
      <div style={{ height: 4, background: "#1E3A5F", borderRadius: 2, marginBottom: 16 }}>
        <div style={{ height: 4, background: isBigO ? "#854F0B" : "#993C1D", borderRadius: 2, width: `${((qIdx + 1) / totalQ) * 100}%` }} />
      </div>
      {isBigO && bq?.code && (
        <div style={{ background: "#1E293B", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
          <pre style={{ fontSize: 13, color: "#1E3A5F", fontFamily: "Consolas, monospace", margin: 0, whiteSpace: "pre-wrap" as const }}>{bq.code}</pre>
        </div>
      )}
      {!isBigO && aq && (
        <div style={{ background: "#FAECE7", border: "1px solid #F5C4B3", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#993C1D" }}>{aq.scenario}</div>
        </div>
      )}
      <p style={{ fontSize: 16, fontWeight: 600, color: "#1E3A5F", marginBottom: 12 }}>{isBigO ? bq?.question : "Quel ADT choisir ?"}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {q.options.map((opt, idx) => {
          let bg = "#111827", border = "#1E3A5F";
          if (showFeedback) { if (idx === q.correctIndex) { bg = "#F0FDF4"; border = "#16A34A"; } else if (idx === selected) { bg = "#FEF2F2"; border = "#DC2626"; } }
          return <button key={idx} onClick={() => { if (showFeedback) return; setSelected(idx); setShowFeedback(true); if (idx === q.correctIndex) setScore(s => s + 1); }} disabled={showFeedback} style={{ padding: "10px 14px", border: `2px solid ${border}`, borderRadius: 8, background: bg, cursor: showFeedback ? "default" : "pointer", textAlign: "left" as const, fontSize: 14 }}>{opt}</button>;
        })}
      </div>
      {showFeedback && (
        <>
          <div style={{ marginTop: 10, padding: "8px 12px", background: "#16A34A15", borderRadius: 8, fontSize: 13, color: "#16A34A", border: "1px solid #16A34A40" }}>{q.explanation}</div>
          <button onClick={() => { setQIdx(i => i + 1); setSelected(null); setShowFeedback(false); }} style={{ marginTop: 10, width: "100%", padding: "10px", background: isBigO ? "#854F0B" : "#993C1D", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Suivant →</button>
        </>
      )}
    </div>
  );
}
