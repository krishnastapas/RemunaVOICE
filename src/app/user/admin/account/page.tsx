"use client";

import { useRouter } from "next/navigation";
import BackHeader from "@/components/BackHeader";

export default function AdminAccounts() {
  const router = useRouter();

  const options = [
  {
    title: "Pending Requests",
    icon: "📥",
    path: "/user/admin/account/pending-request",
  },
  {
    title: "Add New Entry",
    icon: "➕",
    path: "/user/admin/account/add-new-request",
  },
  {
    title: "Reports",
    icon: "📊",
    path: "/user/admin/account/report",
  },
  {
    title: "Donor List",
    icon: "🙏",
    path: "/user/admin/account/donner", // new route
  },
];

  return (
    <div className="min-h-screen bg-yellow-100 px-4 py-6">

      {/* Top Bar (Back + Title in one line) */}
      <div className="max-w-4xl mx-auto mb-6">

  {/* Back Button */}
  <button
    onClick={() => router.back()}
    className="bg-gray-700 text-white px-4 py-2 rounded-md mb-4 hover:bg-gray-800 transition"
  >
    ← Back
  </button>

  {/* Title */}
  <div className="text-2xl font-semibold text-[#8b5e00] flex items-center gap-2">
    💰 Account Management
  </div>

</div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">

        {options.map((item, index) => (
          <div
            key={index}
            onClick={() => router.push(item.path)}
            className="bg-white border border-[#d4a017] rounded-2xl 
            h-40 flex flex-col items-center justify-center 
            cursor-pointer 
            shadow-[0_2px_6px_rgba(168,107,0,0.15)] 
            hover:shadow-md transition hover:scale-[1.03]"
          >
            {/* Icon */}
            <div className="text-4xl text-[#a86b00] mb-3">
              {item.icon}
            </div>

            {/* Title */}
            <p className="text-lg font-semibold text-[#8b5e00]">
              {item.title}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}