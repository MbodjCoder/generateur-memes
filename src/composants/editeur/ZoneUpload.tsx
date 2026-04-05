"use client";

import { useCallback, useState } from "react";
import { Upload, ImagePlus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utilitaires";

interface PropsZoneUpload {
  surSelection: (donnees: string) => void;
}

// Zone de glisser-déposer pour télécharger une image
export default function ZoneUpload({ surSelection }: PropsZoneUpload) {
  const [enSurvol, setEnSurvol] = useState(false);

  const traiterFichier = useCallback(
    (fichier: File) => {
      if (!fichier.type.startsWith("image/")) return;
      const lecteur = new FileReader();
      lecteur.onload = (e) => {
        const resultat = e.target?.result as string;
        if (resultat) surSelection(resultat);
      };
      lecteur.readAsDataURL(fichier);
    },
    [surSelection]
  );

  const surDeposer = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setEnSurvol(false);
      const fichier = e.dataTransfer.files[0];
      if (fichier) traiterFichier(fichier);
    },
    [traiterFichier]
  );

  const surChangement = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fichier = e.target.files?.[0];
      if (fichier) traiterFichier(fichier);
    },
    [traiterFichier]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onDragOver={(e) => {
        e.preventDefault();
        setEnSurvol(true);
      }}
      onDragLeave={() => setEnSurvol(false)}
      onDrop={surDeposer}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 p-12",
        "border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300",
        enSurvol
          ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20 scale-[1.02]"
          : "border-bordure hover:border-violet-400 hover:bg-carte-survol"
      )}
    >
      <div
        className={cn(
          "p-4 rounded-full transition-colors",
          enSurvol
            ? "bg-violet-100 dark:bg-violet-900/30"
            : "bg-gray-100 dark:bg-gray-800"
        )}
      >
        {enSurvol ? (
          <Upload size={32} className="text-violet-500" />
        ) : (
          <ImagePlus size={32} className="text-texte-secondaire" />
        )}
      </div>

      <div className="text-center">
        <p className="text-lg font-medium">
          {enSurvol ? "Déposez votre image ici" : "Glissez-déposez une image"}
        </p>
        <p className="text-sm text-texte-secondaire mt-1">
          ou cliquez pour parcourir vos fichiers
        </p>
        <p className="text-xs text-texte-secondaire mt-2">
          PNG, JPG, GIF, WebP — jusqu&apos;à 10 Mo
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={surChangement}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </motion.div>
  );
}
