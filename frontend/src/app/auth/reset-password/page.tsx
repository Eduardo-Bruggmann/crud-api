"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const { confirmResetPassword, loading, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("reset_email");

    if (!storedEmail) {
      router.push("/auth/forgot-password");
      return;
    }

    setEmail(storedEmail);
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await confirmResetPassword({
      email,
      code,
      newPassword,
      confirmPassword,
    });

    localStorage.removeItem("reset_email");
    router.push("/auth/login");
  }

  return (
    <div className="mx-auto max-w-md">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
            Recovery
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
          <p className="text-sm text-gray-600">
            Provide the verification code and set a new password following
            backend rules.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
          Verification code
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
          Confirm new password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Reset password"}
        </button>
      </form>
    </div>
  );
}
