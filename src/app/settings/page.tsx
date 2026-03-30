"use client";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/components/AuthProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",TEAL="#0891B2",GREEN="#16A34A",RED="#DC2626";

export default function SettingsPage() {
  const { student, user } = useAuth();
  const [newPwd, setNewPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [msg, setMsg] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const changePwd = async () => {
    if (newPwd.length < 6) { setMsg("6 caracteres minimum"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setMsg(error ? error.message : "Mot de passe modifie !");
    if (!error) setNewPwd("");
  };

  const togglePublic = async () => {
    const next = !isPublic;
    setIsPublic(next);
    if (student) {
      await supabase.from("cq_student_settings").upsert({ student_id: student.id, scores_public: next }, { onConflict: "student_id" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT }}>
      <NavBar/>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Parametres</h1>

        <div style={{ padding: "16px", background: CARD, borderRadius: 10, border: "1px solid " + BORDER, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 10 }}>Changer le mot de passe</div>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <input value={newPwd} onChange={e => setNewPwd(e.target.value)} type={showPwd ? "text" : "password"} placeholder="Nouveau mot de passe"
              style={{ width: "100%", padding: "10px 40px 10px 12px", background: BG, border: "1px solid " + BORDER, borderRadius: 8, color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <button onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: MUTED, cursor: "pointer" }}>
              {showPwd ? "Cacher" : "Voir"}
            </button>
          </div>
          <button onClick={changePwd} style={{ padding: "8px 20px", background: TEAL, color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Modifier</button>
          {msg && <div style={{ marginTop: 8, fontSize: 12, color: msg.includes("modifie") ? GREEN : RED }}>{msg}</div>}
        </div>

        <div style={{ padding: "16px", background: CARD, borderRadius: 10, border: "1px solid " + BORDER, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>Scores publics</div>
              <div style={{ fontSize: 12, color: MUTED }}>Visible dans le leaderboard</div>
            </div>
            <button onClick={togglePublic} style={{ padding: "6px 16px", background: isPublic ? GREEN + "20" : BORDER, border: "1px solid " + (isPublic ? GREEN : BORDER), borderRadius: 20, color: isPublic ? GREEN : MUTED, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
              {isPublic ? "Public" : "Prive"}
            </button>
          </div>
        </div>

        <div style={{ padding: "16px", background: CARD, borderRadius: 10, border: "1px solid " + BORDER }}>
          <div style={{ fontSize: 13, color: MUTED }}>Connecte en tant que :</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginTop: 4 }}>{student?.first_name} {student?.last_name}</div>
          <div style={{ fontSize: 12, color: MUTED }}>{user?.email} | {student?.class_name} {student?.cohort}</div>
        </div>
      </div>
    </div>
  );
}
