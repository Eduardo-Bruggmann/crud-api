import prisma from "../config/prisma.js";

const buildSearchFilter = (search) => {
  const query = (search || "").trim();
  if (!query) return { deletedAt: null };

  return {
    deletedAt: null,
    OR: [{ username: { contains: query } }, { email: { contains: query } }],
  };
};

const buildOrQuery = (email, username) => {
  const orQuery = [];

  if (email) orQuery.push({ email });
  if (username) orQuery.push({ username });

  return orQuery.length > 0 ? orQuery : null;
};

export const insertUser = async (data) => await prisma.user.create({ data });

export const findUserByEmailOrUsername = async (email, username) => {
  const orQuery = buildOrQuery(email, username);
  if (!orQuery) return null;

  return await prisma.user.findFirst({
    where: {
      OR: orQuery,
      deletedAt: null,
    },
  });
};

export const findUserById = async (id) =>
  await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

export const findManyUsers = async (skip, take, search) => {
  const where = buildSearchFilter(search);

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

export const findManyPublicUsers = async (skip, take, search) => {
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

export const updateUserById = async (id, data) =>
  await prisma.user.update({
    where: { id, deletedAt: null },
    data,
  });

export const deleteUserById = async (id) =>
  await prisma.user.update({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
