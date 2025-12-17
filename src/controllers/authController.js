import * as authService from "../services/authService.js";
import { errorHandler } from "../utils/error/errorHandler.js";
import { logger } from "../utils/logger.js";

const cookieOptions = {
  httpOnly: true,
  secure: false, // Set true if using HTTPS
  sameSite: "strict",
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: "/api/auth",
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
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({ user, accessToken });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    await authService.logout(token);

    logger.info(`Logout: userId=${req.user.id}`);

    res.status(204).clearCookie("refreshToken", { path: "/api/auth" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export const refreshTokens = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    const { user, accessToken, refreshToken } = await authService.refreshTokens(
      token
    );

    logger.info(`Refresh emitted: userId=${valid.userId}`);

    res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({ user, accessToken });
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
