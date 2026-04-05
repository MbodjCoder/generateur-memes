"use client";

import { Download, Share2, Save, RotateCcw, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utilitaires";
import { useState } from "react";

interface PropsBarreOutils {
  surExporter: (format: "png" | "jpeg") => void;
  surSauvegarder: () => void;
  surPartager: () => void;
  surReinitialiser: () => void;
  aUneImage: boolean;
  enSauvegarde: boolean;
}

// Barre d'outils pour les actions sur le mème
export default function BarreOutils({
  surExporter,
  surSauvegarder,
  surPartager,
  surReinitialiser,
  aUneImage,
  enSauvegarde,
}: PropsBarreOutils) {
  const [formatExport, setFormatExport] = useState<"png" | "jpeg">("png");

  const classesBouton = cn(
    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
    "transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
  );

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-carte border border-bordure">
      {/* Format d'export */}
      <div className="flex items-center gap-1 mr-2">
        <ImageIcon size={14} className="text-texte-secondaire" />
        <select
          value={formatExport}
          onChange={(e) => setFormatExport(e.target.value as "png" | "jpeg")}
          className="text-xs bg-background border border-bordure rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
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
        <Download size={16} />
        Télécharger
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
        <Save size={16} />
        {enSauvegarde ? "Sauvegarde..." : "Sauvegarder"}
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
        <Share2 size={16} />
        Partager
      </button>

      {/* Réinitialiser */}
      <button
        onClick={surReinitialiser}
        className={cn(
          classesBouton,
          "ml-auto bg-carte-survol hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
        )}
      >
        <RotateCcw size={16} />
        Réinitialiser
      </button>
    </div>
  );
}
