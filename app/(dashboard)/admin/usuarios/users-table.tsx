"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type UserWithStats,
  toggleUserStatus,
  deleteUser,
  type PaginatedResponse,
} from "./actions";
import { UserDialog } from "./user-dialog";
import { Pagination } from "@/components/ui/pagination";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  Loader2,
  Users,
  Mail,
} from "lucide-react";

interface UsersTableProps {
  users: UserWithStats[];
  pagination: PaginatedResponse<UserWithStats>["pagination"];
}

export function UsersTable({ users, pagination }: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<UserWithStats | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserWithStats | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggleStatus = (user: UserWithStats) => {
    startTransition(async () => {
      const result = await toggleUserStatus(user.id);
      if (!result.success) {
        setError(result.error || "Error al cambiar el estado");
      }
    });
  };

  const handleDelete = () => {
    if (!deletingUser) return;

    startTransition(async () => {
      const result = await deleteUser(deletingUser.id);
      if (result.success) {
        setDeletingUser(null);
      } else {
        setError(result.error || "Error al eliminar");
      }
    });
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No hay usuarios</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Crea tu primer usuario para comenzar.
        </p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive mb-4">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Fecha de creación</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className={user.status === "inactive" ? "opacity-60" : ""}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                    className={
                      user.status === "active"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : ""
                    }
                  >
                    {user.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingUser(user)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user)}
                          disabled={isPending}
                        >
                          {user.status === "active" ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletingUser(user)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <Pagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
        className="mt-4"
      />

      {/* Dialog de edición */}
      <UserDialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        user={editingUser}
      />

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>¿Eliminar usuario?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              usuario <strong>&quot;{deletingUser?.name}&quot;</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeletingUser(null)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

