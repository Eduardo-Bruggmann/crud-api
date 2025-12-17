import * as userRepository from "../repositories/userRepository.js";
import { sendDeletionEmail } from "../services/email/emailService.js";
import { updateUserSchema } from "../schemas/userSchema.js";
import { sanitizeUser, sanitizeUsers } from "../utils/sanitizeUser.js";
import { postCount } from "../repositories/postRepository.js";
import { commentCount } from "../repositories/commentRepository.js";
import { AppError } from "../utils/error/AppError.js";
import bcrypt from "bcryptjs";

const {
  findUserByEmailOrUsername,
  findUserById,
  findManyPublicUsers,
  updateUserById,
  deleteUserById,
} = userRepository;

export const getUserByEmailOrUsername = async (email, username) => {
  const user = await findUserByEmailOrUsername(email, username);

  if (!user) throw new AppError("User not found", 404);

  return sanitizeUser(user);
};

export const getUser = async (id) => {
  const user = await findUserById(id);

  if (!user) throw new AppError("User not found", 404);

  return sanitizeUser(user);
};

export const listPublicUsers = async (skip, take, search) => {
  const { items, total } = await findManyPublicUsers(skip, take, search);

  return { items: sanitizeUsers(items), total };
};

export const updateUser = async (id, payload) => {
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

export const deleteUser = async (id) => {
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
