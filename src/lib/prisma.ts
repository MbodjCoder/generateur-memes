import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Singleton Prisma pour éviter les connexions multiples en développement
const clientGlobal = globalThis as unknown as { prisma?: PrismaClient };

function creerClient(): PrismaClient {
  const adaptateur = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter: adaptateur });
}

export const prisma = clientGlobal.prisma ?? creerClient();

if (process.env.NODE_ENV !== "production") {
  clientGlobal.prisma = prisma;
}
