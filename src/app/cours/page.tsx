"use client";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import { C } from "@/lib/theme";

const DOCS = [
  { category: "LO1 — ADT & Structures", color: "#7C3AED", items: [
    { name: "Ch.1 — Design Specification", file: "/fiches/Ch1_Fiche_Memo_ADT.pdf", type: "Fiche memo" },
    { name: "Ch.2 — Memory Stack", file: "/fiches/Ch2_Fiche_Memo_Memory_Stack.pdf", type: "Fiche memo" },
    { name: "Ch.3 — Queue FIFO + Tri", file: "/fiches/Ch3_Fiche_Memo_FIFO_Tri.pdf", type: "Fiche memo" },
    { name: "Ch.4 — Shortest Path", file: "/fiches/Ch4_Fiche_Memo_Shortest_Path.pdf", type: "Fiche memo" },
  ]},
  { category: "LO2 — Specification & Design", color: "#0891B2", items: [
    { name: "Ch.5 — Spec formelle VDM/SDL", file: "/fiches/Ch5_Fiche_Memo_VDM_SDL.pdf", type: "Fiche memo" },
    { name: "Ch.6 — Encapsulation", file: "/fiches/Ch6_Fiche_Memo_Encapsulation.pdf", type: "Fiche memo" },
    { name: "Ch.7 — ADT vers POO", file: "/fiches/Ch7_Fiche_Memo_ADT_POO.pdf", type: "Fiche memo" },
    { name: "Ch.8 — Design Patterns", file: "/fiches/Ch8_Fiche_Memo_Design_Patterns.pdf", type: "Fiche memo" },
  ]},
  { category: "LO3 — Implementation & Testing", color: "#F97316", items: [
    { name: "Ch.8 — LinkedList & HashMap", file: "/fiches/Ch8_Fiche_Memo_LinkedList_HashMap.pdf", type: "Fiche memo" },
    { name: "Ch.10 — Exceptions & JUnit", file: "/fiches/Ch10_Fiche_Memo_Exceptions_JUnit.pdf", type: "Fiche memo" },
    { name: "Exercices Entreprise (PDF)", file: "/fiches/Exercices_Entreprise.pdf", type: "Exercices" },
  ]},
  { category: "LO4 — Efficacite & Complexite", color: "#D97706", items: [
    { name: "Ch.12 — Analyse asymptotique", file: "/fiches/Ch12_Fiche_Memo_Big_O.pdf", type: "Fiche memo" },
    { name: "Ch.13 — Mesurer efficacite", file: "/fiches/Ch13_Fiche_Memo_Benchmark.pdf", type: "Fiche memo" },
    { name: "Ch.14 — Trade-offs", file: "/fiches/Ch14_Fiche_Memo_Tradeoffs.pdf", type: "Fiche memo" },
    { name: "Big O — Cours complet", file: "/fiches/Cours_Big_O.pdf", type: "Cours" },
  ]},
  { category: "Presentations (PPTX)", color: "#3B82F6", items: [
    { name: "Toutes les presentations", file: "/docs/pptx/", type: "Dossier PPTX" },
  ]},
];

export default function CoursPage() {
  const [search, setSearch] = useState("");

  const filtered = DOCS.map(cat => ({
    ...cat,
    items: cat.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  return (
    <GameShell title="Documents & Memos" color={C.accent}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>Fiches memo, presentations, exercices — tout telecharger</p>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un document..."
          style={{ width: "100%", padding: "10px 14px", background: C.card, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 14, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />

        {filtered.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: cat.color, marginBottom: 8 }}>{cat.category}</div>
            <div style={{ display: "grid", gap: 6 }}>
              {cat.items.map((item, ii) => (
                <a key={ii} href={item.file} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.card, border: "1px solid " + C.border, borderRadius: 8, textDecoration: "none", transition: "border-color 0.2s" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.name}</div>
                    <div style={{ fontSize: 10, color: C.dimmed }}>{item.type}</div>
                  </div>
                  <span style={{ fontSize: 11, color: cat.color, fontWeight: 600 }}>Telecharger</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GameShell>
  );
}
