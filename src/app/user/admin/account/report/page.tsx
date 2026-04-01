"use client";

import { useRouter } from "next/navigation";

export default function ReportDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-6">
      {/* 🔙 BACK */}

      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-600 text-white px-3 py-1 rounded"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold text-center mb-10">
        📊 Reports Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

  {/* DONOR CARD */}
  <div
    onClick={() => router.push("/user/admin/account/report/donor")}
    className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition cursor-pointer"
  >
    <h2 className="text-xl font-semibold mb-2">🙏 Donor Report</h2>
    <p className="text-gray-500">
      View donations, filter data, and export reports.
    </p>
  </div>

  {/* EXPENSE CARD */}
  <div
    onClick={() => router.push("/user/admin/account/report/expenses")}
    className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition cursor-pointer"
  >
    <h2 className="text-xl font-semibold mb-2">💰 Expense Report</h2>
    <p className="text-gray-500">
      Track department expenses with analytics.
    </p>
  </div>

</div>
    </div>
  );
}