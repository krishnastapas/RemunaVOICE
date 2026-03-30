"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function PendingRequests() {
  const router = useRouter();

  const [requests, setRequests] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending"); // 🔥 default
  const formatDate = (timestamp: any) => {
  if (!timestamp?.seconds) return "";

  const date = new Date(timestamp.seconds * 1000);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  useEffect(() => {
    const q = query(
      collection(db, "purchaseRequests"),
      where("status", "==", statusFilter)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setRequests(data);
    });

    return () => unsub();
  }, [statusFilter]);

  const handleAction = async (id: string, status: string) => {
    await updateDoc(doc(db, "purchaseRequests", id), {
      status,
    });
  };

  return (
    <div className="p-4 min-h-screen bg-yellow-100">

      {/* 🔙 BACK */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-600 text-white px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h1 className="text-xl font-bold mb-4">📥 Requests Management</h1>

      {/* 🔥 FILTER DROPDOWN */}
      <div className="mb-4 flex gap-3 items-center">
        <label className="font-medium">Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* 🔥 TABLE */}
      {requests.length === 0 ? (
        <p className="text-gray-600">No {statusFilter} requests</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border text-sm">

            <thead className="bg-yellow-200">
  <tr>
    <th className="p-2 border">Date</th>
    <th className="p-2 border">Department</th>
    <th className="p-2 border">Items</th>
    <th className="p-2 border">Total</th>
    <th className="p-2 border">Status</th>
    {statusFilter === "pending" && (
      <th className="p-2 border">Action</th>
    )}
  </tr>
</thead>

            <tbody>
  {requests.map((req) => (
    <tr key={req.id} className="text-center">

      {/* 📅 DATE */}
      <td className="border p-2 text-sm">
        {formatDate(req.createdAt)}
      </td>

      {/* 🏢 DEPARTMENT */}
      <td className="border p-2 font-medium">
        {req.department}
      </td>

      {/* 📦 ITEMS */}
      <td className="border p-2 text-left">
        {req.items?.map((it: any, i: number) => {
          const total = (it.quantity || 0) * (it.price || 0);

          return (
            <div key={i}>
              • {it.name} ({it.quantity} {it.unit}) × ₹{it.price} = ₹{total}
            </div>
          );
        })}
      </td>

      {/* 💰 TOTAL */}
      <td className="border p-2 font-bold">
        ₹{req.totalAmount}
      </td>

      {/* 📌 STATUS */}
      <td className="border p-2 capitalize">
        {req.status}
      </td>

      {/* ⚡ ACTION */}
      {statusFilter === "pending" && (
        <td className="border p-2">
          <div className="flex gap-2 justify-center">

            <button
              onClick={() => handleAction(req.id, "approved")}
              className="bg-green-600 text-white px-2 py-1 rounded text-xs"
            >
              Approve
            </button>

            <button
              onClick={() => handleAction(req.id, "rejected")}
              className="bg-red-600 text-white px-2 py-1 rounded text-xs"
            >
              Reject
            </button>

          </div>
        </td>
      )}

    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
}