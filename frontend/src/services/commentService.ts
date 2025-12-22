import { PaginatedResponse } from "@/types/pagination";
import { Comment, CreateCommentDTO } from "@/types/comment";
import { http } from "./http";

export function createComment(data: CreateCommentDTO): Promise<Comment> {
  return http<Comment>(`/posts/${data.postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content: data.content }),
  });
}

export function listCommentsByPost(
  postId: number,
  page = 1,
  limit = 20,
  search = ""
): Promise<PaginatedResponse<Comment, "comments">> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  return http<PaginatedResponse<Comment, "comments">>(
    `/posts/${postId}/comments?${params}`
  );
}

export function deleteComment(postId: number, commentId: number) {
  return http(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });
}
