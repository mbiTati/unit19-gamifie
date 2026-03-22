import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unit 19 Gamifié — Data Structures & Algorithms",
  description: "Plateforme d'apprentissage gamifiée pour l'Unité 19 — Mme MBI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="light" style={{ colorScheme: "light" }}>
      <body style={{ background: "#FAFBFC", color: "#1B2A4A" }}>{children}</body>
    </html>
  );
}
