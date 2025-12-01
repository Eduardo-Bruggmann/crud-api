import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const buildSearchFilter = (search) => {
  const query = (search || "").trim();
  if (!query) return {};
  return {
    OR: [{ content: { contains: query } }],
  };
};

export const insertComment = (data) => prisma.comment.create({ data });

export const findCommentById = (id) =>
  prisma.comment.findUnique({ where: { id } });

export const listCommentsByPost = async (
  postId,
  skip = 0,
  take = 20,
  search = ""
) => {
  const where = { postId, ...buildSearchFilter(search) };

  const [items, total] = await Promise.all([
    prisma.comment.findMany({
      skip,
      take,
      where,
      select: {
        id: true,
        content: true,
        createdAt: true,
        authorId: true,
        postId: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.comment.count({ where }),
  ]);

  return { items, total };
};

export const deleteCommentById = (id) =>
  prisma.comment.delete({
    where: { id },
  });
