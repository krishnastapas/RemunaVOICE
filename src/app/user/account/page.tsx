"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AccountsHome() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);

  /* 🔐 Auth Protection */
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  /* 📊 Fetch Stats */
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "purchaseRequests"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);

        let totalCount = 0;
        let pendingCount = 0;
        let approvedCount = 0;

        snap.forEach((doc) => {
          const data = doc.data();

          totalCount++;

          if (data.status === "pending") pendingCount++;
          if (data.status === "approved") approvedCount++;
        });

        setTotal(totalCount);
        setPending(pendingCount);
        setApproved(approvedCount);

      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-100 p-6 flex flex-col items-center">

      {/* 🔙 Back */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => router.push("/user/dashboard")}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-2xl font-bold text-yellow-800 mb-6">
        💰 Accounts Dashboard
      </h1>

      {/* 📊 STATS */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-6">

        <StatCard label="Total" value={total} color="bg-gray-200" />
        <StatCard label="Pending" value={pending} color="bg-yellow-400" />
        <StatCard label="Approved" value={approved} color="bg-green-400" />

      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-md">

        <button
          onClick={() =>
            router.push("/user/account/new-request")
          }
          className="bg-yellow-700 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-800"
        >
          ➕ New Request
        </button>

        <button
          onClick={() =>
            router.push("/user/account/previous-request")
          }
          className="bg-yellow-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-600"
        >
          📜 Previous Requests
        </button>

      </div>
    </div>
  );
}

/* 🔥 STAT CARD */
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`${color} rounded-xl p-3 text-center shadow`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}