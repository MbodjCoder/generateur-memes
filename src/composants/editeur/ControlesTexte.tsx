"use client";

import { ElementTexte } from "@/lib/types";
import { POLICES_DISPONIBLES, COULEURS_PREDEFINIES } from "@/lib/constantes";
import { cn } from "@/lib/utilitaires";
import {
  Bold,
  Italic,
  RotateCw,
  Type,
  Palette,
  Minus,
  Plus,
  Trash2,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";

interface PropsControlesTexte {
  element: ElementTexte;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  surChangement: (id: string, partiel: Record<string, any>) => void;
  surSuppression: (id: string) => void;
}

// Panneau de contrôle pour les éléments texte
export default function ControlesTexte({
  element,
  surChangement,
  surSuppression,
}: PropsControlesTexte) {
  const modifier = (partiel: Partial<ElementTexte>) => {
    surChangement(element.id, partiel);
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-carte border border-bordure">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Type size={16} className="text-accent" />
          Propriétés du texte
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
            title="Supprimer ce texte"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Contenu */}
      <input
        type="text"
        value={element.contenu}
        onChange={(e) => modifier({ contenu: e.target.value })}
        placeholder="Saisissez votre texte..."
        className={cn(
          "w-full px-3 py-2 rounded-lg text-sm",
          "bg-background border border-bordure",
          "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
          "placeholder:text-texte-secondaire"
        )}
      />

      {/* Police */}
      <div>
        <label className="text-xs text-texte-secondaire mb-1 block">Police</label>
        <select
          value={element.police}
          onChange={(e) => modifier({ police: e.target.value })}
          className="w-full px-3 py-2 rounded-lg text-sm bg-background border border-bordure focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {POLICES_DISPONIBLES.map((p) => (
            <option key={p.valeur} value={p.valeur} style={{ fontFamily: p.valeur }}>
              {p.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Taille */}
      <div>
        <label className="text-xs text-texte-secondaire mb-1 block">
          Taille : {element.taille}px
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => modifier({ taille: Math.max(12, element.taille - 2) })}
            className="p-1 rounded hover:bg-carte-survol"
          >
            <Minus size={14} />
          </button>
          <input
            type="range"
            min={12}
            max={120}
            value={element.taille}
            onChange={(e) => modifier({ taille: Number(e.target.value) })}
            className="flex-1 accent-accent"
          />
          <button
            onClick={() => modifier({ taille: Math.min(120, element.taille + 2) })}
            className="p-1 rounded hover:bg-carte-survol"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Couleur du texte */}
      <div>
        <label className="text-xs text-texte-secondaire mb-1 flex items-center gap-1">
          <Palette size={12} />
          Couleur
        </label>
        <div className="flex items-center gap-1.5 flex-wrap">
          {COULEURS_PREDEFINIES.map((c) => (
            <button
              key={c}
              onClick={() => modifier({ couleur: c })}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                element.couleur === c
                  ? "border-accent scale-110 ring-2 ring-accent/30"
                  : "border-bordure"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={element.couleur}
            onChange={(e) => modifier({ couleur: e.target.value })}
            className="w-7 h-7 rounded-full border border-bordure cursor-pointer"
          />
        </div>
      </div>

      {/* Contour */}
      <div>
        <label className="text-xs text-texte-secondaire mb-1 block">Contour</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.couleurContour}
            onChange={(e) => modifier({ couleurContour: e.target.value })}
            className="w-8 h-8 rounded border border-bordure cursor-pointer"
          />
          <input
            type="range"
            min={0}
            max={10}
            value={element.epaisseurContour}
            onChange={(e) => modifier({ epaisseurContour: Number(e.target.value) })}
            className="flex-1 accent-accent"
          />
          <span className="text-xs text-texte-secondaire w-8">
            {element.epaisseurContour}px
          </span>
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

      {/* Style */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => modifier({ gras: !element.gras })}
          className={cn(
            "p-2 rounded-lg transition-colors",
            element.gras ? "bg-accent text-white" : "bg-carte-survol hover:bg-bordure"
          )}
          title="Gras"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => modifier({ italique: !element.italique })}
          className={cn(
            "p-2 rounded-lg transition-colors",
            element.italique ? "bg-accent text-white" : "bg-carte-survol hover:bg-bordure"
          )}
          title="Italique"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => modifier({ ombre: !element.ombre })}
          className={cn(
            "p-2 rounded-lg transition-colors text-xs font-medium",
            element.ombre ? "bg-accent text-white" : "bg-carte-survol hover:bg-bordure"
          )}
          title="Ombre"
        >
          Ombre
        </button>
        <div className="flex items-center gap-1 ml-auto">
          <RotateCw size={14} className="text-texte-secondaire" />
          <input
            type="range"
            min={-180}
            max={180}
            value={element.rotation}
            onChange={(e) => modifier({ rotation: Number(e.target.value) })}
            className="w-20 accent-accent"
          />
          <span className="text-xs text-texte-secondaire w-8">
            {element.rotation}°
          </span>
        </div>
      </div>
    </div>
  );
}
