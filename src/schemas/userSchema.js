import { z } from "zod";

const usernameField = z
  .string()
  .min(3, "Username too short")
  .max(20, "Username too long");

const emailField = z.email("Invalid email format").max(255, "Email too long");

const passwordField = z
  .string()
  .min(6, "Password too short")
  .max(32, "Password too long");

const privacyField = z.boolean();

const adminField = z.boolean();

const avatarField = z.string().max(255);

export const registerUserSchema = z
  .object({
    username: usernameField,
    email: emailField,
    password: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerUserByAdminSchema = registerUserSchema.safeExtend({
  isPrivate: privacyField.optional().default(false),
  isAdmin: adminField.optional().default(false),
});

export const loginUserSchema = z
  .object({
    email: emailField.optional(),
    username: usernameField.optional(),
    password: passwordField,
  })
  .refine((data) => !data.email || !data.username, {
    message: "Email or username is required",
  });

export const updateUserSchema = z
  .object({
    username: usernameField.optional(),
    email: emailField.optional(),
    password: passwordField.optional(),
    currentPassword: passwordField.optional(),
    isPrivate: privacyField.optional(),
    avatar: avatarField.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export const updateUserByAdminSchema = z
  .object({
    username: usernameField.optional(),
    isAdmin: adminField.optional(),
    avatar: avatarField.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export const resetPasswordSchema = z
  .object({
    email: emailField,
    code: z.string().length(7, "Invalid code format"),
    newPassword: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
