import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const buildSearchFilter = (search) => {
  const query = (search || "").trim();
  if (!query) return {};
  return {
    OR: [{ name: { contains: query } }],
  };
};

export const insertCategory = (data) => prisma.category.create({ data });

export const findCategoryByName = (name) =>
  prisma.category.findUnique({ where: { name } });

export const findCategoryById = (id) =>
  prisma.category.findUnique({ where: { id } });

export const listCategories = async (skip = 0, take = 20, search = "") => {
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

export const updateCategoryById = (id, data) =>
  prisma.category.update({
    where: { id },
    data,
  });

export const deleteCategoryById = async (id) => {
  const postCount = await prisma.post.count({ where: { categoryId: id } });
  if (postCount > 0) {
    throw new AppError("Category has posts and cannot be deleted", 409);
  }

  await prisma.category.delete({
    where: { id },
  });
};
