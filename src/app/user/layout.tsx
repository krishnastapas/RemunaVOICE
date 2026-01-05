"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FaHandsHelping } from "react-icons/fa";
import { GiMeditation } from "react-icons/gi";
import { useAuth } from "@/context/AuthContext";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);

  // 🔒 Protect routes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/");
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);
      router.push("/");
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-yellow-800 font-semibold">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">

      {/* 🌟 FIXED HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-yellow-700 text-white py-[14px] px-6 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-lg font-semibold">🪔 Hare Krishna!</h1>
          <p className="text-sm opacity-90">
            Welcome,&nbsp;
            <span className="font-bold capitalize">
              {userData?.firstName ||
                user?.displayName?.split(" ")[0] ||
                "Devotee"}{" "}
              Pr
            </span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
            logoutLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-600 hover:bg-yellow-800"
          }`}
        >
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </header>

      {/* 🌼 MAIN CONTENT */}
      <main className="flex-grow pt-[95px] pb-[80px] px-4">
        {children}
      </main>

      {/* 🌟 FIXED FOOTER — ONLY Seva | Sadhana */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-yellow-800 text-white flex justify-around items-center py-2 shadow-lg rounded-t-2xl">

        {/* Seva */}
        <button
          onClick={() => router.push("/user/seva-board")}
          className={`flex flex-col items-center ${
            pathname === "/user/seva-board"
              ? "text-yellow-300"
              : "text-white"
          }`}
        >
          <FaHandsHelping className="text-xl" />
          <span className="text-xs">Seva</span>
        </button>

        {/* Sadhana */}
        <button
          onClick={() => router.push("/user/sadhana")}
          className={`flex flex-col items-center ${
            pathname === "/user/sadhana"
              ? "text-yellow-300"
              : "text-white"
          }`}
        >
          <GiMeditation className="text-xl" />
          <span className="text-xs">Sadhana</span>
        </button>
      </nav>
    </div>
  );
}
