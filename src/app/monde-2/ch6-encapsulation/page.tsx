"use client";
import { useState } from "react";

interface Question { question: string; code?: string; options: string[]; correctIndex: number; explanation: string; }

const QUESTIONS: Question[] = [
  { question: "Qu'est-ce que l'encapsulation en POO ?", options: ["Mettre du code dans un fichier .jar", "Regrouper données + opérations dans une unité et contrôler l'accès", "Compresser les données", "Utiliser des interfaces"], correctIndex: 1, explanation: "L'encapsulation = regrouper les attributs et méthodes dans une classe, avec des modificateurs d'accès (private, public) pour contrôler qui peut voir/modifier quoi." },
  { question: "Que signifie 'information hiding' (masquage d'information) ?", options: ["Chiffrer les données", "Cacher les détails d'implémentation derrière une interface publique", "Supprimer les commentaires du code", "Rendre toutes les variables private"], correctIndex: 1, explanation: "L'information hiding = exposer UNIQUEMENT ce qui est nécessaire (interface publique) et cacher le COMMENT (implémentation interne). C'est le principe de l'ADT !" },
  { code: "public class Stack {\n  private int[] data;\n  private int top;\n\n  public void push(int e) {...}\n  public int pop() {...}\n}", question: "Dans ce code, qu'est-ce qui est caché ?", options: ["Les méthodes push et pop", "Le fait que c'est un Stack", "Le tableau data[] et l'index top", "Rien n'est caché"], correctIndex: 2, explanation: "data[] et top sont private = cachés. L'utilisateur ne sait pas que c'est un tableau en interne. Il pourrait être remplacé par une LinkedList sans changer l'interface publique." },
  { question: "Quel est l'avantage principal de l'encapsulation pour un ADT ?", options: ["Le code est plus court", "On peut changer l'implémentation sans affecter les utilisateurs", "Le programme est plus rapide", "C'est obligatoire en Java"], correctIndex: 1, explanation: "C'est LE point clé : si l'interface publique ne change pas, on peut remplacer ArrayList par LinkedList sans que le code client ne change." },
  { code: "// Version 1 : ArrayList\nprivate ArrayList<Contact> contacts;\n\n// Version 2 : HashMap\nprivate HashMap<String,Contact> contacts;", question: "Si on change de Version 1 à Version 2, que se passe-t-il pour le code qui utilise la classe ?", options: ["Il faut tout réécrire", "Rien, si les méthodes publiques gardent les mêmes signatures", "Le programme crashe", "Il faut recompiler Java"], correctIndex: 1, explanation: "C'est la puissance de l'encapsulation : tant que les signatures publiques (ajouterContact, rechercherParEmail...) ne changent pas, le code client fonctionne sans modification." },
  { question: "En Java, quel modificateur d'accès est le PLUS restrictif ?", options: ["public", "protected", "private", "default (package)"], correctIndex: 2, explanation: "private = accessible UNIQUEMENT dans la classe elle-même. C'est le niveau recommandé pour les attributs (données internes)." },
  { question: "Quel lien entre ADT et encapsulation ?", options: ["Aucun lien", "L'ADT EST le concept d'encapsulation appliqué aux structures de données", "L'ADT est le contraire de l'encapsulation", "L'encapsulation remplace les ADT"], correctIndex: 1, explanation: "Un ADT encapsule des données avec des opérations. L'utilisateur voit QUOI faire (interface), pas COMMENT c'est fait (implémentation). C'est de l'encapsulation !" },
  { question: "Pourquoi utiliser des getters au lieu d'attributs public ?", options: ["C'est juste une convention Java inutile", "Pour pouvoir ajouter de la validation et changer l'implémentation plus tard", "Pour que le code soit plus long", "Pour la performance"], correctIndex: 1, explanation: "Un getter permet d'ajouter de la logique (validation, calcul, lazy loading) sans changer l'interface. Avec un attribut public, impossible d'intercepter l'accès." },
];

export default function Ch6Game() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!started) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
        <div style={{ fontSize: 14, color: "#0F6E56", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 2 — Chapitre 6</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1B2A4A", margin: "0.5rem 0" }}>Encapsulation & Information Hiding</h1>
        <p style={{ color: "#64748B", fontSize: 16, marginBottom: 24 }}>Critère M3 — 8 questions</p>
        <button onClick={() => setStarted(true)} style={{ padding: "12px 32px", background: "#0F6E56", color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Commencer</button>
      </div>
    );
  }

  if (current >= QUESTIONS.length) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "3rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", textAlign: "center" as const }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: pct >= 70 ? "#16A34A" : "#F97316" }}>{score}/{QUESTIONS.length}</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#1B2A4A" }}>{pct}%</div>
        <button onClick={() => { setCurrent(0); setScore(0); setStarted(false); }} style={{ marginTop: 16, padding: "10px 24px", background: "#0F6E56", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Rejouer</button>
      </div>
    );
  }

  const q = QUESTIONS[current];
  return (
    <div style={{ maxWidth: 650, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{current + 1}/{QUESTIONS.length} | Score: {score}</div>
      <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, marginBottom: 16 }}>
        <div style={{ height: 4, background: "#0F6E56", borderRadius: 2, width: `${((current + 1) / QUESTIONS.length) * 100}%` }} />
      </div>
      {q.code && (
        <div style={{ background: "#1E293B", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: 12 }}>
          <pre style={{ fontSize: 13, color: "#E2E8F0", fontFamily: "Consolas, monospace", margin: 0, whiteSpace: "pre-wrap" as const }}>{q.code}</pre>
        </div>
      )}
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
              disabled={showFeedback} style={{ padding: "10px 14px", border: `2px solid ${border}`, borderRadius: 8, background: bg, cursor: showFeedback ? "default" : "pointer", textAlign: "left" as const, fontSize: 14, color: "#334155" }}>
              {opt}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <>
          <div style={{ marginTop: 10, padding: "8px 12px", background: "#F0FDF4", borderRadius: 8, fontSize: 13, color: "#166534", border: "1px solid #86EFAC" }}>{q.explanation}</div>
          <button onClick={() => { setCurrent(c => c + 1); setSelected(null); setShowFeedback(false); }}
            style={{ marginTop: 10, width: "100%", padding: "10px", background: "#0F6E56", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Suivant →</button>
        </>
      )}
    </div>
  );
}
