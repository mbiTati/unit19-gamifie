"use client";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { useAuth, LEVELS, getLevel } from "@/components/AuthProvider";
import { XPBar } from "@/components/GameAnimations";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",TEAL="#0891B2",GREEN="#16A34A",ORANGE="#F97316",PURPLE="#7C3AED",RED="#DC2626";

export default function StudentHome() {
  const { student, loading, user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    if (!student) return;
    supabase.from("cq_student_progress").select("*").eq("student_id", student.id).then(({ data }) => { if (data) setProgress(data); });
    supabase.from("cq_game_scores").select("*").eq("student_id", student.id).order("created_at", { ascending: false }).limit(10).then(({ data }) => { if (data) setScores(data); });
  }, [student]);

  if (loading) return <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }}>Chargement...</div>;
  if (!user) return <div style={{ minHeight: "100vh", background: BG, color: TEXT, padding: "3rem", textAlign: "center" }}><NavBar/><h2 style={{ marginTop: "2rem" }}>Connectez-vous</h2><Link href="/login" style={{ color: TEAL, fontSize: 16 }}>Page de connexion</Link></div>;

  const xp = student?.total_xp || 0;
  const lvl = getLevel(xp);
  const completedModules = progress.filter(p => p.completed).length;

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT }}>
      <NavBar/>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem" }}>
        {/* Badge niveau anime */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem", paddingTop: "1rem" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: `conic-gradient(${lvl.color} ${lvl.progress * 360}deg, ${BORDER} 0deg)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 20px ${lvl.color}40, 0 0 40px ${lvl.color}20`,
              animation: "badgePulse 2s ease-in-out infinite",
            }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: BG, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: lvl.color }}>{lvl.index + 1}</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: lvl.color, marginTop: 8 }}>{lvl.name}</div>
          <div style={{ fontSize: 13, color: MUTED }}>{student?.first_name} {student?.last_name}</div>
          <div style={{ maxWidth: 300, margin: "10px auto 0" }}>
            <XPBar current={xp} max={lvl.nextLvl?.minXP || 2000} color={lvl.color} />
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
              {xp} XP {lvl.nextLvl ? `/ ${lvl.nextLvl.minXP} XP pour ${lvl.nextLvl.name}` : "— Niveau max !"}
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "XP Total", value: String(xp), color: PURPLE },
            { label: "Modules", value: `${completedModules}/14`, color: GREEN },
            { label: "Scores", value: String(scores.length), color: ORANGE },
          ].map((s, i) => (
            <div key={i} style={{ padding: "12px", background: CARD, borderRadius: 10, border: "1px solid " + BORDER, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bouton Continuer */}
        <Link href="/" style={{ display: "block", padding: "14px", background: `linear-gradient(135deg, ${TEAL}, ${PURPLE})`, borderRadius: 10, textAlign: "center", textDecoration: "none", color: "white", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
          Continuer l'aventure
        </Link>

        {/* Derniers scores */}
        {scores.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Derniers scores</div>
            {scores.slice(0, 5).map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: i % 2 === 0 ? CARD : "transparent", borderRadius: 6, fontSize: 13 }}>
                <span style={{ color: MUTED }}>{s.game_name || s.module_name}</span>
                <span style={{ color: GREEN, fontWeight: 600 }}>{s.score} pts</span>
              </div>
            ))}
          </div>
        )}

        {/* Niveaux */}
        <div style={{ padding: "14px", background: CARD, borderRadius: 10, border: "1px solid " + BORDER }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 8 }}>Tous les niveaux</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {LEVELS.map((l, i) => {
              const unlocked = xp >= l.minXP;
              return (
                <div key={i} style={{ padding: "6px 8px", background: unlocked ? l.color + "15" : BORDER + "30", borderRadius: 6, border: `1px solid ${unlocked ? l.color + "40" : "transparent"}`, textAlign: "center", opacity: unlocked ? 1 : 0.4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: unlocked ? l.color : MUTED }}>{l.name}</div>
                  <div style={{ fontSize: 9, color: MUTED }}>{l.minXP} XP</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Link href="/scores" style={{ flex: 1, padding: "10px", background: CARD, border: "1px solid " + BORDER, borderRadius: 8, textDecoration: "none", textAlign: "center", fontSize: 13, color: MUTED }}>Mon profil</Link>
          <Link href="/settings" style={{ flex: 1, padding: "10px", background: CARD, border: "1px solid " + BORDER, borderRadius: 8, textDecoration: "none", textAlign: "center", fontSize: 13, color: MUTED }}>Parametres</Link>
        </div>
      </div>
      <style>{`@keyframes badgePulse { 0%,100% { box-shadow: 0 0 20px ${lvl.color}40; } 50% { box-shadow: 0 0 30px ${lvl.color}60, 0 0 50px ${lvl.color}30; } }`}</style>
    </div>
  );
}
