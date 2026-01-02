"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/user";
import Link from "next/link";

type EditableField = "username" | "email" | "isPrivate" | "password" | null;

export default function Settings() {
  const { getUser, updateUser } = useUser();
  const [user, setUser] = useState<User | null>(null);

  const [editing, setEditing] = useState<EditableField>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    isPrivate: false,
    password: "",
    currentPassword: "",
  });

  const [initialForm, setInitialForm] = useState({
    username: "",
    email: "",
    isPrivate: false,
  });

  const [isTogglingPrivacy, setIsTogglingPrivacy] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser();
      if (!fetchedUser) return;

      setUser(fetchedUser);
      setForm({
        username: fetchedUser.username,
        email: fetchedUser.email,
        isPrivate: fetchedUser.isPrivate,
        password: "",
        currentPassword: "",
      });
      setInitialForm({
        username: fetchedUser.username,
        email: fetchedUser.email,
        isPrivate: fetchedUser.isPrivate,
      });
      setAvatarFile(null);
    };

    fetchUser();
  }, [getUser]);

  if (!user)
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm text-gray-500">Loading data...</p>
      </div>
    );

  function startEditing(field: EditableField) {
    setEditing(field);
    setForm((prev) => ({ ...prev, password: "", currentPassword: "" }));
  }

  function cancelEditing() {
    setEditing(null);
    setForm((prev) => ({
      ...prev,
      ...initialForm,
      password: "",
      currentPassword: "",
    }));
  }

  const isFieldDirty = (field: EditableField) => {
    if (!field) return false;
    if (field === "password") return form.password.trim().length > 0;
    if (field === "username") return form.username !== initialForm.username;
    if (field === "email") return form.email !== initialForm.email;
    return false;
  };

  async function saveField(field: EditableField) {
    if (!field) return;

    const payload: any = {};

    if (field === "email" || field === "password") {
      if (!form.currentPassword) {
        alert("Current password is required to change email or password.");
        return;
      }
      payload.currentPassword = form.currentPassword;
    }

    if (field === "password") {
      payload.password = form.password;
    } else {
      payload[field] = form[field as keyof typeof form];
    }

    await updateUser(payload);

    setEditing(null);
    setForm((prev) => ({ ...prev, password: "", currentPassword: "" }));

    const updatedUser = await getUser();
    if (updatedUser) {
      setUser(updatedUser);
      setInitialForm({
        username: updatedUser.username,
        email: updatedUser.email,
        isPrivate: updatedUser.isPrivate,
      });
      setForm((prev) => ({
        ...prev,
        username: updatedUser.username,
        email: updatedUser.email,
        isPrivate: updatedUser.isPrivate,
        password: "",
        currentPassword: "",
      }));
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
              Settings
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-600">
              Update personal data and credentials.
            </p>
          </div>
          <Link
            href="/me"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to profile →
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-gray-100 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                  <img
                    src={
                      user.avatar && apiUrl
                        ? `${apiUrl}${user.avatar}`
                        : "/default-pfp.jpeg"
                    }
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Avatar</p>
                  <p className="text-xs text-gray-500">
                    Upload a new image (max 2MB).
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  className="text-sm"
                />
                <button
                  onClick={async () => {
                    if (!avatarFile) return;
                    const payload = new FormData();
                    payload.append("avatar", avatarFile);
                    await updateUser(payload);
                    const updatedUser = await getUser();
                    if (updatedUser) setUser(updatedUser);
                    setAvatarFile(null);
                  }}
                  disabled={!avatarFile}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
                >
                  {avatarFile ? "Save avatar" : "Choose file"}
                </button>
              </div>
            </div>
          </div>

          <FieldRow
            label="Username"
            helper="Name displayed to other users."
            disabled={editing !== "username"}
            value={form.username}
            onChange={(v: any) => setForm({ ...form, username: v })}
            isEditing={editing === "username"}
            isDirty={isFieldDirty("username")}
            onEdit={() => startEditing("username")}
            onSave={() => saveField("username")}
            onCancel={cancelEditing}
          />

          <FieldRow
            label="Email"
            helper="Used for login and recovery."
            type="email"
            disabled={editing !== "email"}
            value={form.email}
            onChange={(v: any) => setForm({ ...form, email: v })}
            isEditing={editing === "email"}
            isDirty={isFieldDirty("email")}
            onEdit={() => startEditing("email")}
            onSave={() => saveField("email")}
            onCancel={cancelEditing}
          >
            {editing === "email" && (
              <PasswordConfirm
                value={form.currentPassword}
                onChange={(v: any) => setForm({ ...form, currentPassword: v })}
              />
            )}
          </FieldRow>

          <ToggleRow
            label="Private profile"
            helper="When enabled, your data stops appearing publicly."
            checked={form.isPrivate}
            loading={isTogglingPrivacy}
            onToggle={async (next: boolean) => {
              setIsTogglingPrivacy(true);
              try {
                await updateUser({ isPrivate: next });
                setForm((prev) => ({ ...prev, isPrivate: next }));
                setInitialForm((prev) => ({ ...prev, isPrivate: next }));
                setUser((prev) => (prev ? { ...prev, isPrivate: next } : prev));
              } finally {
                setIsTogglingPrivacy(false);
              }
            }}
          />

          <FieldRow
            label="New password"
            helper="Minimum of 6 characters."
            type="password"
            disabled={editing !== "password"}
            value={form.password}
            onChange={(v: any) => setForm({ ...form, password: v })}
            isEditing={editing === "password"}
            isDirty={isFieldDirty("password")}
            onEdit={() => startEditing("password")}
            onSave={() => saveField("password")}
            onCancel={cancelEditing}
          >
            {editing === "password" && (
              <PasswordConfirm
                value={form.currentPassword}
                onChange={(v: any) => setForm({ ...form, currentPassword: v })}
              />
            )}
          </FieldRow>
        </div>
      </div>
    </div>
  );
}

function FieldRow({
  label,
  helper,
  type = "text",
  value,
  disabled,
  isEditing,
  isDirty,
  onChange,
  onEdit,
  onSave,
  onCancel,
  children,
}: any) {
  return (
    <div className="rounded-lg border border-gray-100 p-4">
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[1fr_auto] sm:items-end sm:gap-6">
        <div className="flex-1">
          <label className="text-sm font-semibold text-gray-800">{label}</label>
          {helper && <p className="text-xs text-gray-500">{helper}</p>}
          <input
            type={type}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-100"
          />
        </div>

        <div className="flex items-center gap-3 sm:self-end">
          {isEditing ? (
            <button
              onClick={isDirty ? onSave : onCancel}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
            >
              {isDirty ? "Save" : "Cancel"}
            </button>
          ) : (
            <button
              onClick={onEdit}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

function PasswordConfirm({ value, onChange }: any) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      Current password
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-200 px-3 py-2"
      />
    </label>
  );
}

function ToggleRow({ label, helper, checked, loading, onToggle }: any) {
  return (
    <div className="rounded-lg border border-gray-100 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          {helper && <p className="text-xs text-gray-500">{helper}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => onToggle(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition shadow-sm disabled:opacity-60 ${
              checked ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-pressed={checked}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                checked ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {checked ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
}
