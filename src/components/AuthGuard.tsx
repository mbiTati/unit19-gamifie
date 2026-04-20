"use client";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, [user, loading]);

  if (loading) return <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Chargement...</div>;
  if (!user) return null;

  return <>{children}</>;
}
