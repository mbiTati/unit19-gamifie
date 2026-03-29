"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import { C } from "@/lib/theme";

interface GraphNode { id: string; x: number; y: number; }
interface Edge { from: string; to: string; weight?: number; }

const NODES: GraphNode[] = [
  {id:"A",x:250,y:30},{id:"B",x:120,y:100},{id:"C",x:380,y:100},
  {id:"D",x:60,y:200},{id:"E",x:200,y:200},{id:"F",x:320,y:200},{id:"G",x:440,y:200},
  {id:"H",x:130,y:290},{id:"I",x:370,y:290},
];
const EDGES: Edge[] = [
  {from:"A",to:"B",weight:4},{from:"A",to:"C",weight:3},{from:"B",to:"D",weight:5},{from:"B",to:"E",weight:2},
  {from:"C",to:"F",weight:6},{from:"C",to:"G",weight:1},{from:"D",to:"H",weight:3},{from:"E",to:"H",weight:4},
  {from:"F",to:"I",weight:2},{from:"G",to:"I",weight:7},
];

function getAdj(nodeId: string): string[] {
  const adj: string[] = [];
  for (const e of EDGES) {
    if (e.from === nodeId) adj.push(e.to);
    if (e.to === nodeId) adj.push(e.from);
  }
  return adj;
}

function bfs(start: string): string[] {
  const visited: string[] = [];
  const queue = [start];
  const seen = new Set([start]);
  while (queue.length > 0) {
    const node = queue.shift()!;
    visited.push(node);
    for (const n of getAdj(node)) {
      if (!seen.has(n)) { seen.add(n); queue.push(n); }
    }
  }
  return visited;
}

function dfs(start: string): string[] {
  const visited: string[] = [];
  const stack = [start];
  const seen = new Set([start]);
  while (stack.length > 0) {
    const node = stack.pop()!;
    visited.push(node);
    for (const n of getAdj(node).reverse()) {
      if (!seen.has(n)) { seen.add(n); stack.push(n); }
    }
  }
  return visited;
}

export default function GraphExplorer() {
  const [mode, setMode] = useState<"idle"|"bfs"|"dfs">("idle");
  const [visited, setVisited] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [fullPath, setFullPath] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const startAlgo = (type: "bfs"|"dfs") => {
    const path = type === "bfs" ? bfs("A") : dfs("A");
    setFullPath(path);
    setMode(type);
    setStep(0);
    setVisited([]);
    setRunning(true);
    // Animate step by step
    path.forEach((_, i) => {
      setTimeout(() => {
        setVisited(path.slice(0, i + 1));
        setStep(i + 1);
        if (i === path.length - 1) setRunning(false);
      }, i * 600);
    });
  };

  const reset = () => { setMode("idle"); setVisited([]); setStep(0); setFullPath([]); setRunning(false); };

  const nodePos = (id: string) => NODES.find(n => n.id === id)!;

  return (
    <GameShell title="Graph Explorer" color={C.secondary}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>Visualisez BFS (file) et DFS (pile) sur un graphe</p>

        {/* Graph SVG */}
        <div style={{ background: C.card, borderRadius: 12, padding: "12px", border: "1px solid " + C.border, marginBottom: 12 }}>
          <svg viewBox="0 0 500 320" width="100%" style={{ display: "block" }}>
            {/* Edges */}
            {EDGES.map((e, i) => {
              const from = nodePos(e.from), to = nodePos(e.to);
              const isVisited = visited.includes(e.from) && visited.includes(e.to);
              return (
                <g key={i}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isVisited ? C.gold : C.border} strokeWidth={isVisited ? 3 : 2}
                    style={{ transition: "all 0.4s" }} />
                  {e.weight && <text x={(from.x+to.x)/2+8} y={(from.y+to.y)/2-5}
                    fill={C.dimmed} fontSize="10" textAnchor="middle">{e.weight}</text>}
                </g>
              );
            })}
            {/* Nodes */}
            {NODES.map(n => {
              const idx = visited.indexOf(n.id);
              const isVisited = idx >= 0;
              const isCurrent = idx === visited.length - 1 && running;
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={20}
                    fill={isCurrent ? C.gold : isVisited ? C.accent + "40" : C.card}
                    stroke={isCurrent ? C.gold : isVisited ? C.accent : C.border}
                    strokeWidth={isCurrent ? 3 : 2}
                    style={{ transition: "all 0.3s" }} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle"
                    fill={isCurrent ? C.bg : isVisited ? C.accent : C.text}
                    fontSize="13" fontWeight="bold">{n.id}</text>
                  {isVisited && <text x={n.x} y={n.y - 24} textAnchor="middle"
                    fill={C.gold} fontSize="9" fontWeight="bold">{idx + 1}</text>}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          <button onClick={() => startAlgo("bfs")} disabled={running}
            style={{ padding: "10px", background: C.accent + "15", border: "1px solid " + C.accent + "30", borderRadius: 8, color: C.accent, fontWeight: 600, fontSize: 13, cursor: running ? "wait" : "pointer", opacity: running ? 0.5 : 1 }}>
            BFS (File)
          </button>
          <button onClick={() => startAlgo("dfs")} disabled={running}
            style={{ padding: "10px", background: C.gold + "15", border: "1px solid " + C.gold + "30", borderRadius: 8, color: C.gold, fontWeight: 600, fontSize: 13, cursor: running ? "wait" : "pointer", opacity: running ? 0.5 : 1 }}>
            DFS (Pile)
          </button>
          <button onClick={reset}
            style={{ padding: "10px", background: C.danger + "15", border: "1px solid " + C.danger + "30", borderRadius: 8, color: C.danger, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Reset
          </button>
        </div>

        {/* Info */}
        {mode !== "idle" && (
          <div style={{ padding: "10px 14px", background: (mode === "bfs" ? C.accent : C.gold) + "10", borderRadius: 8, border: "1px solid " + (mode === "bfs" ? C.accent : C.gold) + "30" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: mode === "bfs" ? C.accent : C.gold, marginBottom: 4 }}>
              {mode === "bfs" ? "BFS — Breadth-First Search (Queue FIFO)" : "DFS — Depth-First Search (Stack LIFO)"}
            </div>
            <div style={{ fontSize: 12, color: C.text }}>
              Ordre de visite : {visited.join(" → ")}{running ? " ..." : ""}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
              {mode === "bfs" ? "Explore niveau par niveau. Utilise une Queue (FIFO)." : "Explore en profondeur d'abord. Utilise un Stack (LIFO)."}
            </div>
          </div>
        )}

        {/* Complexity */}
        <div style={{ padding: "10px", background: C.card, borderRadius: 8, border: "1px solid " + C.border, marginTop: 8 }}>
          <div style={{ fontSize: 11, color: C.muted }}>
            BFS et DFS : O(V + E) avec V={NODES.length} sommets et E={EDGES.length} aretes.
            {mode !== "idle" && ` | Etape ${step}/${fullPath.length}`}
          </div>
        </div>
      </div>
    </GameShell>
  );
}
