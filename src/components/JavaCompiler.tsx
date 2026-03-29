"use client";
import { useState } from "react";

const BORDER="#1E3A5F",CARD="#111827",MUTED="#94A3B8",TEAL="#0891B2";

export default function JavaCompiler({ starterCode, title = "Java" }: { starterCode?: string; title?: string }) {
  const [expanded, setExpanded] = useState(false);
  const src = `https://onecompiler.com/embed/java?theme=dark&hideTitle=true&hideLanguageSelection=true${starterCode ? "&code=" + encodeURIComponent(starterCode) : ""}`;

  return (
    <div style={{ marginTop: 12, border: "1px solid " + BORDER, borderRadius: 10, overflow: "hidden", background: CARD }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid " + BORDER }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: TEAL }}>{title} — OneCompiler</span>
        <button onClick={() => setExpanded(!expanded)}
          style={{ fontSize: 11, color: MUTED, background: "none", border: "1px solid " + BORDER, borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
          {expanded ? "Reduire" : "Agrandir"}
        </button>
      </div>
      <iframe src={src} width="100%" height={expanded ? 600 : 350}
        style={{ border: "none", background: "#1e1e1e" }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        title="Java Compiler" />
    </div>
  );
}
