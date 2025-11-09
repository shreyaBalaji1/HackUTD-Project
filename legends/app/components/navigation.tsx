"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<string | null>(null);

  const hideNav =
    pathname === "/" || pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const userName = searchParams.get("user");
    setUser(userName ?? null);
  }, [searchParams]);

  if (hideNav) return null;

  const linkClass = (path: string) =>
    `px-1 text-sm font-medium tracking-wide transition ${
      pathname === path
        ? "text-yellow-200 font-semibold"
        : "text-gray-100 hover:text-white"
    }`;

  return (
    <nav
      className={`${inter.className} bg-red-600 text-white py-4 shadow-md sticky top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto flex items-center px-8">
        {/* LEFT — LOGO */}
        <Image
          src="/clogo.png"
          alt="Toyota Logo"
          width={130}
          height={130}
          className="opacity-95"
        />

        {/* RIGHT — SPREAD OUT NAV ITEMS */}
        <div className="flex items-center space-x-8 ml-auto">
          <Link href="/ai-search" className={linkClass("/ai-search")}>
            <span className="flex items-center gap-1">
              ✨ AI Search
            </span>
          </Link>

          <Link href="/filter" className={linkClass("/filter")}>
            Filter
          </Link>

          <Link href="/calculator" className={linkClass("/calculator")}>
            Calculator
          </Link>

          <Link href="/favorites" className={linkClass("/favorites")}>
            Favorites
          </Link>

          <Link href="/compare" className={linkClass("/compare")}>
            Compare
          </Link>

          {user && (
            <span className="text-sm text-gray-200 hidden sm:inline font-light">
              Welcome, {user}
            </span>
          )}

          <button
            onClick={() =>
              (window.location.href = "http://localhost:5001/logout")
            }
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg 
                       hover:bg-white/20 transition text-sm font-medium tracking-wide"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
