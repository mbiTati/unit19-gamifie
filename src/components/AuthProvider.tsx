"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  level: number;
  total_xp: number;
  classe: string;
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

// 9 niveaux CodeQuest (partages entre les 3 apps)
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
  for (const l of LEVELS) {
    if (xp >= l.minXP) lvl = l;
  }
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
    const { data } = await supabase
      .from("cq_students")
      .select("*")
      .eq("email", email)
      .single();
    if (data) setStudent(data);
    return data;
  };

  const refreshStudent = async () => {
    if (user?.email) await fetchStudent(user.email);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) fetchStudent(session.user.email);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) fetchStudent(session.user.email);
      else setStudent(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (!error && data.user) {
      // Create student profile
      await supabase.from("cq_students").insert({
        email,
        first_name: firstName,
        last_name: lastName,
        role: "student",
        level: 0,
        total_xp: 0,
        classe: "BI1",
        cohort: "2025",
      });
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStudent(null);
  };

  const addXP = async (points: number) => {
    if (!student) return;
    const newXP = (student.total_xp || 0) + points;
    const newLevel = getLevel(newXP).index;
    await supabase
      .from("cq_students")
      .update({ total_xp: newXP, level: newLevel })
      .eq("id", student.id);
    setStudent({ ...student, total_xp: newXP, level: newLevel });
  };

  const isTeacher = student?.role === "teacher";

  return (
    <AuthContext.Provider value={{ user, student, loading, isTeacher, signIn, signUp, signOut, refreshStudent, addXP }}>
      {children}
    </AuthContext.Provider>
  );
}
