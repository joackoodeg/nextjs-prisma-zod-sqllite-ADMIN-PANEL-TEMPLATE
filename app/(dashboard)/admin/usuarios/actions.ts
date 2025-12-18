"use server";

import { prisma } from "@/lib/prisma";
import {
  usuarioSchema,
  type UsuarioFormData,
} from "@/lib/validations/usuario";
import { revalidatePath } from "next/cache";

export type UserWithStats = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type UsersFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
};

export async function getUsers(
  filters?: UsersFilters
): Promise<PaginatedResponse<UserWithStats>> {
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 25;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};

  // Filtro de búsqueda por nombre o email
  if (filters?.search) {
    where.OR = [
      {
        name: {
          contains: filters.search,
        },
      },
      {
        email: {
          contains: filters.search,
        },
      },
    ];
  }

  // Filtro de status
  if (filters?.status && filters.status !== "all") {
    where.status = filters.status;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data: users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

type ActionResult = {
  success: boolean;
  error?: string;
  data?: UserWithStats;
};

export async function createUser(formData: UsuarioFormData): Promise<ActionResult> {
  try {
    const validated = usuarioSchema.parse(formData);

    // Verificar si ya existe un usuario con el mismo email
    const existente = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existente) {
      return { success: false, error: "Ya existe un usuario con ese email" };
    }

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        status: validated.status || "active",
      },
    });

    revalidatePath("/admin/usuarios");
    revalidatePath("/");

    return { success: true, data: user };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return { success: false, error: "Error al crear el usuario" };
  }
}

export async function updateUser(
  id: string,
  formData: UsuarioFormData
): Promise<ActionResult> {
  try {
    const validated = usuarioSchema.parse(formData);

    // Verificar si existe otro usuario con el mismo email
    if (validated.email) {
      const existente = await prisma.user.findFirst({
        where: {
          email: validated.email,
          id: { not: id },
        },
      });

      if (existente) {
        return { success: false, error: "Ya existe otro usuario con ese email" };
      }
    }

    const userActual = await prisma.user.findUnique({
      where: { id },
    });

    if (!userActual) {
      return { success: false, error: "Usuario no encontrado" };
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: validated.name,
        email: validated.email,
        status: validated.status || "active",
      },
    });

    revalidatePath("/admin/usuarios");
    revalidatePath("/");

    return { success: true, data: user };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return { success: false, error: "Error al actualizar el usuario" };
  }
}

export async function toggleUserStatus(id: string): Promise<ActionResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        status: user.status === "active" ? "inactive" : "active",
      },
    });

    revalidatePath("/admin/usuarios");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error);
    return { success: false, error: "Error al cambiar el estado del usuario" };
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/usuarios");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { success: false, error: "Error al eliminar el usuario" };
  }
}

