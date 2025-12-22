import { PaginatedResponse } from "@/types/pagination";
import { http } from "./http";
import { User } from "@/types/user";
import { CreateUserByAdminDTO, UpdateUserByAdminDTO } from "@/types/admin";

export function createUserByAdmin(data: CreateUserByAdminDTO): Promise<User> {
  return http<User>("/admin/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getUserByAdmin(userId: string): Promise<User> {
  return http<User>(`/admin/users/${userId}`);
}

export function listUsersByAdmin(
  page = 1,
  limit = 20,
  search = ""
): Promise<PaginatedResponse<User, "users">> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  return http<PaginatedResponse<User, "users">>(`/admin/users?${params}`);
}

export function updateUserByAdmin(
  userId: string,
  data: UpdateUserByAdminDTO | FormData
): Promise<User> {
  const isForm = typeof FormData !== "undefined" && data instanceof FormData;

  return http<User>(`/admin/users/${userId}`, {
    method: "PATCH",
    body: isForm ? data : JSON.stringify(data),
  });
}

export function deleteUserByAdmin(userId: string) {
  return http(`/admin/users/${userId}`, {
    method: "DELETE",
  });
}
