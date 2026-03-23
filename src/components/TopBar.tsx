"use client";
import Link from "next/link";

export default function TopBar({ title, backTo = "/" }: { title?: string; backTo?: string }) {
  return (
    <div style={{
      padding: "8px 16px",
      borderBottom: "1px solid #1E3A5F",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#0B1120",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link href={backTo} style={{ fontSize: 12, color: "#94A3B8", textDecoration: "none" }}>
        Retour accueil
      </Link>
      {title && <span style={{ fontSize: 11, color: "#64748B" }}>{title}</span>}
    </div>
  );
}
