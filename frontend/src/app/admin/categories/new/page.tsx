"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCategory } from "@/hooks/useCategory";

export default function NewCategory() {
  const { categories, loading, error, listCategories, createCategory } =
    useCategory();
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    listCategories(1);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    try {
      await createCategory(name);
      setName("");
      setFeedback("Category created.");
      listCategories(1);
    } catch (err: any) {
      setFeedback(err.message || "Failed to create category");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
              Admin
            </p>
            <h1 className="text-2xl font-bold text-gray-900">New category</h1>
          </div>
          <Link
            href="/feed/categories"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View categories
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
            />
          </label>

          {feedback && <p className="text-sm text-blue-700">{feedback}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Create category"}
          </button>
        </form>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Existing categories
          </h2>
          <p className="text-sm text-gray-600">Click to edit</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && categories.length === 0 && (
            <p className="text-sm text-gray-500">No categories.</p>
          )}

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/admin/categories/${category.id}/edit`}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-gray-800 shadow-sm hover:border-blue-200 hover:text-blue-700"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
