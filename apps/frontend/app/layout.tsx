import Link from "next/link";
import "./styles.css";

import { setEnvironment } from "./environment";
setEnvironment();

export const metadata = {
  title: "Coding Ninjas Blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="sticky top-0 bg-neutral-50 bg-opacity-30 border-b-neutral-200 border-b backdrop-blur-md">
          <div className="max-w-6xl px-2 lg:mx-auto flex justify-between items-center py-3">
            <Link
              className="font-semibold text-2xl sm:text-3xl transition-all tracking-tight"
              href="/"
            >
              Coding Ninjas Blog.
            </Link>
            <Link
              className="bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-1 rounded-full font-medium text-white"
              href="/blogs/create"
            >
              Post a blog
            </Link>
          </div>
        </nav>
        <main className="max-w-6xl mt-4 mx-auto">{children}</main>
      </body>
    </html>
  );
}
