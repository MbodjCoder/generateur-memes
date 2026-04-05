"use client";

import { motion } from "framer-motion";
import { Download, Trash2, Share2, Calendar, Pencil } from "lucide-react";
import { cn } from "@/lib/utilitaires";
import { MemeAPI } from "@/lib/types";

interface PropsCarteMeme {
  meme: MemeAPI;
  index: number;
  surSupprimer: (id: string) => void;
  surModifier: (meme: MemeAPI) => void;
}

// Carte affichant un mème dans la galerie
export default function CarteMeme({
  meme,
  index,
  surSupprimer,
  surModifier,
}: PropsCarteMeme) {
  const dateFormatee = new Date(meme.dateCreation).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const telecharger = (e: React.MouseEvent) => {
    e.stopPropagation();
    const lien = document.createElement("a");
    lien.download = `${meme.titre || "meme"}.png`;
    lien.href = meme.imageDonnees;
    lien.click();
  };

  const partager = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const reponse = await fetch(meme.imageDonnees);
    const blob = await reponse.blob();
    const fichier = new File([blob], `${meme.titre}.png`, { type: "image/png" });

    if (navigator.share) {
      try {
        await navigator.share({ title: meme.titre, files: [fichier] });
      } catch {
        // Annulé
      }
    } else {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
      } catch {
        // Non supporté
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => surModifier(meme)}
      className={cn(
        "group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer",
        "bg-carte border border-bordure",
        "hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30",
        "transition-all duration-300"
      )}
    >
      {/* Image du mème */}
      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          src={meme.imageDonnees}
          alt={meme.titre}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Bouton supprimer — toujours visible */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          surSupprimer(meme.id);
        }}
        className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors shadow-sm"
        title="Supprimer"
      >
        <Trash2 size={14} />
      </button>

      {/* Actions supplémentaires au survol (desktop) */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 sm:p-3 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              surModifier(meme);
            }}
            className="p-1.5 sm:p-2 rounded-lg bg-accent/40 backdrop-blur-sm hover:bg-accent/60 text-white transition-colors"
            title="Modifier"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={telecharger}
            className="p-1.5 sm:p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-colors"
            title="Télécharger"
          >
            <Download size={14} />
          </button>
          <button
            onClick={partager}
            className="p-1.5 sm:p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-colors"
            title="Partager"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* Infos */}
      <div className="p-2 sm:p-3">
        <h3 className="font-medium text-xs sm:text-sm truncate">{meme.titre}</h3>
        <p className="text-[10px] sm:text-xs text-texte-secondaire flex items-center gap-1 mt-0.5 sm:mt-1">
          <Calendar size={10} />
          {dateFormatee}
        </p>
      </div>
    </motion.div>
  );
}
