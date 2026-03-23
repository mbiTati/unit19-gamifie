"use client";
import Link from "next/link";
import { useState, useCallback } from "react";

interface Node { id: string; x: number; y: number; }
interface Edge { from: string; to: string; weight: number; }
interface GraphScenario { title: string; description: string; nodes: Node[]; edges: Edge[]; start: string; end: string; }

const SCENARIOS: GraphScenario[] = [
  {
    title: "Réseau de métro simplifié",
    description: "Trouvez le chemin le plus court de A à F dans ce réseau de métro.",
    nodes: [
      { id: "A", x: 50, y: 150 }, { id: "B", x: 180, y: 50 }, { id: "C", x: 180, y: 250 },
      { id: "D", x: 350, y: 50 }, { id: "E", x: 350, y: 250 }, { id: "F", x: 500, y: 150 },
    ],
    edges: [
      { from: "A", to: "B", weight: 4 }, { from: "A", to: "C", weight: 2 },
      { from: "B", to: "D", weight: 5 }, { from: "C", to: "B", weight: 1 },
      { from: "C", to: "E", weight: 3 }, { from: "D", to: "F", weight: 2 },
      { from: "E", to: "D", weight: 1 }, { from: "E", to: "F", weight: 6 },
    ],
    start: "A", end: "F",
  },
  {
    title: "Réseau routier entre villes",
    description: "GPS : trouvez le trajet le plus court de Paris à Nice.",
    nodes: [
      { id: "Paris", x: 80, y: 50 }, { id: "Lyon", x: 250, y: 80 }, { id: "Marseille", x: 350, y: 250 },
      { id: "Toulouse", x: 100, y: 250 }, { id: "Nice", x: 500, y: 200 }, { id: "Dijon", x: 280, y: 20 },
    ],
    edges: [
      { from: "Paris", to: "Lyon", weight: 5 }, { from: "Paris", to: "Dijon", weight: 3 },
      { from: "Paris", to: "Toulouse", weight: 7 }, { from: "Dijon", to: "Lyon", weight: 2 },
      { from: "Lyon", to: "Marseille", weight: 3 }, { from: "Lyon", to: "Nice", weight: 5 },
      { from: "Toulouse", to: "Marseille", weight: 4 }, { from: "Marseille", to: "Nice", weight: 2 },
    ],
    start: "Paris", end: "Nice",
  },
];

function dijkstra(nodes: Node[], edges: Edge[], start: string, end: string) {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();
  const steps: { current: string; distances: Record<string, number>; visited: string[]; description: string }[] = [];

  nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
  dist[start] = 0;

  while (visited.size < nodes.length) {
    let current = "";
    let minDist = Infinity;
    for (const n of nodes) {
      if (!visited.has(n.id) && dist[n.id] < minDist) {
        minDist = dist[n.id];
        current = n.id;
      }
    }
    if (!current) break;
    visited.add(current);

    const neighbors = edges.filter(e => e.from === current);
    for (const edge of neighbors) {
      const alt = dist[current] + edge.weight;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = current;
      }
    }

    steps.push({
      current,
      distances: { ...dist },
      visited: Array.from(visited),
      description: current === start
        ? `Départ de ${start}. Distance = 0.`
        : `Visite ${current} (distance = ${dist[current]}). Mise à jour des voisins.`,
    });
  }

  const path: string[] = [];
  let c: string | null = end;
  while (c) { path.unshift(c); c = prev[c]; }

  return { path, distance: dist[end], steps };
}

export default function Ch4Game() {
  const [scenarioIdx, setScenarioIdx] = useState<number | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof dijkstra> | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userGuess, setUserGuess] = useState("");
  const [guessResult, setGuessResult] = useState<"correct" | "wrong" | null>(null);

  const startScenario = useCallback((idx: number) => {
    setScenarioIdx(idx);
    setStepIdx(0);
    setShowResult(false);
    setUserGuess("");
    setGuessResult(null);
    const sc = SCENARIOS[idx];
    setResult(dijkstra(sc.nodes, sc.edges, sc.start, sc.end));
  }, []);

  if (scenarioIdx === null) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{padding:"8px 0 0"}}><Link href="/" style={{fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Retour accueil</Link></div>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 14, color: "#7C3AED", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 1 — Chapitre 4</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1B2A4A", margin: "0.5rem 0" }}>Shortest Path — Dijkstra</h1>
          <p style={{ color: "#64748B", fontSize: 16 }}>Critère D1 — Algorithmes de plus court chemin</p>
          <a href="/fiches/Ch4_Fiche_Memo_Shortest_Path.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {SCENARIOS.map((sc, i) => (
            <button key={i} onClick={() => startScenario(i)} style={{ padding: "1.5rem", border: "2px solid #7C3AED", borderRadius: 12, background: "#EDE9FE", cursor: "pointer", textAlign: "left" as const }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#7C3AED" }}>{sc.title}</div>
              <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>{sc.description}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const sc = SCENARIOS[scenarioIdx];
  const step = result?.steps[stepIdx];
  const isLastStep = result ? stepIdx >= result.steps.length - 1 : false;

  return (
    <div style={{ maxWidth: 750, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <button onClick={() => setScenarioIdx(null)} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 8 }}>← Retour</button>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1B2A4A", marginBottom: 4 }}>{sc.title}</h2>
      <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, marginBottom: 12 }}>
        <div style={{ height: 4, background: "#7C3AED", borderRadius: 2, width: `${((stepIdx + 1) / (result?.steps.length || 1)) * 100}%`, transition: "width 0.3s" }} />
      </div>

      {/* Graph SVG */}
      <svg viewBox="0 0 580 300" style={{ width: "100%", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", marginBottom: 12 }}>
        {sc.edges.map((e, i) => {
          const from = sc.nodes.find(n => n.id === e.from)!;
          const to = sc.nodes.find(n => n.id === e.to)!;
          const inPath = showResult && result?.path.includes(e.from) && result?.path.includes(e.to) && Math.abs(result.path.indexOf(e.from) - result.path.indexOf(e.to)) === 1;
          return (
            <g key={i}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={inPath ? "#7C3AED" : "#CBD5E1"} strokeWidth={inPath ? 3 : 1.5} />
              <text x={(from.x + to.x) / 2 + 8} y={(from.y + to.y) / 2 - 8} fontSize={12} fill="#F97316" fontWeight={600}>{e.weight}</text>
            </g>
          );
        })}
        {sc.nodes.map((n) => {
          const isVisited = step?.visited.includes(n.id);
          const isCurrent = step?.current === n.id;
          const isStart = n.id === sc.start;
          const isEnd = n.id === sc.end;
          const inFinalPath = showResult && result?.path.includes(n.id);
          let fill = "#E2E8F0";
          if (inFinalPath) fill = "#7C3AED";
          else if (isCurrent) fill = "#F97316";
          else if (isVisited) fill = "#16A34A";
          else if (isStart) fill = "#2563EB";
          else if (isEnd) fill = "#DC2626";
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={22} fill={fill} stroke="#1B2A4A" strokeWidth={1} />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={11} fill="white" fontWeight={700}>{n.id}</text>
              {step && step.distances[n.id] !== undefined && (
                <text x={n.x} y={n.y + 38} textAnchor="middle" fontSize={10} fill="#64748B">
                  {step.distances[n.id] === Infinity ? "∞" : step.distances[n.id]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#64748B", marginBottom: 12, flexWrap: "wrap" as const }}>
        <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#2563EB", marginRight: 4 }} />Départ</span>
        <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#DC2626", marginRight: 4 }} />Arrivée</span>
        <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#F97316", marginRight: 4 }} />En cours</span>
        <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#16A34A", marginRight: 4 }} />Visité</span>
      </div>

      {/* Step explanation */}
      {step && !showResult && (
        <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#166534" }}>Étape {stepIdx + 1} : {step.description}</div>
        </div>
      )}

      {/* Controls */}
      {!showResult ? (
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0}
            style={{ padding: "8px 20px", border: "1px solid #E2E8F0", borderRadius: 8, background: "#111827", cursor: stepIdx === 0 ? "default" : "pointer", opacity: stepIdx === 0 ? 0.4 : 1, fontSize: 14, fontWeight: 600 }}>← Précédent</button>
          {isLastStep ? (
            <button onClick={() => setShowResult(true)}
              style={{ padding: "8px 20px", border: "none", borderRadius: 8, background: "#7C3AED", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Voir le résultat</button>
          ) : (
            <button onClick={() => setStepIdx(stepIdx + 1)}
              style={{ padding: "8px 20px", border: "none", borderRadius: 8, background: "#7C3AED", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Suivant →</button>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center" as const }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#7C3AED", marginBottom: 8 }}>
            Chemin : {result?.path.join(" → ")} (distance = {result?.distance})
          </div>
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}>Aviez-vous deviné ? Entrez la distance que vous pensiez :</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <input type="number" value={userGuess} onChange={(e) => setUserGuess(e.target.value)}
                style={{ width: 80, padding: "8px", border: "1px solid #E2E8F0", borderRadius: 8, textAlign: "center" as const, fontSize: 16 }} />
              <button onClick={() => setGuessResult(Number(userGuess) === result?.distance ? "correct" : "wrong")}
                style={{ padding: "8px 16px", background: "#7C3AED", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Vérifier</button>
            </div>
            {guessResult === "correct" && <div style={{ color: "#16A34A", fontWeight: 600, marginTop: 8 }}>Correct !</div>}
            {guessResult === "wrong" && <div style={{ color: "#DC2626", fontWeight: 600, marginTop: 8 }}>La bonne réponse était {result?.distance}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
