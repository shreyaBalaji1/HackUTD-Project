"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<string | null>(null);

  // Hide navigation on login/signup
  const hideNav =
    pathname === "/" || pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const userName = searchParams.get("user");
    if (userName) {
      setUser(userName);
    } else {
      setUser(null);
    }
  }, [searchParams]);

  if (hideNav) return null;

  // Active link style helper
  const linkClass = (path: string) =>
    `hover:underline transition ${
      pathname === path ? "font-semibold text-yellow-200" : "hover:text-gray-200"
    }`;

  return (
    <nav className="bg-red-600 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        {/* App Name */}
        <h1 className="font-bold text-lg tracking-wide">🚗 Car App</h1>

        {/* Nav Links */}
        <div className="flex items-center space-x-6">
          <Link href="/filter" className={linkClass("/filter")}>
            Filter
          </Link>
          <Link href="/calculator" className={linkClass("/calculator")}>
            Calculator
          </Link>
          <Link href="/favorites" className={linkClass("/favorites")}>
            Favorites ❤️
          </Link>
          <Link href="/compare" className={linkClass("/compare")}>
            Compare 🚘
          </Link>


          {/* Optional welcome text */}
          {user && (
            <span className="text-sm text-gray-200 hidden sm:inline">
              Welcome, {user}!
            </span>
          )}

          {/* Logout */}
          <button
            onClick={() => (window.location.href = "http://localhost:5001/logout")}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

