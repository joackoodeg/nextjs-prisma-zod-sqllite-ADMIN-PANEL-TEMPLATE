import { z } from "zod";

export const usuarioSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
