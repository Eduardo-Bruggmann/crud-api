import { z } from "zod";
import { usernameField, emailField, passwordField } from "./userSchema.js";

export const registerSchema = z
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

export const loginSchema = z
  .object({
    email: emailField.optional(),
    username: usernameField.optional(),
    password: passwordField,
  })
  .refine((data) => !data.email || !data.username, {
    message: "Email or username is required",
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
