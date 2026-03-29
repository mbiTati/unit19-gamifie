"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { C } from "@/lib/theme";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1px solid " + C.border, background: C.card,
    color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box",
  };

  const handleSubmit = async () => {
    setError(""); setSuccess(""); setLoading(true);
    if (!isSupabaseConfigured) { setError("Supabase non configure"); setLoading(false); return; }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/student");
    } else {
      if (!firstName.trim() || !lastName.trim()) { setError("Prenom et nom requis"); setLoading(false); return; }
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user) {
        await supabase.from("cq_students").insert({
          email, first_name: firstName.trim(), last_name: lastName.trim(),
          role: "student", level: 0, total_xp: 0, classe: "BI1", cohort: "2025",
        });
      }
      setSuccess("Compte cree ! Verifiez votre email pour confirmer.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 24,
    }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: C.dimmed, marginBottom: 8 }}>ECOLE SCHULZ</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: C.accent, marginBottom: 4 }}>CODEQUEST</div>
      <div style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>Unit 19 — Data Structures & Algorithms</div>

      <div style={{ width: "100%", maxWidth: 380, background: C.card, borderRadius: 16, padding: 28, border: "1px solid " + C.border }}>
        {/* Toggle login/signup */}
        <div style={{ display: "flex", marginBottom: 20, borderRadius: 8, overflow: "hidden", border: "1px solid " + C.border }}>
          <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            style={{ flex: 1, padding: 8, border: "none", background: mode === "login" ? C.primary : "transparent", color: mode === "login" ? C.text : C.muted, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            Connexion
          </button>
          <button onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
            style={{ flex: 1, padding: 8, border: "none", background: mode === "signup" ? C.primary : "transparent", color: mode === "signup" ? C.text : C.muted, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            Inscription
          </button>
        </div>

        {mode === "signup" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prenom" style={inputStyle} />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" style={inputStyle} />
          </div>
        )}

        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={{ ...inputStyle, marginBottom: 10 }} />

        <div style={{ position: "relative", marginBottom: 10 }}>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe"
            type={showPwd ? "text" : "password"} onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ ...inputStyle, paddingRight: 44 }} />
          <button onClick={() => setShowPwd(!showPwd)}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13 }}>
            {showPwd ? "Cacher" : "Voir"}
          </button>
        </div>

        {error && <div style={{ padding: "8px 12px", background: C.danger + "15", borderRadius: 8, fontSize: 12, color: C.danger, marginBottom: 10, border: "1px solid " + C.danger + "30" }}>{error}</div>}
        {success && <div style={{ padding: "8px 12px", background: C.success + "15", borderRadius: 8, fontSize: 12, color: C.success, marginBottom: 10, border: "1px solid " + C.success + "30" }}>{success}</div>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", padding: 12, background: C.primary, color: C.text, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "..." : mode === "login" ? "Se connecter" : "Creer un compte"}
        </button>

        {mode === "login" && (
          <div style={{ fontSize: 11, color: C.dimmed, textAlign: "center", marginTop: 10 }}>Mot de passe par defaut : Schulz2025!</div>
        )}
      </div>

      <a href="/" style={{ fontSize: 12, color: C.dimmed, textDecoration: "none", marginTop: 20 }}>Continuer sans compte</a>
    </div>
  );
}
