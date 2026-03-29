"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { C } from "@/lib/theme";

export default function NavBar({ isTeacher: isTeacherProp }: { isTeacher?: boolean } = {}) {
  const pathname = usePathname();
  const { user, student, isTeacher: authIsTeacher, signOut } = useAuth();
  const isProf = isTeacherProp || authIsTeacher || (student?.role === "teacher");
  const isLoggedIn = !!user;

  const NAV = [
    { href: "/", label: "Hub Cours" },
    ...(isLoggedIn ? [{ href: "/student", label: "Mon Espace" }] : []),
    ...(isProf ? [{ href: "/teacher", label: "Dashboard Prof" }] : []),
    { href: "/cours", label: "Documents" },
    ...(isLoggedIn ? [{ href: "/scores", label: "Classement" }] : []),
    ...(isLoggedIn ? [{ href: "/settings", label: "Parametres" }] : []),
  ];

  return (
    <nav style={{
      display: "flex", alignItems: "center", gap: 2, padding: "6px 12px",
      background: C.card, borderBottom: "1px solid " + C.border,
      overflowX: "auto", position: "sticky", top: 0, zIndex: 100,
    }}>
      <Link href="/" style={{ fontSize: 14, fontWeight: 800, color: C.accent, textDecoration: "none", marginRight: 10, flexShrink: 0 }}>U19</Link>

      {NAV.map(item => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}
            style={{
              padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: active ? 700 : 400,
              background: active ? C.primary + "25" : "transparent",
              color: active ? C.accent : C.muted,
              textDecoration: "none", whiteSpace: "nowrap",
              border: active ? "1px solid " + C.primary + "40" : "1px solid transparent",
            }}>
            {item.label}
          </Link>
        );
      })}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {isLoggedIn ? (
          <>
            <span style={{ fontSize: 10, color: C.accent, fontWeight: 600 }}>
              {student?.first_name || user?.email?.split("@")[0]}
            </span>
            <button onClick={() => signOut()}
              style={{ fontSize: 10, color: C.danger, background: C.danger + "10", border: "1px solid " + C.danger + "25", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontWeight: 600 }}>
              Deconnexion
            </button>
          </>
        ) : (
          <Link href="/login"
            style={{ fontSize: 11, color: C.accent, textDecoration: "none", padding: "5px 12px", border: "1px solid " + C.accent + "30", borderRadius: 6, fontWeight: 600 }}>
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}
