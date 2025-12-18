# Admin Template

Template de administración con Next.js, Prisma, Turso SQLite y TypeScript.

## Stack Tecnológico

### Core
- **Next.js 16** - Framework React con App Router y Server Components
- **TypeScript** - Tipado estático para mayor seguridad en el código
- **React 19** - Biblioteca UI con las últimas características

### Base de Datos
- **Turso** - Base de datos SQLite distribuida en la nube
- **Prisma 5.22** - ORM con adaptador LibSQL (feature preview)
- **@libsql/client** - Cliente oficial de Turso/LibSQL
- **@prisma/adapter-libsql** - Adaptador de Prisma para LibSQL

### UI y Estilos
- **Tailwind CSS 4** - Framework de utilidades CSS
- **shadcn/ui** - Componentes UI basados en Radix UI
- **Radix UI** - Componentes primitivos accesibles
- **Lucide React** - Iconos modernos

### Validación y Formularios
- **Zod** - Validación de esquemas TypeScript-first
- **React Hook Form** - Manejo eficiente de formularios
- **@hookform/resolvers** - Integración Zod con React Hook Form

### Utilidades
- **Sonner** - Notificaciones toast elegantes
- **class-variance-authority** - Variantes de componentes
- **clsx & tailwind-merge** - Utilidades para clases CSS

### Visualización de Datos
- **Recharts** - Librería de gráficos React para visualizaciones complejas y personalizables

## Conexión con Turso: Limitaciones y Soluciones

### ⚠️ Prisma no tiene soporte nativo para Turso

Prisma no soporta oficialmente Turso como base de datos. Para conectar Prisma con Turso, este proyecto utiliza una solución alternativa mediante **Driver Adapters** (una feature en preview de Prisma).

### Cómo funciona la conexión

1. **Adaptador LibSQL**: Turso utiliza el protocolo LibSQL (un fork de SQLite). Prisma proporciona un adaptador experimental `@prisma/adapter-libsql` que permite usar Prisma con LibSQL.

2. **Configuración en `prisma/schema.prisma`**:
   ```prisma
   generator client {
     provider        = "prisma-client-js"
     previewFeatures = ["driverAdapters"]  // Feature en preview
   }

   datasource db {
     provider = "sqlite"  // Se usa sqlite como provider base
     url      = env("TURSO_DATABASE_URL")
   }
   ```

3. **Cliente Prisma personalizado** (`lib/prisma.ts`):
   ```typescript
   import { PrismaLibSQL } from "@prisma/adapter-libsql";
   import { createClient } from "@libsql/client";

   const libsql = createClient({
     url: process.env.TURSO_DATABASE_URL,
     authToken: process.env.TURSO_AUTH_TOKEN,
   });

   const adapter = new PrismaLibSQL(libsql);

   export const prisma = new PrismaClient({
     adapter,  // Se inyecta el adaptador
   });
   ```

4. **Configuración de Next.js** (`next.config.ts`):
   ```typescript
   const nextConfig = {
     serverExternalPackages: ["@libsql/client", "@prisma/adapter-libsql"],
   };
   ```
   Esto es necesario porque estos paquetes contienen código nativo que no puede ser empaquetado por Next.js.

### Limitaciones importantes

1. **No se puede usar `prisma migrate`**: 
   - Prisma Migrate no funciona directamente con Turso porque no reconoce la conexión LibSQL como una base de datos migrable.
   - **Solución**: Se usa un script personalizado (`scripts/init-db.ts`) que:
     - Genera el SQL desde el schema usando `prisma migrate diff`
     - Ejecuta el SQL directamente usando el cliente `@libsql/client`

2. **Feature en Preview**:
   - `driverAdapters` es una feature experimental de Prisma.
   - Puede haber cambios en futuras versiones.
   - Algunas funcionalidades avanzadas de Prisma pueden no estar disponibles.

3. **Prisma Studio limitado**:
   - Prisma Studio puede no funcionar correctamente con el adaptador.
   - Se recomienda usar herramientas alternativas para visualizar datos.

4. **Migraciones manuales**:
   - Cada cambio en el schema requiere ejecutar manualmente `npm run db:init`.
   - No hay historial automático de migraciones como con `prisma migrate`.

### Workflow de desarrollo

```bash
# 1. Modificar el schema
# Editar prisma/schema.prisma

# 2. Regenerar el cliente de Prisma
npm run db:generate

# 3. Aplicar cambios a la base de datos (genera y ejecuta SQL)
npm run db:init

# 4. (Opcional) Poblar con datos de ejemplo
npm run db:seed
```

### Alternativas consideradas

- **Usar `@libsql/client` directamente**: Más control pero perderías todas las ventajas de Prisma (type-safety, queries type-safe, etc.)
- **Esperar soporte oficial**: Prisma podría agregar soporte nativo en el futuro, pero no hay timeline confirmado.

## Configuración

### 1. Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd system_template

# Instalar dependencias
npm install
```

### 2. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Turso Database
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

**Obtener credenciales de Turso:**
1. Crea una cuenta en [turso.tech](https://turso.tech)
2. Crea una base de datos
3. Obtén la URL y el token de autenticación desde el dashboard

### 3. Inicialización de la base de datos

```bash
# Genera el cliente de Prisma
npm run db:generate

# Inicializa la base de datos (crea las tablas)
npm run db:init

# (Opcional) Pobla con datos de ejemplo
npm run db:seed

# O ejecuta todo en un solo comando
npm run db:setup
```

### 4. Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
app/
  ├── (dashboard)/          # Grupo de rutas del dashboard
  │   ├── admin/            # Página de administración
  │   │   ├── page.tsx      # Lista de usuarios
  │   │   ├── actions.ts    # Server Actions (CRUD)
  │   │   ├── users-header.tsx
  │   │   ├── users-table.tsx
  │   │   └── user-dialog.tsx
  │   ├── analytics/        # Página de analytics
  │   │   └── page.tsx      # Ejemplos de gráficos
  │   ├── layout.tsx        # Layout del dashboard
  │   └── page.tsx          # Página principal
  └── layout.tsx            # Layout raíz

components/
  ├── layout/               # Componentes de layout
  │   ├── sidebar.tsx
  │   ├── navbar.tsx
  │   └── logo.tsx
  ├── charts/               # Componentes de gráficos
  │   ├── recharts/         # Componentes Recharts
  │   │   ├── line-chart.tsx
  │   │   ├── bar-chart.tsx
  │   │   ├── area-chart.tsx
  │   │   ├── pie-chart.tsx
  │   │   ├── radar-chart.tsx
  │   │   ├── scatter-chart.tsx
  │   │   └── combo-chart.tsx
  │   ├── kpi-card.tsx      # Tarjetas de KPI
  │   ├── metric-card.tsx   # Tarjetas de métricas
  │   └── chart-wrapper.tsx
  └── ui/                   # Componentes UI (shadcn/ui)
      ├── button.tsx
      ├── table.tsx
      ├── dialog.tsx
      └── ...

lib/
  ├── prisma.ts             # Cliente Prisma configurado para Turso
  ├── utils.ts              # Utilidades (cn, etc.)
  ├── charts/               # Configuración y utilidades de gráficos
  │   ├── chart-config.ts   # Configuración de colores y estilos
  │   ├── chart-utils.ts     # Utilidades de formateo
  │   └── sample-data.ts     # Datos de ejemplo
  └── validations/          # Schemas de validación Zod
      └── usuario.ts

prisma/
  ├── schema.prisma         # Schema de la base de datos
  └── seed.ts               # Datos de ejemplo

scripts/
  └── init-db.ts            # Script para inicializar DB en Turso
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter |
| `npm run db:generate` | Genera el cliente de Prisma desde el schema |
| `npm run db:init` | Genera SQL desde el schema y lo ejecuta en Turso |
| `npm run db:seed` | Pobla la base de datos con datos de ejemplo |
| `npm run db:setup` | Ejecuta `db:init` y `db:seed` en secuencia |
| `npm run db:studio` | Abre Prisma Studio (puede no funcionar con Turso) |

## Características

- ✅ **CRUD completo** de usuarios con Server Actions
- ✅ **Filtros y búsqueda** en tiempo real
- ✅ **Paginación** eficiente
- ✅ **Validación** con Zod y React Hook Form
- ✅ **UI responsive** con Tailwind CSS
- ✅ **Estadísticas (KPIs)** en tiempo real
- ✅ **Type-safe** end-to-end con TypeScript y Prisma
- ✅ **Componentes accesibles** con Radix UI
- ✅ **Gráficos y visualizaciones** con Recharts

## Gráficos y Visualización

El template incluye una suite completa de componentes de gráficos usando **Recharts**.

### Componentes Disponibles

#### Recharts (Gráficos)
- `LineChart` - Gráficos de líneas para tendencias temporales
- `BarChart` - Gráficos de barras verticales y horizontales
- `AreaChart` - Gráficos de áreas para datos acumulados
- `PieChart` - Gráficos circulares para distribuciones
- `RadarChart` - Gráficos radar para comparaciones multidimensionales
- `ScatterChart` - Gráficos de dispersión para análisis de correlación
- `ComboChart` - Gráficos combinados (barras + líneas + áreas)

#### Componentes de Métricas (shadcn/ui)
- `KPICard` - Tarjetas de KPI con tendencias y cambios porcentuales
- `MetricCard` - Tarjetas de métricas simples

### Uso Básico

```typescript
import { LineChart } from "@/components/charts/recharts/line-chart";
import { ChartWrapper } from "@/components/charts/chart-wrapper";

const data = [
  { month: "Ene", sales: 1200 },
  { month: "Feb", sales: 1900 },
];

<ChartWrapper title="Ventas Mensuales">
  <LineChart
    data={data}
    dataKey="month"
    lines={[{ key: "sales", name: "Ventas" }]}
    xAxisKey="month"
  />
</ChartWrapper>
```

### Página de Ejemplo

Visita `/analytics` para ver ejemplos de todos los tipos de gráficos disponibles con datos de muestra.

### Configuración

Los gráficos están configurados para usar automáticamente los colores del tema de Tailwind definidos en `lib/charts/chart-config.ts`. Puedes personalizar los colores modificando este archivo.

### Utilidades

El template incluye utilidades en `lib/charts/chart-utils.ts` para:
- Formateo de moneda, números y porcentajes
- Cálculo de cambios porcentuales
- Formateo de fechas
- Agrupación de datos

## Personalización

### Agregar un nuevo modelo

1. Edita `prisma/schema.prisma`:
   ```prisma
   model Product {
     id        String   @id @default(cuid())
     name      String
     price     Float
     createdAt DateTime @default(now())
   }
   ```

2. Regenera y aplica cambios:
   ```bash
   npm run db:generate
   npm run db:init
   ```

### Crear una nueva página

1. Crea una carpeta en `app/(dashboard)/`
2. Agrega `page.tsx` con tu componente
3. Usa Server Actions para operaciones de base de datos

### Agregar validaciones

Crea un nuevo archivo en `lib/validations/` usando Zod:
```typescript
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
});
```

## Troubleshooting

### Error: "TURSO_DATABASE_URL is not defined"
- Verifica que el archivo `.env` existe y contiene las variables correctas
- Reinicia el servidor de desarrollo después de crear/modificar `.env`

### Error al ejecutar `db:init`
- Verifica que las credenciales de Turso son correctas
- Asegúrate de que la base de datos existe en Turso
- Revisa que el token de autenticación tiene permisos suficientes

### Prisma Studio no funciona
- Es una limitación conocida con el adaptador LibSQL
- Usa herramientas alternativas o consulta directamente con `@libsql/client`

### Errores de build en producción
- Asegúrate de que `serverExternalPackages` está configurado en `next.config.ts`
- Verifica que todas las variables de entorno están configuradas en tu plataforma de deployment

## Recursos

- [Documentación de Turso](https://docs.turso.tech)
- [Prisma Driver Adapters](https://www.prisma.io/docs/concepts/components/prisma-client/driver-adapters)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## Licencia

MIT

# nextjs-prisma-zod-sqllite-ADMIN-PANEL-TEMPLATE
