import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(5, "Título curto demais")
    .max(100, "Título longo demais"),
  content: z
    .string()
    .min(20, "Conteúdo curto demais")
    .max(6000, "Conteúdo longo demais"),
  categoryId: z.number().int("ID da categoria inválido").optional(),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(5, "Título curto demais")
    .max(100, "Título longo demais")
    .optional(),
  content: z
    .string()
    .min(20, "Conteúdo curto demais")
    .max(6000, "Conteúdo longo demais")
    .optional(),
  categoryId: z.number().int("ID da categoria inválido").optional(),
});
