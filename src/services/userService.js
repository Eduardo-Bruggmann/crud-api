import * as userRepository from "../repositories/userRepository.js";
import * as userSchema from "../schemas/userSchema.js";
import * as emailService from "../services/email/emailService.js";
import * as tokenService from "./tokenService.js";
import { postCount } from "../repositories/postRepository.js";
import { commentCount } from "../repositories/commentRepository.js";
import { AppError } from "../utils/error/AppError.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const {
  findUserByEmailOrUsername,
  findUserById,
  listUsers,
  listPublicUsers,
  updateUserById,
  deleteUserById,
  insertUser,
} = userRepository;

const {
  registerUserSchema,
  registerUserByAdminSchema,
  loginUserSchema,
  updateUserSchema,
  updateUserByAdminSchema,
  resetPasswordSchema,
} = userSchema;

const { sendVerificationEmail, sendDeletionEmail, sendResetPasswordEmail } =
  emailService;

const { generateAccessToken, generateRefreshToken, revokeRefreshToken } =
  tokenService;

export const createUser = async (payload) => {
  const data = registerUserSchema.parse(payload);

  if (await findUserByEmailOrUsername(data.email, data.username))
    throw new AppError("User already exists", 400);

  const hash = await bcrypt.hash(data.password, 10);

  const insertData = {
    ...data,
    password: hash,
    isPrivate: false,
    isAdmin: false,
  };

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

export const createUserByAdmin = async (payload) => {
  const insertData = registerUserByAdminSchema.parse(payload);

  if (await findUserByEmailOrUsername(insertData.email, insertData.username))
    throw new AppError("User already exists", 400);

  const hash = await bcrypt.hash(insertData.password, 10);

  const user = await insertUser({ ...insertData, password: hash });

  if (!user) throw new AppError("Failed to create user", 500);

  logger.info(`User created: ${user.email}`);

  try {
    await sendVerificationEmail(user.email);
  } catch (err) {
    console.error("Error sending verification email:", err);
  }

  return sanitizeUser(user);
};

export const getUserByEmailOrUsername = async (email, username) => {
  const user = await findUserByEmailOrUsername(email, username);

  if (!user) throw new AppError("User not found", 404);

  return sanitizeUser(user);
};

export const getUserById = async (id) => {
  const user = await findUserById(id);

  if (!user) throw new AppError("User not found", 404);

  return sanitizeUser(user);
};

export const getUsers = async (skip, limit, search) => {
  const { items, total } = await listUsers(skip, limit, search);

  return { items: sanitizeUsers(items), total };
};

export const getPublicUsers = async (skip, take, search) => {
  const { items, total } = await listPublicUsers(skip, take, search);

  return { items: sanitizeUsers(items), total };
};

export const editUserById = async (id, payload) => {
  const user = await findUserById(id);
  if (!user) throw new AppError("User not found", 404);

  const updateData = updateUserSchema.parse(payload);

  const needsCurrentPassword = updateData.email || updateData.password;

  if (needsCurrentPassword && !updateData.currentPassword)
    throw new AppError(
      "Current password is required to change email or password",
      400
    );

  if (needsCurrentPassword) {
    const match = await bcrypt.compare(
      updateData.currentPassword,
      user.password
    );

    if (!match) throw new AppError("Current password is incorrect", 401);

    if (updateData.password)
      updateData.password = await bcrypt.hash(updateData.password, 10);

    delete updateData.currentPassword;
  }

  const updatedUser = await updateUserById(id, updateData);

  if (!updatedUser) throw new AppError("Failed to update user", 500);

  return sanitizeUser(updatedUser);
};

export const editUserByIdAsAdmin = async (id, payload) => {
  const user = await findUserById(id);
  if (!user) throw new AppError("User not found", 404);

  const updateData = updateUserByAdminSchema.parse(payload);

  const updatedUser = await updateUserById(id, updateData);

  if (!updatedUser) throw new AppError("Failed to update user", 500);

  return sanitizeUser(updatedUser);
};

export const removeUserById = async (id) => {
  const user = await findUserById(id);
  if (!user) throw new AppError("User not found", 404);

  if ((await postCount({ authorId: id })) > 0)
    throw new AppError("User has posts and cannot be deleted", 409);

  if ((await commentCount({ authorId: id })) > 0)
    throw new AppError("User has comments and cannot be deleted", 409);

  const deletedUser = await deleteUserById(id);

  if (!deletedUser) throw new AppError("Failed to delete user", 500);

  try {
    await sendDeletionEmail(user.email);
  } catch (err) {
    console.error("Error sending deletion email:", err);
  }

  return sanitizeUser(deletedUser);
};

export const isLoginValid = async (payload) => {
  const data = loginUserSchema.parse(payload);

  const user = await findUserByEmailOrUsername(data.email, data.username);
  if (!user) throw new AppError("Invalid credentials", 401);

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) throw new AppError("Invalid credentials", 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  logger.info(`Login: userId=${user.id}`);

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const logoutUserByToken = async (token) => {
  if (!token) throw new AppError("Token missing", 400);

  return await revokeRefreshToken(token);
};

export const generateResetPasswordCode = async (email) => {
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

export const resetPasswordWithCode = async (payload) => {
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

const sanitizeUser = (user) => {
  const {
    password,
    verificationCode,
    verificationExpiresAt,
    deletedAt,
    ...safeUser
  } = user;
  return safeUser;
};

const sanitizeUsers = (users) => {
  return users.map(sanitizeUser);
};
