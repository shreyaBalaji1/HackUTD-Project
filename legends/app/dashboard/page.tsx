"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userName = params.get("user");
    setUser(userName);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Welcome, {user}!</h1>
          <button
            onClick={() => (window.location.href = "http://localhost:5001/logout")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <h1 className="text-3xl font-bold">Loading...</h1>
      )}
    </div>
  );
}
