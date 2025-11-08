"use client";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-500 via-white-500 to-black-100 text-gray-800">
      <div className="bg-white rounded-xl shadow-xl border border-blue-400 p-10 w-96 text-center">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.png" alt="Toyota Logo" width={200} height={200} />

          <p className="text-gray-600 text-sm mt-1">
            Look for your new dream car <br />
            with ease all on one platform
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

        <form className="flex flex-col gap-3 text-left">
          <div>
            <label className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="Enter password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="Enter password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Sign Up
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-full py-2 hover:bg-gray-100 transition">
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Icon"
              width={20}
              height={20}
            />
            <span className="font-medium text-gray-700">
              Continue with Google
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
