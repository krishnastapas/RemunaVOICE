"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FaHandsHelping } from "react-icons/fa";
import { GiMeditation, GiSunrise } from "react-icons/gi";
import { MdRecordVoiceOver, MdAdminPanelSettings } from "react-icons/md";

/* =====================
 HELPERS
===================== */

function isBirthdayToday(dob?: string) {
  if (!dob) return false;
  const today = new Date();
  const d = new Date(dob + "T00:00:00");
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth()
  );
}

/* =====================
 PAGE
===================== */

export default function UserDashboard() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [birthdayNames, setBirthdayNames] = useState<string[]>([]);
  const [dailyQuote, setDailyQuote] = useState<{
    text: string;
    imageUrl?: string;
  } | null>(null);

  /* 🔒 AUTH */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/");
    });
    return () => unsub();
  }, [router]);

  /* 🎂 FETCH BIRTHDAYS */
  useEffect(() => {
    const loadBirthdays = async () => {
      const snap = await getDocs(collection(db, "devotees"));
      const list: string[] = [];

      snap.docs.forEach((d) => {
        const data = d.data();
        if (isBirthdayToday(data.dob)) {
          list.push(`${data.firstName || "Devotee"} Pr`);
        }
      });

      setBirthdayNames(list);
    };

    loadBirthdays();
  }, []);

  /* 📜 FETCH DAILY QUOTE */
  useEffect(() => {
    const loadQuote = async () => {
      const res = await fetch("/api/daily-quote");
      const data = await res.json();
      setDailyQuote(data.quote);
    };

    loadQuote();
  }, []);

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

      <h2 className="text-xl font-bold text-yellow-800 my-3 text-center">
        📿 Dashboard
      </h2>

      {/* 🎂 BIRTHDAY */}
      {birthdayNames.length > 0 && (
        <div className="mx-4 mb-4 bg-pink-50 border border-pink-200 rounded-xl p-4 text-center shadow">
          <p className="text-lg font-semibold text-pink-700">
            🎉 Happy Krishna Conscious Birthday 🎂
          </p>
          <p className="text-sm text-pink-600 mt-1">
            {birthdayNames.join(", ")}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            May Śrī Kṛṣṇa bless you with devotion & strength 🙏
          </p>
        </div>
      )}

      {/* 📜 DAILY QUOTE */}
      {dailyQuote && (
        <div className="mx-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow text-center">
          <p className="text-xs text-yellow-700 font-semibold mb-2">
            🌼 Śrīla Prabhupāda Says
          </p>

          {dailyQuote.imageUrl && (
            <img
              src={dailyQuote.imageUrl}
              alt="Daily Quote"
              className="mx-auto mb-3 rounded-lg max-h-48 object-cover"
            />
          )}

          <p className="text-sm italic text-gray-800">
            “{dailyQuote.text}”
          </p>
        </div>
      )}

      {/* FEATURE GRID */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-10">
        {features.seva && (
          <Card icon={<FaHandsHelping />} label="Seva" onClick={() => router.push("/user/seva-board")} />
        )}
        {features.sadhana && (
          <Card icon={<GiMeditation />} label="Sadhana" onClick={() => router.push("/user/sadhana")} />
        )}
        {features.preaching && (
          <Card icon={<MdRecordVoiceOver />} label="Preaching" onClick={() => router.push("/user/preaching")} />
        )}
        {features.morningProgram && (
          <Card icon={<GiSunrise />} label="Morning Program" onClick={() => router.push("/user/morning-program")} />
        )}
        {features.admin && (
          <Card icon={<MdAdminPanelSettings />} label="Admin" onClick={() => router.push("/user/admin")} />
        )}
      </div>
    </div>
  );
}

/* =====================
 CARD
===================== */

function Card({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-yellow-300 rounded-xl p-4 shadow flex flex-col items-center hover:shadow-md transition"
    >
      <div className="text-3xl text-yellow-700 mb-2">{icon}</div>
      <span className="font-semibold text-center">{label}</span>
    </button>
  );
}
