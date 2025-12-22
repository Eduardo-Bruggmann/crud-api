"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Register() {
  const { register, loading, error } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await register(formData);

    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

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
            Registration
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-sm text-gray-600">
            Fields follow backend validations (username, password, and email
            rules).
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
          Username
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
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

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-800">
          Confirm password
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
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
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-gray-700">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
