import prisma from "../config/prisma.js";

const buildSearchFilter = (search) => {
  const query = (search || "").trim();
  if (!query) return {};
  return {
    OR: [{ content: { contains: query } }],
  };
};

export const insertComment = async (data) =>
  await prisma.comment.create({ data });

export const findCommentById = async (id) =>
  await prisma.comment.findUnique({ where: { id } });

export const listCommentsByPost = async (
  postId,
  skip = 0,
  take = 20,
  search = ""
) => {
  const where = { postId, ...buildSearchFilter(search) };
  const select = {
    id: true,
    content: true,
    createdAt: true,
    authorId: true,
    postId: true,
  };

  const [items, total] = await Promise.all([
    prisma.comment.findMany({
      skip,
      take,
      where,
      select,
      orderBy: { createdAt: "desc" },
    }),
    prisma.comment.count({ where }),
  ]);

  return { items, total };
};

export const deleteCommentById = async (id) =>
  await prisma.comment.delete({
    where: { id },
  });

export const commentCount = async (objectWithId) => {
  if (objectWithId.authorId)
    return await prisma.comment.count({
      where: { authorId: objectWithId.authorId },
    });

  if (objectWithId.postId)
    return await prisma.comment.count({
      where: { postId: objectWithId.postId },
    });

  return null;
};
