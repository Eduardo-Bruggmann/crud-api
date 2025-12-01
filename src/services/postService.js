import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const buildSearchFilter = (search) => {
  const query = (search || "").trim();
  if (!query) return {};
  return {
    OR: [{ title: { contains: query } }, { content: { contains: query } }],
  };
};

export const insertPost = (data) => prisma.post.create({ data });

export const findPostById = (id) => prisma.post.findUnique({ where: { id } });

export const listPosts = async (skip = 0, take = 20, search = "") => {
  const where = buildSearchFilter(search);

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take,
      where,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        categoryId: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  return { items, total };
};

export const listPostsByCategoryName = async (
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

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take,
      where,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        categoryId: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  return { items, total };
};

export const updatePostById = (id, data) =>
  prisma.post.update({
    where: { id },
    data,
  });

export const deletePostById = async (id) => {
  const commentsCount = await prisma.comment.count({
    where: { postId: id },
  });

  if (commentsCount > 0) {
    throw new AppError("Post has comments and cannot be deleted", 409);
  }

  await prisma.post.delete({
    where: { id },
  });
};
