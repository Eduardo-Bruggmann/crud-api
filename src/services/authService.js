import * as userRepository from "../repositories/userRepository.js";
import * as userService from "./userService.js";
import * as tokenService from "./tokenService.js";
import * as authSchema from "../schemas/userSchema.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { AppError } from "../utils/error/AppError.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { logger } from "../utils/logger.js";

const { insertUser, findUserByEmailOrUsername, updateUserById } =
  userRepository;

const { registerSchema, loginSchema, resetPasswordSchema } = authSchema;

const { generateAccessToken, generateRefreshToken, revokeRefreshToken } =
  tokenService;

export const register = async (payload) => {
  const data = registerSchema.parse(payload);

  if (await findUserByEmailOrUsername(data.email, data.username))
    throw new AppError("User already exists", 400);

  const hash = await bcrypt.hash(data.password, 10);

  const insertData = {
    ...data,
    password: hash,
    isPrivate: false,
    isAdmin: false,
  };
  delete insertData.confirmPassword;

  const user = await insertUser(insertData);

  if (!user) throw new AppError("Failed to create user", 500);

  logger.info(`User created: ${user.email}`);

  try {
    await sendVerificationEmail(user.email);
  } catch (err) {
    console.error("Error sending verification email:", err);
  }

  return sanitizeUser(user);
};

export const login = async (payload) => {
  const data = loginSchema.parse(payload);

  const user = await findUserByEmailOrUsername(data.email, data.username);
  if (!user) throw new AppError("Invalid credentials", 401);

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) throw new AppError("Invalid credentials", 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  logger.info(`Login: userId=${user.id}`);

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const logout = async (token) => {
  if (!token) throw new AppError("Token missing", 400);

  return await revokeRefreshToken(token);
};

export const refreshTokens = async (oldToken) => {
  const valid = await tokenService.validateRefreshToken(oldToken);

  const newRefresh = await tokenService.rotateRefreshToken(oldToken);

  const user = await userService.getUserById(valid.userId);
  const newAccess = tokenService.generateAccessToken(user);

  logger.info(`Refresh emitted: userId=${valid.userId}`);

  return { user, accessToken: newAccess, refreshToken: newRefresh };
};

export const requestPasswordReset = async (email) => {
  const user = await findUserByEmailOrUsername(email, undefined);

  if (!user) throw new AppError("User not found", 404);

  const rawCode = crypto.randomInt(100000, 999999).toString();
  const code = `${rawCode.slice(0, 3)}-${rawCode.slice(3)}`;

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await updateUserById(user.id, {
    verificationCode: code,
    verificationExpiresAt: expiresAt,
  });

  try {
    await sendResetPasswordEmail(email, code);
  } catch (err) {
    console.error("Error sending reset password email:", err);
    throw new AppError("Failed to send reset password email", 500);
  }

  return true;
};

export const confirmPasswordReset = async (payload) => {
  const data = resetPasswordSchema.parse(payload);
  const { email, code, newPassword } = data;

  const user = await findUserByEmailOrUsername(email, undefined);
  if (!user) throw new AppError("User not found", 404);

  if (user.verificationCode !== code)
    throw new AppError("Invalid reset code", 400);

  if (user.verificationExpiresAt < new Date())
    throw new AppError("Reset code has expired", 400);

  const hash = await bcrypt.hash(newPassword, 10);

  const updatedUser = await updateUserById(user.id, {
    password: hash,
    verificationCode: null,
    verificationExpiresAt: null,
  });

  return sanitizeUser(updatedUser);
};
