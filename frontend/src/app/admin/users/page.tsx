"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteUserByAdmin, listUsersByAdmin } from "@/services/adminService";
import { User } from "@/types/user";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async (requestedPage = 1, query = search) => {
    setLoading(true);
    setError(null);
    try {
      const { users, page, totalPages } = await listUsersByAdmin(
        requestedPage,
        10,
        query
      );
      setUsers(users);
      setPage(page);
      setTotalPages(totalPages);
      setSearch(query);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Confirm deletion for this user?");
    if (!confirmed) return;

    await deleteUserByAdmin(id);
    fetchUsers(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, search.trim());
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
              Admin
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-600">
              Protected admin-only operations.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <form
              onSubmit={handleSearch}
              className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
            >
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm sm:w-64"
              />
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Search
              </button>
            </form>
            <Link
              href="/admin/users/new"
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
            >
              New user
            </Link>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading && <p className="text-sm text-gray-500">Loading users...</p>}

          {!loading && users.length === 0 && (
            <p className="text-sm text-gray-500">No users found.</p>
          )}

          {users.map((user) => (
            <article
              key={user.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                    ID {user.id}
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user.username}
                  </h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {user.isAdmin ? "Admin" : "Regular"}
                </span>
              </div>

              <div className="mt-4 flex gap-2 text-sm">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                >
                  Details
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(user.id)}
                  className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => fetchUsers(page - 1, search)}
              className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 disabled:opacity-60"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => fetchUsers(page + 1, search)}
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
