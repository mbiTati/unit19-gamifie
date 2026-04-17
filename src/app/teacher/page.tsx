"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { useAuth, getLevel, LEVELS } from "@/components/AuthProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { C } from "@/lib/theme";

const TEACHER_EMAILS = ["tati.b@hotmail.fr"];

export default function TeacherDashboard() {
  const { student, isTeacher, user, loading } = useAuth();
  const isProf = isTeacher || TEACHER_EMAILS.includes(user?.email || "");
  const [students, setStudents] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [cqClasses, setCqClasses] = useState<any[]>([]);
  const [locks, setLocks] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<"progression"|"questions"|"gestion"|"documents"|"outils"|"direct"|"acces">("progression");
  const [filterClasse, setFilterClasse] = useState("all");
  const [filterCohort, setFilterCohort] = useState("all");

  useEffect(() => {
    if (!isProf || !isSupabaseConfigured) return;
    supabase.from("cq_students").select("*").eq("role", "student").order("last_name").then(({ data }) => { if (data) setStudents(data); });
    supabase.from("cq_comments").select("*").order("created_at", { ascending: false }).limit(50).then(({ data }) => { if (data) setComments(data); });
    supabase.from("cq_game_scores").select("*").order("created_at", { ascending: false }).limit(100).then(({ data }) => { if (data) setScores(data); });
    supabase.from("cq_classes").select("*").order("name").then(({ data }) => { if (data) setCqClasses(data); });
    supabase.from("cq_locks").select("*").then(({ data }) => {
      if (data) { const m: Record<string, boolean> = {}; data.forEach((r: any) => m[r.section] = r.locked); setLocks(m); }
    });
  }, [isProf]);

  if (loading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Chargement...</div>;
  if (!isProf) return <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}><NavBar /><div style={{ padding: "3rem", textAlign: "center" }}><h2>Acces reserve au professeur</h2><Link href="/login" style={{ color: C.accent }}>Se connecter</Link></div></div>;

  const classes = Array.from(new Set(students.map(s => s.class_name).filter(Boolean)));
  const cohorts = Array.from(new Set(students.map(s => s.cohort).filter(Boolean)));
  const filtered = students.filter(s => (filterClasse === "all" || s.class_name === filterClasse) && (filterCohort === "all" || s.cohort === filterCohort));

  const avgXP = filtered.length > 0 ? Math.round(filtered.reduce((a, s) => a + (s.total_xp || 0), 0) / filtered.length) : 0;
  const struggling = filtered.filter(s => (s.total_xp || 0) < avgXP * 0.4 && avgXP > 0);
  const u19Comments = comments.filter(c => c.unit === "Unit 19" || !c.unit);
  const unread = u19Comments.filter(c => !c.is_read);

  const toggleLock = async (section: string) => {
    if (!isSupabaseConfigured) return;
    const newVal = !locks[section];
    setLocks(prev => ({ ...prev, [section]: newVal }));
    await supabase.from("cq_locks").upsert({ section, locked: newVal, unit: "Unit 19" }, { onConflict: "section" });
  };

  const deleteStudent = async (id: string, name: string) => {
    if (!confirm("SUPPRIMER definitivement " + name + " ? Cette action est irreversible.")) return;
    if (!isSupabaseConfigured) return;
    await supabase.from("cq_student_progress").delete().eq("student_id", id);
    await supabase.from("cq_game_scores").delete().eq("student_id", id);
    await supabase.from("cq_comments").delete().eq("student_id", id);
    await supabase.from("cq_students").delete().eq("id", id);
    // Refresh list from Supabase
    const { data } = await supabase.from("cq_students").select("*").eq("role", "student").order("last_name");
    if (data) setStudents(data);
    else setStudents(prev => prev.filter(s => s.id !== id));
  };

  const resetStudent = async (id: string) => {
    if (!confirm("Remettre a zero la progression de cet eleve ?")) return;
    if (isSupabaseConfigured) {
      await supabase.from("cq_student_progress").delete().eq("student_id", id);
      // level/total_xp stored in cq_student_progress, not cq_students
      setStudents(prev => prev.map(s => s.id === id ? { ...s, total_xp: 0, level: 0 } : s));
    }
  };

  const TABS = [
    { id: "progression" as const, label: "Progression" },
    { id: "questions" as const, label: `Questions${unread.length > 0 ? " (" + unread.length + ")" : ""}` },
    { id: "gestion" as const, label: "Gerer les eleves" },
    { id: "documents" as const, label: "Mes Documents" },
    { id: "outils" as const, label: "Outils & Jeux" },
    { id: "direct" as const, label: "En direct" },
    { id: "acces" as const, label: "Acces" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <NavBar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem 1.5rem" }}>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { v: String(filtered.length), l: "ELEVES", c: C.accent },
            { v: "0%", l: "PROGRESSION MOY.", c: C.accent },
            { v: "-", l: "QUIZ MOYEN", c: C.muted },
            { v: String(u19Comments.length), l: "QUESTIONS", c: C.gold },
            { v: String(struggling.length), l: "EN DIFFICULTE", c: struggling.length > 0 ? C.danger : C.success },
          ].map((kpi, i) => (
            <div key={i} style={{ padding: "14px", background: C.card, borderRadius: 10, border: "1px solid " + C.border, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: kpi.c }}>{kpi.v}</div>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>{kpi.l}</div>
            </div>
          ))}
        </div>

        {/* Global filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center", padding: "10px 14px", background: C.card, borderRadius: 8, border: "1px solid " + C.border }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Filtres :</span>
          <span style={{ fontSize: 12, color: C.muted }}>Classe :</span>
          <select value={filterClasse} onChange={e => setFilterClasse(e.target.value)} style={{ padding: "8px 12px", background: C.bg, border: "1px solid " + C.border, borderRadius: 6, color: C.text, fontSize: 13 }}>
            <option value="all">Toutes les classes</option>
            {classes.map(cl => <option key={cl} value={cl}>{cl}</option>)}
          </select>
          <span style={{ fontSize: 12, color: C.muted }}>Cohorte :</span>
          <select value={filterCohort} onChange={e => setFilterCohort(e.target.value)} style={{ padding: "8px 12px", background: C.bg, border: "1px solid " + C.border, borderRadius: 6, color: C.text, fontSize: 13 }}>
            <option value="all">Toutes</option>
            {cohorts.map(co => <option key={co} value={co}>{co}</option>)}
          </select>
          <span style={{ fontSize: 12, color: C.accent, marginLeft: "auto" }}>{filtered.length} eleve{filtered.length > 1 ? "s" : ""}</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "2px solid " + C.border }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "10px 18px", fontSize: 13, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? C.accent : C.muted, background: "none", border: "none", borderBottom: tab === t.id ? "3px solid " + C.accent : "3px solid transparent", cursor: "pointer" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: Progression */}
        {tab === "progression" && (
          <>
            {/* Student table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid " + C.border }}>
                    {["ELEVE", "CLASSE", "NIVEAU", "XP", "MODULES", "PROGRESSION", "QUIZ", "ACTIONS"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => {
                    const lvl = getLevel(s.total_xp || 0);
                    return (
                      <tr key={s.id} style={{ borderBottom: "1px solid " + C.border, background: i % 2 === 0 ? "transparent" : C.card + "40" }}>
                        <td style={{ padding: "8px 10px", fontWeight: 600, color: C.text }}>{s.first_name} {(s.last_name || "").toUpperCase()}</td>
                        <td style={{ padding: "8px 10px", color: C.muted }}>{s.class_name} - {s.cohort}</td>
                        <td style={{ padding: "8px 10px", color: lvl.color, fontSize: 12 }}>{lvl.name}</td>
                        <td style={{ padding: "8px 10px", fontWeight: 700, color: C.accent }}>{s.total_xp || 0}</td>
                        <td style={{ padding: "8px 10px", color: C.muted }}>0/14</td>
                        <td style={{ padding: "8px 10px" }}>
                          <div style={{ width: 80, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: "0%", height: "100%", background: C.accent, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 10, color: C.muted }}>0%</span>
                        </td>
                        <td style={{ padding: "8px 10px", color: C.muted }}>-</td>
                        <td style={{ padding: "8px 10px" }}>
                          <div style={{display:"flex",gap:4}}>
                          <button onClick={() => resetStudent(s.id)} style={{ fontSize: 11, padding: "4px 8px", background: C.gold + "15", border: "1px solid " + C.gold + "30", borderRadius: 4, color: C.gold, cursor: "pointer", fontWeight: 600 }}>Reset</button>
                          <button onClick={() => deleteStudent(s.id, s.first_name + " " + s.last_name)} style={{ fontSize: 11, padding: "4px 8px", background: C.danger + "15", border: "1px solid " + C.danger + "30", borderRadius: 4, color: C.danger, cursor: "pointer", fontWeight: 600 }}>Suppr</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* TAB: Questions */}
        {tab === "questions" && (
          <div style={{ display: "grid", gap: 8 }}>
            {u19Comments.length === 0 && <div style={{ padding: 20, textAlign: "center", color: C.muted, background: C.card, borderRadius: 10 }}>Aucune question</div>}
            {u19Comments.map((c, i) => (
              <div key={i} style={{ padding: "12px 14px", background: C.card, borderRadius: 10, border: "1px solid " + (c.is_read ? C.border : C.gold + "40") }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{c.student_email}</span>
                  <span style={{ fontSize: 10, color: C.muted }}>{c.chapter} | {new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
                <div style={{ fontSize: 13, color: C.text }}>{c.message}</div>
                {!c.is_read && <span style={{ fontSize: 9, padding: "2px 6px", background: C.gold + "20", color: C.gold, borderRadius: 4, marginTop: 4, display: "inline-block" }}>Non lu</span>}
              </div>
            ))}
          </div>
        )}

        {/* TAB: Gestion */}
        {tab === "gestion" && (
          <div>
            {/* Gestion des classes */}
            <div style={{ padding: "16px", background: C.card, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.danger, marginBottom: 10 }}>Gestion des classes</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {cqClasses.map((cl, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: C.bg, borderRadius: 6, border: "1px solid " + C.border }}>
                    <span style={{ fontWeight: 700, color: C.accent }}>{cl.name}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>{cl.description || ""} · {cl.cohort || "2025"}</span>
                    <button onClick={async () => {
                      if (!confirm("Supprimer la classe " + cl.name + " ?")) return;
                      await supabase.from("cq_classes").delete().eq("id", cl.id);
                      setCqClasses(prev => prev.filter(c => c.id !== cl.id));
                    }} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>x</button>
                  </div>
                ))}
                {cqClasses.length === 0 && <span style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>Aucune classe</span>}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input id="className" placeholder="Nom (ex: BI2)" style={{ width: 140, padding: "10px 12px", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 13, outline: "none" }}/>
                <input id="classDesc" placeholder="Description" style={{ flex: 1, padding: "10px 12px", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 13, outline: "none" }}/>
                <select id="classCohort" defaultValue="2025" style={{ padding: "10px", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 13 }}>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
                <button onClick={async () => {
                  const name = (document.getElementById("className") as HTMLInputElement)?.value?.trim();
                  const desc = (document.getElementById("classDesc") as HTMLInputElement)?.value?.trim();
                  const cohort = (document.getElementById("classCohort") as HTMLSelectElement)?.value;
                  if (!name) { alert("Nom de classe requis !"); return; }
                  if (!isSupabaseConfigured) { alert("Supabase non configure"); return; }
                  const { error } = await supabase.from("cq_classes").insert({ name, description: desc || "", cohort: cohort || "2025" });
                  if (error) { alert("Erreur : " + error.message); return; }
                  const { data } = await supabase.from("cq_classes").select("*").order("name");
                  if (data) setCqClasses(data);
                  (document.getElementById("className") as HTMLInputElement).value = "";
                  (document.getElementById("classDesc") as HTMLInputElement).value = "";
                }} style={{ padding: "10px 20px", background: C.accent, color: C.bg, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Creer la classe
                </button>
              </div>
            </div>

            {/* Ajouter un eleve */}
            <div style={{ padding: "16px", background: C.card, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.danger, marginBottom: 4 }}>Ajouter un eleve</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Mot de passe par defaut : <strong style={{ color: C.text }}>Schulz2025!</strong></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                <input id="addPrenom" placeholder="Prenom" style={{ padding: "10px 12px", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 13, outline: "none" }}/>
                <input id="addNom" placeholder="Nom" style={{ padding: "10px 12px", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 13, outline: "none" }}/>
                <input id="addEmail" placeholder="Email" style={{ padding: "10px 12px", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 13, outline: "none" }}/>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <select id="addClasse" defaultValue="" style={{ flex: 1, padding: "10px", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 13 }}>
                  <option value="" disabled>— Classe —</option>
                  {cqClasses.map(cl => <option key={cl.id} value={cl.name}>{cl.name}</option>)}
                  <option value="BI2">BI2</option>
                </select>
                <select id="addCohort" defaultValue="2025" style={{ flex: 1, padding: "10px", background: C.bg, border: "1px solid " + C.border, borderRadius: 8, color: C.text, fontSize: 13 }}>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
                <button onClick={async () => {
                  const prenom = (document.getElementById("addPrenom") as HTMLInputElement)?.value?.trim();
                  const nom = (document.getElementById("addNom") as HTMLInputElement)?.value?.trim();
                  const email = (document.getElementById("addEmail") as HTMLInputElement)?.value?.trim();
                  const classe = (document.getElementById("addClasse") as HTMLSelectElement)?.value;
                  const cohort = (document.getElementById("addCohort") as HTMLSelectElement)?.value;
                  if (!prenom || !nom || !email) { alert("Prenom, nom et email requis !"); return; }
                  if (!classe) { alert("Selectionnez une classe !"); return; }
                  if (!isSupabaseConfigured) { alert("Supabase non configure"); return; }
                  try {
                    // Etape 1 : Creer le compte Auth via /auth/v1/signup
                    const signupRes = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + "/auth/v1/signup", {
                      method: "POST",
                      headers: { "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "", "Content-Type": "application/json" },
                      body: JSON.stringify({ email, password: "Schulz2025!" })
                    });
                    const signupData = await signupRes.json();
                    if (signupData.error || signupData.msg) { 
                      // Si le compte Auth existe deja, on continue quand meme pour le profil
                      if (!signupData.msg?.includes("already") && !signupData.error?.includes("already")) {
                        alert("Erreur Auth : " + (signupData.error || signupData.msg)); return; 
                      }
                    }
                    const authId = signupData?.id || signupData?.user?.id || null;

                    // Etape 2 : Creer le profil etudiant
                    const { error } = await supabase.from("cq_students").insert({ 
                      email, first_name: prenom, last_name: nom, role: "student", 
                      class_name: classe, cohort: cohort || "2025",
                      auth_id: authId
                    });
                    if (error) { alert("Erreur profil : " + error.message); return; }

                    // Etape 3 : Confirmer l'email via RPC
                    await supabase.rpc("confirm_student_email", { student_email: email });
                  } catch (e: any) { alert("Erreur : " + e.message); return; }
                  const { data } = await supabase.from("cq_students").select("*").eq("role", "student").order("last_name");
                  if (data) setStudents(data);
                  (document.getElementById("addPrenom") as HTMLInputElement).value = "";
                  (document.getElementById("addNom") as HTMLInputElement).value = "";
                  (document.getElementById("addEmail") as HTMLInputElement).value = "";
                  alert(prenom + " " + nom + " ajoute en " + classe + " !");
                }} style={{ padding: "10px 24px", background: C.accent, color: C.bg, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Ajouter
                </button>
              </div>
            </div>

            {/* Eleves en difficulte + Top 5 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: "14px", background: C.card, borderRadius: 10, border: "1px solid " + C.border }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.danger, marginBottom: 8 }}>En difficulte</div>
                {struggling.length === 0 ? <div style={{ color: C.success, fontSize: 12 }}>Aucun</div> :
                  struggling.map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
                      <span style={{ color: C.text }}>{s.first_name} {s.last_name}</span>
                      <span style={{ color: C.danger }}>{s.total_xp || 0} XP</span>
                    </div>
                  ))
                }
              </div>
              <div style={{ padding: "14px", background: C.card, borderRadius: 10, border: "1px solid " + C.border }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.gold, marginBottom: 8 }}>Top 5</div>
                {Array.from(filtered).sort((a: any, b: any) => (b.total_xp || 0) - (a.total_xp || 0)).slice(0, 5).map((s: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
                    <span style={{ color: C.text }}>{i + 1}. {s.first_name} {s.last_name}</span>
                    <span style={{ color: C.accent }}>{s.total_xp || 0} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tous les eleves */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Tous les eleves ({filtered.length})</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid " + C.border }}>
                      {["NOM", "EMAIL", "CLASSE", "COHORTE", "AUTH", "ACTIONS"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s: any, i: number) => (
                      <tr key={s.id} style={{ borderBottom: "1px solid " + C.border, background: i % 2 === 0 ? "transparent" : C.card + "40" }}>
                        <td style={{ padding: "8px 10px", fontWeight: 600, color: C.text }}>{s.first_name} {(s.last_name || "").toUpperCase()}</td>
                        <td style={{ padding: "8px 10px", color: C.muted }}>{s.email}</td>
                        <td style={{ padding: "8px 10px", color: C.text }}>{s.class_name}</td>
                        <td style={{ padding: "8px 10px", color: C.muted }}>{s.cohort}</td>
                        <td style={{ padding: "8px 10px", color: C.success, fontSize: 12 }}>Lie</td>
                        <td style={{ padding: "8px 10px" }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => resetStudent(s.id)} style={{ fontSize: 11, padding: "4px 8px", background: C.gold + "15", border: "1px solid " + C.gold + "30", borderRadius: 4, color: C.gold, cursor: "pointer", fontWeight: 600 }}>Reset</button>
                            <button onClick={() => deleteStudent(s.id, s.first_name + " " + s.last_name)} style={{ fontSize: 11, padding: "4px 8px", background: C.danger + "15", border: "1px solid " + C.danger + "30", borderRadius: 4, color: C.danger, cursor: "pointer", fontWeight: 600 }}>Suppr</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: C.muted }}>Aucun eleve dans cette classe</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Documents */}
        {tab === "documents" && (
          <div>
            {/* PPTX */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, padding: "3px 10px", background: C.gold + "15", borderRadius: 4 }}>PPTX</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Presentations</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {["Ch1_P1_Design_Specification_ADT","Ch2_P2_Memory_Stack_Function_Calls","Ch3_M1M2_FIFO_Queue_Sorting","Ch4_D1_Shortest_Path_BFS_Dijkstra","Ch5_P3_Formal_Spec_Stack","Ch6_M3_Encapsulation_Information_Hiding","Ch7_D2_ADT_Base_POO","Ch8_P4a_LinkedList_HashMap","Ch9_P4b_Tree_Sorting","Ch10_P5_Exceptions_JUnit5","Ch11_M4D3_ADT_BigO","Ch12_P6_Asymptotic_Analysis","Ch13_P7_Measuring_Efficiency","Ch14_M5D4_Tradeoffs_Independence"].map((f,i) => (
                  <a key={i} href={"/docs/pptx/"+f+".pptx"} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 10px", background: C.card, border: "1px solid " + C.border, borderRadius: 6, textDecoration: "none", fontSize: 12, color: C.text }}>{f.replace(/_/g," ")}</a>
                ))}
              </div>
            </div>

            {/* PDF Referentiel */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.danger, padding: "3px 10px", background: C.danger + "15", borderRadius: 4 }}>PDF</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Cours referentiel (52 PPTX)</span>
              </div>
              <a href="/cours" style={{ fontSize: 13, color: C.accent, textDecoration: "underline" }}>Voir les 52 PPTX sur la page Documents</a>
            </div>

            {/* Fiches Memo */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.success, padding: "3px 10px", background: C.success + "15", borderRadius: 4 }}>MEMO</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Fiches memo (15 PDFs)</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {["Ch1","Ch2","Ch3","Ch4","Ch5","Ch6","Ch7","Ch8a","Ch8b","Ch9","Ch10","Ch11","Ch12","Ch13","Ch14"].map((ch,i) => (
                  <a key={i} href={"/fiches/"+["Ch1_Fiche_Memo_ADT","Ch2_Fiche_Memo_Memory_Stack","Ch3_Fiche_Memo_FIFO_Sorting","Ch4_Fiche_Memo_Shortest_Path","Ch5_Fiche_Memo_Notation_Formelle","Ch6_Fiche_Memo_Encapsulation","Ch7_Fiche_Memo_ADT_POO","Ch8_Fiche_Memo_Design_Patterns","Ch8_Fiche_Memo_LinkedList_HashMap","Ch9_Fiche_Memo_Tree_Sorting","Ch10_Fiche_Memo_Exceptions_JUnit","Ch11_Fiche_Memo_ADT_BigO","Ch12_Fiche_Memo_Asymptotic","Ch13_Fiche_Memo_Efficiency","Ch14_Fiche_Memo_Tradeoffs"][i]+".pdf"} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 10px", background: C.card, border: "1px solid " + C.border, borderRadius: 6, textDecoration: "none", fontSize: 12, color: C.success }}>{ch}</a>
                ))}
              </div>
            </div>

            {/* Exercices */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.secondary, padding: "3px 10px", background: C.secondary + "15", borderRadius: 4 }}>EXOS</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Exercices & cas</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <Link href="/exercices-entreprise" style={{ padding: "8px 10px", background: C.card, border: "1px solid " + C.border, borderRadius: 6, textDecoration: "none", fontSize: 12, color: C.text }}>5 Exercices Entreprise Java</Link>
                <Link href="/projets" style={{ padding: "8px 10px", background: C.card, border: "1px solid " + C.border, borderRadius: 6, textDecoration: "none", fontSize: 12, color: C.text }}>4 Projets integrateurs</Link>
              </div>
            </div>

            {/* Outils */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, padding: "3px 10px", background: C.accent + "15", borderRadius: 4 }}>TOOLS</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Outils interactifs</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {[
                  { name: "Sort Race", href: "/jeux/sort-race" },
                  { name: "Tree Builder", href: "/jeux/tree-builder" },
                  { name: "Graph Explorer", href: "/jeux/graph-explorer" },
                  { name: "LinkedList Lab", href: "/jeux/linked-list-lab" },
                  { name: "Hash Table Hero", href: "/jeux/hash-table-hero" },
                  { name: "Stack & Queue", href: "/jeux/stack-queue-runner" },
                  { name: "Recursion Tower", href: "/jeux/recursion-tower" },
                  { name: "Battle", href: "/battle" },
                  { name: "Block Animations", href: "/jeux/block-animations" },
                ].map((t, i) => (
                  <Link key={i} href={t.href} style={{ padding: "6px 10px", background: C.card, border: "1px solid " + C.border, borderRadius: 6, textDecoration: "none", fontSize: 12, color: C.accent }}>{t.name}</Link>
                ))}
              </div>
            </div>

            {/* Supabase */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", padding: "3px 10px", background: "#7C3AED15", borderRadius: 4 }}>CLOUD</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Supabase</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <a href="https://supabase.com/dashboard/project/jslbfkaujahihvjdxcjg" target="_blank" rel="noopener noreferrer" style={{ padding: "6px 10px", background: C.card, border: "1px solid " + C.border, borderRadius: 6, textDecoration: "none", fontSize: 12, color: "#7C3AED" }}>Dashboard Supabase</a>
                <a href="https://supabase.com/dashboard/project/jslbfkaujahihvjdxcjg/editor" target="_blank" rel="noopener noreferrer" style={{ padding: "6px 10px", background: C.card, border: "1px solid " + C.border, borderRadius: 6, textDecoration: "none", fontSize: 12, color: "#7C3AED" }}>Table Editor</a>
                <a href="https://supabase.com/dashboard/project/jslbfkaujahihvjdxcjg/sql/new" target="_blank" rel="noopener noreferrer" style={{ padding: "6px 10px", background: C.card, border: "1px solid " + C.border, borderRadius: 6, textDecoration: "none", fontSize: 12, color: "#7C3AED" }}>SQL Editor</a>
                <a href="https://github.com/mbiTati/unit19-gamifie" target="_blank" rel="noopener noreferrer" style={{ padding: "6px 10px", background: C.card, border: "1px solid " + C.border, borderRadius: 6, textDecoration: "none", fontSize: 12, color: C.muted }}>GitHub Repo</a>
              </div>
            </div>
          </div>
        )}

        

        {/* TAB: En direct */}
        {tab === "direct" && (
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Presence de TOUS les eleves</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {students.filter(s => s.role !== "teacher").map((s: any, i: number) => {
                const lastActive = s.updated_at || s.created_at;
                const ago = lastActive ? Math.round((Date.now() - new Date(lastActive).getTime()) / 60000) : 999;
                const online = ago < 5;
                return (
                  <div key={i} style={{ padding: "10px", background: C.card, borderRadius: 8, border: "1px solid " + (online ? C.success : C.border), display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: online ? C.success : C.border }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.first_name} {s.last_name}</div>
                      <div style={{ fontSize: 10, color: online ? C.success : C.muted }}>{online ? "En ligne" : ago < 60 ? `Il y a ${ago} min` : "Hors ligne"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: Acces */}
        {tab === "acces" && (
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Bloquer/debloquer des sections pour les eleves.</div>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                { key: "jeux", label: "Jeux pedagogiques", desc: "Sort Race, Tree Builder, etc." },
                { key: "quiz_live", label: "Quiz Live", desc: "Kahoot en classe" },
                { key: "boss_final", label: "Boss Final", desc: "15 questions LO1-LO4" },
                { key: "exercices", label: "Exercices", desc: "14 exercices par chapitre" },
                { key: "exercices_entreprise", label: "Exercices Entreprise", desc: "5 cas" },
                { key: "projets", label: "Projets integrateurs", desc: "4 projets LO1-LO4" },
                { key: "classement", label: "Classement", desc: "Leaderboard XP" },
                { key: "documents_corriges", label: "Documents corriges", desc: "Corriges masques" },
              ].map(section => (
                <div key={section.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: C.card, borderRadius: 8, border: "1px solid " + C.border }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{section.label}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{section.desc}</div>
                  </div>
                  <button onClick={() => toggleLock(section.key)}
                    style={{ padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
                      background: locks[section.key] ? C.danger + "20" : C.success + "20",
                      color: locks[section.key] ? C.danger : C.success,
                    }}>
                    {locks[section.key] ? "BLOQUE" : "OUVERT"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
