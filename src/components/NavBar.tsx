"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { C } from "@/lib/theme";

const ALL_NAV = [
  { href: "/", label: "Hub Cours", icon: "📚" },
  { href: "/student", label: "Mon Espace", icon: "🏠" },
  { href: "/teacher", label: "Dashboard Prof", icon: "📊", profOnly: true },
  { href: "/cours", label: "Documents", icon: "📄" },
  { href: "/scores", label: "Classement", icon: "🏆" },
  { href: "/settings", label: "Parametres", icon: "⚙️" },
  { href: "/quiz-live", label: "Quiz Live", icon: "🎮" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, student, isTeacher, signOut } = useAuth();
  const isLoggedIn = !!user;

  // Show all items always (some redirect to login if needed)
  const items = ALL_NAV.filter(item => !item.profOnly || isTeacher);

  return (
    <div style={{ background: C.card, borderBottom: "2px solid " + C.border, position: "sticky", top: 0, zIndex: 100 }}>
      {/* Top bar: brand + auth */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>CodeQuest</span>
          <span style={{ fontSize: 12, color: C.muted }}>Unit 19</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isLoggedIn ? (
            <>
              <Link href="/student" style={{ fontSize: 13, color: C.accent, textDecoration: "none", fontWeight: 600 }}>
                {student?.first_name || user?.email?.split("@")[0]}
              </Link>
              {isTeacher && <span style={{ fontSize: 10, padding: "2px 8px", background: C.gold + "20", color: C.gold, borderRadius: 4, fontWeight: 700 }}>PROF</span>}
              <button onClick={() => signOut()}
                style={{ fontSize: 12, color: C.danger, background: C.danger + "12", border: "1px solid " + C.danger + "30", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontWeight: 600 }}>
                Deconnexion
              </button>
            </>
          ) : (
            <Link href="/login"
              style={{ fontSize: 13, color: "#0a0f1a", textDecoration: "none", padding: "8px 20px", background: C.accent, borderRadius: 8, fontWeight: 700 }}>
              Connexion
            </Link>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <div style={{ display: "flex", gap: 0, padding: "0 16px", overflowX: "auto" }}>
        {items.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              style={{
                padding: "10px 16px", fontSize: 13, fontWeight: active ? 700 : 500,
                color: active ? C.accent : C.muted,
                textDecoration: "none", whiteSpace: "nowrap",
                borderBottom: active ? "3px solid " + C.accent : "3px solid transparent",
                transition: "all 0.2s",
              }}>
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
