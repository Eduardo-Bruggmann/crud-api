"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategory } from "@/hooks/useCategory";

export default function EditCategory() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(Array.isArray(params?.id) ? params?.id[0] : params?.id);

  const { getCategory, updateCategory, deleteCategory, loading, error } =
    useCategory();

  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getCategory(id).then((cat) => {
      if (cat) setName(cat.name);
    });
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setFeedback(null);
    try {
      await updateCategory({ id, name });
      setFeedback("Category updated.");
    } catch (err: any) {
      setFeedback(err.message || "Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirmed = confirm("Delete this category?");
    if (!confirmed) return;
    await deleteCategory(id);
    router.push("/feed/categories");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
              Admin
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Edit category</h1>
            <p className="text-sm text-gray-600">ID {id}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/feed/categories")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
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

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
