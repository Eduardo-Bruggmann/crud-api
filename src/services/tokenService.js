import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const insertToken = (userId, token) => {
  return prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });
};

export const findToken = (token) => {
  return prisma.refreshToken.findUnique({ where: { token } });
};

export const deleteToken = (token) => {
  return prisma.refreshToken.delete({ where: { token } });
};
