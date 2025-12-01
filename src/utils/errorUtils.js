import { ZodError } from "zod";
import { AppError } from "./AppError.js";

export const getZodErrorMessage = (err) => {
  if (err instanceof ZodError) {
    return JSON.parse(err)[0].message ?? "Validation error";
  }
  return null;
};

export const parseAppError = (err) => {
  if (err instanceof AppError) {
    return {
      message: err.message,
      status: err.statusCode,
    };
  }
  return null;
};
