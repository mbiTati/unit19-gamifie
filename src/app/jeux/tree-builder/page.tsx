"use client";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import { C } from "@/lib/theme";

interface TreeNode { value: number; left: TreeNode|null; right: TreeNode|null; }

function insert(root: TreeNode|null, val: number): TreeNode {
  if (!root) return { value: val, left: null, right: null };
  if (val < root.value) root.left = insert(root.left, val);
  else if (val > root.value) root.right = insert(root.right, val);
  return root;
}

function inorder(node: TreeNode|null): number[] {
  if (!node) return [];
  return [...inorder(node.left), node.value, ...inorder(node.right)];
}
function preorder(node: TreeNode|null): number[] {
  if (!node) return [];
  return [node.value, ...preorder(node.left), ...preorder(node.right)];
}
function postorder(node: TreeNode|null): number[] {
  if (!node) return [];
  return [...postorder(node.left), ...postorder(node.right), node.value];
}

function treeHeight(node: TreeNode|null): number {
  if (!node) return 0;
  return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
}

function TreeSVG({ node, x, y, dx, highlighted }: { node: TreeNode|null; x: number; y: number; dx: number; highlighted: number[] }) {
  if (!node) return null;
  const isHL = highlighted.includes(node.value);
  return (
    <g>
      {node.left && <>
        <line x1={x} y1={y} x2={x-dx} y2={y+50} stroke={C.border} strokeWidth="2"/>
        <TreeSVG node={node.left} x={x-dx} y={y+50} dx={dx/2} highlighted={highlighted}/>
      </>}
      {node.right && <>
        <line x1={x} y1={y} x2={x+dx} y2={y+50} stroke={C.border} strokeWidth="2"/>
        <TreeSVG node={node.right} x={x+dx} y={y+50} dx={dx/2} highlighted={highlighted}/>
      </>}
      <circle cx={x} cy={y} r={18} fill={isHL ? C.gold : C.primary+"40"} stroke={isHL ? C.gold : C.accent} strokeWidth="2" style={{transition:"all 0.3s"}}/>
      <text x={x} y={y+4} textAnchor="middle" fill={isHL ? C.bg : C.text} fontSize="12" fontWeight="bold">{node.value}</text>
    </g>
  );
}

export default function TreeBuilder() {
  const { user: authUser, loading: authLoading } = useAuth();
  if (authLoading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!authUser) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  const [root, setRoot] = useState<TreeNode|null>(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [traversal, setTraversal] = useState<string>("");

  const addNode = () => {
    const val = parseInt(input);
    if (isNaN(val)) { setMessage("Entrez un nombre"); return; }
    if (root && inorder(root).includes(val)) { setMessage(`${val} existe deja`); return; }
    setRoot(prev => insert(prev ? {...structuredClone(prev)} : null, val));
    setHighlighted([val]);
    setMessage(`${val} insere — O(log n) si equilibre, O(n) pire cas`);
    setInput("");
    setTimeout(() => setHighlighted([]), 1500);
  };

  const showTraversal = (type: string) => {
    if (!root) return;
    const result = type === "inorder" ? inorder(root) : type === "preorder" ? preorder(root) : postorder(root);
    setTraversal(`${type === "inorder" ? "Inordre (G-R-D)" : type === "preorder" ? "Preordre (R-G-D)" : "Postordre (G-D-R)"} : ${result.join(", ")}`);
    // Animate highlighting
    result.forEach((v, i) => {
      setTimeout(() => setHighlighted(result.slice(0, i + 1)), i * 400);
    });
    setTimeout(() => setHighlighted([]), result.length * 400 + 1000);
  };

  const reset = () => { setRoot(null); setMessage(""); setTraversal(""); setHighlighted([]); };
  const presets = () => { let r: TreeNode|null = null; [50,30,70,20,40,60,80].forEach(v => r = insert(r, v)); setRoot(r); setMessage("Arbre pre-rempli"); };

  const h = treeHeight(root);
  const svgW = 500;
  const svgH = Math.max(120, h * 55 + 40);

  return (
    <GameShell title="Tree Builder" color={C.success}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>Construisez un arbre binaire de recherche (BST) et visualisez les parcours</p>

        {/* Tree visualization */}
        <div style={{ background: C.card, borderRadius: 12, padding: "12px", border: "1px solid " + C.border, marginBottom: 12, overflow: "auto" }}>
          {root ? (
            <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ display: "block" }}>
              <TreeSVG node={root} x={svgW/2} y={30} dx={svgW/5} highlighted={highlighted}/>
            </svg>
          ) : (
            <div style={{ padding: "30px", textAlign: "center", color: C.dimmed }}>Arbre vide — inserez des valeurs</div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Valeur..." onKeyDown={e => e.key === "Enter" && addNode()}
            style={{ flex: 1, padding: "10px 12px", background: C.card, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 14, outline: "none" }} />
          <button onClick={addNode} style={{ padding: "10px 16px", background: C.primary, color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Inserer</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 12 }}>
          <button onClick={() => showTraversal("inorder")} style={{ padding: "8px", background: C.accent + "15", border: "1px solid " + C.accent + "30", borderRadius: 6, color: C.accent, fontWeight: 600, fontSize: 10, cursor: "pointer" }}>Inordre</button>
          <button onClick={() => showTraversal("preorder")} style={{ padding: "8px", background: C.gold + "15", border: "1px solid " + C.gold + "30", borderRadius: 6, color: C.gold, fontWeight: 600, fontSize: 10, cursor: "pointer" }}>Preordre</button>
          <button onClick={() => showTraversal("postorder")} style={{ padding: "8px", background: C.secondary + "15", border: "1px solid " + C.secondary + "30", borderRadius: 6, color: C.secondary, fontWeight: 600, fontSize: 10, cursor: "pointer" }}>Postordre</button>
          <button onClick={presets} style={{ padding: "8px", background: C.border, border: "none", borderRadius: 6, color: C.muted, fontWeight: 600, fontSize: 10, cursor: "pointer" }}>Exemple</button>
          <button onClick={reset} style={{ padding: "8px", background: C.danger + "15", border: "1px solid " + C.danger + "30", borderRadius: 6, color: C.danger, fontWeight: 600, fontSize: 10, cursor: "pointer" }}>Reset</button>
        </div>

        {traversal && <div style={{ padding: "10px", background: C.accent + "10", borderRadius: 8, border: "1px solid " + C.accent + "30", fontSize: 12, color: C.accent, marginBottom: 8 }}>{traversal}</div>}
        {message && <div style={{ padding: "8px 12px", background: C.card, borderRadius: 8, fontSize: 12, color: C.gold }}>{message}</div>}

        {root && <div style={{ padding: "10px", background: C.card, borderRadius: 8, border: "1px solid " + C.border, marginTop: 8 }}>
          <div style={{ fontSize: 11, color: C.muted }}>Hauteur: {h} | Noeuds: {inorder(root).length} | Inordre = trie: [{inorder(root).join(", ")}]</div>
        </div>}
      </div>
    </GameShell>
  );
}
