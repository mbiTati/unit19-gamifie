"use client";
import { useState } from "react";

// LinkedList simulator
interface LLNode { value: string; }

function LinkedListGame() {
  const [nodes, setNodes] = useState<LLNode[]>([{ value: "Alice" }, { value: "Bob" }, { value: "Clara" }]);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<string[]>(["Liste initialisée : [Alice, Bob, Clara]"]);
  const [score, setScore] = useState(0);

  const addFirst = () => { if (!input.trim()) return; setNodes([{ value: input.trim() }, ...nodes]); setLog(l => [...l, `addFirst("${input.trim()}") → ajouté en tête`]); setScore(s => s + 5); setInput(""); };
  const addLast = () => { if (!input.trim()) return; setNodes([...nodes, { value: input.trim() }]); setLog(l => [...l, `addLast("${input.trim()}") → ajouté en fin`]); setScore(s => s + 5); setInput(""); };
  const removeFirst = () => { if (nodes.length === 0) { setLog(l => [...l, "removeFirst() → ERREUR : liste vide !"]); return; } const v = nodes[0].value; setNodes(nodes.slice(1)); setLog(l => [...l, `removeFirst() → "${v}" supprimé`]); setScore(s => s + 5); };
  const removeLast = () => { if (nodes.length === 0) { setLog(l => [...l, "removeLast() → ERREUR : liste vide !"]); return; } const v = nodes[nodes.length - 1].value; setNodes(nodes.slice(0, -1)); setLog(l => [...l, `removeLast() → "${v}" supprimé`]); setScore(s => s + 5); };
  const getAt = () => { const idx = parseInt(input); if (isNaN(idx) || idx < 0 || idx >= nodes.length) { setLog(l => [...l, `get(${input}) → ERREUR : index invalide`]); return; } setLog(l => [...l, `get(${idx}) → "${nodes[idx].value}"`]); setScore(s => s + 3); setInput(""); };

  return (
    <div>
      <div style={{ fontSize: 13, color: "#993C1D", fontWeight: 600, marginBottom: 8 }}>Score : {score} pts | Taille : {nodes.length}</div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const, minHeight: 50, alignItems: "center", padding: "8px 0" }}>
        {nodes.length === 0 ? <span style={{ color: "#94A3B8", fontStyle: "italic" }}>(liste vide)</span> : nodes.map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <div style={{ background: i === 0 ? "#993C1D" : "#D85A30", color: "white", padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
              {n.value}
              <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 4 }}>[{i}]</span>
            </div>
            {i < nodes.length - 1 && <span style={{ color: "#D85A30", fontSize: 16 }}>→</span>}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, margin: "10px 0", flexWrap: "wrap" as const }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Valeur ou index..." style={{ flex: 1, minWidth: 120, padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13 }} />
        <button onClick={addFirst} style={{ padding: "6px 10px", background: "#16A34A", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>addFirst</button>
        <button onClick={addLast} style={{ padding: "6px 10px", background: "#16A34A", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>addLast</button>
        <button onClick={removeFirst} style={{ padding: "6px 10px", background: "#DC2626", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>removeFirst</button>
        <button onClick={removeLast} style={{ padding: "6px 10px", background: "#DC2626", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>removeLast</button>
        <button onClick={getAt} style={{ padding: "6px 10px", background: "#2563EB", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>get(i)</button>
      </div>
      <div style={{ background: "#1E293B", borderRadius: 8, padding: "8px 12px", maxHeight: 100, overflowY: "auto" as const }}>
        {log.slice(-5).map((l, i) => <div key={i} style={{ fontSize: 11, color: l.includes("ERREUR") ? "#F87171" : "#94A3B8", fontFamily: "Consolas, monospace" }}>{l}</div>)}
      </div>
    </div>
  );
}

// HashMap simulator
function HashMapGame() {
  const [map, setMap] = useState<Record<string, string>>({ alice: "0612345678", bob: "0698765432" });
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [log, setLog] = useState<string[]>(["HashMap initialisée avec 2 contacts"]);
  const [score, setScore] = useState(0);

  const put = () => { if (!key.trim()) return; const existed = key.trim() in map; setMap({ ...map, [key.trim()]: value.trim() }); setLog(l => [...l, `put("${key.trim()}", "${value.trim()}") → ${existed ? "MIS À JOUR" : "AJOUTÉ"}`]); setScore(s => s + 5); setKey(""); setValue(""); };
  const get = () => { if (!key.trim()) return; const v = map[key.trim()]; setLog(l => [...l, `get("${key.trim()}") → ${v ? `"${v}"` : "null (clé non trouvée)"}`]); setScore(s => s + 3); };
  const remove = () => { if (!key.trim() || !(key.trim() in map)) { setLog(l => [...l, `remove("${key.trim()}") → clé non trouvée`]); return; } const newMap = { ...map }; delete newMap[key.trim()]; setMap(newMap); setLog(l => [...l, `remove("${key.trim()}") → supprimé`]); setScore(s => s + 5); setKey(""); };
  const containsKey = () => { if (!key.trim()) return; setLog(l => [...l, `containsKey("${key.trim()}") → ${key.trim() in map}`]); setScore(s => s + 2); };

  return (
    <div>
      <div style={{ fontSize: 13, color: "#993C1D", fontWeight: 600, marginBottom: 8 }}>Score : {score} pts | Taille : {Object.keys(map).length}</div>
      <div style={{ display: "grid", gap: 4, marginBottom: 10 }}>
        {Object.entries(map).length === 0 ? <span style={{ color: "#94A3B8", fontStyle: "italic" }}>(map vide)</span> : Object.entries(map).map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 4 }}>
            <div style={{ background: "#F97316", color: "white", padding: "4px 10px", borderRadius: "6px 0 0 6px", fontSize: 13, fontWeight: 600, minWidth: 80 }}>{k}</div>
            <div style={{ background: "#028090", color: "white", padding: "4px 10px", borderRadius: "0 6px 6px 0", fontSize: 13, flex: 1 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <input value={key} onChange={e => setKey(e.target.value)} placeholder="Clé..." style={{ flex: 1, padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13 }} />
        <input value={value} onChange={e => setValue(e.target.value)} placeholder="Valeur..." style={{ flex: 1, padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13 }} />
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
        <button onClick={put} style={{ padding: "6px 12px", background: "#16A34A", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>put(k,v)</button>
        <button onClick={get} style={{ padding: "6px 12px", background: "#2563EB", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>get(k)</button>
        <button onClick={remove} style={{ padding: "6px 12px", background: "#DC2626", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>remove(k)</button>
        <button onClick={containsKey} style={{ padding: "6px 12px", background: "#7C3AED", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>containsKey(k)</button>
      </div>
      <div style={{ background: "#1E293B", borderRadius: 8, padding: "8px 12px", maxHeight: 100, overflowY: "auto" as const, marginTop: 8 }}>
        {log.slice(-5).map((l, i) => <div key={i} style={{ fontSize: 11, color: l.includes("non trouvée") ? "#F87171" : "#94A3B8", fontFamily: "Consolas, monospace" }}>{l}</div>)}
      </div>
    </div>
  );
}

export default function Ch8Game() {
  const [mode, setMode] = useState<"menu" | "linkedlist" | "hashmap">("menu");

  if (mode === "menu") {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 14, color: "#993C1D", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 3 — Chapitre 8</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1B2A4A", margin: "0.5rem 0" }}>LinkedList + HashMap</h1>
          <p style={{ color: "#64748B", fontSize: 16 }}>Critère P4a — Implémenter des ADT complexes</p>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <button onClick={() => setMode("linkedlist")} style={{ padding: "1.5rem", border: "2px solid #993C1D", borderRadius: 12, background: "#FAECE7", cursor: "pointer", textAlign: "left" as const }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#993C1D" }}>Jeu 1 — Simulateur LinkedList</div>
            <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Manipulez une liste chaînée : addFirst, addLast, remove, get</div>
          </button>
          <button onClick={() => setMode("hashmap")} style={{ padding: "1.5rem", border: "2px solid #F97316", borderRadius: 12, background: "#FFF7ED", cursor: "pointer", textAlign: "left" as const }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#F97316" }}>Jeu 2 — Simulateur HashMap</div>
            <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Manipulez une table de hachage : put, get, remove, containsKey</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <button onClick={() => setMode("menu")} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 12 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#993C1D", marginBottom: 16 }}>{mode === "linkedlist" ? "Simulateur LinkedList" : "Simulateur HashMap"}</h2>
      {mode === "linkedlist" ? <LinkedListGame /> : <HashMapGame />}
    </div>
  );
}
