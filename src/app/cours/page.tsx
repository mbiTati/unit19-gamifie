"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/components/AuthProvider";
import { C } from "@/lib/theme";

const PPTX_COURS = [
  { ch: "Ch.1", name: "Design Specification & ADT", file: "/docs/pptx/Ch1_P1_Design_Specification_ADT.pptx", criteria: "P1" },
  { ch: "Ch.2", name: "Memory Stack & Function Calls", file: "/docs/pptx/Ch2_P2_Memory_Stack_Function_Calls.pptx", criteria: "P2" },
  { ch: "Ch.3", name: "FIFO Queue & Sorting", file: "/docs/pptx/Ch3_M1M2_FIFO_Queue_Sorting.pptx", criteria: "M1/M2" },
  { ch: "Ch.4", name: "Shortest Path — BFS & Dijkstra", file: "/docs/pptx/Ch4_D1_Shortest_Path_BFS_Dijkstra.pptx", criteria: "D1" },
  { ch: "Ch.5", name: "Formal Spec — Stack & VDM/SDL", file: "/docs/pptx/Ch5_P3_Formal_Spec_Stack.pptx", criteria: "P3" },
  { ch: "Ch.6", name: "Encapsulation & Information Hiding", file: "/docs/pptx/Ch6_M3_Encapsulation_Information_Hiding.pptx", criteria: "M3" },
  { ch: "Ch.7", name: "ADT → POO", file: "/docs/pptx/Ch7_D2_ADT_Base_POO.pptx", criteria: "D2" },
  { ch: "Ch.8", name: "LinkedList & HashMap", file: "/docs/pptx/Ch8_P4a_LinkedList_HashMap.pptx", criteria: "P4a" },
  { ch: "Ch.9", name: "Tree & Sorting", file: "/docs/pptx/Ch9_P4b_Tree_Sorting.pptx", criteria: "P4b" },
  { ch: "Ch.10", name: "Exceptions & JUnit 5", file: "/docs/pptx/Ch10_P5_Exceptions_JUnit5.pptx", criteria: "P5" },
  { ch: "Ch.11", name: "ADT & Big O", file: "/docs/pptx/Ch11_M4D3_ADT_BigO.pptx", criteria: "M4/D3" },
  { ch: "Ch.12", name: "Analyse asymptotique", file: "/docs/pptx/Ch12_P6_Asymptotic_Analysis.pptx", criteria: "P6" },
  { ch: "Ch.13", name: "Measuring Efficiency", file: "/docs/pptx/Ch13_P7_Measuring_Efficiency.pptx", criteria: "P7" },
  { ch: "Ch.14", name: "Trade-offs & Independence", file: "/docs/pptx/Ch14_M5D4_Tradeoffs_Independence.pptx", criteria: "M5/D4" },
];

const PPTX_SUPPLEMENTS = [
  { ch: "Ch.5", name: "Supplement — VDM/SDL", file: "/docs/pptx/Ch5_SUPPLEMENT.pptx" },
  { ch: "Ch.6", name: "Supplement — Encapsulation", file: "/docs/pptx/Ch6_SUPPLEMENT.pptx" },
  { ch: "Ch.7", name: "Supplement — ADT POO", file: "/docs/pptx/Ch7_SUPPLEMENT.pptx" },
  { ch: "Ch.8", name: "Supplement — LinkedList HashMap", file: "/docs/pptx/Ch8_SUPPLEMENT.pptx" },
  { ch: "Ch.9", name: "Supplement — Tree Sorting", file: "/docs/pptx/Ch9_SUPPLEMENT.pptx" },
  { ch: "Ch.10", name: "Supplement — Exceptions JUnit", file: "/docs/pptx/Ch10_SUPPLEMENT.pptx" },
  { ch: "Ch.11", name: "Supplement — ADT Big O", file: "/docs/pptx/Ch11_SUPPLEMENT.pptx" },
  { ch: "Ch.12", name: "Supplement — Asymptotic", file: "/docs/pptx/Ch12_SUPPLEMENT.pptx" },
  { ch: "Ch.13", name: "Supplement — Efficiency", file: "/docs/pptx/Ch13_SUPPLEMENT.pptx" },
  { ch: "Ch.14", name: "Supplement — Tradeoffs", file: "/docs/pptx/Ch14_SUPPLEMENT.pptx" },
];

const PDF_REFERENTIEL = [
  { lo: "LO1", items: [
    { name: "Abstract Data Types", file: "/cours/3_2024_UNIT_19_01_1_ABSTRACT_DATA_TYPES_compressed.pdf" },
    { name: "Data Structures", file: "/cours/1_2024_UNIT_19_01_2_DATA_STRUCTURES_compressed.pdf" },
    { name: "Algorithms (partie 1)", file: "/cours/2_2024_UNIT_19_01_4_ALGORITHMS_compressed.pdf" },
    { name: "Algorithms (partie 2)", file: "/cours/4_2024_UNIT_19_01_4_ALGORITHMS_compressed.pdf" },
  ]},
  { lo: "LO2", items: [
    { name: "Design Specification", file: "/cours/6_UNIT_19_02_01_Design_specification_compressed.pdf" },
    { name: "VDM / SDL", file: "/cours/3_UNIT_19_02_02_VDM_SDL_compressed.pdf" },
    { name: "Encapsulation", file: "/cours/1_UNIT_19_02_03_e_Encapsulation_compressed.pdf" },
    { name: "Information Hiding", file: "/cours/4_UNIT_19_02_03_f_Information_Hiding_compressed.pdf" },
    { name: "Design Patterns", file: "/cours/5_UNIT_19_02_03_b_Design_patterns_compressed.pdf" },
    { name: "Interfaces", file: "/cours/7_UNIT_19_02_03_d_Interfaces_compressed.pdf" },
    { name: "Creation Conditions", file: "/cours/8_UNIT_19_02_04_Creation_Conditions_compressed.pdf" },
    { name: "Parallelism", file: "/cours/11_UNIT_19_02_03_c_Parallelism_compressed.pdf" },
    { name: "Efficiency", file: "/cours/12_UNIT_19_02_03_g_Efficiency_compressed.pdf" },
  ]},
  { lo: "LO3", items: [
    { name: "Implementation", file: "/cours/3__UNIT_19_03_Implementation_compressed.pdf" },
    { name: "Scenarios", file: "/cours/1_UNIT_19_03_02_b_Scenarios_compressed.pdf" },
    { name: "Tests (partie 1)", file: "/cours/2_UNIT_19_03_02_a_Tests_compressed.pdf" },
    { name: "Tests (partie 2)", file: "/cours/4_UNIT_19_03_02_a_Tests_compressed.pdf" },
    { name: "Techniques", file: "/cours/2_UNIT_19_03_02_c_Techniques_compressed.pdf" },
  ]},
  { lo: "LO4", items: [
    { name: "Trade-offs", file: "/cours/UNIT_19_04_Tradeoff.pdf" },
    { name: "Benchmark", file: "/cours/BENCHMARK.pdf" },
    { name: "Big O", file: "/cours/BIG_O.pdf" },
    { name: "Cours Big O complet", file: "/cours/Cours_Big_O.pdf" },
    { name: "Big O Debutants", file: "/cours/Cours_Big_O_Debutants_1.pdf" },
  ]},
  { lo: "Java", items: [
    { name: "POO — Rappels", file: "/cours/Programmation_Orientee_Objet_Rappels.pdf" },
    { name: "Testing & Debugging Java", file: "/cours/Testing_Debugging_Java_v2.pdf" },
    { name: "Pile (Stack)", file: "/cours/PILE.pdf" },
    { name: "Exercices Entreprise Java", file: "/cours/Exercices_Entreprise_Contextes_Java_2.pdf" },
  ]},
];

const FICHES_MEMO = [
  { ch: "Ch.1", file: "/fiches/Ch1_Fiche_Memo_ADT.pdf" },
  { ch: "Ch.2", file: "/fiches/Ch2_Fiche_Memo_Memory_Stack.pdf" },
  { ch: "Ch.3", file: "/fiches/Ch3_Fiche_Memo_FIFO_Sorting.pdf" },
  { ch: "Ch.4", file: "/fiches/Ch4_Fiche_Memo_Shortest_Path.pdf" },
  { ch: "Ch.5", file: "/fiches/Ch5_Fiche_Memo_Notation_Formelle.pdf" },
  { ch: "Ch.6", file: "/fiches/Ch6_Fiche_Memo_Encapsulation.pdf" },
  { ch: "Ch.7", file: "/fiches/Ch7_Fiche_Memo_ADT_POO.pdf" },
  { ch: "Ch.8a", file: "/fiches/Ch8_Fiche_Memo_Design_Patterns.pdf" },
  { ch: "Ch.8b", file: "/fiches/Ch8_Fiche_Memo_LinkedList_HashMap.pdf" },
  { ch: "Ch.9", file: "/fiches/Ch9_Fiche_Memo_Tree_Sorting.pdf" },
  { ch: "Ch.10", file: "/fiches/Ch10_Fiche_Memo_Exceptions_JUnit.pdf" },
  { ch: "Ch.11", file: "/fiches/Ch11_Fiche_Memo_ADT_BigO.pdf" },
  { ch: "Ch.12", file: "/fiches/Ch12_Fiche_Memo_Asymptotic.pdf" },
  { ch: "Ch.13", file: "/fiches/Ch13_Fiche_Memo_Efficiency.pdf" },
  { ch: "Ch.14", file: "/fiches/Ch14_Fiche_Memo_Tradeoffs.pdf" },
];

const LO_COLORS: Record<string, string> = { LO1: "#7C3AED", LO2: "#0891B2", LO3: "#F97316", LO4: "#D97706", Java: "#DC2626" };

export default function CoursPage() {
  const { user, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"pptx"|"referentiel"|"fiches">("pptx");

  if (loading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Chargement...</div>;
  if (!user) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  const q = search.toLowerCase();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1rem 1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Documents & Cours</h1>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Presentations PPTX, cours PDF du referentiel, fiches memo</p>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
          style={{ width: "100%", padding: "10px 14px", background: C.card, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 14, outline: "none", marginBottom: 12, boxSizing: "border-box" }} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "2px solid " + C.border }}>
          {([
            { id: "pptx" as const, label: `Presentations PPTX (${PPTX_COURS.length + PPTX_SUPPLEMENTS.length})` },
            { id: "referentiel" as const, label: `Cours PDF referentiel (${PDF_REFERENTIEL.reduce((a, lo) => a + lo.items.length, 0)})` },
            { id: "fiches" as const, label: `Fiches memo (${FICHES_MEMO.length})` },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "10px 16px", fontSize: 13, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? C.accent : C.muted, background: "none", border: "none", borderBottom: tab === t.id ? "3px solid " + C.accent : "3px solid transparent", cursor: "pointer" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* PPTX */}
        {tab === "pptx" && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.accent, marginBottom: 8 }}>Cours principaux</div>
            <div style={{ display: "grid", gap: 6, marginBottom: 16 }}>
              {PPTX_COURS.filter(p => !q || p.name.toLowerCase().includes(q) || p.ch.toLowerCase().includes(q)).map((p, i) => (
                <a key={i} href={p.file} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.card, border: "1px solid " + C.border, borderRadius: 8, textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, padding: "2px 8px", background: C.gold + "15", borderRadius: 4 }}>PPTX</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.ch} — {p.name}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>Critere {p.criteria}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: C.accent }}>Telecharger</span>
                </a>
              ))}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Supplements</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {PPTX_SUPPLEMENTS.filter(p => !q || p.name.toLowerCase().includes(q)).map((p, i) => (
                <a key={i} href={p.file} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.card, border: "1px solid " + C.border, borderRadius: 8, textDecoration: "none" }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.dimmed, padding: "2px 6px", background: C.border, borderRadius: 4 }}>SUP</span>
                  <div style={{ fontSize: 12, color: C.muted }}>{p.ch} — {p.name}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Referentiel PDFs */}
        {tab === "referentiel" && (
          <div>
            {PDF_REFERENTIEL.map((lo, li) => {
              const items = lo.items.filter(p => !q || p.name.toLowerCase().includes(q));
              if (items.length === 0) return null;
              return (
                <div key={li} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: LO_COLORS[lo.lo] || C.accent, marginBottom: 8 }}>{lo.lo}</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {items.map((p, i) => (
                      <a key={i} href={p.file} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.card, border: "1px solid " + C.border, borderRadius: 8, textDecoration: "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.danger, padding: "2px 8px", background: C.danger + "15", borderRadius: 4 }}>PDF</span>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.name}</div>
                        </div>
                        <span style={{ fontSize: 11, color: C.accent }}>Ouvrir</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fiches memo */}
        {tab === "fiches" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {FICHES_MEMO.filter(f => !q || f.ch.toLowerCase().includes(q)).map((f, i) => (
              <a key={i} href={f.file} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: C.card, border: "1px solid " + C.border, borderRadius: 8, textDecoration: "none" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.success, padding: "2px 8px", background: C.success + "15", borderRadius: 4 }}>MEMO</span>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.ch}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
