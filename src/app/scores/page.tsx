"use client";
import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import { useAuth, getLevel, LEVELS } from "@/components/AuthProvider";
import { XPBar } from "@/components/GameAnimations";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",TEAL="#0891B2",GREEN="#16A34A",PURPLE="#7C3AED",ORANGE="#F97316";

export default function ScoresPage() {
  const { student } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [view, setView] = useState<"profile"|"leaderboard">("profile");

  useEffect(() => {
    supabase.from("cq_students").select("*").eq("role", "student").order("total_xp", { ascending: false }).then(({ data }) => { if (data) setLeaderboard(data); });
  }, []);

  const xp = student?.total_xp || 0;
  const lvl = getLevel(xp);
  const rank = leaderboard.findIndex(s => s.id === student?.id) + 1;

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT }}>
      <TopBar />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: CARD, borderRadius: 8, padding: 3 }}>
          {(["profile","leaderboard"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", background: view === v ? PURPLE : "transparent", color: view === v ? "white" : MUTED, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              {v === "profile" ? "Mon Profil" : "Leaderboard"}
            </button>
          ))}
        </div>

        {view === "profile" && student && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 90, height: 90, borderRadius: "50%", margin: "0 auto 10px",
              background: `conic-gradient(${lvl.color} ${lvl.progress * 360}deg, ${BORDER} 0deg)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 20px ${lvl.color}40`,
            }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: lvl.color }}>{lvl.index + 1}</span>
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: lvl.color }}>{lvl.name}</div>
            <div style={{ fontSize: 14, color: TEXT }}>{student.first_name} {student.last_name}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{student.email}</div>
            <div style={{ maxWidth: 300, margin: "12px auto" }}>
              <XPBar current={xp} max={lvl.nextLvl?.minXP || 2000} color={lvl.color} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16, textAlign: "center" }}>
              <div style={{ padding: "12px", background: CARD, borderRadius: 8, border: "1px solid " + BORDER }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: PURPLE }}>{xp}</div>
                <div style={{ fontSize: 11, color: MUTED }}>XP Total</div>
              </div>
              <div style={{ padding: "12px", background: CARD, borderRadius: 8, border: "1px solid " + BORDER }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: ORANGE }}>#{rank || "?"}</div>
                <div style={{ fontSize: 11, color: MUTED }}>Classement</div>
              </div>
            </div>
          </div>
        )}

        {view === "leaderboard" && (
          <div style={{ background: CARD, borderRadius: 10, border: "1px solid " + BORDER, overflow: "hidden" }}>
            {leaderboard.map((s, i) => {
              const l = getLevel(s.total_xp || 0);
              const isMe = s.id === student?.id;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: "1px solid " + BORDER, background: isMe ? PURPLE + "10" : "transparent" }}>
                  <div style={{ width: 28, textAlign: "center", fontSize: 16, fontWeight: 800, color: i < 3 ? [ORANGE, MUTED, "#CD7F32"][i] : MUTED }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: isMe ? 700 : 400, color: TEXT }}>{s.first_name} {s.last_name}{isMe ? " (vous)" : ""}</div>
                    <div style={{ fontSize: 10, color: l.color }}>{l.name}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: PURPLE }}>{s.total_xp || 0}</div>
                </div>
              );
            })}
            {leaderboard.length === 0 && <div style={{ padding: 20, textAlign: "center", color: MUTED }}>Aucun eleve</div>}
          </div>
        )}
      </div>
    </div>
  );
}
