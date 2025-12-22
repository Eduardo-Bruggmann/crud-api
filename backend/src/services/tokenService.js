import * as tokenRepository from "../repositories/tokenRepository.js";
import { findUserById } from "../repositories/userRepository.js";
import { AppError } from "../utils/error/AppError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const { insertToken, findToken, deleteToken } = tokenRepository;

export const getToken = async (token) => {
  if (!token) throw new AppError("Token is missing", 400);

  const stored = await findToken(token);

  if (!stored) throw new AppError("Invalid token", 401);

  return stored;
};

export const removeToken = async (token) => {
  await getToken(token);
  return await deleteToken(token);
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = async (userId) => {
  const user = await findUserById(userId);

  if (!user) throw new AppError("User not found", 404);

  const token = crypto.randomBytes(64).toString("hex");

  await insertToken(userId, token);

  return token;
};

export const validateRefreshToken = async (token) => {
  const stored = await findToken(token);
  if (!stored) throw new AppError("Invalid token", 401);

  if (stored.expiresAt < new Date()) {
    await deleteToken(token);
    throw new AppError("Token expired", 401);
  }

  return stored;
};

export const rotateRefreshToken = async (oldToken) => {
  const stored = await validateRefreshToken(oldToken);
  if (!stored) throw new AppError("Invalid token", 401);

  await deleteToken(oldToken);

  return await generateRefreshToken(stored.userId);
};

export const revokeRefreshToken = async (token) => {
  if (!token) throw new AppError("Token is missing", 400);

  return await deleteToken(token);
};
