import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(5, "Title too short").max(100, "Title too long"),
  content: z
    .string()
    .min(20, "Content too short")
    .max(6000, "Content too long"),
  categoryId: z.number().int("Invalid category ID").optional(),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(5, "Title too short")
    .max(100, "Title too long")
    .optional(),
  content: z
    .string()
    .min(20, "Content too short")
    .max(6000, "Content too long")
    .optional(),
  categoryId: z.number().int("Invalid category ID").optional(),
});
