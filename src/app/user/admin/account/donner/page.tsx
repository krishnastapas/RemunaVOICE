"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function DonorPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !amount || !date) {
      alert("All fields required!");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "donations"), {
        name,
        amount: Number(amount),
        date,
        createdAt: serverTimestamp(),
      });

      alert("✅ Donor added!");

      setName("");
      setAmount("");
      setDate("");
    } catch (err) {
      console.error(err);
      alert("❌ Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-4">
        {/* 🔙 BACK */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-600 text-white px-3 py-1 rounded"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">
        🙏 Add Donor
      </h1>

      {/* BUTTON TO LIST PAGE */}
      <button
        onClick={() => router.push("/user/admin/account/donners")}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        📋 View Donor List
      </button>

      {/* FORM */}
      <div className="bg-white p-5 rounded shadow space-y-4">

        <input
          placeholder="Donor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 h-10 rounded"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-3 h-10 rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-3 h-10 rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Add Donor"}
        </button>
      </div>
    </div>
  );
}