"use client";
import Link from "next/link";
import { useState } from "react";

interface Chapter {
  id: string;
  name: string;
  criteria: string;
  pptx?: string;
  supplement?: string;
  game: string;
  exerciseGuide?: string;
  exerciseComplet?: string;
  fiche?: string;
}

interface World {
  id: number;
  name: string;
  title: string;
  lo: string;
  color: string;
  bgColor: string;
  borderColor: string;
  weeks: string;
  chapters: Chapter[];
  boss?: { id: string; name: string; route: string };
}

const WORLDS: World[] = [
  {
    id: 1, name: "Monde 1", title: "Explorer les ADT et algorithmes", lo: "LO1",
    color: "#534AB7", bgColor: "#EEEDFE", borderColor: "#CECBF6", weeks: "Semaines 1-6",
    chapters: [
      { id: "ch1", name: "Design Specification", criteria: "P1", pptx: "/docs/pptx/Ch1_P1_Design_Specification_ADT.pptx", game: "/monde-1/ch1-design-spec", exerciseGuide: "/exercices/ch1/exercice-guide/StudentDirectory.java", exerciseComplet: "/exercices/ch1/exercice-complet/ExerciceBibliotheque.java", fiche: "/fiches/Ch1_Fiche_Memo_ADT.pdf" },
      { id: "ch2", name: "Memory Stack & Calls", criteria: "P2", pptx: "/docs/pptx/Ch2_P2_Memory_Stack_Function_Calls.pptx", game: "/monde-1/ch2-memory-stack", exerciseGuide: "/exercices/ch2/exercice-guide/TraceCallStack.java", exerciseComplet: "/exercices/ch2/exercice-complet/ExerciceRecursion.java", fiche: "/fiches/Ch2_Fiche_Memo_Memory_Stack.pdf" },
      { id: "ch3", name: "FIFO Queue + Sorting", criteria: "M1/M2", pptx: "/docs/pptx/Ch3_M1M2_FIFO_Queue_Sorting.pptx", game: "/monde-1/ch3-fifo-sorting", exerciseGuide: "/exercices/ch3/exercice-guide/QueueCinema.java", exerciseComplet: "/exercices/ch3/exercice-complet/ComparaisonTri.java", fiche: "/fiches/Ch3_Fiche_Memo_FIFO_Sorting.pdf" },
      { id: "ch4", name: "Shortest Path", criteria: "D1", pptx: "/docs/pptx/Ch4_D1_Shortest_Path_BFS_Dijkstra.pptx", game: "/monde-1/ch4-shortest-path", exerciseGuide: "/exercices/ch4/exercice-guide/TraceDijkstra.java", fiche: "/fiches/Ch4_Fiche_Memo_Shortest_Path.pdf" },
    ],
    boss: { id: "boss-lo1", name: "Boss LO1", route: "/monde-1/boss-lo1" },
  },
  {
    id: 2, name: "Monde 2", title: "Notation formelle des ADT", lo: "LO2",
    color: "#0F6E56", bgColor: "#E1F5EE", borderColor: "#9FE1CB", weeks: "Semaines 7-10",
    chapters: [
      { id: "ch5", name: "Stack impératif", criteria: "P3", pptx: "/docs/pptx/Ch5_P3_Formal_Spec_Stack.pptx", supplement: "/docs/pptx/Ch5_SUPPLEMENT.pptx", game: "/monde-2/ch5-formal-spec", exerciseGuide: "/exercices/ch5/exercice-guide/SpecQueue.java", fiche: "/fiches/Ch5_Fiche_Memo_Notation_Formelle.pdf" },
      { id: "ch6", name: "Encapsulation", criteria: "M3", pptx: "/docs/pptx/Ch6_M3_Encapsulation_Information_Hiding.pptx", supplement: "/docs/pptx/Ch6_SUPPLEMENT.pptx", game: "/monde-2/ch6-encapsulation", exerciseGuide: "/exercices/ch6/exercice-guide/EncapsulationGuide.java", exerciseComplet: "/exercices/ch6/exercice-complet/CompteEnBanque.java", fiche: "/fiches/Ch6_Fiche_Memo_Encapsulation.pdf" },
      { id: "ch7", name: "ADT et POO", criteria: "D2", pptx: "/docs/pptx/Ch7_D2_ADT_Base_POO.pptx", supplement: "/docs/pptx/Ch7_SUPPLEMENT.pptx", game: "/monde-2/ch7-adt-oop", exerciseGuide: "/exercices/ch7/exercice-guide/ArgumentationADT.java", exerciseComplet: "/exercices/ch7/exercice-complet/RedactionD2.java", fiche: "/fiches/Ch7_Fiche_Memo_ADT_POO.pdf" },
    ],
    boss: { id: "boss-lo2", name: "Boss LO2", route: "/monde-2/boss-lo2" },
  },
  {
    id: 3, name: "Monde 3", title: "Implémenter les ADT complexes", lo: "LO3",
    color: "#993C1D", bgColor: "#FAECE7", borderColor: "#F5C4B3", weeks: "Semaines 11-18",
    chapters: [
      { id: "ch8", name: "LinkedList + HashMap", criteria: "P4a", pptx: "/docs/pptx/Ch8_P4a_LinkedList_HashMap.pptx", supplement: "/docs/pptx/Ch8_SUPPLEMENT.pptx", game: "/monde-3/ch8-linkedlist-hashmap", exerciseGuide: "/exercices/ch8/exercice-guide/GestionEmployes.java", exerciseComplet: "/exercices/ch8/exercice-complet/GestionPharmacie.java", fiche: "/fiches/Ch8_Fiche_Memo_LinkedList_HashMap.pdf" },
      { id: "ch9", name: "Tree + Sorting", criteria: "P4b", pptx: "/docs/pptx/Ch9_P4b_Tree_Sorting.pptx", supplement: "/docs/pptx/Ch9_SUPPLEMENT.pptx", game: "/monde-3/ch9-queue-tree-sort", exerciseGuide: "/exercices/ch9/exercice-guide/BSTreeGuide.java", fiche: "/fiches/Ch9_Fiche_Memo_Tree_Sorting.pdf" },
      { id: "ch10", name: "Exceptions + JUnit 5", criteria: "P5", pptx: "/docs/pptx/Ch10_P5_Exceptions_JUnit5.pptx", supplement: "/docs/pptx/Ch10_SUPPLEMENT.pptx", game: "/monde-3/ch10-exceptions-junit", exerciseGuide: "/exercices/ch10/exercice-guide/ExceptionsGuide.java", exerciseComplet: "/exercices/ch10/exercice-complet/GestionTicketsTests.java", fiche: "/fiches/Ch10_Fiche_Memo_Exceptions_JUnit.pdf" },
      { id: "ch11", name: "ADT + Big O", criteria: "M4/D3", pptx: "/docs/pptx/Ch11_M4D3_ADT_BigO.pptx", supplement: "/docs/pptx/Ch11_SUPPLEMENT.pptx", game: "/monde-3/ch11-adt-bigo", exerciseGuide: "/exercices/ch11/exercice-guide/AnalyseComplexite.java", fiche: "/fiches/Ch11_Fiche_Memo_ADT_BigO.pdf" },
    ],
    boss: { id: "boss-lo3", name: "Boss LO3", route: "/monde-3/boss-lo3" },
  },
  {
    id: 4, name: "Monde 4", title: "Évaluer l'efficacité", lo: "LO4",
    color: "#854F0B", bgColor: "#FAEEDA", borderColor: "#FAC775", weeks: "Semaines 19-22",
    chapters: [
      { id: "ch12", name: "Analyse asymptotique", criteria: "P6", pptx: "/docs/pptx/Ch12_P6_Asymptotic_Analysis.pptx", supplement: "/docs/pptx/Ch12_SUPPLEMENT.pptx", game: "/monde-4/ch12-asymptotic", exerciseGuide: "/exercices/ch12/exercice-guide/BigOAnalyse.java", fiche: "/fiches/Ch12_Fiche_Memo_Asymptotic.pdf" },
      { id: "ch13", name: "Mesurer l'efficacité", criteria: "P7", pptx: "/docs/pptx/Ch13_P7_Measuring_Efficiency.pptx", supplement: "/docs/pptx/Ch13_SUPPLEMENT.pptx", game: "/monde-4/ch13-efficiency", exerciseGuide: "/exercices/ch13/exercice-guide/BenchmarkJava.java", fiche: "/fiches/Ch13_Fiche_Memo_Efficiency.pdf" },
      { id: "ch14", name: "Trade-offs", criteria: "M5/D4", pptx: "/docs/pptx/Ch14_M5D4_Tradeoffs_Independence.pptx", supplement: "/docs/pptx/Ch14_SUPPLEMENT.pptx", game: "/monde-4/ch14-tradeoffs", exerciseGuide: "/exercices/ch14/exercice-guide/TradeoffAnalyse.java", fiche: "/fiches/Ch14_Fiche_Memo_Tradeoffs.pdf" },
    ],
    boss: { id: "boss-lo4", name: "Boss LO4", route: "/monde-4/boss-lo4" },
  },
];

function Badge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return <span style={{ fontSize: 11, fontWeight: 600, color, background: bg, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" as const }}>{text}</span>;
}

function ResourceBtn({ href, label, icon, color }: { href: string; label: string; icon: string; color: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color, padding: "4px 10px", borderRadius: 6, border: `1px solid ${color}30`, background: `${color}08`, textDecoration: "none", whiteSpace: "nowrap" as const }}>
      <span style={{ fontSize: 14 }}>{icon}</span> {label}
    </a>
  );
}

function ChapterCard({ ch, worldColor, worldId }: { ch: Chapter; worldColor: string; worldId: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${worldColor}20`, borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: open ? `${worldColor}08` : "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge text={ch.criteria} color={worldColor} bg={`${worldColor}15`} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1B2A4A" }}>{ch.name}</span>
        </div>
        <span style={{ color: "#94A3B8", fontSize: 18, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>&#9662;</span>
      </button>
      {open && (
        <div style={{ padding: "8px 14px 14px", display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
          {ch.pptx && <ResourceBtn href={ch.pptx} label="Cours PPTX" icon="&#128218;" color={worldColor} />}
          {ch.supplement && <ResourceBtn href={ch.supplement} label="Supplément" icon="&#128203;" color="#64748B" />}
          <Link href={ch.game} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#DC2626", padding: "4px 10px", borderRadius: 6, border: "1px solid #DC262630", background: "#DC262608", textDecoration: "none", whiteSpace: "nowrap" as const }}>
            <span style={{ fontSize: 14 }}>&#127918;</span> Mini-jeu
          </Link>
          {ch.fiche && <ResourceBtn href={ch.fiche} label="Fiche mémo" icon="&#128196;" color="#7C3AED" />}
          {ch.exerciseGuide && <ResourceBtn href={ch.exerciseGuide} label="Exercice guidé" icon="&#9998;&#65039;" color="#028090" />}
          {ch.exerciseComplet && <ResourceBtn href={ch.exerciseComplet} label="Exercice complet" icon="&#128187;" color="#16A34A" />}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ maxWidth: 850, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem", padding: "2rem 1rem", background: "linear-gradient(135deg, #1B2A4A 0%, #065A82 100%)", borderRadius: 16, color: "white" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" as const, color: "#00A896", marginBottom: 8 }}>Unit 19 — Data Structures & Algorithms</div>
        <h1 style={{ fontSize: 34, fontWeight: 800, margin: "0.3rem 0", color: "white" }}>Aventure Gamifiée</h1>
        <p style={{ fontSize: 15, color: "#94A3B8", maxWidth: 520, margin: "0.5rem auto 0" }}>4 mondes, 14 chapitres, 15 mini-jeux, 14 cours PPTX, 42 exercices Java, 14 fiches mémo</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" as const }}>
          <span style={{ fontSize: 12, color: "#00A896", background: "#00A89620", padding: "4px 12px", borderRadius: 20 }}>&#128218; 24 PPTX</span>
          <span style={{ fontSize: 12, color: "#F97316", background: "#F9731620", padding: "4px 12px", borderRadius: 20 }}>&#127918; 15 jeux</span>
          <span style={{ fontSize: 12, color: "#7C3AED", background: "#7C3AED20", padding: "4px 12px", borderRadius: 20 }}>&#128196; 14 fiches</span>
          <span style={{ fontSize: 12, color: "#16A34A", background: "#16A34A20", padding: "4px 12px", borderRadius: 20 }}>&#128187; 42 Java</span>
          <span style={{ fontSize: 12, color: "#DC2626", background: "#DC262620", padding: "4px 12px", borderRadius: 20 }}>&#128123; 5 boss</span>
        </div>
      </div>

      {/* Worlds */}
      <div style={{ display: "grid", gap: 20 }}>
        {WORLDS.map((world) => (
          <div key={world.id} style={{ border: `2px solid ${world.borderColor}`, borderRadius: 14, overflow: "hidden" }}>
            {/* World header */}
            <div style={{ background: world.bgColor, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: world.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 15 }}>{world.id}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: world.color }}>{world.name} — {world.lo}</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>{world.title}</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{world.weeks}</div>
            </div>

            {/* Chapters */}
            <div style={{ padding: "10px 14px" }}>
              {world.chapters.map((ch) => (
                <ChapterCard key={ch.id} ch={ch} worldColor={world.color} worldId={world.id} />
              ))}

              {/* Boss button */}
              {world.boss && (
                <Link href={world.boss.route} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", marginTop: 4, borderRadius: 8, background: `${world.color}10`, border: `1px dashed ${world.color}40`, textDecoration: "none", color: world.color, fontWeight: 600, fontSize: 14 }}>
                  <span style={{ fontSize: 18 }}>&#128123;</span> {world.boss.name} — Quiz transversal
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Boss Final */}
      <div style={{ marginTop: 20, borderRadius: 14, overflow: "hidden", border: "2px solid #DC2626" }}>
        <Link href="/boss-final" style={{ display: "block", textDecoration: "none", padding: "1.5rem", background: "linear-gradient(135deg, #DC2626, #F97316)", textAlign: "center" as const }}>
          <div style={{ fontSize: 36 }}>&#128081;</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "white", marginTop: 4 }}>Boss Final — Unit 19</div>
          <div style={{ fontSize: 13, color: "white", opacity: 0.9, marginTop: 4 }}>20 questions LO1 à LO4 — 4 minutes — Prouvez que vous maîtrisez tout !</div>
          <div style={{ display: "inline-block", marginTop: 10, padding: "8px 24px", background: "white", color: "#DC2626", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>Affronter le boss</div>
        </Link>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "2rem", padding: "1rem", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ fontSize: 13, color: "#94A3B8" }}>Mme MBI — Bachelor 2 — Programmation Java</div>
        <div style={{ fontSize: 12, color: "#CBD5E1", marginTop: 4 }}>Unit 19 : Data Structures & Algorithms — 22 semaines, 90 périodes</div>
      </div>
    </div>
  );
}
