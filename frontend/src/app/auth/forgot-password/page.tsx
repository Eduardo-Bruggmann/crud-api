"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const { requestResetPassword, loading, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await requestResetPassword(email);

    localStorage.setItem("reset_email", email);
    router.push("/auth/reset-password");
  }

  return (
    <div className="mx-auto max-w-md">
      <form
        className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
            Recovery
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            Forgot your password?
          </h1>
          <p className="text-sm text-gray-600">
            Enter your registered email. The API will send a verification code.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? "Sending..." : "Send code"}
        </button>
      </form>
    </div>
  );
}
