import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { config } from "dotenv";

// Cargar variables de entorno desde .env
config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const libsql = createClient({
  url: url ?? "file:./dev.db",
  authToken: authToken,
});

const adapter = new PrismaLibSQL(libsql);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding database...");

  // Limpiar datos existentes
  await prisma.user.deleteMany();

  // Crear usuarios de ejemplo
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "María García",
        email: "maria.garcia@example.com",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@example.com",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Ana Martínez",
        email: "ana.martinez@example.com",
        status: "inactive",
      },
    }),
    prisma.user.create({
      data: {
        name: "Luis Fernández",
        email: "luis.fernandez@example.com",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Laura Sánchez",
        email: "laura.sanchez@example.com",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Pedro López",
        email: "pedro.lopez@example.com",
        status: "inactive",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sofía González",
        email: "sofia.gonzalez@example.com",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Diego Hernández",
        email: "diego.hernandez@example.com",
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Elena Torres",
        email: "elena.torres@example.com",
        status: "inactive",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

