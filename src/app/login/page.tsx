"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const BG="#0B1120",CARD="#111827",BORDER="#1E3A5F",TEXT="#E2E8F0",MUTED="#94A3B8",TEAL="#0891B2",RED="#DC2626";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError(error.message); setLoading(false); return; }
      } else {
        const { error, data } = await supabase.auth.signUp({ email, password });
        if (error) { setError(error.message); setLoading(false); return; }
        if (data.user) {
          await supabase.from("cq_students").insert({
            email, first_name: firstName, last_name: lastName,
            role: "student", level: 0, total_xp: 0, classe: "BI1", cohort: "2025",
          });
        }
      }
      router.push("/");
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 400, background: CARD, borderRadius: 16, border: "1px solid " + BORDER, padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: TEXT }}>Unit 19</div>
          <div style={{ fontSize: 13, color: TEAL }}>Data Structures & Algorithms</div>
        </div>

        <div style={{ display: "flex", marginBottom: 20, borderRadius: 8, overflow: "hidden", border: "1px solid " + BORDER }}>
          <button onClick={() => setMode("login")} style={{ flex: 1, padding: "8px", background: mode === "login" ? TEAL : "transparent", color: mode === "login" ? "white" : MUTED, border: "none", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Connexion</button>
          <button onClick={() => setMode("signup")} style={{ flex: 1, padding: "8px", background: mode === "signup" ? TEAL : "transparent", color: mode === "signup" ? "white" : MUTED, border: "none", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Inscription</button>
        </div>

        {mode === "signup" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prenom" style={{ padding: "10px 12px", background: BG, border: "1px solid " + BORDER, borderRadius: 8, color: TEXT, fontSize: 14, outline: "none" }} />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" style={{ padding: "10px 12px", background: BG, border: "1px solid " + BORDER, borderRadius: 8, color: TEXT, fontSize: 14, outline: "none" }} />
          </div>
        )}

        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email"
          style={{ width: "100%", padding: "10px 12px", background: BG, border: "1px solid " + BORDER, borderRadius: 8, color: TEXT, fontSize: 14, outline: "none", marginBottom: 12, boxSizing: "border-box" }} />

        <div style={{ position: "relative", marginBottom: 12 }}>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" type={showPwd ? "text" : "password"}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ width: "100%", padding: "10px 40px 10px 12px", background: BG, border: "1px solid " + BORDER, borderRadius: 8, color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          <button onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 16 }}>
            {showPwd ? "🙈" : "👁"}
          </button>
        </div>

        {error && <div style={{ padding: "8px 12px", background: RED + "15", borderRadius: 8, fontSize: 12, color: RED, marginBottom: 12 }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", padding: "12px", background: TEAL, color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "..." : mode === "login" ? "Se connecter" : "Creer un compte"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <a href="/" style={{ fontSize: 12, color: MUTED, textDecoration: "none" }}>Continuer sans compte</a>
        </div>
      </div>
    </div>
  );
}
