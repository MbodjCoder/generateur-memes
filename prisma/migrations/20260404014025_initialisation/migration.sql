-- CreateTable
CREATE TABLE "Meme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "imageDonnees" TEXT NOT NULL,
    "texteHaut" TEXT,
    "texteBas" TEXT,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" DATETIME NOT NULL
);
