import { execSync } from "child_process";
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { createClient } from "@libsql/client";
import { config } from "dotenv";

// Cargar variables de entorno desde .env
const result = config();

if (result.error) {
  console.error("❌ Error al cargar el archivo .env:", result.error.message);
  console.error("💡 Asegúrate de que el archivo .env existe en la raíz del proyecto");
  process.exit(1);
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("❌ Error: TURSO_DATABASE_URL no está definido en el archivo .env");
  console.error("💡 Verifica que el archivo .env contiene:");
  console.error("   TURSO_DATABASE_URL=libsql://tu-database-url.turso.io");
  process.exit(1);
}

if (!authToken) {
  console.error("❌ Error: TURSO_AUTH_TOKEN no está definido en el archivo .env");
  console.error("💡 Verifica que el archivo .env contiene:");
  console.error("   TURSO_AUTH_TOKEN=tu-auth-token");
  process.exit(1);
}

async function initDatabase() {
  console.log("🔄 Inicializando base de datos en Turso...\n");

  try {
    // Generar el SQL diff desde el schema
    console.log("📝 Generando SQL desde el schema...");
    const sqlDiff = execSync(
      `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`,
      { encoding: "utf-8", cwd: process.cwd() }
    );

    if (!sqlDiff || sqlDiff.trim().length === 0) {
      console.log("ℹ️  No hay cambios en el schema.");
      return;
    }

    // Guardar el SQL en un archivo temporal
    const sqlFile = join(process.cwd(), "temp-migration.sql");
    writeFileSync(sqlFile, sqlDiff);

    console.log("✅ SQL generado exitosamente");
    console.log("\n📄 SQL a ejecutar:");
    console.log("─".repeat(50));
    console.log(sqlDiff);
    console.log("─".repeat(50));

    // Conectar a Turso
    console.log("\n🔌 Conectando a Turso...");
    const client = createClient({
      url,
      authToken,
    });

    // Ejecutar el SQL
    console.log("⚡ Ejecutando SQL en Turso...");
    
    // Dividir el SQL en statements
    // Primero separar por líneas que terminan con ; y luego limpiar
    const lines = sqlDiff.split("\n");
    const statements: string[] = [];
    let currentStatement = "";

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Ignorar comentarios
      if (trimmedLine.startsWith("--") || trimmedLine.startsWith("/*") || trimmedLine.length === 0) {
        continue;
      }

      currentStatement += (currentStatement ? " " : "") + trimmedLine;

      // Si la línea termina con ;, es el final del statement
      if (trimmedLine.endsWith(";")) {
        statements.push(currentStatement);
        currentStatement = "";
      }
    }

    // Si queda algo sin terminar, agregarlo
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }

    // Ejecutar cada statement
    for (const statement of statements) {
      const cleanStatement = statement.trim();
      if (cleanStatement && cleanStatement.length > 0) {
        try {
          await client.execute(cleanStatement);
          const preview = cleanStatement.replace(/\s+/g, " ").substring(0, 60);
          console.log(`  ✓ Ejecutado: ${preview}...`);
        } catch (error: any) {
          // Ignorar errores de "table already exists"
          if (error.message?.includes("already exists") || 
              error.message?.includes("duplicate column name") ||
              error.message?.includes("UNIQUE constraint failed")) {
            const preview = cleanStatement.replace(/\s+/g, " ").substring(0, 60);
            console.log(`  ⚠ Ignorado (ya existe): ${preview}...`);
          } else {
            console.error(`  ❌ Error en: ${cleanStatement.substring(0, 60)}...`);
            console.error(`  Error: ${error.message}`);
            throw error;
          }
        }
      }
    }

    // Limpiar archivo temporal
    unlinkSync(sqlFile);

    console.log("\n✅ Base de datos inicializada exitosamente!");
    console.log("🎉 Puedes ejecutar 'npm run db:seed' para poblar datos de ejemplo.");
  } catch (error: any) {
    console.error("\n❌ Error al inicializar la base de datos:");
    console.error(error.message);
    
    // Limpiar archivo temporal si existe
    const sqlFile = join(process.cwd(), "temp-migration.sql");
    try {
      if (readFileSync) {
        unlinkSync(sqlFile);
      }
    } catch {}

    process.exit(1);
  }
}

initDatabase();

