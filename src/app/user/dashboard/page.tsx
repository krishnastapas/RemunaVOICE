"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { GiMeditation } from "react-icons/gi";
import { MdRecordVoiceOver } from "react-icons/md";

export default function UserDashboard() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);

  // 🔒 Protect routes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/");
    });
    return () => unsub();
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

  const features = userData?.features || {};

  return (
    <div>
      {/* HEADER */}
      <header className="bg-yellow-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
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
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            logoutLoading
              ? "bg-gray-400"
              : "bg-yellow-600 hover:bg-yellow-800"
          }`}
        >
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </header>

      <h2 className="text-xl font-bold text-yellow-800 mb-4 text-center">
        📿 Dashboard
      </h2>

      <div className="grid grid-cols-2 gap-4 px-4">
        {/* SEVA */}
        {features.seva && (
          <button
            onClick={() => router.push("/user/seva-board")}
            className="bg-white border border-yellow-300 rounded-xl p-4 shadow flex flex-col items-center"
          >
            <FaHandsHelping className="text-3xl text-yellow-700 mb-2" />
            <span className="font-semibold">Seva</span>
          </button>
        )}

        {/* SADHANA */}
        {features.sadhana && (
          <button
            onClick={() => router.push("/user/sadhana")}
            className="bg-white border border-yellow-300 rounded-xl p-4 shadow flex flex-col items-center"
          >
            <GiMeditation className="text-3xl text-yellow-700 mb-2" />
            <span className="font-semibold">Sadhana</span>
          </button>
        )}

        {/* PREACHING */}
        {features.preaching && (
          <button
            onClick={() => router.push("/user/preaching")}
            className="bg-white border border-yellow-300 rounded-xl p-4 shadow flex flex-col items-center hover:shadow-md transition"
          >
            <MdRecordVoiceOver className="text-3xl text-yellow-700 mb-2" />
            <span className="font-semibold">Preaching</span>
          </button>
        )}

        {/* SEVA ADMIN */}
        {features.sevaAlot && (
          <button
            onClick={() => router.push("/user/seva-board-admin")}
            className="bg-white border border-yellow-300 rounded-xl p-4 shadow flex flex-col items-center"
          >
            <GiMeditation className="text-3xl text-yellow-700 mb-2" />
            <span className="font-semibold">Seva Board Admin</span>
          </button>
        )}
      </div>

      {!features.seva && !features.sadhana && !features.preaching && (
        <p className="text-center text-yellow-700 mt-6">
          No features enabled for your account 🙏
        </p>
      )}
    </div>
  );
}
