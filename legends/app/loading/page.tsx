"use client";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen w-screen bg-white">
      <img src="/logo.png" className="h-50 w-50 animate-spin" />
    </div>
  );
}
