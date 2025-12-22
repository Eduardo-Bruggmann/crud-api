import { sendErrorEmail } from "../../services/email/emailService.js";
import { AppError } from "./AppError.js";
import { ZodError } from "zod";
import { logger } from "../logger.js";

export const errorHandler = (err, res) => {
  console.error(err);

  const appErr = parseAppError(err);
  const zodMessage = getZodErrorMessage(err);

  let errorMessage;

  if (appErr) {
    errorMessage = appErr.message;
    logger.error(errorMessage);
    return res.status(appErr.status).json({ message: appErr.message });
  }

  if (zodMessage) {
    errorMessage = zodMessage;
    logger.error(errorMessage);
    return res.status(400).json({ message: zodMessage });
  }

  errorMessage = err?.message || "Internal server error";

  logger.error(errorMessage);

  try {
    sendErrorEmail(errorMessage);
  } catch (emailErr) {
    console.error("Failed to send admin error email:", emailErr);
  }

  return res.status(500).json({ message: "Internal server error" });
};

const parseAppError = (err) => {
  if (err instanceof AppError) {
    return {
      message: err.message,
      status: err.statusCode,
    };
  }
  return null;
};

const getZodErrorMessage = (err) => {
  if (err instanceof ZodError) {
    return err.errors?.[0]?.message || "Invalid input data";
  }
  return null;
};
