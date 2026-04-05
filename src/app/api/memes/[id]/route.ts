import { NextRequest, NextResponse } from "next/server";
import { obtenirPrisma } from "@/lib/prisma";

// GET /api/memes/:id — Récupérer un mème par son identifiant
export async function GET(
  _requete: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await obtenirPrisma();
  const { id } = await params;
  const meme = await prisma.meme.findUnique({ where: { id } });

  if (!meme) {
    return NextResponse.json({ erreur: "Mème introuvable." }, { status: 404 });
  }

  return NextResponse.json(meme);
}

// PUT /api/memes/:id — Mettre à jour un mème existant
export async function PUT(
  requete: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await obtenirPrisma();
  const { id } = await params;
  const corps = await requete.json();
  const { titre, imageDonnees, texteHaut, texteBas } = corps;

  try {
    const meme = await prisma.meme.update({
      where: { id },
      data: {
        ...(titre && { titre }),
        ...(imageDonnees && { imageDonnees }),
        texteHaut: texteHaut ?? null,
        texteBas: texteBas ?? null,
      },
    });
    return NextResponse.json(meme);
  } catch {
    return NextResponse.json({ erreur: "Mème introuvable." }, { status: 404 });
  }
}

// DELETE /api/memes/:id — Supprimer un mème
export async function DELETE(
  _requete: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await obtenirPrisma();
  const { id } = await params;

  try {
    await prisma.meme.delete({ where: { id } });
    return NextResponse.json({ message: "Mème supprimé." });
  } catch {
    return NextResponse.json({ erreur: "Mème introuvable." }, { status: 404 });
  }
}
