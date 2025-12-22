"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePost } from "@/hooks/usePost";
import { useCategory } from "@/hooks/useCategory";

export default function NewPost() {
  const router = useRouter();
  const { createPost, loading, error } = usePost();
  const { categories, listCategories } = useCategory();

  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    listCategories(1);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const payload = {
      title: form.title,
      content: form.content,
      ...(form.categoryId ? { categoryId: Number(form.categoryId) } : {}),
    };

    try {
      await createPost(payload);
      setFeedback("Post created.");
      router.push("/feed/posts");
    } catch (err: any) {
      setFeedback(err.message || "Failed to create post");
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
            <h1 className="text-2xl font-bold text-gray-900">New post</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push("/feed/posts")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View posts
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
            Title
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
            Content
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              rows={6}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
            Category (optional)
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {feedback && <p className="text-sm text-blue-700">{feedback}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Create post"}
          </button>
        </form>
      </div>
    </div>
  );
}
