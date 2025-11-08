"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<string | null>(null);
  
  // Hide navigation on login and signup pages
  const hideNav = pathname === "/" || pathname === "/login" || pathname === "/signup";
  
  useEffect(() => {
    // Check for user in URL params
    const userName = searchParams.get("user");
    if (userName) {
      setUser(userName);
    } else {
      // Check if user is in session (you might want to add an API call here)
      // For now, we'll check localStorage or keep it simple
      setUser(null);
    }
  }, [searchParams]);
  
  if (hideNav) {
    return null;
  }

  return (
    <nav className="bg-red-600 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <h1 className="font-bold text-lg tracking-wide">🚗 Car App</h1>
        <div className="flex items-center space-x-6">
          <Link href="/filter" className="hover:underline hover:text-gray-200">
            Filter
          </Link>
          <Link href="/calculator" className="hover:underline hover:text-gray-200">
            Calculator
          </Link>
          {user && (
            <span className="text-sm text-gray-200">Welcome, {user}!</span>
          )}
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

