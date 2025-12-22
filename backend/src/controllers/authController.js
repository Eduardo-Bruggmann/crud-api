import * as authService from "../services/authService.js";
import { errorHandler } from "../utils/error/errorHandler.js";
import { logger } from "../utils/logger.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/api",
};

const accessTokenOptions = {
  ...cookieOptions,
  maxAge: 15 * 60 * 1000,
};

const refreshTokenOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const payload = req.body;

    const user = await authService.register(payload);

    res.status(201).json(user);
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const login = async (req, res) => {
  try {
    const payload = req.body;

    const { user, accessToken, refreshToken } = await authService.login(
      payload
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .json({ user });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
      logger.info(`Logout: userId=${req.user.id}`);
    }

    res
      .status(204)
      .clearCookie("accessToken", { path: "/api" })
      .clearCookie("refreshToken", { path: "/api" })
      .send();
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const refreshTokens = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(204).send();

    const { user, accessToken, refreshToken } = await authService.refreshTokens(
      token
    );

    logger.info(`Refresh emitted: userId=${user.id}`);

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken)
      .json({ user });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const email = req.body.email;

    await authService.requestPasswordReset(email);

    res.status(200).json({ message: "Reset code sent" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const confirmPasswordReset = async (req, res) => {
  try {
    const payload = req.body;

    await authService.confirmPasswordReset(payload);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return errorHandler(err, res);
  }
};
