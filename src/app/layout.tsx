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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
