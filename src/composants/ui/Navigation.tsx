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
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-12 sm:h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Pen size={14} className="text-white sm:hidden" />
            <Pen size={16} className="text-white hidden sm:block" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            Mème<span className="text-accent">Studio</span>
          </span>
        </Link>

        {/* Liens */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {liens.map((lien) => {
            const estActif = chemin === lien.href;
            const Icone = lien.icone;
            return (
              <Link
                key={lien.href}
                href={lien.href}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200",
                  estActif
                    ? "bg-accent-clair text-accent-sombre dark:text-accent"
                    : "text-texte-secondaire hover:bg-carte-survol hover:text-foreground"
                )}
              >
                <Icone size={16} />
                {lien.label}
              </Link>
            );
          })}
          <div className="ml-1.5 sm:ml-2 pl-1.5 sm:pl-2 border-l border-bordure">
            <BoutonTheme />
          </div>
        </div>
      </div>
    </nav>
  );
}
