"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserByAdmin } from "@/services/adminService";

export default function NewAdminUser() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createUserByAdmin(form);
      router.push("/admin/users");
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold text-gray-900">New user</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to list
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
            Username
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
            Confirm password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
              className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={form.isAdmin}
              onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
              className="h-4 w-4"
            />
            Grant admin permission
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create user"}
          </button>
        </form>
      </div>
    </div>
  );
}
