import { PaginatedResponse } from "@/types/pagination";
import { User, UpdateUserDTO } from "@/types/user";
import { http } from "./http";

export function getUser(): Promise<User> {
  return http<User>("/users/profile");
}

export function listPublicUsers(
  page = 1,
  limit = 20,
  search = ""
): Promise<PaginatedResponse<User, "users">> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  return http<PaginatedResponse<User, "users">>(`/users/public?${params}`);
}

export function updateUser(data: UpdateUserDTO | FormData): Promise<User> {
  const isForm = typeof FormData !== "undefined" && data instanceof FormData;

  return http<User>("/users/profile", {
    method: "PATCH",
    body: isForm ? data : JSON.stringify(data),
  });
}

export function deleteUser() {
  return http("/users/profile", {
    method: "DELETE",
  });
}
