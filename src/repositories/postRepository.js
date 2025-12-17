import prisma from "../config/prisma.js";

const buildSearchFilter = (search) => {
  const query = (search || "").trim();
  if (!query) return {};
  return {
    OR: [{ title: { contains: query } }, { content: { contains: query } }],
  };
};

export const insertPost = async (data) => await prisma.post.create({ data });

export const findPostById = async (id) =>
  await prisma.post.findUnique({ where: { id } });

export const findPostByTitle = async (title) =>
  await prisma.post.findUnique({ where: { title } });

export const findManyPosts = async (skip = 0, take = 20, search = "") => {
  const where = buildSearchFilter(search);
  const select = {
    id: true,
    title: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    authorId: true,
    categoryId: true,
  };

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take,
      where,
      select,
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  return { items, total };
};

export const findManyPostsByCategoryName = async (
  categoryName,
  skip = 0,
  take = 20,
  search = ""
) => {
  const category = await prisma.category.findUnique({
    where: { name: categoryName },
    select: { id: true },
  });

  if (!category) {
    return { items: [], total: 0 };
  }

  const where = {
    ...buildSearchFilter(search),
    categoryId: category.id,
  };
  const select = {
    id: true,
    title: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    authorId: true,
    categoryId: true,
  };

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take,
      where,
      select,
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  return { items, total };
};

export const updatePostById = async (id, data) =>
  await prisma.post.update({
    where: { id },
    data,
  });

export const deletePostById = async (id) =>
  await prisma.post.delete({
    where: { id },
  });

export const postCount = async (objectWithId) => {
  if (objectWithId.authorId)
    return await prisma.post.count({
      where: { authorId: objectWithId.authorId },
    });

  if (objectWithId.categoryId)
    return await prisma.post.count({
      where: { categoryId: objectWithId.categoryId },
    });

  return null;
};
