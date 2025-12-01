import bcrypt from "bcryptjs";
import * as userService from "../services/userService.js";
import {
  registerUserByAdminSchema,
  updateUserSchema,
} from "../schemas/userSchema.js";
import { logger } from "../utils/logger.js";
import { getZodErrorMessage } from "../utils/errorUtils.js";
import { parseAppError } from "../utils/errorUtils.js";

const {
  insertUser,
  findUserByEmailOrUsername,
  findUserById,
  listUsers,
  updateUserById,
  deleteUserById,
} = userService;

export const createUser = async (req, res) => {
  try {
    const payload = registerUserByAdminSchema.parse(req.body);

    const exists = await findUserByEmailOrUsername(
      payload.email,
      payload.username
    );

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(payload.password, 10);

    const user = await insertUser({
      username: payload.username,
      email: payload.email,
      password: hash,
      isAdmin: payload.isAdmin ?? false,
      isPrivate: payload.isPrivate ?? false,
    });

    logger.info(`User created: ${user.email}`);

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isPrivate: user.isPrivate,
    });
  } catch (err) {
    logger.error(err);

    const msg = getZodErrorMessage(err);
    if (msg) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isPrivate: user.isPrivate,
      avatar: user.avatar,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const { items, total } = await listUsers(skip, limit, search);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      users: items,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = updateUserSchema.parse(req.body);
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const dataToUpdate = { ...payload };

    if (payload.password && id !== req.user.id) {
      return res
        .status(400)
        .json({ message: "Admins cannot change users' passwords" });
    }

    const updated = await updateUserById(id, dataToUpdate);

    res.json({
      id: updated.id,
      username: updated.username,
      email: updated.email,
      isAdmin: updated.isAdmin,
      isPrivate: updated.isPrivate,
      avatar: updated.avatar,
    });
  } catch (err) {
    logger.error(err);

    const msg = getZodErrorMessage(err);
    if (msg) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteUserById(id);

    logger.warn(`User soft-deleted: id=${id}`);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    logger.error(err);

    const appErr = parseAppError(err);
    if (appErr)
      return res.status(appErr.status).json({ message: appErr.message });

    res.status(500).json({ message: "Internal server error" });
  }
};
