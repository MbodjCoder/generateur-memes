"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utilitaires";

// Bouton de basculement entre le thème clair et sombre
export default function BoutonTheme() {
  const { theme, setTheme } = useTheme();
  const [monte, setMonte] = useState(false);

  useEffect(() => setMonte(true), []);

  if (!monte) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "p-2 rounded-lg transition-colors duration-200",
        "hover:bg-carte-survol",
        "text-texte-secondaire hover:text-foreground"
      )}
      aria-label="Basculer le thème"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
