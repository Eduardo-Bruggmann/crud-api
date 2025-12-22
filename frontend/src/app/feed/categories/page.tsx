"use client";

import { useEffect, useState } from "react";
import { useCategory } from "@/hooks/useCategory";

export default function CategoriesFeed() {
  const {
    categories,
    page,
    totalPages,
    loading,
    error,
    search,
    listCategories,
  } = useCategory();

  const [query, setQuery] = useState("");

  useEffect(() => {
    listCategories(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    listCategories(1, query.trim());
  };

  const goToPage = (nextPage: number) => {
    listCategories(nextPage, query || search);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
              Feed
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-600">
              Paginated list from the API.
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
              placeholder="Search category"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm sm:w-64"
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {loading && (
            <p className="text-sm text-gray-500">Loading categories...</p>
          )}

          {!loading && categories.length === 0 && (
            <p className="text-sm text-gray-500">No categories found.</p>
          )}

          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                ID {category.id}
              </p>
              <h2 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h2>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => goToPage(page - 1)}
              className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 disabled:opacity-60"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => goToPage(page + 1)}
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
