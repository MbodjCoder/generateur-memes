"use client";

import { ElementImage } from "@/lib/types";
import { cn } from "@/lib/utilitaires";
import {
  Image,
  Trash2,
  FlipHorizontal,
  FlipVertical,
  Eye,
  RotateCw,
  Lock,
  Unlock,
  Square,
} from "lucide-react";

interface PropsControlesImage {
  element: ElementImage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  surChangement: (id: string, partiel: Record<string, any>) => void;
  surSuppression: (id: string) => void;
}

const MODES_AJUSTEMENT = [
  { valeur: "contenir", label: "Contenir" },
  { valeur: "couvrir", label: "Couvrir" },
  { valeur: "remplir", label: "Remplir" },
  { valeur: "etirer", label: "Étirer" },
] as const;

// Panneau de contrôle pour les éléments image
export default function ControlesImage({
  element,
  surChangement,
  surSuppression,
}: PropsControlesImage) {
  const modifier = (partiel: Partial<ElementImage>) => {
    surChangement(element.id, partiel);
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-carte border border-bordure">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Image size={16} className="text-accent" />
          Propriétés de l&apos;image
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => modifier({ verrouille: !element.verrouille })}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              element.verrouille
                ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30"
                : "text-texte-secondaire hover:bg-carte-survol"
            )}
            title={element.verrouille ? "Déverrouiller" : "Verrouiller"}
          >
            {element.verrouille ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
          <button
            onClick={() => surSuppression(element.id)}
            className="p-1.5 rounded-lg text-danger hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
            title="Supprimer cette image"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Mode d'ajustement */}
      <div>
        <label className="text-xs text-texte-secondaire mb-1.5 block">Ajustement</label>
        <div className="grid grid-cols-4 gap-1">
          {MODES_AJUSTEMENT.map((mode) => (
            <button
              key={mode.valeur}
              onClick={() => modifier({ ajustement: mode.valeur })}
              className={cn(
                "px-2 py-1.5 rounded-lg text-xs font-medium transition-colors",
                element.ajustement === mode.valeur
                  ? "bg-accent text-white"
                  : "bg-carte-survol hover:bg-bordure"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opacité */}
      <div>
        <label className="text-xs text-texte-secondaire mb-1 flex items-center gap-1">
          <Eye size={12} />
          Opacité : {Math.round(element.opacite * 100)}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(element.opacite * 100)}
          onChange={(e) => modifier({ opacite: Number(e.target.value) / 100 })}
          className="w-full accent-accent"
        />
      </div>

      {/* Rotation */}
      <div>
        <label className="text-xs text-texte-secondaire mb-1 flex items-center gap-1">
          <RotateCw size={12} />
          Rotation : {Math.round(element.rotation)}°
        </label>
        <input
          type="range"
          min={-180}
          max={180}
          value={element.rotation}
          onChange={(e) => modifier({ rotation: Number(e.target.value) })}
          className="w-full accent-accent"
        />
      </div>

      {/* Coins arrondis */}
      <div>
        <label className="text-xs text-texte-secondaire mb-1 flex items-center gap-1">
          <Square size={12} />
          Coins arrondis : {element.bordureRayon}px
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={element.bordureRayon}
          onChange={(e) => modifier({ bordureRayon: Number(e.target.value) })}
          className="w-full accent-accent"
        />
      </div>

      {/* Retournement */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => modifier({ inverserX: !element.inverserX })}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
            element.inverserX
              ? "bg-accent text-white"
              : "bg-carte-survol hover:bg-bordure"
          )}
        >
          <FlipHorizontal size={14} />
          Horizontal
        </button>
        <button
          onClick={() => modifier({ inverserY: !element.inverserY })}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
            element.inverserY
              ? "bg-accent text-white"
              : "bg-carte-survol hover:bg-bordure"
          )}
        >
          <FlipVertical size={14} />
          Vertical
        </button>
      </div>
    </div>
  );
}
