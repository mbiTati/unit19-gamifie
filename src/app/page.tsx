"use client";
import Link from "next/link";

const BG = "#0B1120";
const CARD = "#111827";
const BORDER = "#1E3A5F";
const TEXT = "#E2E8F0";
const MUTED = "#94A3B8";
const DIM = "#64748B";
const ACCENT = "#00A896";
const ORANGE = "#F97316";
const PURPLE = "#7C3AED";
const RED = "#DC2626";
const BLUE = "#3B82F6";
const GREEN = "#16A34A";
const TEAL = "#0891B2";

interface Module {
  num: number;
  name: string;
  criteria: string;
  game: string;
  exercise?: string;
  type: "quiz" | "simulator" | "race" | "builder" | "debug" | "boss";
  description: string;
}

interface World {
  id: number;
  name: string;
  title: string;
  lo: string;
  emoji: string;
  color: string;
  glow: string;
  modules: Module[];
  boss: { route: string; name: string };
}

const WORLDS: World[] = [
  {
    id: 1, name: "Monde 1", title: "Explorer les ADT", lo: "LO1", emoji: "🗺️", color: PURPLE, glow: "#7C3AED30",
    modules: [
      { num: 1, name: "Design Specification", criteria: "P1", game: "/monde-1/ch1-design-spec", exercise: "/exercice/ch1", type: "quiz", description: "Associez les opérations aux bons ADT" },
      { num: 2, name: "Memory Stack", criteria: "P2", game: "/monde-1/ch2-memory-stack", exercise: "/exercice/ch2", type: "simulator", description: "Simulez le call stack pas à pas" },
      { num: 3, name: "Queue FIFO + Tri", criteria: "M1/M2", game: "/monde-1/ch3-fifo-sorting", exercise: "/exercice/ch3", type: "race", description: "Tri visuel animé, course d'algos, simulateur FIFO" },
      { num: 4, name: "Shortest Path", criteria: "D1", game: "/monde-1/ch4-shortest-path", exercise: "/exercice/ch4", type: "simulator", description: "Trouvez le chemin avec Dijkstra" },
    ],
    boss: { route: "/monde-1/boss-lo1", name: "Boss LO1" },
  },
  {
    id: 2, name: "Monde 2", title: "Spécification & Conception", lo: "LO2", emoji: "📜", color: TEAL, glow: "#0891B230",
    modules: [
      { num: 5, name: "Spec formelle & VDM/SDL", criteria: "P3", game: "/monde-2/ch5-formal-spec", exercise: "/exercice/ch5", type: "builder", description: "Notation impérative, VDM, SDL, ASN.1 + classifier les conditions" },
      { num: 6, name: "Encapsulation & Interfaces", criteria: "M3", game: "/monde-2/ch6-encapsulation", exercise: "/exercice/ch6", type: "simulator", description: "Simulateur visuel, info hiding, interfaces, héritage" },
      { num: 7, name: "ADT → POO & Conditions", criteria: "D2", game: "/monde-2/ch7-adt-oop", exercise: "/exercice/ch7", type: "quiz", description: "5 arguments, pré/post/error conditions" },
      { num: 8, name: "Design Patterns", criteria: "M3", game: "/monde-2/ch8-design-patterns", exercise: "/exercice/ch8", type: "quiz", description: "Singleton, Factory, Observer, Strategy, Composite" },
    ],
    boss: { route: "/monde-2/boss-lo2", name: "Boss LO2" },
  },
  {
    id: 3, name: "Monde 3", title: "Implémenter", lo: "LO3", emoji: "⚙️", color: ORANGE, glow: "#F9731630",
    modules: [
      { num: 8, name: "LinkedList + HashMap", criteria: "P4a", game: "/monde-3/ch8-linkedlist-hashmap", exercise: "/exercice/ch8", type: "simulator", description: "Manipulez les structures en temps réel" },
      { num: 9, name: "Tree + Sorting", criteria: "P4b", game: "/monde-3/ch9-queue-tree-sort", exercise: "/exercice/ch9", type: "simulator", description: "Parcours d'arbre + tri pas à pas" },
      { num: 10, name: "Exceptions + JUnit 5", criteria: "P5", game: "/monde-3/ch10-exceptions-junit", exercise: "/exercice/ch10", type: "debug", description: "Chassez les bugs + quiz JUnit 5" },
      { num: 11, name: "ADT + Big O", criteria: "M4/D3", game: "/monde-3/ch11-adt-bigo", exercise: "/exercice/ch11", type: "quiz", description: "Identifiez la complexité du code" },
    ],
    boss: { route: "/monde-3/boss-lo3", name: "Boss LO3" },
  },
  {
    id: 4, name: "Monde 4", title: "Évaluer l'efficacité", lo: "LO4", emoji: "📊", color: GREEN, glow: "#16A34A30",
    modules: [
      { num: 12, name: "Analyse asymptotique", criteria: "P6", game: "/monde-4/ch12-asymptotic", exercise: "/exercice/ch12", type: "simulator", description: "Classer, Code→O(), Calculateur visuel, Quiz Big O" },
      { num: 13, name: "Mesurer l'efficacité", criteria: "P7", game: "/monde-4/ch13-efficiency", exercise: "/exercice/ch13", type: "quiz", description: "Benchmark temps + mémoire" },
      { num: 14, name: "Trade-offs & Benchmarks", criteria: "M5/D4", game: "/monde-4/ch14-tradeoffs", exercise: "/exercice/ch14", type: "simulator", description: "Balance trade-off, benchmark simulé, compromis" },
    ],
    boss: { route: "/monde-4/boss-lo4", name: "Boss LO4" },
  },
];

const typeIcons: Record<string, string> = {
  quiz: "❓", simulator: "🔬", race: "🏁", builder: "🔧", debug: "🐛", boss: "👾",
};
const typeLabels: Record<string, string> = {
  quiz: "Quiz", simulator: "Simulateur", race: "Course", builder: "Constructeur", debug: "Debugging", boss: "Boss",
};

function ModuleCard({ m, color }: { m: Module; color: string }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{typeIcons[m.type]}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>Ch.{m.num} — {m.name}</div>
          <div style={{ fontSize: 11, color: DIM, marginTop: 1 }}>
            <span style={{ color, fontWeight: 600 }}>{m.criteria}</span> · {typeLabels[m.type]}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.4, marginBottom: 10 }}>{m.description}</div>
      <div style={{ display: "flex", gap: 6 }}>
        <Link href={m.game} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px", borderRadius: 8, background: `${color}15`, border: `1px solid ${color}30`, color, fontWeight: 600, fontSize: 12, textDecoration: "none" }}>
          🎮 Mini-jeu
        </Link>
        {m.exercise && (
          <Link href={m.exercise} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px", borderRadius: 8, background: `${TEAL}15`, border: `1px solid ${TEAL}30`, color: TEAL, fontWeight: 600, fontSize: 12, textDecoration: "none" }}>
            ✏️ Exercice
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif", color: TEXT }}>
      {/* HERO */}
      <div style={{ textAlign: "center" as const, padding: "2.5rem 1rem 2rem", marginBottom: "1.5rem", borderRadius: 16, background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)", border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 8 }}>🏰</div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" as const, color: ACCENT }}>Unit 19 — Data Structures & Algorithms</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0.5rem 0", color: "white" }}>Aventure Gamifiée</h1>
        <p style={{ color: MUTED, fontSize: 14, maxWidth: 480, margin: "0.5rem auto 1rem" }}>Explorez 4 mondes, maîtrisez 14 chapitres, affrontez les boss !</p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const, marginTop: 16 }}>
          {[
            { n: "14", l: "chapitres", c: BLUE },
            { n: "15", l: "mini-jeux", c: ORANGE },
            { n: "5", l: "boss fights", c: RED },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" as const }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.c }}>{s.n}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PIPELINE */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" as const, fontSize: 12 }}>
        {WORLDS.map((w, i) => (
          <span key={w.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: `${w.color}20`, color: w.color, padding: "3px 10px", borderRadius: 6, fontWeight: 600, fontSize: 11 }}>{w.emoji} {w.lo}</span>
            {i < WORLDS.length - 1 && <span style={{ color: DIM }}>→</span>}
          </span>
        ))}
        <span style={{ color: DIM }}>→</span>
        <span style={{ background: `${RED}20`, color: RED, padding: "3px 10px", borderRadius: 6, fontWeight: 600, fontSize: 11 }}>👑 Final</span>
      </div>

      {/* WORLDS */}
      <div style={{ display: "grid", gap: 20 }}>
        {WORLDS.map(w => (
          <div key={w.id} style={{ borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: `0 0 24px ${w.glow}` }}>
            {/* World header */}
            <div style={{ padding: "16px 18px", background: `linear-gradient(135deg, ${w.color}10, ${w.color}05)`, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>{w.emoji}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: w.color }}>{w.name}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{w.title} — {w.lo}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: DIM, textAlign: "right" as const }}>
                {w.modules.length} chapitres
              </div>
            </div>

            {/* Module cards grid */}
            <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
              {w.modules.map(m => <ModuleCard key={m.num} m={m} color={w.color} />)}
            </div>

            {/* Boss button */}
            <div style={{ padding: "0 14px 14px" }}>
              <Link href={w.boss.route} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, background: `linear-gradient(135deg, ${w.color}15, ${w.color}08)`, border: `1px dashed ${w.color}50`, textDecoration: "none", color: w.color, fontWeight: 700, fontSize: 14, transition: "background 0.2s" }}>
                <span style={{ fontSize: 20 }}>👾</span> {w.boss.name} — Affronter le boss
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* BOSS FINAL */}
      <Link href="/boss-final" style={{ display: "block", marginTop: 20, borderRadius: 16, overflow: "hidden", border: `1px solid ${RED}`, textDecoration: "none", textAlign: "center" as const, padding: "2rem", background: `linear-gradient(135deg, ${RED}15, ${ORANGE}15)`, boxShadow: `0 0 40px ${RED}25` }}>
        <div style={{ fontSize: 48 }}>👑</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginTop: 8 }}>Boss Final</div>
        <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>20 questions — LO1 à LO4 — 4 minutes — Streak bonus</div>
        <div style={{ display: "inline-block", marginTop: 14, padding: "10px 28px", background: RED, color: "white", borderRadius: 10, fontWeight: 700, fontSize: 15 }}>Commencer</div>
      </Link>

      {/* FOOTER */}
      <div style={{ textAlign: "center" as const, marginTop: "2rem", padding: "1rem", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 12, color: DIM }}>Mme MBI — Bachelor 2 — Unit 19 : Data Structures & Algorithms</div>
      </div>
    </div>
  );
}
