"use client";

import { useRouter } from "next/navigation";
import {
  FaPenFancy,
  FaUserCheck,
  FaChartBar,
  FaBookOpen,
  FaVideo,
} from "react-icons/fa";
import BackPageName from "@/components/BackHeaderButton";

/* =====================
 PAGE
===================== */

export default function SadhanaHomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-yellow-50">
      <BackPageName title="Sadhana" link="/user/dashboard" />

      <div className="max-w-md mx-auto p-4">
        <p className="text-center text-sm text-gray-600 mb-6">
          Regulate, reflect and grow in devotional life
        </p>

        {/* MAIN GRID */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            icon={<FaPenFancy />}
            label="Fill Sadhana"
            desc="Daily entry"
            onClick={() => router.push("/user/sadhana/fill")}
          />

          <Card
            icon={<FaUserCheck />}
            label="My Sadhana"
            desc="My history"
            onClick={() => router.push("/user/sadhana/my")}
          />

          <Card
            icon={<FaChartBar />}
            label="Sadhana Report"
            desc="Weekly / Monthly"
            onClick={() => router.push("/user/sadhana/report")}
          />

          <Card
            icon={<FaBookOpen />}
            label="SP Book Reading"
            desc="Reading tracker"
            onClick={() => router.push("/user/sadhana/book-reading")}
          />
        </div>

        {/* JOIN BOOK READING — CENTERED CTA */}
        <div className="mt-6 flex justify-center">
          <JoinCard
            onClick={() =>
              (window.location.href =
                "https://meet.google.com/pzr-iofu-spb")
            }
          />
        </div>
      </div>
    </div>
  );
}

/* =====================
 NORMAL CARD
===================== */

function Card({
  icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-yellow-300 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
    >
      <div className="text-3xl text-yellow-700 mb-2">{icon}</div>

      <div className="font-semibold text-yellow-900 text-sm">
        {label}
      </div>

      <div className="text-xs text-gray-500 mt-1">{desc}</div>
    </button>
  );
}

/* =====================
 JOIN BOOK READING CARD
===================== */

function JoinCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full max-w-sm
        bg-green-600 text-white
        rounded-2xl
        p-5
        shadow-lg
        hover:bg-green-700
        hover:shadow-xl
        transition
        flex items-center gap-4
      "
    >
      <div className="text-3xl">
        <FaVideo />
      </div>

      <div className="text-left">
        <div className="font-bold text-lg">
          Join Book Reading
        </div>
        <div className="text-sm text-green-100">
          Live Google Meet
        </div>
      </div>
    </button>
  );
}
