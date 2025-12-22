"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const router = useRouter();
  const { logout, user, isAuthenticated, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/auth/login");
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 w-full bg-blue-600 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="rounded bg-white/10 px-2 py-1 text-xs uppercase tracking-[0.08em]">
              CRUD API
            </span>
            <span className="text-lg">Dashboard</span>
          </Link>
          <span className="hidden text-sm text-blue-100 sm:inline">
            Manage users, posts, categories and comments
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/feed/users"
            className="rounded border border-white/20 px-3 py-1 hover:bg-white/10"
          >
            Feed
          </Link>
          <Link
            href="/me"
            className="rounded border border-white/20 px-3 py-1 hover:bg-white/10"
          >
            My account
          </Link>
          {!isAuthenticated && (
            <Link
              href="/auth/login"
              className="rounded bg-white px-3 py-1 font-semibold text-blue-700 hover:bg-blue-50"
            >
              Login
            </Link>
          )}
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut || loading}
              className="rounded bg-blue-900 px-3 py-1 font-semibold text-white shadow disabled:opacity-60"
            >
              {isLoggingOut
                ? "Signing out..."
                : `Logout${user ? ` (${user.username})` : ""}`}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
