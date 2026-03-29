import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unit 19 — Data Structures & Algorithms",
  description: "Plateforme gamifiee BTEC HND Computing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0B1120", color: "#E2E8F0" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
