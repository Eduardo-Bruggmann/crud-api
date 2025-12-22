"use client";

import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Me() {
  const { user, loading, getUser, deleteUser } = useUser();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    getUser().catch(() => {
      router.replace("/auth/login");
    });
  }, [getUser, router]);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm text-gray-500">No data available.</p>
      </div>
    );
  }

  const avatarUrl =
    user.avatar && apiUrl ? `${apiUrl}${user.avatar}` : "/default-pfp.png";

  async function deleteProfile() {
    const confirmDeletion = confirm(
      "Do you want to permanently remove your profile?"
    );
    if (!confirmDeletion) return;

    await deleteUser();
    alert("Profile deleted successfully.");

    router.replace("/auth/login");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-blue-600">
              My profile
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.username}
            </h1>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              <img
                src={avatarUrl}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/me/settings"
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700"
            >
              Edit details
            </Link>
            <button
              type="button"
              onClick={deleteProfile}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow hover:bg-red-700"
            >
              Delete profile
            </button>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <ProfileItem label="ID" value={user.id} />
          <ProfileItem
            label="Privacy"
            value={user.isPrivate ? "Private" : "Public"}
          />
          <ProfileItem label="Admin" value={user.isAdmin ? "Yes" : "No"} />
          <ProfileItem label="Avatar" value={user.avatar ?? "None"} />
        </dl>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-gray-800">{value}</p>
    </div>
  );
}
