import { PaginatedResponse } from "@/types/pagination";
import { Category } from "@/types/category";
import { http } from "./http";

export function createCategory(name: string): Promise<Category> {
  return http<Category>("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function getCategory(id: number): Promise<Category> {
  return http<Category>(`/categories/${id}`);
}

export function listCategories(
  page = 1,
  limit = 20,
  search = ""
): Promise<PaginatedResponse<Category, "categories">> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  return http<PaginatedResponse<Category, "categories">>(
    `/categories?${params}`
  );
}

export function updateCategory(data: Category): Promise<Category> {
  return http<Category>(`/categories/${data.id}`, {
    method: "PUT",
    body: JSON.stringify({ name: data.name }),
  });
}

export function deleteCategory(id: number) {
  return http(`/categories/${id}`, {
    method: "DELETE",
  });
}
