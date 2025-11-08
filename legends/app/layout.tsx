import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Car App",
  description: "Find your car, calculate payments, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen`}
      >
        {/* 🔴 Navigation Bar */}
        <nav className="bg-red-600 text-white py-4 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
            <h1 className="font-bold text-lg tracking-wide">🚗 Car App</h1>
            <div className="flex space-x-6">
              <Link href="/" className="hover:underline hover:text-gray-200">
                Filter
              </Link>
              <Link href="/calculator" className="hover:underline hover:text-gray-200">
                Calculator
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="min-h-screen bg-white text-black p-6">{children}</main>
      </body>
    </html>
  );
}

