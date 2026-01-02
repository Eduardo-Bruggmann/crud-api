"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePost } from "@/hooks/usePost";
import { useCategory } from "@/hooks/useCategory";
import { useComment } from "@/hooks/useComment";
import { useUser } from "@/hooks/useUser";
import * as adminService from "@/services/adminService";

export default function PostsFeed() {
  const {
    posts,
    page,
    totalPages,
    loading,
    error,
    search,
    listPosts,
    listPostsByCategoryName,
  } = usePost();
  const { categories, listCategories } = useCategory();
  const { user, getUser } = useUser();
  const {
    comments,
    page: commentsPage,
    totalPages: commentsTotalPages,
    loading: commentsLoading,
    error: commentsError,
    listCommentsByPost,
    createComment,
    deleteComment,
  } = useComment();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});

  useEffect(() => {
    listPosts(1);
    listCategories(1);
  }, [listPosts, listCategories]);

  useEffect(() => {
    getUser().catch(() => null);
  }, [getUser]);

  useEffect(() => {
    const idsFromPosts = posts.map((p) => p.authorId);
    const idsFromComments = comments.map((c) => c.authorId);
    const missingAuthorIds = Array.from(
      new Set(
        [...idsFromPosts, ...idsFromComments].filter((id) => !authorNames[id])
      )
    );

    if (missingAuthorIds.length === 0) return;

    const fetchAuthorsById = async () => {
      const entries = await Promise.all(
        missingAuthorIds.map(async (id) => {
          try {
            const fetchedUser = await adminService.getUserByAdmin(id);
            return [id, fetchedUser.username] as const;
          } catch {
            return [id, id] as const; // fallback keeps the ID if the fetch fails
          }
        })
      );

      setAuthorNames((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    };

    fetchAuthorsById();
  }, [posts, comments, authorNames]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (category) {
      listPostsByCategoryName(category, 1, trimmedQuery);
    } else {
      listPosts(1, trimmedQuery);
    }
  };

  const goToPage = (nextPage: number) => {
    const currentQuery = query.trim() || search;

    if (category) {
      listPostsByCategoryName(category, nextPage, currentQuery);
    } else {
      listPosts(nextPage, currentQuery);
    }
  };

  const openComments = async (postId: number) => {
    setSelectedPostId(postId);
    setCommentContent("");
    await listCommentsByPost(postId, 1);
  };

  const closeComments = () => {
    setSelectedPostId(null);
    setCommentContent("");
  };

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPostId || !commentContent.trim()) return;

    await createComment({
      postId: selectedPostId,
      content: commentContent.trim(),
    });

    setCommentContent("");
    await listCommentsByPost(selectedPostId, 1);
  };

  const goToCommentsPage = (nextPage: number) => {
    if (!selectedPostId) return;
    listCommentsByPost(selectedPostId, nextPage);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!selectedPostId) return;

    const targetPage =
      comments.length === 1 && commentsPage > 1
        ? commentsPage - 1
        : commentsPage;

    await deleteComment(selectedPostId, commentId);
    await listCommentsByPost(selectedPostId, targetPage);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
              Feed
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
            <p className="text-sm text-gray-600">
              Paginated list from the API; filter by category and text search.
            </p>
          </div>
          <form
            onSubmit={handleSearch}
            className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
          >
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm sm:w-48"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or content"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm sm:w-64"
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Filter
            </button>
          </form>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading && <p className="text-sm text-gray-500">Loading posts...</p>}

          {!loading && posts.length === 0 && (
            <p className="text-sm text-gray-500">No posts found.</p>
          )}

          {!loading &&
            posts.map((post) => (
              <article
                key={post.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                      ID {post.id}
                    </p>
                    <h2
                      className={`text-lg font-semibold text-gray-900 ${
                        user?.isAdmin
                          ? "cursor-pointer hover:text-blue-700"
                          : ""
                      }`}
                      onClick={() =>
                        user?.isAdmin
                          ? window.location.assign(
                              `/admin/posts/${post.id}/edit`
                            )
                          : undefined
                      }
                    >
                      {post.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {categories.find((c) => c.id === post.categoryId)?.name ??
                      "No category"}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-700">{post.content}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  <span>
                    Author: {authorNames[post.authorId] ?? post.authorId}
                  </span>
                  <span>·</span>
                  <span>
                    Created on {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  {selectedPostId === post.id ? (
                    <button
                      type="button"
                      onClick={closeComments}
                      className="rounded-md bg-gray-200 px-3 py-1 font-semibold text-gray-800 hover:bg-gray-300"
                    >
                      Hide comments
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openComments(post.id)}
                      className="rounded-md bg-blue-50 px-3 py-1 font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Show comments
                    </button>
                  )}
                </div>

                {selectedPostId === post.id && (
                  <div className="mt-4 space-y-3 rounded-lg border border-gray-100 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">
                        Comments
                      </p>
                      {commentsError && (
                        <span className="text-xs font-semibold text-red-600">
                          {commentsError}
                        </span>
                      )}
                    </div>

                    <form onSubmit={submitComment} className="space-y-2">
                      <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Write a comment"
                        rows={3}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
                        disabled={commentsLoading}
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={commentsLoading || !commentContent.trim()}
                          className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800 disabled:opacity-60"
                        >
                          {commentsLoading ? "Sending..." : "Comment"}
                        </button>
                      </div>
                    </form>

                    {commentsLoading && (
                      <p className="text-xs text-gray-500">
                        Loading comments...
                      </p>
                    )}

                    {!commentsLoading && comments.length === 0 && (
                      <p className="text-xs text-gray-500">No comments yet.</p>
                    )}

                    <div className="space-y-2">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-md border border-gray-100 bg-gray-50 p-3"
                        >
                          <p className="text-sm text-gray-800">
                            {comment.content}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                            <div className="flex flex-wrap items-center gap-2">
                              <span>
                                Author:{" "}
                                {authorNames[comment.authorId] ??
                                  comment.authorId}
                              </span>
                              <span>·</span>
                              <span>
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {user?.id === comment.authorId && (
                              <button
                                type="button"
                                disabled={commentsLoading}
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {comments.length > 0 && (
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-700">
                        <span>
                          Page {commentsPage} of {commentsTotalPages || 1}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={commentsPage <= 1 || commentsLoading}
                            onClick={() => goToCommentsPage(commentsPage - 1)}
                            className="rounded-md bg-gray-200 px-3 py-1 font-semibold text-gray-800 disabled:opacity-60"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            disabled={
                              commentsPage >= commentsTotalPages ||
                              commentsLoading
                            }
                            onClick={() => goToCommentsPage(commentsPage + 1)}
                            className="rounded-md bg-gray-800 px-3 py-1 font-semibold text-white disabled:opacity-60"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => goToPage(page - 1)}
              className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 disabled:opacity-60"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => goToPage(page + 1)}
              className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
