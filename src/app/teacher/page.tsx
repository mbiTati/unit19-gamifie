"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/components/AuthProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",TEAL="#0891B2",GREEN="#16A34A",ORANGE="#F97316",RED="#DC2626",PURPLE="#7C3AED";

export default function TeacherDashboard() {
  const { student, isTeacher, loading } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [gameScores, setGameScores] = useState<any[]>([]);
  const [view, setView] = useState<"kpi"|"students"|"comments"|"scores">("kpi");

  useEffect(() => {
    if (!isTeacher) return;
    supabase.from("cq_students").select("*").eq("role", "student").then(({ data }) => { if (data) setStudents(data); });
    supabase.from("cq_comments").select("*").eq("unit", "Unit 19").order("created_at", { ascending: false }).limit(20).then(({ data }) => { if (data) setComments(data); });
    supabase.from("cq_game_scores").select("*").order("created_at", { ascending: false }).limit(50).then(({ data }) => { if (data) setGameScores(data); });
  }, [isTeacher]);

  if (loading) return <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }}>Chargement...</div>;
  if (!isTeacher) return <div style={{ minHeight: "100vh", background: BG, color: TEXT, padding: "3rem", textAlign: "center" }}><TopBar /><h2 style={{ marginTop: "2rem" }}>Acces reserve au professeur</h2><Link href="/" style={{ color: TEAL }}>Retour</Link></div>;

  const avgXP = students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.total_xp || 0), 0) / students.length) : 0;
  const struggling = students.filter(s => (s.total_xp || 0) < avgXP * 0.4);
  const topStudents = [...students].sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0)).slice(0, 5);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT }}>
      <TopBar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Dashboard Professeur</h1>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>Unit 19 — Data Structures & Algorithms</p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: CARD, borderRadius: 8, padding: 3 }}>
          {(["kpi","students","comments","scores"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", background: view === v ? TEAL : "transparent", color: view === v ? "white" : MUTED, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
              {v === "kpi" ? "KPIs" : v === "students" ? "Eleves" : v === "comments" ? `Messages (${comments.length})` : "Scores"}
            </button>
          ))}
        </div>

        {/* KPIs */}
        {view === "kpi" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Eleves", value: String(students.length), color: TEAL },
                { label: "XP moyen", value: String(avgXP), color: PURPLE },
                { label: "En difficulte", value: String(struggling.length), color: struggling.length > 0 ? RED : GREEN },
                { label: "Messages", value: String(comments.length), color: ORANGE },
              ].map((s, i) => (
                <div key={i} style={{ padding: "14px", background: CARD, borderRadius: 10, border: "1px solid " + BORDER, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Alertes */}
            {struggling.length > 0 && (
              <div style={{ padding: "12px", background: RED + "10", border: "1px solid " + RED + "30", borderRadius: 10, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: RED, marginBottom: 6 }}>Eleves en difficulte (XP &lt; 40% de la moyenne)</div>
                {struggling.map((s, i) => (
                  <div key={i} style={{ fontSize: 12, color: TEXT, padding: "2px 0" }}>{s.first_name} {s.last_name} — {s.total_xp || 0} XP</div>
                ))}
              </div>
            )}

            {/* Top 5 */}
            <div style={{ padding: "14px", background: CARD, borderRadius: 10, border: "1px solid " + BORDER }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: GREEN, marginBottom: 8 }}>Top 5 eleves</div>
              {topStudents.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid " + BORDER : "none" }}>
                  <span style={{ fontSize: 13, color: TEXT }}>{i + 1}. {s.first_name} {s.last_name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE }}>{s.total_xp || 0} XP</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Students list */}
        {view === "students" && (
          <div style={{ background: CARD, borderRadius: 10, border: "1px solid " + BORDER, overflow: "hidden" }}>
            {students.map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid " + BORDER }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{s.first_name} {s.last_name}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{s.email} | {s.classe} {s.cohort}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: PURPLE }}>{s.total_xp || 0} XP</div>
                  <div style={{ fontSize: 10, color: MUTED }}>Niv. {(s.level || 0) + 1}</div>
                </div>
              </div>
            ))}
            {students.length === 0 && <div style={{ padding: 20, textAlign: "center", color: MUTED }}>Aucun eleve inscrit</div>}
          </div>
        )}

        {/* Comments */}
        {view === "comments" && (
          <div style={{ display: "grid", gap: 10 }}>
            {comments.map((c, i) => (
              <div key={i} style={{ padding: "12px", background: CARD, borderRadius: 10, border: "1px solid " + BORDER }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: TEAL }}>{c.student_email}</span>
                  <span style={{ fontSize: 10, color: MUTED }}>{c.chapter} | {new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
                <div style={{ fontSize: 13, color: TEXT }}>{c.message}</div>
              </div>
            ))}
            {comments.length === 0 && <div style={{ padding: 20, textAlign: "center", color: MUTED, background: CARD, borderRadius: 10 }}>Aucun message</div>}
          </div>
        )}

        {/* Game scores */}
        {view === "scores" && (
          <div style={{ background: CARD, borderRadius: 10, border: "1px solid " + BORDER, overflow: "hidden" }}>
            {gameScores.slice(0, 20).map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid " + BORDER, fontSize: 12 }}>
                <span style={{ color: MUTED }}>{s.student_email || "?"}</span>
                <span style={{ color: TEXT }}>{s.game_name || s.module_name}</span>
                <span style={{ color: GREEN, fontWeight: 600 }}>{s.score} pts</span>
              </div>
            ))}
            {gameScores.length === 0 && <div style={{ padding: 20, textAlign: "center", color: MUTED }}>Aucun score</div>}
          </div>
        )}
      </div>
    </div>
  );
}
