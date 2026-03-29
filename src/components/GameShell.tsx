"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { C } from "@/lib/theme";

export default function GameShell({ 
  title, color = C.accent, score, current, total, children, backTo = "/"
}: { 
  title: string; color?: string; score?: number; current?: number; total?: number; 
  children: ReactNode; backTo?: string;
}) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{
        padding: "6px 16px", background: C.card, borderBottom: "1px solid " + C.border,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <Link href={backTo} style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "5px 12px", borderRadius: 7, border: "1px solid " + C.border,
          background: "transparent", color: C.muted, cursor: "pointer",
          fontSize: 11, textDecoration: "none",
        }}>
          Retour
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{title}</span>
          {current !== undefined && total !== undefined && (
            <span style={{
              padding: "2px 10px", borderRadius: 10,
              background: color + "15", border: "1px solid " + color + "30",
              fontSize: 10, fontWeight: 600, color,
            }}>
              {current} / {total}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {score !== undefined && (
            <span style={{
              padding: "2px 10px", borderRadius: 10,
              background: C.gold + "15", border: "1px solid " + C.gold + "30",
              fontSize: 11, fontWeight: 700, color: C.gold,
            }}>
              {score} pts
            </span>
          )}
        </div>
      </div>
      <div style={{ padding: "1rem" }}>
        {children}
      </div>
    </div>
  );
}
