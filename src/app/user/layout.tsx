"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FaHome, FaUser, FaHandsHelping } from "react-icons/fa";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // 🔒 Protect route - only logged-in users can access
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/"); // redirect to login if not logged in
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-yellow-50">
      {/* Main content area */}
      <div className="flex-grow p-4 pb-16">{children}</div>

      {/* 🌼 Mobile bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-yellow-800 text-white flex justify-around items-center py-2 shadow-lg rounded-t-2xl">
        <button
          onClick={() => router.push("/user/dashboard")}
          className={`flex flex-col items-center ${
            pathname === "/user/dashboard" ? "text-yellow-300" : "text-white"
          }`}
        >
          <FaHome className="text-xl" />
          <span className="text-xs">Dashboard</span>
        </button>

        <button
          onClick={() => router.push("/user/seva-board")}
          className={`flex flex-col items-center ${
            pathname === "/user/seva-board" ? "text-yellow-300" : "text-white"
          }`}
        >
          <FaHandsHelping className="text-xl" />
          <span className="text-xs">Seva</span>
        </button>

        <button
          onClick={() => router.push("/user/profile")}
          className={`flex flex-col items-center ${
            pathname === "/user/profile" ? "text-yellow-300" : "text-white"
          }`}
        >
          <FaUser className="text-xl" />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
}
