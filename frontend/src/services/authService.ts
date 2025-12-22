import { http } from "./http";
import { User } from "@/types/user";
import { RegisterDTO, LoginDTO, ResetPasswordDTO } from "@/types/auth";

export function register(data: RegisterDTO): Promise<User> {
  return http<User>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false
  );
}

export function login(data: LoginDTO): Promise<{ user: User }> {
  return http<{ user: User }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false
  );
}

export function logout() {
  return http(
    "/auth/logout",
    {
      method: "POST",
    },
    false
  );
}

export function refreshTokens(): Promise<{ user: User } | undefined> {
  return http<{ user: User }>(
    "/auth/refresh",
    {
      method: "POST",
    },
    false
  );
}

export function requestResetPassword(email: string) {
  return http(
    "/auth/reset-password/request",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
    false
  );
}

export function confirmResetPassword(data: ResetPasswordDTO) {
  return http(
    "/auth/reset-password/confirm",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false
  );
}
