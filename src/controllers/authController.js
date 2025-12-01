import bcrypt from "bcryptjs";
import * as userService from "../services/userService.js";
import * as tokenUtils from "../utils/tokenUtils.js";
import { registerUserSchema, loginUserSchema } from "../schemas/userSchema.js";
import { logger } from "../utils/logger.js";
import { getZodErrorMessage } from "../utils/errorUtils.js";

const {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
} = tokenUtils;

const { insertUser, findUserByEmailOrUsername, findUserById } = userService;

export const registerUser = async (req, res) => {
  try {
    const payload = registerUserSchema.parse(req.body);

    const exists = await findUserByEmailOrUsername(
      payload.email,
      payload.username
    );
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(payload.password, 10);

    const data = {
      username: payload.username,
      email: payload.email,
      password: hash,
      isPrivate: false,
      isAdmin: false,
    };

    const user = await insertUser(data);
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    logger.info(`User created: ${user.email}`);

    res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Set true if using HTTPS
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/auth/refresh",
      })
      .json({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken,
      });
  } catch (err) {
    logger.error(err);

    const msg = getZodErrorMessage(err);
    if (msg) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const payload = loginUserSchema.parse(req.body);
    const { email, username, password } = payload;

    const user = await findUserByEmailOrUsername(email, username);

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ message: "Incorrect password" });
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);

    logger.info(`Login: userId=${user.id}`);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Set true if using HTTPS
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/auth/refresh",
      })
      .json({
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken,
      });
  } catch (err) {
    logger.error(err);

    const msg = getZodErrorMessage(err);
    if (msg) return res.status(400).json({ message: msg });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(400).json({ message: "Token missing" });

    await revokeRefreshToken(token);

    logger.info(`Logout: userId=${req.user.id}`);

    res.json({ message: "Logout successful" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token missing" });

    const valid = await validateRefreshToken(token);
    if (!valid) return res.status(401).json({ message: "Refresh invalid" });

    const newRefresh = await rotateRefreshToken(token);

    const user = await findUserById(valid.userId);
    const newAccess = generateAccessToken(user);

    logger.info(`Refresh emitted: userId=${valid.userId}`);

    res
      .cookie("refreshToken", newRefresh, {
        httpOnly: true,
        secure: false, // Set true if using HTTPS
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/auth/refresh",
      })
      .json({ accessToken: newAccess });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
