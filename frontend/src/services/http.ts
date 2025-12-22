const API_URL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export async function http<T>(
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}/api${url}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status === 401 && retry) {
    if (!isRefreshing) {
      isRefreshing = true;

      refreshPromise = refreshSession().finally(() => {
        isRefreshing = false;
      });
    }

    const refreshed = await refreshPromise;

    if (!refreshed) throw new Error("Session expired");
    return http<T>(url, options, false);
  }

  const isJson =
    res.headers
      .get("content-type")
      ?.toLowerCase()
      .includes("application/json") ?? false;

  if (!res.ok) {
    const err = isJson ? await res.json().catch(() => null) : null;
    throw new Error(err?.message ?? "Request failed");
  }

  if (res.status === 204) return undefined as T;

  return (isJson ? res.json() : res.text()) as T;
}

async function refreshSession(): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (res.status === 204 || !res.ok) return false;

  return true;
}
