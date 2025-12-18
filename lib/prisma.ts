import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("Error: TURSO_DATABASE_URL is not defined in the environment.");
} else {
  console.log("TURSO_DATABASE_URL is defined.");
}

if (!authToken) {
  console.error("Error: TURSO_AUTH_TOKEN is not defined in the environment.");
} else {
  console.log("TURSO_AUTH_TOKEN is defined.");
}

const libsql = createClient({
  url: url ?? "file:./dev.db", // Fallback to avoid immediate crash if env var is missing, though connection will fail if not using file
  authToken: authToken,
});

const adapter = new PrismaLibSQL(libsql);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
