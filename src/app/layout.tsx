import "./globals.css";

export const metadata = {
  title: "Unit 19 Gamifié — Data Structures & Algorithms",
  description: "Plateforme d'apprentissage gamifiée pour l'Unité 19 — Mme MBI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" style={{ colorScheme: "dark" }}>
      <head><meta name="color-scheme" content="dark" /></head>
      <body style={{ background: "#0B1120", color: "#E2E8F0" }}>{children}</body>
    </html>
  );
}
