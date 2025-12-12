import * as userService from "../services/userService.js";
import { errorHandler } from "../utils/error/errorHandler.js";
import { logger } from "../utils/logger.js";

const {
  getUserById,
  getPublicUsers,
  editUserById,
  removeUserById,
  generateResetPasswordCode,
  resetPasswordWithCode,
} = userService;

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    res.status(200).json(user);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const listPublicUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const { items, total } = await getPublicUsers(skip, limit, search);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      users: items,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.user.id;
    const payload = req.body;

    const updated = await editUserById(id, payload);

    res.status(200).json(updated);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.user.id;
    await removeUserById(id);

    logger.warn(`User soft-deleted: id=${id}`);

    res.status(204).send();
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const email = req.body.email;

    await generateResetPasswordCode(email);

    res.status(200).json({ message: "Reset code sent" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const confirmPasswordReset = async (req, res) => {
  try {
    const payload = req.body;

    await resetPasswordWithCode(payload);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return errorHandler(err, res);
  }
};
