import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unit 19 — Data Structures & Algorithms",
  description: "CodeQuest — BTEC HND Computing — Ecole Schulz",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0a0f1a", color: "#e2e8f0", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
