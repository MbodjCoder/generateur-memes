"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

// Fournisseur de thème pour l'application
export default function FournisseurTheme({ enfants }: { enfants: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {enfants}
    </ThemeProvider>
  );
}
