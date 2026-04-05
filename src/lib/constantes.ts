// Polices disponibles pour le texte des mèmes
export const POLICES_DISPONIBLES = [
  { nom: "Impact", valeur: "Impact" },
  { nom: "Arial Black", valeur: "Arial Black" },
  { nom: "Comic Sans MS", valeur: "Comic Sans MS" },
  { nom: "Courier New", valeur: "Courier New" },
  { nom: "Georgia", valeur: "Georgia" },
  { nom: "Times New Roman", valeur: "Times New Roman" },
  { nom: "Verdana", valeur: "Verdana" },
] as const;

// Couleurs prédéfinies pour le texte
export const COULEURS_PREDEFINIES = [
  "#FFFFFF",
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FF6600",
  "#9900FF",
] as const;

// Dimensions par défaut du canvas
export const LARGEUR_CANVAS = 600;
export const HAUTEUR_CANVAS = 600;

// Templates de mèmes populaires
export const TEMPLATES_MEMES = [
  {
    id: "vide",
    nom: "Image vide",
    description: "Commencer avec une image vide",
    apercu: null,
  },
  {
    id: "drake",
    nom: "Drake",
    description: "Le classique Drake approuve/désapprouve",
    apercu: "/templates/drake.svg",
  },
  {
    id: "bouton",
    nom: "Bouton rouge",
    description: "Le dilemme du bouton rouge",
    apercu: "/templates/bouton.svg",
  },
  {
    id: "cerveau",
    nom: "Cerveau expansé",
    description: "Niveaux d'intelligence croissants",
    apercu: "/templates/cerveau.svg",
  },
  {
    id: "change-my-mind",
    nom: "Change My Mind",
    description: "Changez mon avis",
    apercu: "/templates/change-my-mind.svg",
  },
] as const;
