"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { useAuth, getLevel } from "@/components/AuthProvider";
import { XPBar } from "@/components/GameAnimations";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { C } from "@/lib/theme";

export default function ScoresPage() {
  const { user, student, loading } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [view, setView] = useState<"profile"|"leaderboard">("profile");
  const [lockChecked, setLockChecked] = useState(false);
  const [sectionLocked, setSectionLocked] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLockChecked(true); return; }
    (async () => {
      try {
        const { data } = await supabase.from("cq_locks").select("*").eq("section", "classement").maybeSingle();
        if (data) setSectionLocked(data.locked === true);
      } catch {}
      setLockChecked(true);
    })();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !student) return;
    // Students see only their class; teacher sees all
    const query = supabase.from("cq_students").select("*").eq("role", "student");
    if (student.role !== "teacher" && student.class_name) {
      query.eq("class_name", student.class_name);
    }
    query.then(({ data }) => {
      if (data) setLeaderboard(data.sort((a: any, b: any) => (b.total_xp || 0) - (a.total_xp || 0)));
    });
  }, [student]);

  if (loading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Chargement...</div>;
  if (!user) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }
  if (!lockChecked) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Chargement...</div>;
  if (sectionLocked && student?.role !== "teacher") return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.text, gap: 12 }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Acces bloque</div>
      <div style={{ fontSize: 13, color: C.muted }}>Cette section est verrouillee par le professeur</div>
      <a href="/" style={{ color: C.accent, marginTop: 8, textDecoration: "none" }}>Retour au Hub</a>
    </div>
  );

  const xp = student?.total_xp || 0;
  const lvl = getLevel(xp);
  const rank = leaderboard.findIndex(s => s.id === student?.id) + 1;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <NavBar />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: C.card, borderRadius: 8, padding: 3 }}>
          {(["profile", "leaderboard"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", background: view === v ? C.primary : "transparent", color: view === v ? "white" : C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              {v === "profile" ? "Mon Profil" : "Leaderboard"}
            </button>
          ))}
        </div>

        {view === "profile" && student && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", margin: "0 auto 10px", background: `conic-gradient(${lvl.color} ${lvl.progress * 360}deg, ${C.border} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${lvl.color}40` }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: lvl.color }}>{lvl.index + 1}</span>
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: lvl.color }}>{lvl.name}</div>
            <div style={{ fontSize: 14, color: C.text }}>{student.first_name} {student.last_name}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{student.email}</div>
            <div style={{ maxWidth: 300, margin: "12px auto" }}>
              <XPBar current={xp} max={lvl.nextLvl?.minXP || 2000} color={lvl.color} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              <div style={{ padding: "12px", background: C.card, borderRadius: 8, border: "1px solid " + C.border, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.accent }}>{xp}</div>
                <div style={{ fontSize: 11, color: C.muted }}>XP Total</div>
              </div>
              <div style={{ padding: "12px", background: C.card, borderRadius: 8, border: "1px solid " + C.border, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.gold }}>#{rank || "?"}</div>
                <div style={{ fontSize: 11, color: C.muted }}>Classement</div>
              </div>
            </div>
          </div>
        )}

        {view === "leaderboard" && (
          <div style={{ background: C.card, borderRadius: 10, border: "1px solid " + C.border, overflow: "hidden" }}>
            {leaderboard.map((s, i) => {
              const l = getLevel(s.total_xp || 0);
              const isMe = s.id === student?.id;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: "1px solid " + C.border, background: isMe ? C.primary + "10" : "transparent" }}>
                  <div style={{ width: 28, textAlign: "center", fontSize: 16, fontWeight: 800, color: i < 3 ? [C.gold, C.muted, "#CD7F32"][i] : C.muted }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: isMe ? 700 : 400, color: C.text }}>{s.first_name} {s.last_name}{isMe ? " (vous)" : ""}</div>
                    <div style={{ fontSize: 10, color: l.color }}>{l.name}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.accent }}>{s.total_xp || 0}</div>
                </div>
              );
            })}
            {leaderboard.length === 0 && <div style={{ padding: 20, textAlign: "center", color: C.muted }}>Aucun eleve</div>}
          </div>
        )}
      </div>
    </div>
  );
}
