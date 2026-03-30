"use client";

import { useRouter } from "next/navigation";
import BackHeader from "@/components/BackHeader";

export default function AdminAccounts() {
  const router = useRouter();

  return (
    <div className="p-4">

      <BackHeader title="💰 Account Management" />

      <div className="mt-6 grid gap-4">

        <button
          onClick={() => router.push("/user/admin/account/pending-request")}
          className="bg-yellow-600 text-white p-4 rounded-xl"
        >
          📥 Pending Requests
        </button>

        <button
          onClick={() => router.push("/user/admin/account/add-new-request")}
          className="bg-green-600 text-white p-4 rounded-xl"
        >
          ➕ Add New Entry
        </button>

        <button
          onClick={() => router.push("/user/admin/account/report")}
          className="bg-blue-600 text-white p-4 rounded-xl"
        >
          📊 Reports
        </button>

      </div>
    </div>
  );
}