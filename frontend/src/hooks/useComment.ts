"use client";

import { useCallback, useState } from "react";
import * as commentService from "@/services/commentService";
import { Comment, CreateCommentDTO } from "@/types/comment";

export function useComment() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createComment = useCallback(async (data: CreateCommentDTO) => {
    setLoading(true);
    setError(null);

    try {
      const createdComment = await commentService.createComment(data);

      setComments((prev) => [...prev, createdComment]);
      return createdComment;
    } catch (err: any) {
      setError(err.message || "Failed to create comment");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listCommentsByPost = useCallback(
    async (postId: number, requestedPage = page, query = search) => {
      setLoading(true);
      setError(null);

      try {
        const {
          page,
          limit: fetchedLimit,
          total,
          totalPages,
          comments,
        } = await commentService.listCommentsByPost(
          postId,
          requestedPage,
          limit,
          query
        );

        setComments(comments);
        setPage(page);
        setLimit(fetchedLimit);
        setTotal(total);
        setTotalPages(totalPages);
        setSearch(query);

        return comments;
      } catch (err: any) {
        setError(err.message || "Failed to fetch comments");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [limit, page, search]
  );

  const deleteComment = useCallback(
    async (postId: number, commentId: number) => {
      setLoading(true);
      setError(null);

      try {
        await commentService.deleteComment(postId, commentId);

        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      } catch (err: any) {
        setError(err.message || "Failed to delete comment");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    comments,
    page,
    limit,
    total,
    totalPages,
    search,
    loading,
    error,
    createComment,
    listCommentsByPost,
    deleteComment,
  };
}
