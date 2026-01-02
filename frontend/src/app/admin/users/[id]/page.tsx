"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  deleteUserByAdmin,
  getUserByAdmin,
  updateUserByAdmin,
} from "@/services/adminService";
import { User } from "@/types/user";

export default function AdminUserDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    username: "",
    isAdmin: false,
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const loadUser = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserByAdmin(userId);
      setUser(data);
      setForm({
        username: data.username,
        isAdmin: data.isAdmin,
        avatar: data.avatar ?? "",
      });
      setAvatarFile(null);
    } catch (err: any) {
      setError(err.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      await updateUserByAdmin(userId, {
        username: form.username,
        isAdmin: form.isAdmin,
      });

      if (avatarFile) {
        const payload = new FormData();
        payload.append("avatar", avatarFile);
        await updateUserByAdmin(userId, payload);
      }
      await loadUser();
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    const confirmed = confirm("Confirm deletion for this user?");
    if (!confirmed) return;
    await deleteUserByAdmin(userId);
    router.push("/admin/users");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
              Admin
            </p>
            <h1 className="text-2xl font-bold text-gray-900">User</h1>
            {user && <p className="text-sm text-gray-600">ID {user.id}</p>}
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to list
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {loading && (
          <p className="mt-4 text-sm text-gray-500">Loading user...</p>
        )}

        {!loading && user && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 rounded-lg border border-gray-100 p-4">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                <img
                  src={
                    user.avatar && apiUrl
                      ? `${apiUrl}${user.avatar}`
                      : "/default-pfp.jpeg"
                  }
                  alt={`Avatar de ${user.username}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2 text-sm text-gray-700">
                <p>Update avatar (image up to 2MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  className="text-sm"
                />
                {avatarFile && (
                  <p className="text-xs text-blue-700">File ready to upload</p>
                )}
              </div>
            </div>

            <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
              Username
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
              />
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <input
                type="checkbox"
                checked={form.isAdmin}
                onChange={(e) =>
                  setForm({ ...form, isAdmin: e.target.checked })
                }
                className="h-4 w-4"
              />
              Admin
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
              >
                Delete user
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
