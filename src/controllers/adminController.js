import * as userService from "../services/userService.js";
import { errorHandler } from "../utils/error/errorHandler.js";
import { logger } from "../utils/logger.js";

const {
  createUserByAdmin,
  getUserById,
  getUsers,
  editUserByIdAsAdmin,
  removeUserById,
} = userService;

export const registerUser = async (req, res) => {
  try {
    const payload = req.body;

    const user = await createUserByAdmin(payload);

    logger.info(`User created: ${user.email}`);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await getUserById(id);

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

    const { items, total } = await getUsers(skip, limit, search);

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

    await getUserById(id);

    const updated = await editUserByIdAsAdmin(id, payload);

    res.status(200).json(updated);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    await getUserById(id);

    await removeUserById(id);

    logger.warn(`User soft-deleted: id=${id}`);

    res.status(204).send();
  } catch (err) {
    return errorHandler(err, res);
  }
};
