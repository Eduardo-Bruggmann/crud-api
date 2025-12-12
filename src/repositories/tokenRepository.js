import prisma from "../config/prisma.js";

export const insertToken = async (userId, token) => {
  return prisma.refreshToken.upsert({
    where: { userId },
    update: {
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
    create: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });
};

export const findToken = async (token) =>
  await prisma.refreshToken.findUnique({ where: { token } });

export const deleteToken = async (token) =>
  await prisma.refreshToken.delete({ where: { token } });
