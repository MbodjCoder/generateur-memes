import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/composants/ui/Navigation";
import FournisseurTheme from "@/composants/ui/FournisseurTheme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MèmeStudio — Générateur de Mèmes",
  description:
    "Créez, personnalisez et partagez vos mèmes en quelques clics. Éditeur professionnel avec aperçu en temps réel.",
};

export default function LayoutPrincipal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <FournisseurTheme enfants={
          <>
            <Navigation />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-bordure py-4 text-center text-xs text-texte-secondaire">
              MèmeStudio &copy; {new Date().getFullYear()}
            </footer>
          </>
        } />
      </body>
    </html>
  );
}
