import bcrypt from "bcryptjs";
import * as userService from "../services/userService.js";
import { updateUserSchema } from "../schemas/userSchema.js";
import { logger } from "../utils/logger.js";
import { getZodErrorMessage, parseAppError } from "../utils/errorUtils.js";

const { findUserById, updateUserById, deleteUserById, listPublicUsers } =
  userService;

export const getUser = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const payload = { ...user };
    delete payload.password;

    res.json({ payload });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const { items, total } = await listPublicUsers(skip, limit, search);

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
    const id = req.user.id;
    const payload = updateUserSchema.parse(req.body);

    const user = await findUserById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const needsCurrentPassword = Boolean(payload.email || payload.password);

    if (needsCurrentPassword && !payload.currentPassword) {
      return res.status(400).json({
        message: "Current password is required to change email or password",
      });
    }

    if (payload.currentPassword) {
      const match = await bcrypt.compare(
        payload.currentPassword,
        user.password
      );
      if (!match) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
    }

    const data = { ...payload };
    delete data.currentPassword;

    if (payload.password) {
      data.password = await bcrypt.hash(payload.password, 10);
    }

    const updated = await updateUserById(id, data);

    delete updated.password;
    res.json({ updated });
  } catch (err) {
    logger.error(err);

    const msg = getZodErrorMessage(err);
    if (msg) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await deleteUserById(req.user.id);

    logger.warn(`User soft-deleted: id=${req.user.id}`);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    logger.error(err);

    const appErr = parseAppError(err);
    if (appErr)
      return res.status(appErr.status).json({ message: appErr.message });

    res.status(500).json({ message: "Internal server error" });
  }
};
