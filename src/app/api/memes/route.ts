import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/memes?uid=xxx — Récupérer les mèmes d'un utilisateur
export async function GET(requete: NextRequest) {
  const uid = requete.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json([], { status: 200 });
  }

  const memes = await prisma.meme.findMany({
    where: { utilisateurId: uid },
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
  const corps = await requete.json();
  const { titre, imageDonnees, texteHaut, texteBas, utilisateurId } = corps;

  if (!titre || !imageDonnees || !utilisateurId) {
    return NextResponse.json(
      { erreur: "Le titre, l'image et l'identifiant utilisateur sont requis." },
      { status: 400 }
    );
  }

  const meme = await prisma.meme.create({
    data: {
      utilisateurId,
      titre,
      imageDonnees,
      texteHaut: texteHaut || null,
      texteBas: texteBas || null,
    },
  });

  return NextResponse.json(meme, { status: 201 });
}
