"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Type,
  ImagePlus,
  ChevronUp,
  ChevronDown,
  Copy,
  Clipboard,
  Trash2,
  Layers,
  RotateCcw,
} from "lucide-react";
import ZoneUpload from "./ZoneUpload";
import ControlesTexte from "./ControlesTexte";
import ControlesImage from "./ControlesImage";
import BarreOutils from "./BarreOutils";
import SelecteurTemplate from "./SelecteurTemplate";
import MenuContextuel from "@/composants/ui/MenuContextuel";
import {
  ElementCanvas,
  ElementTexte,
  OptionMenuContextuel,
  creerElementTexte,
  creerElementImage,
  genererId,
} from "@/lib/types";
import { LARGEUR_CANVAS, HAUTEUR_CANVAS } from "@/lib/constantes";
import type { RefCanvasMeme } from "./CanvasMeme";
import { cn } from "@/lib/utilitaires";

const CanvasMeme = dynamic(() => import("./CanvasMeme"), { ssr: false });

interface PropsEditeurMeme {
  imageInitiale?: string | null;
  idMemeEdite?: string | null;
}

// Éditeur de mèmes professionnel — multi-couches, raccourcis, menu contextuel
export default function EditeurMeme({
  imageInitiale = null,
  idMemeEdite = null,
}: PropsEditeurMeme) {
  const [imageFond, setImageFond] = useState<string | null>(imageInitiale);
  const [elements, setElements] = useState<ElementCanvas[]>([]);
  const [idSelectionne, setIdSelectionne] = useState<string | null>(null);
  const [enSauvegarde, setEnSauvegarde] = useState(false);
  const [messageNotification, setMessageNotification] = useState<string | null>(null);
  const [pressePapiers, setPressePapiers] = useState<ElementCanvas | null>(null);
  const [menuContextuel, setMenuContextuel] = useState<{
    x: number;
    y: number;
    idElement: string | null;
  } | null>(null);
  const refCanvas = useRef<RefCanvasMeme>(null);
  const refInputImage = useRef<HTMLInputElement>(null);

  const elementSelectionne = elements.find((e) => e.id === idSelectionne) ?? null;
  const ordreMax = elements.length > 0 ? Math.max(...elements.map((e) => e.ordre)) : 0;

  // Notification temporaire
  const notifier = useCallback((message: string) => {
    setMessageNotification(message);
    setTimeout(() => setMessageNotification(null), 3000);
  }, []);

  // --- Actions sur les éléments ---

  const ajouterTexte = useCallback(() => {
    const dims = refCanvas.current?.obtenirDimensions() ?? {
      largeur: LARGEUR_CANVAS,
      hauteur: HAUTEUR_CANVAS,
    };
    const nouveau = creerElementTexte(dims.largeur, dims.hauteur, ordreMax + 1);
    setElements((prev) => [...prev, nouveau]);
    setIdSelectionne(nouveau.id);
    setMenuContextuel(null);
  }, [ordreMax]);

  const ajouterImage = useCallback(
    (source: string) => {
      const dims = refCanvas.current?.obtenirDimensions() ?? {
        largeur: LARGEUR_CANVAS,
        hauteur: HAUTEUR_CANVAS,
      };
      const nouveau = creerElementImage(source, dims.largeur, dims.hauteur, ordreMax + 1);
      setElements((prev) => [...prev, nouveau]);
      setIdSelectionne(nouveau.id);
      setMenuContextuel(null);
    },
    [ordreMax]
  );

  const surUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fichier = e.target.files?.[0];
      if (!fichier || !fichier.type.startsWith("image/")) return;
      const lecteur = new FileReader();
      lecteur.onload = (ev) => {
        const resultat = ev.target?.result as string;
        if (resultat) ajouterImage(resultat);
      };
      lecteur.readAsDataURL(fichier);
      e.target.value = "";
    },
    [ajouterImage]
  );

  const mettreAJourElement = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (id: string, partiel: Record<string, any>) => {
      setElements((prev) =>
        prev.map((el) =>
          el.id === id ? ({ ...el, ...partiel } as typeof el) : el
        )
      );
    },
    []
  );

  const modifierTexteInline = useCallback(
    (id: string, contenu: string) => {
      mettreAJourElement(id, { contenu });
    },
    [mettreAJourElement]
  );

  const supprimerElement = useCallback(
    (id: string) => {
      setElements((prev) => prev.filter((el) => el.id !== id));
      if (idSelectionne === id) setIdSelectionne(null);
      setMenuContextuel(null);
    },
    [idSelectionne]
  );

  const copierElement = useCallback(
    (id: string) => {
      const el = elements.find((e) => e.id === id);
      if (el) {
        setPressePapiers({ ...el });
        notifier("Copié");
      }
    },
    [elements, notifier]
  );

  const collerElement = useCallback(() => {
    if (!pressePapiers) {
      notifier("Rien à coller");
      return;
    }
    const copie: ElementCanvas = {
      ...pressePapiers,
      id: genererId(),
      x: pressePapiers.x + 20,
      y: pressePapiers.y + 20,
      ordre: ordreMax + 1,
    } as ElementCanvas;
    setElements((prev) => [...prev, copie]);
    setIdSelectionne(copie.id);
    setMenuContextuel(null);
    notifier("Collé");
  }, [pressePapiers, ordreMax, notifier]);

  // Ordre des couches
  const monterCouche = useCallback(
    (id: string) => {
      setElements((prev) => {
        const tries = [...prev].sort((a, b) => a.ordre - b.ordre);
        const index = tries.findIndex((e) => e.id === id);
        if (index < tries.length - 1) {
          const ordreActuel = tries[index].ordre;
          tries[index].ordre = tries[index + 1].ordre;
          tries[index + 1].ordre = ordreActuel;
        }
        return [...tries];
      });
    },
    []
  );

  const descendreCouche = useCallback(
    (id: string) => {
      setElements((prev) => {
        const tries = [...prev].sort((a, b) => a.ordre - b.ordre);
        const index = tries.findIndex((e) => e.id === id);
        if (index > 0) {
          const ordreActuel = tries[index].ordre;
          tries[index].ordre = tries[index - 1].ordre;
          tries[index - 1].ordre = ordreActuel;
        }
        return [...tries];
      });
    },
    []
  );

  // Supprimer l'image de fond
  const supprimerFond = useCallback(() => {
    setImageFond(null);
    setMenuContextuel(null);
  }, []);

  // --- Raccourcis clavier ---

  useEffect(() => {
    const gererTouche = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement;
      if (
        cible.tagName === "INPUT" ||
        cible.tagName === "TEXTAREA" ||
        cible.tagName === "SELECT"
      )
        return;

      if ((e.ctrlKey || e.metaKey) && e.key === "c" && idSelectionne) {
        e.preventDefault();
        copierElement(idSelectionne);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        e.preventDefault();
        collerElement();
      }

      if ((e.key === "Delete" || e.key === "Backspace") && idSelectionne) {
        e.preventDefault();
        supprimerElement(idSelectionne);
      }

      if (e.key === "Escape") {
        setIdSelectionne(null);
        setMenuContextuel(null);
      }
    };

    window.addEventListener("keydown", gererTouche);
    return () => window.removeEventListener("keydown", gererTouche);
  }, [idSelectionne, copierElement, collerElement, supprimerElement]);

  // --- Menu contextuel ---

  const surMenuContextuel = useCallback(
    (x: number, y: number, idElement: string | null) => {
      setMenuContextuel({ x, y, idElement });
      if (idElement) setIdSelectionne(idElement);
    },
    []
  );

  const construireOptionsMenu = useCallback((): OptionMenuContextuel[] => {
    if (!menuContextuel) return [];
    const { idElement } = menuContextuel;

    if (idElement) {
      return [
        {
          label: "Copier",
          icone: <Copy size={15} />,
          action: () => copierElement(idElement),
        },
        {
          label: "Coller",
          icone: <Clipboard size={15} />,
          action: collerElement,
        },
        {
          label: "Monter d'un niveau",
          icone: <ChevronUp size={15} />,
          action: () => monterCouche(idElement),
          separateur: true,
        },
        {
          label: "Descendre d'un niveau",
          icone: <ChevronDown size={15} />,
          action: () => descendreCouche(idElement),
        },
        {
          label: "Supprimer",
          icone: <Trash2 size={15} />,
          action: () => supprimerElement(idElement),
          danger: true,
          separateur: true,
        },
      ];
    }

    return [
      {
        label: "Ajouter un texte",
        icone: <Type size={15} />,
        action: ajouterTexte,
      },
      {
        label: "Ajouter une image",
        icone: <ImagePlus size={15} />,
        action: () => refInputImage.current?.click(),
      },
      {
        label: "Coller",
        icone: <Clipboard size={15} />,
        action: collerElement,
        separateur: true,
      },
      {
        label: "Supprimer le fond",
        icone: <Trash2 size={15} />,
        action: supprimerFond,
        danger: true,
        separateur: true,
      },
    ];
  }, [
    menuContextuel,
    copierElement,
    collerElement,
    monterCouche,
    descendreCouche,
    supprimerElement,
    ajouterTexte,
    supprimerFond,
  ]);

  // --- Export / Sauvegarde / Partage ---

  const exporterMeme = useCallback(
    (format: "png" | "jpeg") => {
      setMenuContextuel(null);
      const donnees = refCanvas.current?.exporterImage(format);
      if (!donnees) return;
      const lien = document.createElement("a");
      lien.download = `meme-studio.${format}`;
      lien.href = donnees;
      lien.click();
      notifier(`Téléchargé en ${format.toUpperCase()}`);
    },
    [notifier]
  );

  const sauvegarderMeme = useCallback(async () => {
    setMenuContextuel(null);
    const donnees = refCanvas.current?.exporterImage("png");
    if (!donnees) return;

    setEnSauvegarde(true);
    try {
      const titreAuto =
        (elements.find((e) => e.type === "texte") as ElementTexte | undefined)
          ?.contenu || "Mon mème";
      const url = idMemeEdite ? `/api/memes/${idMemeEdite}` : "/api/memes";
      const methode = idMemeEdite ? "PUT" : "POST";

      const reponse = await fetch(url, {
        method: methode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: titreAuto,
          imageDonnees: donnees,
          texteHaut: null,
          texteBas: null,
        }),
      });

      notifier(
        reponse.ok
          ? idMemeEdite
            ? "Mème mis à jour !"
            : "Sauvegardé dans la galerie !"
          : "Erreur lors de la sauvegarde."
      );
    } catch {
      notifier("Erreur de connexion.");
    } finally {
      setEnSauvegarde(false);
    }
  }, [elements, idMemeEdite, notifier]);

  const partagerMeme = useCallback(async () => {
    setMenuContextuel(null);
    const donnees = refCanvas.current?.exporterImage("png");
    if (!donnees) return;

    const reponse = await fetch(donnees);
    const blob = await reponse.blob();
    const fichier = new File([blob], "meme-studio.png", { type: "image/png" });

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mon mème — MèmeStudio",
          text: "Regarde ce mème !",
          files: [fichier],
        });
      } catch {
        // Annulé
      }
    } else {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        notifier("Image copiée dans le presse-papiers");
      } catch {
        notifier("Partage non disponible");
      }
    }
  }, [notifier]);

  const reinitialiser = useCallback(() => {
    setImageFond(null);
    setElements([]);
    setIdSelectionne(null);
    setMenuContextuel(null);
  }, []);

  // --- Rendu ---

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Input caché pour ajout d'image */}
      <input
        ref={refInputImage}
        type="file"
        accept="image/*"
        onChange={surUploadImage}
        className="hidden"
      />

      {/* Notification */}
      {messageNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl bg-accent text-white font-medium shadow-lg text-sm"
        >
          {messageNotification}
        </motion.div>
      )}

      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4 sm:mb-8"
      >
        <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
          {idMemeEdite ? "Modifier votre " : "Créez votre "}
          <span className="text-accent">mème</span>
        </h1>
        <p className="text-texte-secondaire text-xs sm:text-sm hidden sm:block">
          {idMemeEdite
            ? "Modifiez et sauvegardez votre création"
            : "Ctrl+C / Ctrl+V • Clic droit pour les options • Double-clic pour éditer"}
        </p>
      </motion.div>

      {/* Zone d'upload si pas d'image de fond */}
      {!imageFond && (
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <ZoneUpload surSelection={setImageFond} />
          <SelecteurTemplate surSelection={setImageFond} />
        </div>
      )}

      {/* Éditeur */}
      {imageFond && (
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-4 sm:gap-6">
          {/* Colonne gauche : Boutons d'action + Canvas + Barre d'outils */}
          <div className="space-y-3 sm:space-y-4 relative">
            {/* Boutons Texte / Image / Réinitialiser — AU-DESSUS du canvas */}
            <div className="flex items-center gap-2">
              <button
                onClick={ajouterTexte}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-accent text-white font-medium text-xs sm:text-sm hover:bg-accent-sombre transition-colors"
              >
                <Type size={15} />
                Texte
              </button>
              <button
                onClick={() => refInputImage.current?.click()}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-carte border border-bordure font-medium text-xs sm:text-sm hover:bg-carte-survol transition-colors"
              >
                <ImagePlus size={15} />
                Image
              </button>
              <button
                onClick={reinitialiser}
                className="ml-auto p-2 sm:p-2.5 rounded-xl bg-carte border border-bordure hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
                title="Réinitialiser"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <CanvasMeme
              ref={refCanvas}
              imageFond={imageFond}
              elements={elements}
              idSelectionne={idSelectionne}
              surSelectionElement={(id) => {
                setIdSelectionne(id);
                setMenuContextuel(null);
              }}
              surMiseAJourElement={mettreAJourElement}
              surModificationTexteInline={modifierTexteInline}
              surMenuContextuel={surMenuContextuel}
            />

            {/* Menu contextuel */}
            {menuContextuel && (
              <MenuContextuel
                x={menuContextuel.x}
                y={menuContextuel.y}
                options={construireOptionsMenu()}
                surFermeture={() => setMenuContextuel(null)}
              />
            )}

            <BarreOutils
              surExporter={exporterMeme}
              surSauvegarder={sauvegarderMeme}
              surPartager={partagerMeme}
              aUneImage={!!imageFond}
              enSauvegarde={enSauvegarde}
            />
          </div>

          {/* Colonne droite : Contrôles (sur mobile = en dessous) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 sm:space-y-4"
          >
            {/* Contrôles de l'élément sélectionné */}
            {elementSelectionne?.type === "texte" && (
              <ControlesTexte
                element={elementSelectionne}
                surChangement={mettreAJourElement}
                surSuppression={supprimerElement}
              />
            )}
            {elementSelectionne?.type === "image" && (
              <ControlesImage
                element={elementSelectionne}
                surChangement={mettreAJourElement}
                surSuppression={supprimerElement}
              />
            )}

            {/* Info si rien de sélectionné */}
            {!elementSelectionne && elements.length === 0 && (
              <div className="text-center py-4 sm:py-6 text-texte-secondaire text-xs sm:text-sm">
                <Type size={24} className="mx-auto mb-2 opacity-40" />
                <p>Ajoutez du texte ou une image</p>
                <p className="text-xs mt-1 opacity-70 hidden sm:block">
                  Clic droit sur le canvas pour plus d&apos;options
                </p>
              </div>
            )}

            {/* Liste des couches */}
            {elements.length > 0 && (
              <div className="p-2.5 sm:p-3 rounded-xl bg-carte border border-bordure">
                <h3 className="text-xs font-semibold text-texte-secondaire mb-2 flex items-center gap-1.5">
                  <Layers size={13} />
                  Couches ({elements.length})
                </h3>
                <div className="space-y-1 max-h-36 sm:max-h-48 overflow-y-auto">
                  {[...elements]
                    .sort((a, b) => b.ordre - a.ordre)
                    .map((el) => (
                      <div
                        key={el.id}
                        onClick={() => setIdSelectionne(el.id)}
                        className={cn(
                          "flex items-center gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg cursor-pointer text-xs transition-colors",
                          idSelectionne === el.id
                            ? "bg-accent/10 text-accent border border-accent/30"
                            : "hover:bg-carte-survol"
                        )}
                      >
                        {el.type === "texte" ? (
                          <Type size={12} className="shrink-0" />
                        ) : (
                          <ImagePlus size={12} className="shrink-0" />
                        )}
                        <span className="truncate flex-1">
                          {el.type === "texte"
                            ? (el as ElementTexte).contenu || "Texte vide"
                            : "Image"}
                        </span>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              monterCouche(el.id);
                            }}
                            className="p-0.5 rounded hover:bg-bordure"
                            title="Monter"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              descendreCouche(el.id);
                            }}
                            className="p-0.5 rounded hover:bg-bordure"
                            title="Descendre"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Templates */}
            <SelecteurTemplate surSelection={setImageFond} />
          </motion.div>
        </div>
      )}
    </div>
  );
}
