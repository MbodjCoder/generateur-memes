"use client";

import { Download, Share2, Save, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utilitaires";
import { useState } from "react";

interface PropsBarreOutils {
  surExporter: (format: "png" | "jpeg") => void;
  surSauvegarder: () => void;
  surPartager: () => void;
  aUneImage: boolean;
  enSauvegarde: boolean;
}

// Barre d'outils pour les actions sur le mème
export default function BarreOutils({
  surExporter,
  surSauvegarder,
  surPartager,
  aUneImage,
  enSauvegarde,
}: PropsBarreOutils) {
  const [formatExport, setFormatExport] = useState<"png" | "jpeg">("png");

  const classesBouton = cn(
    "flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium",
    "transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-xl bg-carte border border-bordure">
      {/* Format d'export */}
      <div className="flex items-center gap-1 mr-1 sm:mr-2">
        <ImageIcon size={14} className="text-texte-secondaire hidden sm:block" />
        <select
          value={formatExport}
          onChange={(e) => setFormatExport(e.target.value as "png" | "jpeg")}
          className="text-xs bg-background border border-bordure rounded-lg px-1.5 sm:px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
        </select>
      </div>

      {/* Télécharger */}
      <button
        onClick={() => surExporter(formatExport)}
        disabled={!aUneImage}
        className={cn(classesBouton, "bg-accent text-white hover:bg-accent-sombre")}
      >
        <Download size={15} />
        <span className="hidden sm:inline">Télécharger</span>
      </button>

      {/* Sauvegarder dans la galerie */}
      <button
        onClick={surSauvegarder}
        disabled={!aUneImage || enSauvegarde}
        className={cn(
          classesBouton,
          "bg-succes text-white hover:bg-succes/90"
        )}
      >
        <Save size={15} />
        <span className="hidden sm:inline">
          {enSauvegarde ? "Sauvegarde..." : "Sauvegarder"}
        </span>
      </button>

      {/* Partager */}
      <button
        onClick={surPartager}
        disabled={!aUneImage}
        className={cn(
          classesBouton,
          "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        <Share2 size={15} />
        <span className="hidden sm:inline">Partager</span>
      </button>
    </div>
  );
}
