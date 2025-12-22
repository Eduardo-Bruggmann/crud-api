export default function Home() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-blue-600">
          CRUD API
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Welcome to the dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          This frontend consumes the backend API directly and exposes
          authentication plus user, category, post, and comment management.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <HomeCard
          title="Public feed"
          href="/feed/users"
          description="Browse public users and navigate paginated data."
        />
        <HomeCard
          title="My profile"
          href="/me"
          description="See your profile, update your data, and manage privacy."
        />
        <HomeCard
          title="Admin"
          href="/admin/users"
          description="Full CRUD for users, posts, and categories (protected routes)."
        />
        <HomeCard
          title="Posts"
          href="/feed/posts"
          description="List posts, filter by category, and browse comments."
        />
        <HomeCard
          title="Categories"
          href="/feed/categories"
          description="See available categories and paginated lists."
        />
        <HomeCard
          title="Authentication"
          href="/auth/login"
          description="Sign in, register, recover, and reset passwords."
        />
      </div>
    </div>
  );
}

function HomeCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:ring-blue-200"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
        Open <span aria-hidden>→</span>
      </span>
    </a>
  );
}
