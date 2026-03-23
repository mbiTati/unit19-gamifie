"use client";
import Link from "next/link";
import { useState } from "react";
import TopBar from "@/components/TopBar";

// Binary tree node
interface TreeNode { value: number; left?: TreeNode; right?: TreeNode; }

const SAMPLE_TREE: TreeNode = {
  value: 10,
  left: { value: 5, left: { value: 2 }, right: { value: 7 } },
  right: { value: 15, left: { value: 12 }, right: { value: 20 } },
};

function inorder(node: TreeNode | undefined): number[] {
  if (!node) return [];
  return [...inorder(node.left), node.value, ...inorder(node.right)];
}
function preorder(node: TreeNode | undefined): number[] {
  if (!node) return [];
  return [node.value, ...preorder(node.left), ...preorder(node.right)];
}
function postorder(node: TreeNode | undefined): number[] {
  if (!node) return [];
  return [...postorder(node.left), ...postorder(node.right), node.value];
}

function TreeVisualizer() {
  const [traversal, setTraversal] = useState<"inorder" | "preorder" | "postorder">("inorder");
  const result = traversal === "inorder" ? inorder(SAMPLE_TREE) : traversal === "preorder" ? preorder(SAMPLE_TREE) : postorder(SAMPLE_TREE);
  const descriptions: Record<string, string> = {
    inorder: "GAUCHE → RACINE → DROITE — donne les éléments triés dans un BST !",
    preorder: "RACINE → GAUCHE → DROITE — utile pour copier l'arbre",
    postorder: "GAUCHE → DROITE → RACINE — utile pour supprimer l'arbre",
  };

  return (
    <div>
      <div style={{ textAlign: "center" as const, marginBottom: 16 }}>
        <svg viewBox="0 0 400 200" style={{ width: "100%", maxWidth: 400 }}>
          {/* Edges */}
          <line x1="200" y1="30" x2="120" y2="80" stroke="#D85A30" strokeWidth="2" />
          <line x1="200" y1="30" x2="280" y2="80" stroke="#D85A30" strokeWidth="2" />
          <line x1="120" y1="80" x2="70" y2="140" stroke="#D85A30" strokeWidth="2" />
          <line x1="120" y1="80" x2="170" y2="140" stroke="#D85A30" strokeWidth="2" />
          <line x1="280" y1="80" x2="230" y2="140" stroke="#D85A30" strokeWidth="2" />
          <line x1="280" y1="80" x2="330" y2="140" stroke="#D85A30" strokeWidth="2" />
          {/* Nodes */}
          {[{ x: 200, y: 30, v: 10 }, { x: 120, y: 80, v: 5 }, { x: 280, y: 80, v: 15 }, { x: 70, y: 140, v: 2 }, { x: 170, y: 140, v: 7 }, { x: 230, y: 140, v: 12 }, { x: 330, y: 140, v: 20 }].map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="18" fill={result.indexOf(n.v) === 0 ? "#DC2626" : "#D85A30"} stroke="#993C1D" strokeWidth="1.5" />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{n.v}</text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        {(["inorder", "preorder", "postorder"] as const).map(t => (
          <button key={t} onClick={() => setTraversal(t)}
            style={{ padding: "6px 14px", borderRadius: 6, border: traversal === t ? "2px solid #993C1D" : "1px solid #E2E8F0", background: traversal === t ? "#FAECE7" : "white", fontWeight: 600, fontSize: 13, color: traversal === t ? "#993C1D" : "#64748B", cursor: "pointer" }}>{t}</button>
        ))}
      </div>
      <div style={{ background: "#1E293B", borderRadius: 8, padding: "10px 14px", textAlign: "center" as const, marginBottom: 8 }}>
        <code style={{ fontSize: 18, color: "#F97316", fontWeight: 700 }}>[{result.join(", ")}]</code>
      </div>
      <div style={{ fontSize: 13, color: "#64748B", textAlign: "center" as const }}>{descriptions[traversal]}</div>
    </div>
  );
}

// Sorting step-by-step
function SortingGame() {
  const [arr, setArr] = useState([64, 25, 12, 22, 11]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [algo, setAlgo] = useState<"insertion" | "bubble">("insertion");
  const [steps, setSteps] = useState<string[]>([]);

  const runInsertionSort = () => {
    const a = [...arr]; const log: string[] = [];
    for (let i = 1; i < a.length; i++) {
      const key = a[i]; let j = i - 1;
      log.push(`Étape ${i}: insérer ${key} à sa place`);
      while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
      a[j + 1] = key;
      log.push(`→ [${a.join(", ")}]`);
    }
    setSorted([...a]); setSteps(log);
  };

  const runBubbleSort = () => {
    const a = [...arr]; const log: string[] = [];
    for (let i = 0; i < a.length - 1; i++) {
      log.push(`Passage ${i + 1}:`);
      for (let j = 0; j < a.length - 1 - i; j++) {
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; log.push(`  ${a[j + 1]}>${a[j]} → échange → [${a.join(", ")}]`); }
      }
    }
    setSorted([...a]); setSteps(log);
  };

  const randomize = () => { setArr(Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10)); setSorted([]); setSteps([]); };

  return (
    <div>
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 12 }}>
        {arr.map((v, i) => (
          <div key={i} style={{ background: "#D85A30", color: "white", width: 45, height: 45, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 16, fontWeight: 700 }}>{v}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        <button onClick={() => { setAlgo("insertion"); runInsertionSort(); }} style={{ padding: "8px 16px", background: algo === "insertion" ? "#993C1D" : "#1E3A5F", color: algo === "insertion" ? "white" : "#334155", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Insertion Sort</button>
        <button onClick={() => { setAlgo("bubble"); runBubbleSort(); }} style={{ padding: "8px 16px", background: algo === "bubble" ? "#993C1D" : "#1E3A5F", color: algo === "bubble" ? "white" : "#334155", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Bubble Sort</button>
        <button onClick={randomize} style={{ padding: "8px 16px", background: "#64748B", color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Nouveau tableau</button>
      </div>
      {sorted.length > 0 && (
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 8 }}>
          {sorted.map((v, i) => (
            <div key={i} style={{ background: "#16A34A", color: "white", width: 45, height: 45, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 16, fontWeight: 700 }}>{v}</div>
          ))}
        </div>
      )}
      {steps.length > 0 && (
        <div style={{ background: "#1E293B", borderRadius: 8, padding: "8px 12px", maxHeight: 150, overflowY: "auto" as const }}>
          {steps.map((s, i) => <div key={i} style={{ fontSize: 12, color: s.startsWith("→") || s.startsWith("  ") ? "#86EFAC" : "#F97316", fontFamily: "Consolas, monospace" }}>{s}</div>)}
        </div>
      )}
    </div>
  );
}

export default function Ch9Game() {
  const [mode, setMode] = useState<"menu" | "tree" | "sort">("menu");

  if (mode === "menu") return (
    <div style={{ minHeight: "100vh", background: "#0B1120", color: "#1E3A5F", padding: "2rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: 14, color: "#993C1D", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Monde 3 — Chapitre 9</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1E3A5F", margin: "0.5rem 0" }}>Tree + Algorithmes de tri</h1>
        <p style={{ color: "#64748B", fontSize: 16 }}>Critère P4b</p>
          <a href="/fiches/Ch9_Fiche_Memo_Tree_Sorting.pdf" target="_blank" rel="noopener" style={{display:"inline-block",marginTop:8,padding:"6px 14px",background:"#1E293B",border:"1px solid #1E3A5F",borderRadius:8,fontSize:12,color:"#94A3B8",textDecoration:"none"}}>Fiche memo PDF</a>
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <button onClick={() => setMode("tree")} style={{ padding: "1.5rem", border: "2px solid #993C1D", borderRadius: 12, background: "#FAECE7", cursor: "pointer", textAlign: "left" as const }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#993C1D" }}>Jeu 1 — Parcours d'arbre binaire</div>
          <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Inorder, Preorder, Postorder — visualisez les 3 parcours</div>
        </button>
        <button onClick={() => setMode("sort")} style={{ padding: "1.5rem", border: "2px solid #D85A30", borderRadius: 12, background: "#FFF7ED", cursor: "pointer", textAlign: "left" as const }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#D85A30" }}>Jeu 2 — Tri pas à pas</div>
          <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Insertion Sort vs Bubble Sort — voyez chaque étape</div>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <button onClick={() => setMode("menu")} style={{ fontSize: 13, color: "#64748B", background: "none", border: "none", cursor: "pointer", marginBottom: 12 }}>← Retour</button>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#993C1D", marginBottom: 16 }}>{mode === "tree" ? "Parcours d'arbre binaire" : "Tri pas à pas"}</h2>
      {mode === "tree" ? <TreeVisualizer /> : <SortingGame />}
    </div>
  );
}
