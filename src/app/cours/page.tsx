"use client";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/components/AuthProvider";
import { C } from "@/lib/theme";

const DOCS = [
  { cat: "LO1 — ADT, Structures & Algorithmes", color: "#7C3AED", items: [
    { name: "Ch.1 — Design Specification & ADT", file: "Ch1_P1_Design_Specification_ADT.pptx", tag: "P1" },
    { name: "Ch.2 — Memory Stack & Function Calls", file: "Ch2_P2_Memory_Stack_Function_Calls.pptx", tag: "P2" },
    { name: "Ch.3 — FIFO Queue & Sorting", file: "Ch3_M1M2_FIFO_Queue_Sorting.pptx", tag: "M1/M2" },
    { name: "Ch.4 — Shortest Path BFS Dijkstra", file: "Ch4_D1_Shortest_Path_BFS_Dijkstra.pptx", tag: "D1" },
    { name: "Abstract Data Types (cours)", file: "3_2024_UNIT_19_01_1_ABSTRACT_DATA_TYPES_compressed.pptx", tag: "REF" },
    { name: "Data Structures (cours)", file: "1_2024_UNIT_19_01_2_DATA_STRUCTURES_compressed.pptx", tag: "REF" },
    { name: "Algorithms (cours)", file: "2_2024_UNIT_19_01_4_ALGORITHMS_compressed.pptx", tag: "REF" },
    { name: "Pile / Stack (cours)", file: "PILE.pptx", tag: "REF" },
  ]},
  { cat: "LO2 — Specification & Conception", color: "#0891B2", items: [
    { name: "Ch.5 — Formal Spec VDM/SDL", file: "Ch5_P3_Formal_Spec_Stack.pptx", tag: "P3" },
    { name: "Ch.6 — Encapsulation & Info Hiding", file: "Ch6_M3_Encapsulation_Information_Hiding.pptx", tag: "M3" },
    { name: "Ch.7 — ADT vers POO", file: "Ch7_D2_ADT_Base_POO.pptx", tag: "D2" },
    { name: "Design Specification (cours)", file: "6_UNIT_19_02_01_Design_specification_compressed.pptx", tag: "REF" },
    { name: "VDM / SDL (cours)", file: "3_UNIT_19_02_02_VDM_SDL_compressed.pptx", tag: "REF" },
    { name: "Encapsulation (cours)", file: "1_UNIT_19_02_03_e_Encapsulation_compressed.pptx", tag: "REF" },
    { name: "Information Hiding (cours)", file: "4_UNIT_19_02_03_f_Information_Hiding_compressed.pptx", tag: "REF" },
    { name: "Design Patterns (cours)", file: "5_UNIT_19_02_03_b_Design_patterns_compressed.pptx", tag: "REF" },
    { name: "Interfaces (cours)", file: "7_UNIT_19_02_03_d_Interfaces_compressed.pptx", tag: "REF" },
    { name: "Creation Conditions (cours)", file: "8_UNIT_19_02_04_Creation_Conditions_compressed.pptx", tag: "REF" },
    { name: "Parallelism (cours)", file: "11_UNIT_19_02_03_c_Parallelism_compressed.pptx", tag: "REF" },
    { name: "Efficiency (cours)", file: "12_UNIT_19_02_03_g_Efficiency_compressed.pptx", tag: "REF" },
  ]},
  { cat: "LO3 — Implementation & Testing", color: "#F97316", items: [
    { name: "Ch.8 — LinkedList & HashMap", file: "Ch8_P4a_LinkedList_HashMap.pptx", tag: "P4a" },
    { name: "Ch.9 — Tree & Sorting", file: "Ch9_P4b_Tree_Sorting.pptx", tag: "P4b" },
    { name: "Ch.10 — Exceptions & JUnit 5", file: "Ch10_P5_Exceptions_JUnit5.pptx", tag: "P5" },
    { name: "Ch.11 — ADT & Big O", file: "Ch11_M4D3_ADT_BigO.pptx", tag: "M4/D3" },
    { name: "Implementation (cours)", file: "3__UNIT_19_03_Implementation_compressed.pptx", tag: "REF" },
    { name: "Scenarios (cours)", file: "1_UNIT_19_03_02_b_Scenarios_compressed.pptx", tag: "REF" },
    { name: "Tests partie 1 (cours)", file: "2_UNIT_19_03_02_a_Tests.pptx", tag: "REF" },
    { name: "Tests partie 2 (cours)", file: "4_UNIT_19_03_02_a_Tests_compressed.pptx", tag: "REF" },
    { name: "Techniques (cours)", file: "2_UNIT_19_03_02_c_Techniques_compressed.pptx", tag: "REF" },
    { name: "Testing Debugging Java", file: "Testing_Debugging_Java_v2.pptx", tag: "REF" },
  ]},
  { cat: "LO4 — Efficacite & Complexite", color: "#D97706", items: [
    { name: "Ch.12 — Analyse asymptotique", file: "Ch12_P6_Asymptotic_Analysis.pptx", tag: "P6" },
    { name: "Ch.13 — Measuring Efficiency", file: "Ch13_P7_Measuring_Efficiency.pptx", tag: "P7" },
    { name: "Ch.14 — Trade-offs Independence", file: "Ch14_M5D4_Tradeoffs_Independence.pptx", tag: "M5/D4" },
    { name: "Trade-offs (cours)", file: "UNIT_19_04_Tradeoff.pptx", tag: "REF" },
    { name: "Benchmark (cours)", file: "BENCHMARK.pptx", tag: "REF" },
    { name: "Big O (cours)", file: "BIG_O.pptx", tag: "REF" },
    { name: "Cours Big O complet", file: "Cours_Big_O.pptx", tag: "REF" },
    { name: "Big O Debutants", file: "Cours_Big_O_Debutants_1.pptx", tag: "REF" },
  ]},
  { cat: "Java & Exercices", color: "#DC2626", items: [
    { name: "POO Rappels", file: "Programmation_Orientee_Objet_Rappels.pptx", tag: "JAVA" },
    { name: "Exercices Entreprise Java", file: "Exercices_Entreprise_Contextes_Java_2.pptx", tag: "JAVA" },
  ]},
  { cat: "Supplements", color: "#64748B", items: [
    { name: "Ch.5 Supplement", file: "Ch5_SUPPLEMENT.pptx", tag: "SUP" },
    { name: "Ch.6 Supplement", file: "Ch6_SUPPLEMENT.pptx", tag: "SUP" },
    { name: "Ch.7 Supplement", file: "Ch7_SUPPLEMENT.pptx", tag: "SUP" },
    { name: "Ch.8 Supplement", file: "Ch8_SUPPLEMENT.pptx", tag: "SUP" },
    { name: "Ch.9 Supplement", file: "Ch9_SUPPLEMENT.pptx", tag: "SUP" },
    { name: "Ch.10 Supplement", file: "Ch10_SUPPLEMENT.pptx", tag: "SUP" },
    { name: "Ch.11 Supplement", file: "Ch11_SUPPLEMENT.pptx", tag: "SUP" },
    { name: "Ch.12 Supplement", file: "Ch12_SUPPLEMENT.pptx", tag: "SUP" },
    { name: "Ch.13 Supplement", file: "Ch13_SUPPLEMENT.pptx", tag: "SUP" },
    { name: "Ch.14 Supplement", file: "Ch14_SUPPLEMENT.pptx", tag: "SUP" },
  ]},
];

const FICHES = ["Ch1_Fiche_Memo_ADT","Ch2_Fiche_Memo_Memory_Stack","Ch3_Fiche_Memo_FIFO_Sorting","Ch4_Fiche_Memo_Shortest_Path","Ch5_Fiche_Memo_Notation_Formelle","Ch6_Fiche_Memo_Encapsulation","Ch7_Fiche_Memo_ADT_POO","Ch8_Fiche_Memo_Design_Patterns","Ch8_Fiche_Memo_LinkedList_HashMap","Ch9_Fiche_Memo_Tree_Sorting","Ch10_Fiche_Memo_Exceptions_JUnit","Ch11_Fiche_Memo_ADT_BigO","Ch12_Fiche_Memo_Asymptotic","Ch13_Fiche_Memo_Efficiency","Ch14_Fiche_Memo_Tradeoffs"];

const TC: Record<string,string> = {P1:"#F59E0B",P2:"#F59E0B",P3:"#F59E0B","P4a":"#F59E0B","P4b":"#F59E0B",P5:"#F59E0B",P6:"#F59E0B",P7:"#F59E0B","M1/M2":"#0891B2",M3:"#0891B2","M4/D3":"#0891B2","M5/D4":"#0891B2",D1:"#7C3AED",D2:"#7C3AED",REF:"#DC2626",JAVA:"#DC2626",SUP:"#64748B"};

export default function CoursPage() {
  const { user, student, loading, isTeacher } = useAuth();
  const [search, setSearch] = useState("");

  if (loading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Chargement...</div>;
  if (!user) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  const q = search.toLowerCase();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1rem 1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Documents & Cours</h1>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>{isTeacher ? "52 PPTX + 15 fiches memo — tout telecharger" : "15 fiches memo recapitulatives"}</p>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
          style={{ width: "100%", padding: "10px 14px", background: C.card, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 14, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />

        {!isTeacher && (
          <div style={{ padding: "10px 14px", background: C.gold + "10", border: "1px solid " + C.gold + "30", borderRadius: 8, marginBottom: 16, fontSize: 12, color: C.gold }}>
            Eleve : acces aux fiches memo uniquement. Les presentations PPTX sont reservees au professeur.
          </div>
        )}

        {isTeacher && DOCS.map((sec, si) => {
          const items = sec.items.filter(d => !q || d.name.toLowerCase().includes(q));
          if (!items.length) return null;
          return (
            <div key={si} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: sec.color, marginBottom: 8 }}>{sec.cat}</div>
              <div style={{ display: "grid", gap: 6 }}>
                {items.map((d, di) => (
                  <a key={di} href={"/docs/pptx/" + d.file} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.card, border: "1px solid " + C.border, borderRadius: 8, textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: TC[d.tag] || C.gold, padding: "2px 8px", background: (TC[d.tag] || C.gold) + "15", borderRadius: 4 }}>{d.tag}</span>
                      <span style={{ fontSize: 13, color: C.text }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 10, color: C.accent, fontWeight: 600 }}>PPTX</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.success, marginBottom: 8 }}>Fiches memo PDF (15)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {FICHES.filter(f => !q || f.toLowerCase().includes(q)).map((f, i) => (
              <a key={i} href={"/fiches/" + f + ".pdf"} target="_blank" rel="noopener noreferrer"
                style={{ padding: "8px 10px", background: C.card, border: "1px solid " + C.border, borderRadius: 6, textDecoration: "none", fontSize: 12, color: C.success, textAlign: "center" }}>
                {f.replace("_Fiche_Memo_", " ").replace(/_/g, " ")}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
