"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);

    const loginData = isEmailValid
      ? { email: formData.identifier, password: formData.password }
      : { username: formData.identifier, password: formData.password };

    await login(loginData);

    setFormData({
      identifier: "",
      password: "",
    });

    router.push("/me");
  }

  return (
    <div className="mx-auto max-w-md">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
            Authentication
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="text-sm text-gray-600">
            Use your registered username or email.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
          Username or email
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
            className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex flex-col gap-1 text-sm text-blue-600">
          <a href="/auth/forgot-password" className="hover:underline">
            Forgot your password?
          </a>
          <a href="/auth/register" className="hover:underline">
            Create an account
          </a>
        </div>
      </form>
    </div>
  );
}
