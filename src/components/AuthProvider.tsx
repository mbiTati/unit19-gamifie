"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  level: number;
  total_xp: number;
  class_name: string;
  cohort: string;
}

interface AuthCtx {
  user: any;
  student: Student | null;
  loading: boolean;
  isTeacher: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshStudent: () => Promise<void>;
  addXP: (points: number) => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(AuthContext);

export const LEVELS = [
  { name: "Noob Master", minXP: 0, color: "#94A3B8" },
  { name: "Noob Coder", minXP: 50, color: "#64748B" },
  { name: "Little Coder", minXP: 150, color: "#0891B2" },
  { name: "Vibe Coder", minXP: 300, color: "#16A34A" },
  { name: "Code Rookie", minXP: 500, color: "#F97316" },
  { name: "J Coder", minXP: 750, color: "#7C3AED" },
  { name: "Code Master", minXP: 1000, color: "#DC2626" },
  { name: "Code Legend", minXP: 1500, color: "#D97706" },
  { name: "Lord Coder", minXP: 2000, color: "#FBBF24" },
];

export function getLevel(xp: number) {
  let lvl = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.minXP) lvl = l; }
  const idx = LEVELS.indexOf(lvl);
  const nextLvl = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  const progress = nextLvl ? (xp - lvl.minXP) / (nextLvl.minXP - lvl.minXP) : 1;
  return { ...lvl, index: idx, progress, nextLvl };
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = async (email: string) => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.from("cq_students").select("*").eq("email", email).single();
      if (data) setStudent(data);
      return data;
    } catch { return null; }
  };

  const refreshStudent = async () => { if (user?.email) await fetchStudent(user.email); };

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) fetchStudent(session.user.email);
      setLoading(false);
    }).catch(() => setLoading(false));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) fetchStudent(session.user.email);
      else setStudent(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) return { error: { message: "Supabase non configure" } };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    if (!isSupabaseConfigured) return { error: { message: "Supabase non configure" } };
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (!error && data.user) {
      await supabase.from("cq_students").insert({
        email, first_name: firstName, last_name: lastName,
        role: "student", class_name: "BI2", cohort: "2025",
      });
    }
    return { error };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null); setStudent(null);
  };

  const addXP = async (points: number) => {
    if (!student) return;
    const newXP = (student.total_xp || 0) + points;
    const newLevel = getLevel(newXP).index;
    // Store XP locally (cq_students may not have total_xp column)
    setStudent({ ...student, total_xp: newXP, level: newLevel });
    // Try to save to Supabase if columns exist, ignore error if not
    if (isSupabaseConfigured) {
      try { await supabase.from("cq_students").update({ total_xp: newXP, level: newLevel }).eq("id", student.id); } catch {}
    }
  };

  return (
    <AuthContext.Provider value={{ user, student, loading, isTeacher: student?.role === "teacher", signIn, signUp, signOut, refreshStudent, addXP }}>
      {children}
    </AuthContext.Provider>
  );
}
