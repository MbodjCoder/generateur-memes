"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image, PlusCircle, Pen } from "lucide-react";
import { cn } from "@/lib/utilitaires";
import BoutonTheme from "./BoutonTheme";

// Barre de navigation principale
export default function Navigation() {
  const chemin = usePathname();

  const liens = [
    { href: "/", label: "Créer", icone: PlusCircle },
    { href: "/galerie", label: "Galerie", icone: Image },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-bordure bg-carte/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Pen size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Mème<span className="text-accent">Studio</span>
          </span>
        </Link>

        {/* Liens */}
        <div className="flex items-center gap-1">
          {liens.map((lien) => {
            const estActif = chemin === lien.href;
            const Icone = lien.icone;
            return (
              <Link
                key={lien.href}
                href={lien.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  estActif
                    ? "bg-accent-clair text-accent-sombre dark:text-accent"
                    : "text-texte-secondaire hover:bg-carte-survol hover:text-foreground"
                )}
              >
                <Icone size={18} />
                {lien.label}
              </Link>
            );
          })}
          <div className="ml-2 pl-2 border-l border-bordure">
            <BoutonTheme />
          </div>
        </div>
      </div>
    </nav>
  );
}
