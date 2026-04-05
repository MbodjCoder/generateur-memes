import { PrismaClient } from "@/generated/prisma/client";

// Singleton Prisma pour éviter les connexions multiples en développement
const clientGlobal = globalThis as unknown as { prisma?: PrismaClient };

async function creerClient(): Promise<PrismaClient> {
  // En production (Vercel) : utiliser libsql avec Turso
  if (process.env.TURSO_DATABASE_URL) {
    const { PrismaLibSql } = await import("@prisma/adapter-libsql");
    const adaptateur = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter: adaptateur });
  }

  // En développement : utiliser better-sqlite3 avec fichier local
  const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
  const { join } = await import("path");
  const cheminBd = join(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/");
  const adaptateur = new PrismaBetterSqlite3({ url: cheminBd });
  return new PrismaClient({ adapter: adaptateur });
}

// Initialisation lazy du client Prisma
let _prismaPromesse: Promise<PrismaClient> | null = null;

export function obtenirPrisma(): Promise<PrismaClient> {
  if (clientGlobal.prisma) {
    return Promise.resolve(clientGlobal.prisma);
  }

  if (!_prismaPromesse) {
    _prismaPromesse = creerClient().then((client) => {
      if (process.env.NODE_ENV !== "production") {
        clientGlobal.prisma = client;
      }
      return client;
    });
  }

  return _prismaPromesse;
}
