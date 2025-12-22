"use client";

import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";

export default function Home() {
  const {
    publicUsers,
    page,
    limit,
    total,
    totalPages,
    loading,
    error,
    search,
    listPublicUsers,
  } = useUser();
  const [query, setQuery] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    listPublicUsers(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    listPublicUsers(1, query.trim());
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
              Feed
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Public users</h1>
            <p className="text-sm text-gray-600">
              Paginated results from the API.
            </p>
          </div>
          <form
            onSubmit={handleSearch}
            className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm sm:w-72"
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading && <p className="text-sm text-gray-500">Loading users...</p>}

          {!loading && publicUsers.length === 0 && (
            <p className="text-sm text-gray-500">No users found.</p>
          )}

          {publicUsers.map((u) => (
            <article
              key={u.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-200 bg-white">
                    <img
                      src={
                        u.avatar && apiUrl
                          ? `${apiUrl}${u.avatar}`
                          : "/default-pfp.png"
                      }
                      alt={`Avatar de ${u.username}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                      {u.id}
                    </p>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {u.username}
                    </h2>
                    <p className="text-sm text-gray-600">{u.email}</p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {u.isPrivate ? "Private" : "Public"}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages || 1} · {total} user(s)
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => listPublicUsers(page - 1, search)}
              className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 disabled:opacity-60"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => listPublicUsers(page + 1, search)}
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
