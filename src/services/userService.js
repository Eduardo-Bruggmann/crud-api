import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError.js";

const prisma = new PrismaClient();

const buildSearchFilter = (search) => {
  const query = (search || "").trim();
  if (!query) return { deletedAt: null };

  return {
    deletedAt: null,
    OR: [{ username: { contains: query } }, { email: { contains: query } }],
  };
};

export const insertUser = (data) => prisma.user.create({ data });

export const findUserByEmailOrUsername = (email, username) => {
  const orQuery = [];
  if (email) {
    orQuery.push({ email: { contains: email } });
  }
  if (username) {
    orQuery.push({ username: { contains: username } });
  }

  if (!orQuery.length) return Promise.resolve(null);

  return prisma.user.findFirst({
    where: {
      deletedAt: null,
      OR: orQuery,
    },
  });
};

export const findUserById = (id) =>
  prisma.user.findFirst({
    where: { id, deletedAt: null },
  });

export const listUsers = async (
  skip = 0,
  take = 20,
  search = "",
  select = {
    id: true,
    username: true,
    email: true,
    avatar: true,
    isAdmin: true,
    isPrivate: true,
  }
) => {
  const where = buildSearchFilter(search);

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      select,
      where,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
};

export const listPublicUsers = async (skip = 0, take = 20, search = "") => {
  const where = {
    ...buildSearchFilter(search),
    isPrivate: false,
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      where,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
};

export const updateUserById = (id, data) =>
  prisma.user.update({
    where: { id },
    data,
  });

export const deleteUserById = async (id) => {
  const postCount = await prisma.post.count({ where: { authorId: id } });
  if (postCount > 0) {
    throw new AppError("User has posts and cannot be deleted", 409);
  }

  const commentsCount = await prisma.comment.count({
    where: { authorId: id },
  });
  if (commentsCount > 0) {
    throw new AppError("User has comments and cannot be deleted", 409);
  }

  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
