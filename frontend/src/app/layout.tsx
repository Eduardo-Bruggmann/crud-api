import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Header from "@/components/Header";
import AsideBar from "@/components/AsideBar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRUD API",
  description: "A simple CRUD API built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} antialiased bg-[#f7f7f8] text-gray-900`}
      >
        <AuthProvider>
          <Header />

          <div className="min-h-screen bg-[#f7f7f8]">
            <main className="mx-auto flex max-w-6xl gap-6 px-4 py-10 sm:px-8">
              <AsideBar />

              <section className="flex-1 space-y-8">{children}</section>
            </main>
          </div>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
