"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { C } from "@/lib/theme";

const NAV_ITEMS = [
  { href: "/", label: "Hub", short: "Hub" },
  { href: "/student", label: "Mon Espace", short: "Accueil" },
  { href: "/cours", label: "Documents", short: "Docs" },
  { href: "/scores", label: "Classement", short: "Scores" },
  { href: "/settings", label: "Parametres", short: "Config" },
];

const NAV_TEACHER = [
  { href: "/teacher", label: "Dashboard Prof", short: "Prof" },
];

export default function NavBar({ isTeacher = false }: { isTeacher?: boolean }) {
  const pathname = usePathname();
  const items = isTeacher ? [...NAV_ITEMS, ...NAV_TEACHER] : NAV_ITEMS;

  return (
    <nav style={{
      display: "flex", gap: 2, padding: "6px 12px",
      background: C.card, borderBottom: "1px solid " + C.border,
      overflowX: "auto", position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>U19</span>
      </div>
      {items.map(item => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}
            style={{
              padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: active ? 700 : 400,
              background: active ? C.primary + "25" : "transparent",
              color: active ? C.accent : C.muted,
              textDecoration: "none", whiteSpace: "nowrap",
              border: active ? "1px solid " + C.primary + "40" : "1px solid transparent",
            }}>
            {item.label}
          </Link>
        );
      })}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
        <Link href="/login" style={{ fontSize: 11, color: C.dimmed, textDecoration: "none", padding: "4px 10px", border: "1px solid " + C.border, borderRadius: 6 }}>Connexion</Link>
      </div>
    </nav>
  );
}
