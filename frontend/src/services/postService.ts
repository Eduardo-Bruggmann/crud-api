import { PaginatedResponse } from "@/types/pagination";
import { Post, CreatePostDTO, UpdatePostDTO } from "@/types/post";
import { http } from "./http";

export function createPost(data: CreatePostDTO): Promise<Post> {
  return http<Post>("/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getPost(id: number): Promise<Post> {
  return http<Post>(`/posts/${id}`);
}

export function listPosts(
  page = 1,
  limit = 20,
  search = ""
): Promise<PaginatedResponse<Post, "posts">> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  return http<PaginatedResponse<Post, "posts">>(`/posts?${params}`);
}

export function listPostsByCategoryName(
  categoryName: string,
  page = 1,
  limit = 20,
  search = ""
): Promise<PaginatedResponse<Post, "posts">> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  return http<PaginatedResponse<Post, "posts">>(
    `/posts/category/${encodeURIComponent(categoryName)}?${params}`
  );
}

export function updatePost(id: number, data: UpdatePostDTO): Promise<Post> {
  return http<Post>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deletePost(id: number) {
  return http(`/posts/${id}`, {
    method: "DELETE",
  });
}
