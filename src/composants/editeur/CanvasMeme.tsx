"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Transformer,
  Rect,
  Group,
} from "react-konva";
import Konva from "konva";
import {
  ElementCanvas,
  ElementTexte,
  ElementImage,
} from "@/lib/types";
import { LARGEUR_CANVAS, HAUTEUR_CANVAS } from "@/lib/constantes";

interface PropsCanvasMeme {
  imageFond: string | null;
  elements: ElementCanvas[];
  idSelectionne: string | null;
  surSelectionElement: (id: string | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  surMiseAJourElement: (id: string, partiel: Record<string, any>) => void;
  surModificationTexteInline: (id: string, contenu: string) => void;
  surMenuContextuel: (x: number, y: number, idElement: string | null) => void;
}

export interface RefCanvasMeme {
  exporterImage: (format: "png" | "jpeg", qualite?: number) => string | null;
  obtenirDimensions: () => { largeur: number; hauteur: number };
}

// Canvas Konva professionnel : multi-couches, images + textes, menu contextuel
const CanvasMeme = forwardRef<RefCanvasMeme, PropsCanvasMeme>(
  function CanvasMeme(
    {
      imageFond,
      elements,
      idSelectionne,
      surSelectionElement,
      surMiseAJourElement,
      surModificationTexteInline,
      surMenuContextuel,
    },
    ref
  ) {
    const refStage = useRef<Konva.Stage>(null);
    const refTransformateur = useRef<Konva.Transformer>(null);
    const refConteneur = useRef<HTMLDivElement>(null);
    const refsNoeuds = useRef<Map<string, Konva.Node>>(new Map());
    const [fondCharge, setFondCharge] = useState<HTMLImageElement | null>(null);
    const [dimensionsFond, setDimensionsFond] = useState({
      largeur: LARGEUR_CANVAS,
      hauteur: HAUTEUR_CANVAS,
    });
    const [imagesChargees, setImagesChargees] = useState<Map<string, HTMLImageElement>>(new Map());
    const [editionInline, setEditionInline] = useState<{
      id: string;
      x: number;
      y: number;
      largeur: number;
      hauteur: number;
    } | null>(null);
    const refTextarea = useRef<HTMLTextAreaElement>(null);

    // Charger l'image de fond
    useEffect(() => {
      if (!imageFond) {
        setFondCharge(null);
        return;
      }
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setFondCharge(img);
        const ratio = Math.min(
          LARGEUR_CANVAS / img.width,
          HAUTEUR_CANVAS / img.height
        );
        setDimensionsFond({
          largeur: Math.round(img.width * ratio),
          hauteur: Math.round(img.height * ratio),
        });
      };
      img.src = imageFond;
    }, [imageFond]);

    // Charger les images des éléments
    useEffect(() => {
      const imagesElements = elements.filter(
        (el): el is ElementImage => el.type === "image"
      );
      imagesElements.forEach((el) => {
        if (!imagesChargees.has(el.id)) {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            setImagesChargees((prev) => new Map(prev).set(el.id, img));
          };
          img.src = el.source;
        }
      });
    }, [elements, imagesChargees]);

    // Attacher le transformateur
    useEffect(() => {
      if (idSelectionne && refTransformateur.current) {
        const noeud = refsNoeuds.current.get(idSelectionne);
        if (noeud) {
          refTransformateur.current.nodes([noeud]);
          refTransformateur.current.getLayer()?.batchDraw();
          return;
        }
      }
      refTransformateur.current?.nodes([]);
      refTransformateur.current?.getLayer()?.batchDraw();
    }, [idSelectionne, elements]);

    // Focus textarea
    useEffect(() => {
      if (editionInline && refTextarea.current) {
        refTextarea.current.focus();
        refTextarea.current.select();
      }
    }, [editionInline]);

    const largeurCanvas = fondCharge ? dimensionsFond.largeur : LARGEUR_CANVAS;
    const hauteurCanvas = fondCharge ? dimensionsFond.hauteur : HAUTEUR_CANVAS;

    // Export
    useImperativeHandle(ref, () => ({
      exporterImage: (format: "png" | "jpeg", qualite = 0.92) => {
        if (!refStage.current) return null;
        fermerEditionInline();
        surSelectionElement(null);
        refTransformateur.current?.nodes([]);
        refTransformateur.current?.getLayer()?.batchDraw();

        return refStage.current.toDataURL({
          mimeType: format === "jpeg" ? "image/jpeg" : "image/png",
          quality: qualite,
          pixelRatio: 2,
        });
      },
      obtenirDimensions: () => ({ largeur: largeurCanvas, hauteur: hauteurCanvas }),
    }));

    const construireStyleTexte = useCallback((el: ElementTexte) => {
      let style = "";
      if (el.gras) style += "bold ";
      if (el.italique) style += "italic ";
      return style.trim() || "normal";
    }, []);

    // Édition inline
    const ouvrirEditionInline = useCallback(
      (id: string, noeud: Konva.Node) => {
        const rect = noeud.getClientRect();
        noeud.hide();
        refTransformateur.current?.nodes([]);
        noeud.getLayer()?.batchDraw();
        setEditionInline({
          id,
          x: rect.x,
          y: rect.y,
          largeur: Math.max(rect.width, 150),
          hauteur: Math.max(rect.height, 40),
        });
      },
      []
    );

    const fermerEditionInline = useCallback(() => {
      if (!editionInline) return;
      const noeud = refsNoeuds.current.get(editionInline.id);
      noeud?.show();
      noeud?.getLayer()?.batchDraw();
      setEditionInline(null);
    }, [editionInline]);

    // Clic sur le fond
    const surClicFond = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage() || e.target.name() === "fond") {
        fermerEditionInline();
        surSelectionElement(null);
      }
    };

    // Menu contextuel sur le fond ou un élément
    const gererMenuContextuel = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        const conteneur = refConteneur.current;
        if (!conteneur) return;
        const rect = conteneur.getBoundingClientRect();
        surMenuContextuel(e.clientX - rect.left, e.clientY - rect.top, null);
      },
      [surMenuContextuel]
    );

    // Style du textarea inline
    const obtenirStyleTextarea = useCallback(() => {
      if (!editionInline) return {};
      const el = elements.find((e) => e.id === editionInline.id);
      if (!el || el.type !== "texte") return {};

      return {
        position: "absolute" as const,
        left: `${editionInline.x}px`,
        top: `${editionInline.y}px`,
        width: `${editionInline.largeur}px`,
        minHeight: `${editionInline.hauteur}px`,
        fontSize: `${el.taille * el.echelleY}px`,
        fontFamily: el.police,
        fontWeight: el.gras ? "bold" : "normal",
        fontStyle: el.italique ? "italic" : "normal",
        color: el.couleur,
        textAlign: "center" as const,
        border: "2px solid var(--accent)",
        borderRadius: "4px",
        background: "rgba(0,0,0,0.3)",
        outline: "none",
        padding: "2px 4px",
        resize: "none" as const,
        overflow: "hidden",
        lineHeight: "1.2",
        textTransform: "uppercase" as const,
        zIndex: 20,
        WebkitTextStroke:
          el.epaisseurContour > 0
            ? `${Math.min(el.epaisseurContour, 2)}px ${el.couleurContour}`
            : undefined,
        textShadow: el.ombre ? "2px 2px 4px rgba(0,0,0,0.7)" : undefined,
      };
    }, [editionInline, elements]);

    // Tri des éléments par ordre (couches)
    const elementsTries = [...elements].sort((a, b) => a.ordre - b.ordre);

    return (
      <div
        ref={refConteneur}
        className="relative rounded-xl overflow-hidden border border-bordure bg-gray-100 dark:bg-gray-900 flex items-center justify-center"
        onContextMenu={gererMenuContextuel}
      >
        {/* Fond en damier */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-conic-gradient(#d1d5db 0% 25%, transparent 0% 50%)",
            backgroundSize: "16px 16px",
          }}
        />

        <Stage
          ref={refStage}
          width={largeurCanvas}
          height={hauteurCanvas}
          onMouseDown={surClicFond}
          className="relative z-10"
        >
          <Layer>
            {/* Image de fond */}
            {fondCharge && (
              <KonvaImage
                name="fond"
                image={fondCharge}
                width={largeurCanvas}
                height={hauteurCanvas}
              />
            )}
            {!fondCharge && (
              <Rect
                name="fond"
                width={largeurCanvas}
                height={hauteurCanvas}
                fill="#374151"
              />
            )}

            {/* Éléments triés par ordre (couches) */}
            {elementsTries.map((el) => {
              if (el.type === "image") {
                const imgChargee = imagesChargees.get(el.id);
                if (!imgChargee) return null;

                return (
                  <Group
                    key={el.id}
                    ref={(noeud) => {
                      if (noeud) refsNoeuds.current.set(el.id, noeud);
                      else refsNoeuds.current.delete(el.id);
                    }}
                    x={el.x}
                    y={el.y}
                    width={el.largeur}
                    height={el.hauteur}
                    rotation={el.rotation}
                    scaleX={el.echelleX * (el.inverserX ? -1 : 1)}
                    scaleY={el.echelleY * (el.inverserY ? -1 : 1)}
                    opacity={el.opacite}
                    draggable={!el.verrouille}
                    onClick={() => surSelectionElement(el.id)}
                    onTap={() => surSelectionElement(el.id)}
                    onContextMenu={(e) => {
                      e.evt.preventDefault();
                      surSelectionElement(el.id);
                      const conteneur = refConteneur.current;
                      if (conteneur) {
                        const rect = conteneur.getBoundingClientRect();
                        surMenuContextuel(
                          e.evt.clientX - rect.left,
                          e.evt.clientY - rect.top,
                          el.id
                        );
                      }
                    }}
                    onDragEnd={(e) => {
                      surMiseAJourElement(el.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    onTransformEnd={() => {
                      const noeud = refsNoeuds.current.get(el.id);
                      if (!noeud) return;
                      surMiseAJourElement(el.id, {
                        x: noeud.x(),
                        y: noeud.y(),
                        rotation: noeud.rotation(),
                        echelleX: Math.abs(noeud.scaleX()),
                        echelleY: Math.abs(noeud.scaleY()),
                        largeur: (noeud as Konva.Group).width(),
                        hauteur: (noeud as Konva.Group).height(),
                      });
                    }}
                  >
                    {el.bordureRayon > 0 ? (
                      <Group
                        clipFunc={(ctx) => {
                          const r = el.bordureRayon;
                          const w = el.largeur;
                          const h = el.hauteur;
                          ctx.beginPath();
                          ctx.moveTo(r, 0);
                          ctx.lineTo(w - r, 0);
                          ctx.quadraticCurveTo(w, 0, w, r);
                          ctx.lineTo(w, h - r);
                          ctx.quadraticCurveTo(w, h, w - r, h);
                          ctx.lineTo(r, h);
                          ctx.quadraticCurveTo(0, h, 0, h - r);
                          ctx.lineTo(0, r);
                          ctx.quadraticCurveTo(0, 0, r, 0);
                          ctx.closePath();
                        }}
                      >
                        <KonvaImage
                          image={imgChargee}
                          width={el.largeur}
                          height={el.hauteur}
                        />
                      </Group>
                    ) : (
                      <KonvaImage
                        image={imgChargee}
                        width={el.largeur}
                        height={el.hauteur}
                      />
                    )}
                  </Group>
                );
              }

              // Élément texte
              return (
                <Text
                  key={el.id}
                  ref={(noeud) => {
                    if (noeud) refsNoeuds.current.set(el.id, noeud);
                    else refsNoeuds.current.delete(el.id);
                  }}
                  text={el.contenu.toUpperCase()}
                  x={el.x}
                  y={el.y}
                  width={el.largeur}
                  fontSize={el.taille}
                  fontFamily={el.police}
                  fontStyle={construireStyleTexte(el)}
                  fill={el.couleur}
                  stroke={el.couleurContour}
                  strokeWidth={el.epaisseurContour}
                  rotation={el.rotation}
                  scaleX={el.echelleX}
                  scaleY={el.echelleY}
                  opacity={el.opacite}
                  shadowColor={el.ombre ? "rgba(0,0,0,0.7)" : "transparent"}
                  shadowBlur={el.ombre ? 4 : 0}
                  shadowOffsetX={el.ombre ? 2 : 0}
                  shadowOffsetY={el.ombre ? 2 : 0}
                  align="center"
                  draggable={!el.verrouille}
                  onClick={() => surSelectionElement(el.id)}
                  onTap={() => surSelectionElement(el.id)}
                  onDblClick={() => {
                    const noeud = refsNoeuds.current.get(el.id);
                    if (noeud) ouvrirEditionInline(el.id, noeud);
                  }}
                  onDblTap={() => {
                    const noeud = refsNoeuds.current.get(el.id);
                    if (noeud) ouvrirEditionInline(el.id, noeud);
                  }}
                  onContextMenu={(e) => {
                    e.evt.preventDefault();
                    surSelectionElement(el.id);
                    const conteneur = refConteneur.current;
                    if (conteneur) {
                      const rect = conteneur.getBoundingClientRect();
                      surMenuContextuel(
                        e.evt.clientX - rect.left,
                        e.evt.clientY - rect.top,
                        el.id
                      );
                    }
                  }}
                  onDragEnd={(e) => {
                    surMiseAJourElement(el.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                  onTransformEnd={() => {
                    const noeud = refsNoeuds.current.get(el.id);
                    if (!noeud) return;
                    surMiseAJourElement(el.id, {
                      x: noeud.x(),
                      y: noeud.y(),
                      rotation: noeud.rotation(),
                      echelleX: noeud.scaleX(),
                      echelleY: noeud.scaleY(),
                      largeur: noeud.width(),
                    });
                  }}
                />
              );
            })}

            {/* Transformateur */}
            <Transformer
              ref={refTransformateur}
              rotateEnabled
              enabledAnchors={[
                "top-left",
                "top-center",
                "top-right",
                "middle-left",
                "middle-right",
                "bottom-left",
                "bottom-center",
                "bottom-right",
              ]}
              borderStroke="#0ea5e9"
              anchorStroke="#0ea5e9"
              anchorFill="#ffffff"
              anchorSize={10}
              anchorCornerRadius={2}
              rotateAnchorOffset={25}
              boundBoxFunc={(_, nouvelle) => ({
                ...nouvelle,
                width: Math.max(20, nouvelle.width),
                height: Math.max(20, nouvelle.height),
              })}
            />
          </Layer>
        </Stage>

        {/* Textarea d'édition inline */}
        {editionInline && (
          <textarea
            ref={refTextarea}
            defaultValue={
              (
                elements.find((e) => e.id === editionInline.id) as
                  | ElementTexte
                  | undefined
              )?.contenu.toUpperCase() ?? ""
            }
            style={obtenirStyleTextarea()}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                surModificationTexteInline(editionInline.id, e.currentTarget.value);
                fermerEditionInline();
              }
              if (e.key === "Escape") {
                fermerEditionInline();
              }
            }}
            onBlur={(e) => {
              surModificationTexteInline(editionInline.id, e.currentTarget.value);
              fermerEditionInline();
            }}
          />
        )}
      </div>
    );
  }
);

export default CanvasMeme;
