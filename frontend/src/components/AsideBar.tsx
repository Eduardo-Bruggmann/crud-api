"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const links = {
  geral: [
    { href: "/", label: "Home" },
    { href: "/feed/users", label: "Users" },
    { href: "/feed/posts", label: "Posts" },
    { href: "/feed/categories", label: "Categories" },
  ],
  conta: [
    { href: "/me", label: "My profile" },
    { href: "/me/settings", label: "Settings" },
  ],
  admin: [
    { href: "/admin/users", label: "Users" },
    { href: "/admin/posts/new", label: "New post" },
    { href: "/admin/categories/new", label: "New category" },
  ],
};

export default function AsideBar() {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.isAdmin);

  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-56 flex-col gap-6 rounded-lg bg-white p-4 text-[#1a1a1a] shadow-sm sm:flex">
      <NavGroup title="Feed" items={links.geral} />
      <NavGroup title="Account" items={links.conta} />
      {isAdmin ? <NavGroup title="Admin" items={links.admin} /> : null}
    </aside>
  );
}

function NavGroup({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
        {title}
      </p>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
