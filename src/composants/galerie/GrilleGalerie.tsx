"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ImageOff, RefreshCw, Loader2, ArrowLeft } from "lucide-react";
import CarteMeme from "./CarteMeme";
import EditeurMeme from "@/composants/editeur/EditeurMeme";
import { MemeAPI } from "@/lib/types";
import { obtenirIdUtilisateur } from "@/lib/utilitaires";

// Grille affichant les mèmes de l'utilisateur avec édition intégrée
export default function GrilleGalerie() {
  const [memes, setMemes] = useState<MemeAPI[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [memeEnEdition, setMemeEnEdition] = useState<MemeAPI | null>(null);

  const chargerMemes = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const uid = obtenirIdUtilisateur();
      const reponse = await fetch(`/api/memes?uid=${uid}`);
      if (!reponse.ok) throw new Error("Erreur");
      setMemes(await reponse.json());
    } catch {
      setErreur("Impossible de charger les mèmes.");
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    chargerMemes();
  }, [chargerMemes]);

  const supprimerMeme = async (id: string) => {
    try {
      const reponse = await fetch(`/api/memes/${id}`, { method: "DELETE" });
      if (reponse.ok) setMemes((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // Silencieux
    }
  };

  const retourGalerie = () => {
    setMemeEnEdition(null);
    chargerMemes();
  };

  // Mode édition
  if (memeEnEdition) {
    return (
      <div>
        <button
          onClick={retourGalerie}
          className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-texte-secondaire hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Retour à la galerie
        </button>
        <EditeurMeme
          imageInitiale={memeEnEdition.imageDonnees}
          idMemeEdite={memeEnEdition.id}
        />
      </div>
    );
  }

  if (chargement) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 size={32} className="text-accent animate-spin" />
        <p className="text-texte-secondaire">Chargement de la galerie...</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-danger">{erreur}</p>
        <button
          onClick={chargerMemes}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-sombre transition-colors"
        >
          <RefreshCw size={16} />
          Réessayer
        </button>
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <div className="p-4 rounded-full bg-carte-survol">
          <ImageOff size={40} className="text-texte-secondaire" />
        </div>
        <h3 className="text-lg font-medium">Aucun mème pour le moment</h3>
        <p className="text-texte-secondaire text-center max-w-md">
          Créez votre premier mème et il apparaîtra ici.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-texte-secondaire">
          {memes.length} mème{memes.length > 1 ? "s" : ""} — cliquez pour modifier
        </p>
        <button
          onClick={chargerMemes}
          className="flex items-center gap-1.5 text-sm text-texte-secondaire hover:text-foreground transition-colors"
        >
          <RefreshCw size={14} />
          Actualiser
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {memes.map((meme, index) => (
          <CarteMeme
            key={meme.id}
            meme={meme}
            index={index}
            surSupprimer={supprimerMeme}
            surModifier={setMemeEnEdition}
          />
        ))}
      </div>
    </div>
  );
}
