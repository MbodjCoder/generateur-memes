import { NextRequest, NextResponse } from "next/server";
import { obtenirPrisma } from "@/lib/prisma";

// GET /api/memes — Récupérer tous les mèmes
export async function GET() {
  const prisma = await obtenirPrisma();
  const memes = await prisma.meme.findMany({
    orderBy: { dateCreation: "desc" },
    select: {
      id: true,
      titre: true,
      imageDonnees: true,
      texteHaut: true,
      texteBas: true,
      dateCreation: true,
      dateMiseAJour: true,
    },
  });

  return NextResponse.json(memes);
}

// POST /api/memes — Créer un nouveau mème
export async function POST(requete: NextRequest) {
  const prisma = await obtenirPrisma();
  const corps = await requete.json();

  const { titre, imageDonnees, texteHaut, texteBas } = corps;

  if (!titre || !imageDonnees) {
    return NextResponse.json(
      { erreur: "Le titre et l'image sont requis." },
      { status: 400 }
    );
  }

  const meme = await prisma.meme.create({
    data: {
      titre,
      imageDonnees,
      texteHaut: texteHaut || null,
      texteBas: texteBas || null,
    },
  });

  return NextResponse.json(meme, { status: 201 });
}
