"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Donor {
  id: string;
  name: string;
  amount: number;
  date: string;
}

export default function DonorListPage() {
    const router = useRouter();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filtered, setFiltered] = useState<Donor[]>([]);

  // 🔥 MAIN FILTER TYPE
  const [filterType, setFilterType] = useState<"name" | "date">("name");

  // 🔥 DATE FILTER TYPE
  const [dateFilterType, setDateFilterType] = useState("all");

  const [search, setSearch] = useState("");

  const [exactDate, setExactDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // FETCH
  const fetchDonors = async () => {
    const snap = await getDocs(collection(db, "donations"));

    const data: Donor[] = snap.docs.map((docItem) => {
      const d = docItem.data();

      return {
        id: docItem.id,
        name: d.name || "",
        amount: Number(d.amount || 0),
        date: d.date || "",
      };
    });

    const sorted = data.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setDonors(sorted);
    setFiltered(sorted);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this donor?")) return;

    await deleteDoc(doc(db, "donations", id));
    fetchDonors();
  };

  // 🔥 FILTER LOGIC
  const applyFilter = () => {
    let result = [...donors];

    // 🔍 NAME FILTER
    if (filterType === "name" && search.trim()) {
      result = result.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📅 DATE FILTER
    if (filterType === "date") {
      result = result.filter((d) => {
        const dDate = new Date(d.date);

        if (dateFilterType === "exact") {
          return d.date === exactDate;
        }

        if (dateFilterType === "month") {
          return dDate.getMonth() + 1 === Number(month);
        }

        if (dateFilterType === "year") {
          return dDate.getFullYear() === Number(year);
        }

        if (dateFilterType === "range") {
          if (!startDate || !endDate) return true;
          const dt = dDate.getTime();
          return (
            dt >= new Date(startDate).getTime() &&
            dt <= new Date(endDate).getTime()
          );
        }

        return true; // "all"
      });
    }

    setFiltered(result);
  };

  useEffect(() => {
    applyFilter();
  }, [
    filterType,
    search,
    dateFilterType,
    exactDate,
    month,
    year,
    startDate,
    endDate,
    donors,
  ]);

  const totalDonation = filtered.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  return (
    <div className="min-h-screen bg-yellow-100 p-4">
        {/* 🔙 BACK */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-600 text-white px-3 py-1 rounded"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4 text-[#8b5e00]">
        Total Donation: ₹{totalDonation}
      </h1>

      {/* FILTER */}
      <div className="bg-white p-5 rounded-xl shadow mb-5">

        <h2 className="font-semibold text-lg mb-3">
          Filter Donors
        </h2>

        {/* MAIN FILTER */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setFilterType("name")}
            className={`px-4 py-2 rounded ${
              filterType === "name"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            🔍 By Name
          </button>

          <button
            onClick={() => setFilterType("date")}
            className={`px-4 py-2 rounded ${
              filterType === "date"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            📅 By Date
          </button>
        </div>

        {/* NAME SEARCH */}
        {filterType === "name" && (
          <input
            placeholder="Search donor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-3 h-11 rounded"
          />
        )}

        {/* DATE FILTER */}
        {filterType === "date" && (
          <>
            {/* DROPDOWN */}
            <select
              value={dateFilterType}
              onChange={(e) => setDateFilterType(e.target.value)}
              className="w-full border px-3 h-11 rounded mb-3"
            >
              <option value="all">All</option>
              <option value="exact">Exact Date</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
              <option value="range">Date Range</option>
            </select>

            {/* CONDITIONAL INPUTS */}

            {dateFilterType === "exact" && (
              <input
                type="date"
                value={exactDate}
                onChange={(e) => setExactDate(e.target.value)}
                className="w-full border px-3 h-11 rounded"
              />
            )}

            {dateFilterType === "month" && (
              <input
                type="number"
                placeholder="Enter month (1-12)"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border px-3 h-11 rounded"
              />
            )}

            {dateFilterType === "year" && (
              <input
                type="number"
                placeholder="Enter year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border px-3 h-11 rounded"
              />
            )}

            {dateFilterType === "range" && (
              <div className="flex gap-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border px-3 h-11 rounded"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border px-3 h-11 rounded"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded shadow">

        <h2 className="font-bold mb-3 text-[#8b5e00]">
          Donor List
        </h2>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">
            No donors found
          </p>
        ) : (
          filtered.map((d) => (
            <div
              key={d.id}
              className="border-b py-3 flex justify-between"
            >
              <div>
                <strong>{d.name}</strong> — ₹{d.amount} — {d.date}
              </div>

              <button
                onClick={() => handleDelete(d.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}