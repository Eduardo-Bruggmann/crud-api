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

export {
  usernameField,
  emailField,
  passwordField,
  privacyField,
  adminField,
  avatarField,
};
