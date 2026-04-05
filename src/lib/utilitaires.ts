import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Fusion des classes Tailwind sans conflit
export function cn(...entrees: ClassValue[]) {
  return twMerge(clsx(entrees));
}
