// Types principaux — système d'éléments unifié (texte + image)

// Élément de base commun à tous les types
interface ElementBase {
  id: string;
  type: "texte" | "image";
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
  rotation: number;
  echelleX: number;
  echelleY: number;
  opacite: number;
  verrouille: boolean;
  ordre: number;
}

// Élément texte avec toutes les propriétés de style
export interface ElementTexte extends ElementBase {
  type: "texte";
  contenu: string;
  taille: number;
  police: string;
  couleur: string;
  couleurContour: string;
  epaisseurContour: number;
  ombre: boolean;
  gras: boolean;
  italique: boolean;
}

// Élément image superposable avec options de cadrage
export interface ElementImage extends ElementBase {
  type: "image";
  source: string;
  ajustement: "remplir" | "contenir" | "couvrir" | "etirer";
  inverserX: boolean;
  inverserY: boolean;
  bordureRayon: number;
}

// Union discriminée de tous les éléments
export type ElementCanvas = ElementTexte | ElementImage;

// Mème stocké en base
export interface MemeAPI {
  id: string;
  titre: string;
  imageDonnees: string;
  texteHaut: string | null;
  texteBas: string | null;
  dateCreation: string;
  dateMiseAJour: string;
}

// Options du menu contextuel
export interface OptionMenuContextuel {
  label: string;
  icone: React.ReactNode;
  action: () => void;
  danger?: boolean;
  separateur?: boolean;
}

// Identifiant unique
let compteur = 0;
export function genererId(): string {
  compteur++;
  return `el-${Date.now()}-${compteur}`;
}

// Créer un élément texte par défaut
export function creerElementTexte(
  largeurCanvas: number,
  hauteurCanvas: number,
  ordre: number
): ElementTexte {
  return {
    id: genererId(),
    type: "texte",
    contenu: "Votre texte",
    x: largeurCanvas / 2 - 150,
    y: hauteurCanvas / 2 - 30,
    largeur: 300,
    hauteur: 60,
    taille: 42,
    police: "Impact",
    couleur: "#FFFFFF",
    couleurContour: "#000000",
    epaisseurContour: 3,
    ombre: true,
    gras: true,
    italique: false,
    rotation: 0,
    echelleX: 1,
    echelleY: 1,
    opacite: 1,
    verrouille: false,
    ordre,
  };
}

// Créer un élément image par défaut
export function creerElementImage(
  source: string,
  largeurCanvas: number,
  hauteurCanvas: number,
  ordre: number
): ElementImage {
  return {
    id: genererId(),
    type: "image",
    source,
    x: 50,
    y: 50,
    largeur: largeurCanvas * 0.5,
    hauteur: hauteurCanvas * 0.5,
    rotation: 0,
    echelleX: 1,
    echelleY: 1,
    opacite: 1,
    verrouille: false,
    ordre,
    ajustement: "contenir",
    inverserX: false,
    inverserY: false,
    bordureRayon: 0,
  };
}
