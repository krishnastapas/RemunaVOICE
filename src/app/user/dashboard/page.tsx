"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";

export default function UserDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 flex flex-col">
      {/* Header */}
      <header className="bg-yellow-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-lg font-semibold">🪔 Hare Krishna!</h1>
          <p className="text-sm opacity-90">
            Welcome,&nbsp;
            <span className="font-bold capitalize">
              {userData?.firstName || user?.displayName?.split(" ")[0] || "Devotee"} Pr
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

      {/* Main Body */}
      <main className="flex-1 px-4 py-6">
        <div className="bg-white shadow-lg rounded-2xl p-5 text-center border border-yellow-300">
          <h2 className="text-xl font-bold text-yellow-800 mb-3">
            🌸 Welcome to Your Devotee Dashboard
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Hare Krishna,{" "}
            <b>{userData?.firstName || user?.displayName || "Devotee"} Pr</b>!
            <br />
            This is your personal space to view your <b>Seva Board</b>, update your
            <b> Profile</b>, and stay connected with the devotee community.
          </p>

          <p className="mt-3 text-yellow-800 italic font-medium">
            “By serving the servants of Krishna, one easily pleases the Lord Himself.”
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/user/seva-board")}
            className="bg-yellow-700 text-white rounded-xl py-3 font-semibold hover:bg-yellow-800 shadow-md"
          >
            🪔 View Seva Board
          </button>

          <button
            onClick={() => router.push("/user/profile")}
            className="bg-yellow-500 text-white rounded-xl py-3 font-semibold hover:bg-yellow-600 shadow-md"
          >
            👤 My Profile
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 text-sm text-yellow-900">
        🌼 All Glories to Sri Guru and Sri Gauranga 🌼 <br />
        <span className="text-xs">C-Cube Seva Portal</span>
      </footer>
    </div>
  );
}
