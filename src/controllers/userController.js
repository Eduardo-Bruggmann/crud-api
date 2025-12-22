import * as userService from "../services/userService.js";
import { errorHandler } from "../utils/error/errorHandler.js";
import { logger } from "../utils/logger.js";

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.user.id);

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

    const { items, total } = await userService.listPublicUsers(
      skip,
      limit,
      search
    );

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
    const avatarFile = req.file ?? null;

    if (avatarFile) payload.avatar = `/avatars/${avatarFile.filename}`;

    const updatedUser = await userService.updateUser(id, payload);

    res.status(200).json(updatedUser);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.user.id;
    await userService.deleteUser(id);

    logger.warn(`User soft-deleted: id=${id}`);

    res.status(204).clearCookie("accessToken", { path: "/api/auth" });
  } catch (err) {
    return errorHandler(err, res);
  }
};
