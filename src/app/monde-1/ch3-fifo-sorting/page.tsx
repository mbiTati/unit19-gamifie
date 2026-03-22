"use client";
import { useState, useEffect, useRef, useCallback } from "react";

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Bubble Sort with step tracking
async function* bubbleSortGen(arr: number[]): AsyncGenerator<{ arr: number[]; comparisons: number; swaps: number; i: number; j: number }> {
  const a = [...arr];
  let comparisons = 0, swaps = 0;
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      comparisons++;
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
      }
      yield { arr: [...a], comparisons, swaps, i, j };
    }
  }
}

// Quick Sort with step tracking
async function* quickSortGen(arr: number[]): AsyncGenerator<{ arr: number[]; comparisons: number; swaps: number; pivot: number }> {
  const a = [...arr];
  let comparisons = 0, swaps = 0;

  async function* qs(lo: number, hi: number): AsyncGenerator<{ arr: number[]; comparisons: number; swaps: number; pivot: number }> {
    if (lo >= hi) return;
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        swaps++;
        i++;
      }
      yield { arr: [...a], comparisons, swaps, pivot };
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    swaps++;
    yield { arr: [...a], comparisons, swaps, pivot };
    yield* qs(lo, i - 1);
    yield* qs(i + 1, hi);
  }

  yield* qs(0, a.length - 1);
}

function BarChart({ arr, maxVal, color, highlight }: { arr: number[]; maxVal: number; color: string; highlight?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 1, height: 120 }}>
      {arr.map((v, i) => (
        <div key={i} style={{
          flex: 1, background: i === highlight ? "#DC2626" : color,
          height: `${(v / maxVal) * 100}%`, borderRadius: "2px 2px 0 0",
          transition: "height 0.05s",
          minWidth: 2,
        }} />
      ))}
    </div>
  );
}

// Queue game component
function QueueGame() {
  const [queue, setQueue] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const enqueue = () => {
    if (!input.trim()) return;
    setQueue((q) => [...q, input.trim()]);
    setLog((l) => [...l, `enqueue("${input.trim()}") → ajouté en fin`]);
    setScore((s) => s + 5);
    setInput("");
  };

  const dequeue = () => {
    if (queue.length === 0) {
      setLog((l) => [...l, "dequeue() → ERREUR : file vide !"]);
      return;
    }
    const removed = queue[0];
    setQueue((q) => q.slice(1));
    setLog((l) => [...l, `dequeue() → "${removed}" retiré du début`]);
    setScore((s) => s + 5);
  };

  const peek = () => {
    if (queue.length === 0) {
      setLog((l) => [...l, "peek() → ERREUR : file vide !"]);
      return;
    }
    setLog((l) => [...l, `peek() → "${queue[0]}" (sans retirer)`]);
    setScore((s) => s + 2);
  };

  return (
    <div>
      <div style={{ fontSize: 13, color: "#0891B2", fontWeight: 600, marginBottom: 8 }}>Score : {score} pts</div>

      {/* Visual queue */}
      <div style={{ display: "flex", gap: 4, minHeight: 50, alignItems: "center", padding: "8px 0", overflowX: "auto" }}>
        {queue.length === 0 ? (
          <span style={{ color: "#94A3B8", fontStyle: "italic", fontSize: 14 }}>(file vide)</span>
        ) : (
          queue.map((item, i) => (
            <div key={i} style={{
              background: i === 0 ? "#DC2626" : "#0891B2",
              color: "white", padding: "8px 14px", borderRadius: 8,
              fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" as const,
            }}>
              {item} {i === 0 && "← front"}
            </div>
          ))
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, margin: "12px 0", flexWrap: "wrap" as const }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enqueue()}
          placeholder="Nom du client..." style={{ flex: 1, minWidth: 140, padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14 }} />
        <button onClick={enqueue} style={{ padding: "8px 16px", background: "#16A34A", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>enqueue()</button>
        <button onClick={dequeue} style={{ padding: "8px 16px", background: "#DC2626", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>dequeue()</button>
        <button onClick={peek} style={{ padding: "8px 16px", background: "#0891B2", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>peek()</button>
      </div>

      {/* Log */}
      <div style={{ background: "#1E293B", borderRadius: 8, padding: "8px 12px", maxHeight: 120, overflowY: "auto" as const }}>
        {log.length === 0 ? (
          <div style={{ color: "#64748B", fontSize: 12, fontStyle: "italic" }}>Les opérations apparaissent ici...</div>
        ) : (
          log.slice(-6).map((l, i) => (
            <div key={i} style={{ fontSize: 12, color: l.includes("ERREUR") ? "#F87171" : "#94A3B8", fontFamily: "Consolas, monospace" }}>{l}</div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Ch3Game() {
  const [mode, setMode] = useState<"menu" | "race" | "queue">("menu");
  const [bubbleArr, setBubbleArr] = useState<number[]>([]);
  const [quickArr, setQuickArr] = useState<number[]>([]);
  const [bubbleStats, setBubbleStats] = useState({ comparisons: 0, swaps: 0 });
  const [quickStats, setQuickStats] = useState({ comparisons: 0, swaps: 0 });
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [size, setSize] = useState(30);
  const cancelRef = useRef(false);

  const startRace = useCallback(async () => {
    const arr = generateArray(size);
    setBubbleArr([...arr]);
    setQuickArr([...arr]);
    setBubbleStats({ comparisons: 0, swaps: 0 });
    setQuickStats({ comparisons: 0, swaps: 0 });
    setRunning(true);
    setFinished(false);
    cancelRef.current = false;

    const speed = size <= 20 ? 80 : size <= 40 ? 30 : 10;

    // Run both sorts "simultaneously" by interleaving
    const bGen = bubbleSortGen([...arr]);
    const qGen = quickSortGen([...arr]);
    let bDone = false, qDone = false;

    while ((!bDone || !qDone) && !cancelRef.current) {
      if (!bDone) {
        const bStep = await bGen.next();
        if (bStep.done) { bDone = true; }
        else { setBubbleArr(bStep.value.arr); setBubbleStats({ comparisons: bStep.value.comparisons, swaps: bStep.value.swaps }); }
      }
      if (!qDone) {
        const qStep = await qGen.next();
        if (qStep.done) { qDone = true; }
        else { setQuickArr(qStep.value.arr); setQuickStats({ comparisons: qStep.value.comparisons, swaps: qStep.value.swaps }); }
      }
      await sleep(speed);
    }

    setRunning(false);
    setFinished(true);
  }, [size]);

  if (mode === "menu") {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 14, color: "#D97706", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 1 — Chapitre 3</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1B2A4A", margin: "0.5rem 0" }}>FIFO Queue + Sorting</h1>
          <p style={{ color: "#64748B", fontSize: 16 }}>Critères M1 et M2</p>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <button onClick={() => setMode("queue")} style={{ padding: "1.5rem", border: "2px solid #0891B2", borderRadius: 12, background: "#E0F7FA", cursor: "pointer", textAlign: "left" as const }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#0891B2" }}>Jeu 1 — Simulateur de Queue FIFO</div>
            <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Manipulez une file d'attente : enqueue, dequeue, peek</div>
          </button>
          <button onClick={() => setMode("race")} style={{ padding: "1.5rem", border: "2px solid #D97706", borderRadius: 12, background: "#FAEEDA", cursor: "pointer", textAlign: "left" as const }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#D97706" }}>Jeu 2 — Course de tri : Bubble vs Quick</div>
            <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Visualisez en temps réel la différence de performance</div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "queue") {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <button onClick={() => setMode("menu")} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 12 }}>← Retour</button>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0891B2", marginBottom: 12 }}>Simulateur de Queue FIFO</h2>
        <p style={{ fontSize: 14, color: "#64748B", marginBottom: 16 }}>Ajoutez des clients et servez-les dans l'ordre FIFO</p>
        <QueueGame />
      </div>
    );
  }

  // Race mode
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <button onClick={() => { cancelRef.current = true; setMode("menu"); }} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 12 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#D97706", marginBottom: 4 }}>Course de tri : Bubble vs Quick</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: "#64748B" }}>Taille :</label>
        <input type="range" min={10} max={80} value={size} onChange={(e) => setSize(Number(e.target.value))} disabled={running} style={{ flex: 1 }} />
        <span style={{ fontSize: 14, fontWeight: 600, minWidth: 30 }}>{size}</span>
        <button onClick={startRace} disabled={running}
          style={{ padding: "8px 20px", background: running ? "#94A3B8" : "#D97706", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: running ? "default" : "pointer", fontSize: 14 }}>
          {running ? "En cours..." : "Lancer !"}
        </button>
      </div>

      {/* Bubble Sort */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#DC2626" }}>Bubble Sort — O(n²)</span>
          <span style={{ fontSize: 12, color: "#64748B" }}>{bubbleStats.comparisons} comparaisons | {bubbleStats.swaps} échanges</span>
        </div>
        <BarChart arr={bubbleArr} maxVal={100} color="#FCA5A5" />
      </div>

      {/* Quick Sort */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#16A34A" }}>Quick Sort — O(n log n)</span>
          <span style={{ fontSize: 12, color: "#64748B" }}>{quickStats.comparisons} comparaisons | {quickStats.swaps} échanges</span>
        </div>
        <BarChart arr={quickArr} maxVal={100} color="#86EFAC" />
      </div>

      {finished && (
        <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: "1rem", textAlign: "center" as const }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#166534" }}>
            Quick Sort : {quickStats.comparisons} comparaisons vs Bubble Sort : {bubbleStats.comparisons}
          </div>
          <div style={{ fontSize: 14, color: "#166534", marginTop: 4 }}>
            Quick Sort est {Math.round(bubbleStats.comparisons / Math.max(quickStats.comparisons, 1))}x plus rapide !
          </div>
        </div>
      )}
    </div>
  );
}
