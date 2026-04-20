"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { C } from "@/lib/theme";
import { getLevel, LEVELS } from "@/components/AuthProvider";

const AVATARS = ["🧑‍💻","👩‍💻","🧑‍🎓","👨‍🔬","👩‍🔬","🦊","🐉","🤖","👾","🎮","⚡","🔥","💎","🏆","🎯","🛡️","⚔️","🧙","🧑‍🚀","🌟"];
const BADGE_COLORS = ["#0891B2","#7C3AED","#DC2626","#F97316","#16A34A","#D97706","#EC4899","#3B82F6","#10B981","#FBBF24"];
const TITLES_BY_XP = [
  { min: 0, titles: ["Debutant","Apprenti","Novice"] },
  { min: 100, titles: ["Explorateur","Curieux","Studieux"] },
  { min: 300, titles: ["Codeur","Algorithme Jr","Data Rookie"] },
  { min: 500, titles: ["Ninja Java","Stack Master","Queue Expert"] },
  { min: 750, titles: ["Tree Wizard","Graph Hacker","Hash Pro"] },
  { min: 1000, titles: ["Code Legend","Algo Master","Pattern King"] },
  { min: 1500, titles: ["Lord Coder","Data Overlord","Algorithm God"] },
];

function getAvailableTitles(xp: number): string[] {
  const titles: string[] = [];
  for (const t of TITLES_BY_XP) { if (xp >= t.min) titles.push(...t.titles); }
  return titles;
}

export default function SettingsPage() {
  const { student, user } = useAuth();
  const xp = student?.total_xp || 0;
  const lvl = getLevel(xp);

  // Settings state from localStorage
  const [avatar, setAvatar] = useState("🧑‍💻");
  const [badgeColor, setBadgeColor] = useState(lvl.color);
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [newPwd, setNewPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("u19-settings");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.avatar) setAvatar(s.avatar);
        if (s.badgeColor) setBadgeColor(s.badgeColor);
        if (s.title) setTitle(s.title);
        if (s.isPublic !== undefined) setIsPublic(s.isPublic);
      } catch {}
    }
  }, []);

  const saveSettings = (updates: any) => {
    const current = { avatar, badgeColor, title, isPublic, ...updates };
    localStorage.setItem("u19-settings", JSON.stringify(current));
  };

  const changePwd = async () => {
    if (newPwd.length < 6) { setMsg("6 caracteres minimum"); return; }
    if (!isSupabaseConfigured) { setMsg("Supabase non configure"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setMsg(error ? error.message : "Mot de passe modifie !");
    if (!error) setNewPwd("");
  };

  const availableTitles = getAvailableTitles(xp);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <NavBar />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Parametres & Personnalisation</h1>

        {/* Preview */}
        <div style={{ textAlign: "center", padding: "16px", background: C.card, borderRadius: 12, border: "1px solid " + C.border, marginBottom: 16 }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: badgeColor + "20", border: "3px solid " + badgeColor, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 32, boxShadow: `0 0 20px ${badgeColor}30` }}>
            {avatar}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{student?.first_name} {student?.last_name}</div>
          <div style={{ fontSize: 13, color: badgeColor, fontWeight: 600 }}>{title || lvl.name}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{xp} XP — Niveau {lvl.index + 1}</div>
        </div>

        {/* Avatar */}
        <div style={{ padding: "14px", background: C.card, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 8 }}>Avatar</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {AVATARS.map((a, i) => (
              <button key={i} onClick={() => { setAvatar(a); saveSettings({ avatar: a }); }}
                style={{ width: 40, height: 40, borderRadius: 8, border: avatar === a ? "2px solid " + C.accent : "1px solid " + C.border, background: avatar === a ? C.accent + "15" : C.bg, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Badge color */}
        <div style={{ padding: "14px", background: C.card, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 8 }}>Couleur du badge</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {BADGE_COLORS.map((col, i) => (
              <button key={i} onClick={() => { setBadgeColor(col); saveSettings({ badgeColor: col }); }}
                style={{ width: 36, height: 36, borderRadius: "50%", border: badgeColor === col ? "3px solid white" : "2px solid " + C.border, background: col, cursor: "pointer", boxShadow: badgeColor === col ? `0 0 12px ${col}60` : "none" }} />
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ padding: "14px", background: C.card, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>Titre</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Debloques en gagnant de l'XP. {availableTitles.length} titres disponibles.</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {availableTitles.map((t, i) => (
              <button key={i} onClick={() => { setTitle(t); saveSettings({ title: t }); }}
                style={{ padding: "6px 12px", borderRadius: 6, border: title === t ? "1px solid " + C.accent : "1px solid " + C.border, background: title === t ? C.accent + "15" : C.bg, color: title === t ? C.accent : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {t}
              </button>
            ))}
            {TITLES_BY_XP.filter(t => xp < t.min).map((t, i) => (
              <span key={"locked" + i} style={{ padding: "6px 12px", borderRadius: 6, background: C.border + "30", color: C.border, fontSize: 12, fontWeight: 600 }}>
                🔒 {t.min} XP
              </span>
            ))}
          </div>
        </div>

        {/* Scores public */}
        <div style={{ padding: "14px", background: C.card, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Scores publics</div>
              <div style={{ fontSize: 12, color: C.muted }}>Visible dans le classement</div>
            </div>
            <button onClick={() => { const v = !isPublic; setIsPublic(v); saveSettings({ isPublic: v }); }}
              style={{ padding: "6px 16px", background: isPublic ? C.success + "20" : C.border, border: "1px solid " + (isPublic ? C.success : C.border), borderRadius: 20, color: isPublic ? C.success : C.muted, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
              {isPublic ? "Public" : "Prive"}
            </button>
          </div>
        </div>

        {/* Change password */}
        <div style={{ padding: "14px", background: C.card, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 8 }}>Changer le mot de passe</div>
          <div style={{ position: "relative", marginBottom: 8 }}>
            <input value={newPwd} onChange={e => setNewPwd(e.target.value)} type={showPwd ? "text" : "password"} placeholder="Nouveau mot de passe"
              style={{ width: "100%", padding: "10px 40px 10px 12px", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <button onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer" }}>
              {showPwd ? "Cacher" : "Voir"}
            </button>
          </div>
          <button onClick={changePwd} style={{ padding: "8px 20px", background: C.primary, color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Modifier</button>
          {msg && <div style={{ marginTop: 8, fontSize: 12, color: msg.includes("modifie") ? C.success : C.danger }}>{msg}</div>}
        </div>

        {/* Account info */}
        <div style={{ padding: "14px", background: C.card, borderRadius: 10, border: "1px solid " + C.border }}>
          <div style={{ fontSize: 13, color: C.muted }}>Connecte en tant que :</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 4 }}>{student?.first_name} {student?.last_name}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{user?.email} | {student?.class_name} {student?.cohort}</div>
        </div>
      </div>
    </div>
  );
}
