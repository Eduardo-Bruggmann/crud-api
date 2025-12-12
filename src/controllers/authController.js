import * as userService from "../services/userService.js";
import * as tokenService from "../services/tokenService.js";
import { errorHandler } from "../utils/error/errorHandler.js";
import { logger } from "../utils/logger.js";

const { generateAccessToken, validateRefreshToken, rotateRefreshToken } =
  tokenService;

const { createUser, getUserById, isLoginValid, logoutUserByToken } =
  userService;

const cookieOptions = {
  httpOnly: true,
  secure: false, // Set true if using HTTPS
  sameSite: "strict",
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: "/api/auth",
};

export const registerUser = async (req, res) => {
  try {
    const payload = req.body;

    await createUser(payload);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const loginUser = async (req, res) => {
  try {
    const payload = req.body;

    const { user, accessToken, refreshToken } = await isLoginValid(payload);

    res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({ user, accessToken });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    await logoutUserByToken(token);

    logger.info(`Logout: userId=${req.user.id}`);

    res
      .status(200)
      .clearCookie("refreshToken", { path: "/api/auth" })
      .json({ message: "Logout successful" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    const valid = await validateRefreshToken(token);

    const newRefresh = await rotateRefreshToken(token);

    const user = await getUserById(valid.userId);
    const newAccess = generateAccessToken(user);

    logger.info(`Refresh emitted: userId=${valid.userId}`);

    res
      .cookie("refreshToken", newRefresh, cookieOptions)
      .json({ accessToken: newAccess });
  } catch (err) {
    return errorHandler(err, res);
  }
};
