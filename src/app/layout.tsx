import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Réclamation Bêta Fermé — PROTOCOLE Z : ORIGINS",
    template: "%s — PROTOCOLE Z : ORIGINS",
  },
  description:
    "Portail d'accréditation de la bêta fermée du serveur FiveM RP post-apocalyptique PROTOCOLE Z : ORIGINS.",
  applicationName: "PROTOCOLE Z : ORIGINS",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0f0e0c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
