import * as userRepository from "../repositories/userRepository.js";
import * as emailService from "../services/email/emailService.js";
import * as adminSchema from "../schemas/adminSchema.js";
import { sanitizeUser, sanitizeUsers } from "../utils/sanitizeUser.js";
import { AppError } from "../utils/error/AppError.js";
import bcrypt from "bcryptjs";

const {
  insertUser,
  findUserByEmailOrUsername,
  findUserById,
  findManyUsers,
  updateUserById,
} = userRepository;

const { sendVerificationEmail } = emailService;

const { crateUserSchema, updateUserSchema } = adminSchema;

export const createUser = async (payload) => {
  const insertData = crateUserSchema.parse(payload);
  delete insertData.confirmPassword;

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

export const listUsers = async (skip, limit, search) => {
  const { items, total } = await findManyUsers(skip, limit, search);

  return { items: sanitizeUsers(items), total };
};

export const updateUser = async (id, payload) => {
  const user = await findUserById(id);
  if (!user) throw new AppError("User not found", 404);

  const updateData = updateUserSchema.parse(payload);

  const updatedUser = await updateUserById(id, updateData);

  if (!updatedUser) throw new AppError("Failed to update user", 500);

  return sanitizeUser(updatedUser);
};
