import { z } from "zod";

const usernameField = z
  .string()
  .min(3, "Username curto demais")
  .max(20, "Username longo demais");

const emailField = z.email("Email inválido");

const passwordField = z
  .string()
  .min(6, "Senha muito curta")
  .max(32, "Senha muito longa");

const privacyField = z.boolean();

const adminField = z.boolean();

const avatarField = z.string().max(255);

export const registerUserSchema = z.object({
  username: usernameField,
  email: emailField,
  password: passwordField,
});

export const registerUserByAdminSchema = registerUserSchema.extend({
  isPrivate: privacyField.optional().default(false),
  isAdmin: adminField.optional().default(false),
});

export const loginUserSchema = z
  .object({
    email: emailField.optional(),
    username: usernameField.optional(),
    password: passwordField,
  })
  .refine((data) => data.email || data.username, {
    message: "É necessário fornecer email ou username",
  });

export const updateUserSchema = z.object({
  username: usernameField.optional(),
  email: emailField.optional(),
  password: passwordField.optional(),
  currentPassword: passwordField.optional(),
  isPrivate: privacyField.optional(),
  isAdmin: adminField.optional(),
  avatar: avatarField.optional(),
});
