"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

/* 🔥 Departments */
const departments = ["Kitchen", "Garden", "Deity", "Maintenance", "Preaching"];

interface Item {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface RequestType {
  id: string;
  department: string;
  items: Item[];
  totalAmount: number;
  status: string;
  date?: string;
}

export default function PreviousRequests() {
  const { user } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<RequestType[]>([]);

  const [dateFilter, setDateFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const [selectedDate, setSelectedDate] = useState("");
  const [customMonth, setCustomMonth] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "purchaseRequests"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RequestType[];

      setRequests(data);
    });

    return () => unsubscribe();
  }, [user]);

  /* 🔥 FILTER LOGIC */
  const filtered = requests.filter((req) => {
    const today = new Date();
    const reqDate = req.date ? new Date(req.date) : null;

    /* -------- Department Filter -------- */
    if (departmentFilter !== "all" && req.department !== departmentFilter) {
      return false;
    }

    /* -------- Date Filter -------- */
    if (!reqDate) return true;

    if (dateFilter === "today") {
      return reqDate.toDateString() === today.toDateString();
    }

    if (dateFilter === "week") {
      const diff =
        (today.getTime() - reqDate.getTime()) / (1000 * 3600 * 24);
      return diff <= 7;
    }

    if (dateFilter === "month") {
      return (
        reqDate.getMonth() === today.getMonth() &&
        reqDate.getFullYear() === today.getFullYear()
      );
    }

    if (dateFilter === "prevMonth") {
      const prev = new Date(today.getFullYear(), today.getMonth() - 1);
      return (
        reqDate.getMonth() === prev.getMonth() &&
        reqDate.getFullYear() === prev.getFullYear()
      );
    }

    if (dateFilter === "custom" && selectedDate) {
      return req.date === selectedDate;
    }

    if (dateFilter === "customMonth" && customMonth) {
      const [year, month] = customMonth.split("-");
      return (
        reqDate.getFullYear() === Number(year) &&
        reqDate.getMonth() === Number(month) - 1
      );
    }

    if (dateFilter === "range" && fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return reqDate >= from && reqDate <= to;
    }

    return true;
  });

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "purchaseRequests", id));
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-4">

      {/* 🔙 Back */}
      <button
        onClick={() => router.push("/user/account")}
        className="mb-4 bg-gray-600 text-white px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h1 className="text-xl font-bold mb-4">📜 Previous Requests</h1>

      {/* 🔥 FILTER DROPDOWNS */}
      <div className="flex flex-wrap gap-3 mb-4">

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="prevMonth">Previous Month</option>
          <option value="custom">Custom Date</option>
          <option value="customMonth">Custom Month</option>
          <option value="range">Date Range</option>
        </select>

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Departments</option>
          {departments.map((dep) => (
            <option key={dep}>{dep}</option>
          ))}
        </select>
      </div>

      {/* Conditional Inputs */}
      {dateFilter === "custom" && (
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded mb-3"
        />
      )}

      {dateFilter === "customMonth" && (
        <input
          type="month"
          value={customMonth}
          onChange={(e) => setCustomMonth(e.target.value)}
          className="border p-2 rounded mb-3"
        />
      )}

      {dateFilter === "range" && (
        <div className="flex gap-2 mb-3">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      )}

      {/* DATA */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No requests found</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <div key={req.id} className="bg-white p-4 rounded shadow">

              <p className="font-bold text-yellow-800 text-lg">
                {req.department}
              </p>

              <p className="text-sm text-gray-500">
                📅 {formatDate(req.date)}
              </p>

              {req.items.map((it, i) => (
                <p key={i} className="text-sm">
                  • {it.name} ({it.quantity} {it.unit}) × ₹{it.price} = ₹{it.quantity * it.price}
                </p>
              ))}

              <p className="font-bold text-yellow-800">
                Net Total: ₹{req.totalAmount}
              </p>

              <p>Status: {req.status}</p>

              {req.status === "pending" && (
                <button
                  onClick={() => handleDelete(req.id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                >
                  🗑 Delete
                </button>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}