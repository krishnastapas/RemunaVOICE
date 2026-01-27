"use client";

import { useRouter } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import {
  FaPenFancy,
  FaUserCheck,
  FaChartBar,
  FaBookOpen,
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
        <p className="text-center text-sm text-gray-600 mb-4">
          Regulate, reflect and grow in devotional life
        </p>

        {/* GRID */}
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
            label="Book Reading"
            desc="Reading tracker"
            onClick={() => router.push("/user/sadhana/book-reading")}
          />
        </div>
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
      className="bg-white border border-yellow-300 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col items-center text-center"
    >
      <div className="text-3xl text-yellow-700 mb-2">{icon}</div>

      <div className="font-semibold text-yellow-900 text-sm">
        {label}
      </div>

      <div className="text-xs text-gray-500 mt-1">{desc}</div>
    </button>
  );
}
