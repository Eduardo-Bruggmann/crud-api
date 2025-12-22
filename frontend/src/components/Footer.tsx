export default function Footer() {
  return (
    <footer className="flex justify-center items-center w-full h-9 p-3 bg-blue-600 text-white shadow-md">
      <p className="text-sm">
        © {new Date().getFullYear()} CRUD API. All rights reserved.
      </p>
    </footer>
  );
}
