"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

export default function DonorReport() {
  const [data, setData] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [dateType, setDateType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "donations"), (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setData(list);
    });

    return () => unsub();
  }, []);

  const now = new Date();

  // 🔥 UNIVERSAL DATE PARSER
  const getDate = (d: any): Date | null => {
    if (d.date?.seconds) return new Date(d.date.seconds * 1000);
    if (typeof d.date === "string") return new Date(d.date);
    if (d.createdAt?.seconds)
      return new Date(d.createdAt.seconds * 1000);
    return null;
  };

  // 🔥 FILTER
  const filtered = data.filter((d) => {
    const nameMatch = name
      ? (d.name || "").toLowerCase().includes(name.toLowerCase())
      : true;

    const created = getDate(d);

    let dateMatch = true;

    if (dateType === "week") {
      if (!created) return false;
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      dateMatch = created.getTime() >= weekAgo.getTime();
    }

    if (dateType === "month") {
      if (!created) return false;
      dateMatch =
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear();
    }

    if (dateType === "exact" && fromDate) {
      if (!created) return false;
      const selected = new Date(fromDate);
      dateMatch =
        created.toDateString() === selected.toDateString();
    }

    if (dateType === "range") {
      if (!created) return false;

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      dateMatch =
        (!from || created.getTime() >= from.getTime()) &&
        (!to || created.getTime() <= to.getTime());
    }

    return nameMatch && dateMatch;
  });

  // 🔥 SORT (LATEST FIRST)
  const sortedData = [...filtered].sort((a, b) => {
    const aTime = getDate(a)?.getTime() || 0;
    const bTime = getDate(b)?.getTime() || 0;
    return bTime - aTime;
  });

  // 🔥 TOTAL
  const total = sortedData.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  // 🔥 DELETE
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donor?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "donations", id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete");
    }
  };

  // 🔥 PDF EXPORT
  const exportPDF = () => {
    const docu = new jsPDF();

    docu.setFontSize(18);
    docu.text("Donor Report", 10, 10);

    let y = 20;

    sortedData.forEach((d) => {
      const created = getDate(d);

      const date = created
        ? created.toLocaleDateString()
        : "N/A";

      docu.text(`${date} | ${d.name} | ₹${d.amount}`, 10, y);
      y += 8;

      if (y > 270) {
        docu.addPage();
        y = 20;
      }
    });

    docu.text(`Total: ₹${total}`, 10, y + 10);
    docu.save("donor-report.pdf");
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-600 text-white px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">🙏 Donor Report</h1>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-wrap gap-3">

        <input
          placeholder="Search Donor"
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          onChange={(e) => setDateType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Dates</option>
          <option value="exact">Exact Date</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="range">Date Range</option>
        </select>

        {(dateType === "exact" || dateType === "range") && (
          <input
            type="date"
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded"
          />
        )}

        {dateType === "range" && (
          <input
            type="date"
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded"
          />
        )}
      </div>

      {/* TOTAL */}
      <div className="bg-green-100 p-4 rounded-xl mb-4 font-semibold">
        Total Donation: ₹{total}
      </div>

      {/* EXPORT */}
      <button
        onClick={exportPDF}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Export PDF
      </button>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="text-left">Donor Name</th>
              <th className="text-left">Amount (₹)</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {sortedData.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}

            {sortedData.map((d) => {
              const created = getDate(d);

              const date = created
                ? created.toLocaleDateString()
                : "N/A";

              return (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{date}</td>
                  <td>{d.name}</td>
                  <td className="font-semibold">₹{d.amount}</td>

                  <td>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition text-sm"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
}