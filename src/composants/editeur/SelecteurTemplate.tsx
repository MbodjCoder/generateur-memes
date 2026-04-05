"use client";

import { TEMPLATES_MEMES } from "@/lib/constantes";
import { cn } from "@/lib/utilitaires";
import { LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

interface PropsSelecteurTemplate {
  surSelection: (donnees: string) => void;
}

// Sélecteur de templates de mèmes pré-chargés
export default function SelecteurTemplate({ surSelection }: PropsSelecteurTemplate) {
  const chargerTemplate = async (apercu: string | null) => {
    if (!apercu) return;
    // Charger l'image du template
    try {
      const reponse = await fetch(apercu);
      const blob = await reponse.blob();
      const lecteur = new FileReader();
      lecteur.onload = (e) => {
        const resultat = e.target?.result as string;
        if (resultat) surSelection(resultat);
      };
      lecteur.readAsDataURL(blob);
    } catch {
      console.error("Erreur lors du chargement du template");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <LayoutGrid size={16} className="text-accent" />
        Templates populaires
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES_MEMES.filter((t) => t.apercu).map((template, index) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => chargerTemplate(template.apercu)}
            className={cn(
              "relative group rounded-lg overflow-hidden border border-bordure",
              "hover:border-accent hover:shadow-lg transition-all duration-200"
            )}
          >
            <div className="aspect-square bg-carte-survol flex items-center justify-center">
              {template.apercu ? (
                <img
                  src={template.apercu}
                  alt={template.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-texte-secondaire text-xs">{template.nom}</span>
              )}
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
              <span className="w-full text-center text-xs text-white font-medium py-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                {template.nom}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
