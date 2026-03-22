"use client";
import Link from "next/link";

const WORLDS = [
  {
    id: 1,
    name: "Monde 1",
    title: "Explorer les ADT et algorithmes",
    lo: "LO1",
    color: "#534AB7",
    bgColor: "#EEEDFE",
    chapters: [
      { id: "ch1-design-spec", name: "Ch.1 — Design Specification (P1)", status: "ready" },
      { id: "ch2-memory-stack", name: "Ch.2 — Memory Stack (P2)", status: "ready" },
      { id: "ch3-fifo-sorting", name: "Ch.3 — FIFO Queue + Sorting (M1/M2)", status: "coming" },
      { id: "ch4-shortest-path", name: "Ch.4 — Shortest Path (D1)", status: "coming" },
    ],
  },
  {
    id: 2,
    name: "Monde 2",
    title: "Notation formelle des ADT",
    lo: "LO2",
    color: "#0F6E56",
    bgColor: "#E1F5EE",
    chapters: [
      { id: "ch5-formal-spec", name: "Ch.5 — Stack impératif (P3)", status: "coming" },
      { id: "ch6-encapsulation", name: "Ch.6 — Encapsulation (M3)", status: "coming" },
      { id: "ch7-adt-oop", name: "Ch.7 — ADT et POO (D2)", status: "coming" },
    ],
  },
  {
    id: 3,
    name: "Monde 3",
    title: "Implémenter les ADT complexes",
    lo: "LO3",
    color: "#993C1D",
    bgColor: "#FAECE7",
    chapters: [
      { id: "ch8-linkedlist-hashmap", name: "Ch.8 — LinkedList + HashMap (P4a)", status: "coming" },
      { id: "ch9-queue-tree-sort", name: "Ch.9 — Queue, Tree, Tri (P4b)", status: "coming" },
      { id: "ch10-exceptions-junit", name: "Ch.10 — Exceptions + JUnit (P5)", status: "coming" },
      { id: "ch11-adt-bigo", name: "Ch.11 — ADT et Big O (M4/D3)", status: "coming" },
    ],
  },
  {
    id: 4,
    name: "Monde 4",
    title: "Évaluer l'efficacité",
    lo: "LO4",
    color: "#854F0B",
    bgColor: "#FAEEDA",
    chapters: [
      { id: "ch12-asymptotic", name: "Ch.12 — Analyse asymptotique (P6)", status: "coming" },
      { id: "ch13-efficiency", name: "Ch.13 — Mesurer l'efficacité (P7)", status: "coming" },
      { id: "ch14-tradeoffs", name: "Ch.14/15 — Trade-offs + Indépendance (M5/D4)", status: "coming" },
    ],
  },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ fontSize: 13, color: "#028090", fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" as const }}>
          Unit 19 — Data Structures & Algorithms
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1B2A4A", margin: "0.5rem 0" }}>
          Aventure Gamifiée
        </h1>
        <p style={{ color: "#64748B", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
          4 mondes, 15 chapitres, de LO1 à LO4. Chaque chapitre = cours + mini-jeu + exercice Java.
        </p>
      </div>

      <div style={{ display: "grid", gap: 24 }}>
        {WORLDS.map((world) => (
          <div
            key={world.id}
            style={{
              border: `2px solid ${world.color}20`,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: world.bgColor,
                padding: "1rem 1.25rem",
                borderBottom: `2px solid ${world.color}20`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: world.color, letterSpacing: 1 }}>
                  {world.name} — {world.lo}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#1B2A4A" }}>{world.title}</div>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: world.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {world.id}
              </div>
            </div>

            <div style={{ padding: "0.75rem 1.25rem" }}>
              {world.chapters.map((ch) => (
                <div
                  key={ch.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.6rem 0",
                    borderBottom: "1px solid #F0F4F8",
                  }}
                >
                  <span style={{ fontSize: 14, color: ch.status === "ready" ? "#1B2A4A" : "#94A3B8" }}>
                    {ch.name}
                  </span>
                  {ch.status === "ready" ? (
                    <Link
                      href={`/monde-${world.id}/${ch.id}`}
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: world.color,
                        textDecoration: "none",
                        padding: "4px 12px",
                        borderRadius: 6,
                        border: `1px solid ${world.color}`,
                      }}
                    >
                      Jouer →
                    </Link>
                  ) : (
                    <span style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic" }}>
                      Bientôt
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem", fontSize: 13, color: "#94A3B8" }}>
        Mme MBI — Bachelor 2 — Programmation Java
      </div>
    </div>
  );
}
