import { Navbar } from "@/components/layout/navbar";
import { StatCard } from "@/components/ui/stat-card";
import { Users, UserCheck, UserX } from "lucide-react";
import { getUsers } from "./actions";
import { UsersTable } from "./users-table";
import { UsersHeader } from "./users-header";
import { prisma } from "@/lib/prisma";

async function getUserStats() {
  const users = await prisma.user.findMany();

  const activos = users.filter((u) => u.status === "active");
  const inactivos = users.filter((u) => u.status === "inactive");

  return {
    stats: {
      totalUsuarios: users.length,
      usuariosActivos: activos.length,
      usuariosInactivos: inactivos.length,
    },
  };
}

type UsuariosPageProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    status?: string;
  }>;
};

export default async function UsuariosPage({ searchParams }: UsuariosPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const pageSize = parseInt(params.pageSize || "25", 10);

  const filters = {
    page,
    pageSize,
    search: params.search,
    status: params.status,
  };

  const [result, stats] = await Promise.all([
    getUsers(filters),
    getUserStats(),
  ]);

  return (
    <>
      <Navbar title="Usuarios" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* KPIs */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Usuarios"
            value={stats.stats.totalUsuarios}
            icon={Users}
            description="usuarios registrados"
            iconColor="text-primary"
          />
          <StatCard
            title="Usuarios Activos"
            value={stats.stats.usuariosActivos}
            icon={UserCheck}
            description="usuarios activos"
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Usuarios Inactivos"
            value={stats.stats.usuariosInactivos}
            icon={UserX}
            description="usuarios inactivos"
            iconColor="text-muted-foreground"
          />
        </div>

        {/* Header con buscador y botón de agregar */}
        <UsersHeader />

        {/* Tabla de usuarios */}
        <UsersTable
          users={result.data}
          pagination={result.pagination}
        />
      </div>
    </>
  );
}

