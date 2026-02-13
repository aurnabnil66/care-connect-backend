import { PrismaClient } from "@/generated/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prismaClientVal = globalForPrisma.prisma;

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prismaClientVal;
