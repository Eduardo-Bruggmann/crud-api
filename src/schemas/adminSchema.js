import { z } from "zod";
import {
  usernameField,
  privacyField,
  adminField,
  avatarField,
} from "./userSchema.js";
import { registerSchema } from "./authSchema.js";

export const crateUserSchema = registerSchema.safeExtend({
  isPrivate: privacyField.optional().default(false),
  isAdmin: adminField.optional().default(false),
});

export const updateUserSchema = z
  .object({
    username: usernameField.optional(),
    isAdmin: adminField.optional(),
    avatar: avatarField.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });
