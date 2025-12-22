import prisma from "../config/prisma.js";

const buildSearchFilter = (search) => {
  const query = (search || "").trim();
  if (!query) return {};
  return {
    OR: [{ name: { contains: query } }],
  };
};

export const insertCategory = async (data) =>
  await prisma.category.create({ data });

export const findCategoryById = async (id) =>
  await prisma.category.findUnique({ where: { id } });

export const findCategoryByName = async (name) =>
  await prisma.category.findUnique({ where: { name } });

export const findManyCategories = async (skip = 0, take = 20, search = "") => {
  const where = buildSearchFilter(search);

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take,
      where,
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.category.count({ where }),
  ]);

  return { items, total };
};

export const updateCategoryById = async (id, data) =>
  await prisma.category.update({
    where: { id },
    data,
  });

export const deleteCategoryById = async (id) =>
  await prisma.category.delete({
    where: { id },
  });
