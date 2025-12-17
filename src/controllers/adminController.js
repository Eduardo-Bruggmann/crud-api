import * as adminService from "../services/adminService.js";
import * as userService from "../services/userService.js";
import { errorHandler } from "../utils/error/errorHandler.js";
import { logger } from "../utils/logger.js";

export const createUser = async (req, res) => {
  try {
    const payload = req.body;

    const user = await adminService.createUser(payload);

    logger.info(`User created: ${user.email}`);

    res.status(201).json(user);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await userService.getUser(id);

    res.status(200).json(user);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const { items, total } = await adminService.listUsers(skip, limit, search);

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
    const id = req.params.id;

    const payload = req.body;

    await userService.getUser(id);

    const updatedUser = await adminService.updateUser(id, payload);

    res.status(200).json(updatedUser);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    await userService.getUser(id);

    await userService.deleteUser(id);

    logger.warn(`User soft-deleted: id=${id}`);

    res.status(204).send();
  } catch (err) {
    return errorHandler(err, res);
  }
};
