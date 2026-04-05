"use client";

import { useEffect, useRef } from "react";
import { OptionMenuContextuel } from "@/lib/types";
import { cn } from "@/lib/utilitaires";

interface PropsMenuContextuel {
  x: number;
  y: number;
  options: OptionMenuContextuel[];
  surFermeture: () => void;
}

// Menu contextuel au clic droit — s'affiche n'importe où
export default function MenuContextuel({
  x,
  y,
  options,
  surFermeture,
}: PropsMenuContextuel) {
  const refMenu = useRef<HTMLDivElement>(null);

  // Fermer si on clique en dehors
  useEffect(() => {
    const gererClic = (e: MouseEvent) => {
      if (refMenu.current && !refMenu.current.contains(e.target as Node)) {
        surFermeture();
      }
    };
    const gererTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") surFermeture();
    };
    document.addEventListener("mousedown", gererClic);
    document.addEventListener("keydown", gererTouche);
    return () => {
      document.removeEventListener("mousedown", gererClic);
      document.removeEventListener("keydown", gererTouche);
    };
  }, [surFermeture]);

  return (
    <div
      ref={refMenu}
      className="absolute z-[100] min-w-[180px] py-1.5 rounded-xl bg-carte border border-bordure shadow-xl"
      style={{ left: x, top: y }}
    >
      {options.map((option, index) => (
        <div key={index}>
          {option.separateur && index > 0 && (
            <div className="my-1 border-t border-bordure" />
          )}
          <button
            onClick={() => {
              option.action();
              surFermeture();
            }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors",
              option.danger
                ? "text-danger hover:bg-red-50 dark:hover:bg-red-950/30"
                : "text-foreground hover:bg-carte-survol"
            )}
          >
            {option.icone}
            <span className="flex-1 text-left">{option.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
