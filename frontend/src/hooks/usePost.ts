"use client";

import { useState, useCallback } from "react";
import * as postService from "@/services/postService";
import { Post, CreatePostDTO, UpdatePostDTO } from "@/types/post";

export function usePost() {
  const [post, setPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(async (data: CreatePostDTO) => {
    setLoading(true);
    setError(null);

    try {
      const createdPost = await postService.createPost(data);

      setPosts((prev) => [createdPost, ...prev]);
      setPost(createdPost);

      return createdPost;
    } catch (err: any) {
      setError(err.message || "Failed to create post");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPost = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const fetchedPost = await postService.getPost(id);
      setPost(fetchedPost);
      return fetchedPost;
    } catch (err: any) {
      setError(err.message || "Failed to fetch post");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listPosts = useCallback(
    async (requestedPage = page, query = search) => {
      setLoading(true);
      setError(null);

      try {
        const {
          page,
          limit: fetchedLimit,
          total,
          totalPages,
          posts,
        } = await postService.listPosts(requestedPage, limit, query);

        setPosts(posts);
        setPage(page);
        setLimit(fetchedLimit);
        setTotal(total);
        setTotalPages(totalPages);
        setSearch(query);

        return posts;
      } catch (err: any) {
        setError(err.message || "Failed to fetch posts");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [limit, page, search]
  );

  const listPostsByCategoryName = useCallback(
    async (categoryName: string, requestedPage = 1, query = search) => {
      setLoading(true);
      setError(null);

      try {
        const {
          page,
          limit: fetchedLimit,
          total,
          totalPages,
          posts,
        } = await postService.listPostsByCategoryName(
          categoryName,
          requestedPage,
          limit,
          query
        );

        setPosts(posts);
        setPage(page);
        setLimit(fetchedLimit);
        setTotal(total);
        setTotalPages(totalPages);
        setSearch(query);

        return posts;
      } catch (err: any) {
        setError(err.message || "Failed to fetch posts by category");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [limit, search]
  );

  const updatePost = useCallback(async (id: number, data: UpdatePostDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updatedPost = await postService.updatePost(id, data);

      setPost(updatedPost);
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? updatedPost : post))
      );

      return updatedPost;
    } catch (err: any) {
      setError(err.message || "Failed to update post");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await postService.deletePost(id);

      setPost((prev) => (prev?.id === id ? null : prev));
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete post");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    post,
    posts,
    page,
    limit,
    total,
    totalPages,
    search,
    loading,
    error,
    createPost,
    getPost,
    listPosts,
    listPostsByCategoryName,
    updatePost,
    deletePost,
  };
}
