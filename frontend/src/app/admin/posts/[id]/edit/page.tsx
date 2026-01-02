"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { usePost } from "@/hooks/usePost";
import { useCategory } from "@/hooks/useCategory";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(Array.isArray(params?.id) ? params.id[0] : params?.id);

  const { getPost, updatePost, loading, error } = usePost();
  const { categories, listCategories } = useCategory();

  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const load = async () => {
      setInitializing(true);
      try {
        await listCategories(1);
        const post = await getPost(postId);
        setForm({
          title: post.title,
          content: post.content,
          categoryId: post.categoryId ? String(post.categoryId) : "",
        });
      } catch (err: any) {
        setFeedback(err.message || "Failed to load post");
      } finally {
        setInitializing(false);
      }
    };

    load();
  }, [postId, getPost, listCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;

    setFeedback(null);

    const payload = {
      title: form.title,
      content: form.content,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    };

    try {
      await updatePost(postId, payload);
      setFeedback("Post updated.");
      router.push("/feed/posts");
    } catch (err: any) {
      setFeedback(err.message || "Failed to update post");
    }
  };

  if (!postId) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm text-red-600">Invalid post id.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
              Admin
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Edit post</h1>
          </div>
          <div className="flex gap-3 text-sm font-semibold text-blue-600">
            <Link href="/admin/posts/new" className="hover:text-blue-700">
              New post
            </Link>
            <button
              type="button"
              onClick={() => router.push("/feed/posts")}
              className="hover:text-blue-700"
            >
              View posts
            </button>
          </div>
        </div>

        {initializing ? (
          <p className="mt-4 text-sm text-gray-500">Loading post...</p>
        ) : (
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
                rows={8}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
              Category (optional)
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
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
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
