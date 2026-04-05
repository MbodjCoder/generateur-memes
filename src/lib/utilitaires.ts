import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Fusion des classes Tailwind sans conflit
export function cn(...entrees: ClassValue[]) {
  return twMerge(clsx(entrees));
}

// Identifiant unique par navigateur (persisté en localStorage)
const CLE_UTILISATEUR = "memestudio_uid";

export function obtenirIdUtilisateur(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(CLE_UTILISATEUR);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLE_UTILISATEUR, id);
  }
  return id;
}
