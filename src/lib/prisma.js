import { PrismaClient } from "@prisma/client";

// Next.js reloads modules on every file save in development. Without this
// cache, each reload would create another PrismaClient - and another
// connection pool - until the database refuses new connections.
// In production the module is loaded once, so the cache is not needed.
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}