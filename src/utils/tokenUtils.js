import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
  insertToken,
  findToken,
  deleteToken,
} from "../services/tokenService.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(64).toString("hex");

  await insertToken(userId, token);

  return token;
};

export const validateRefreshToken = async (token) => {
  const stored = await findToken(token);
  if (!stored) return null;

  if (stored.expiresAt < new Date()) {
    await deleteToken(token);
    return null;
  }

  return stored;
};

export const rotateRefreshToken = async (oldToken) => {
  const stored = await validateRefreshToken(oldToken);
  if (!stored) return null;

  await deleteToken(oldToken);

  return await generateRefreshToken(stored.userId);
};

export const revokeRefreshToken = async (token) => {
  return await deleteToken(token);
};
