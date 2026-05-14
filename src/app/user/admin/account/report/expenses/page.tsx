"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

export default function ExpenseReport() {
  const [data, setData] = useState<any[]>([]);
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");

  const [dateType, setDateType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    const q = query(
      collection(db, "purchaseRequests"),
      where("status", "==", "approved")
    );

    const unsub = onSnapshot(q, (snap) => {
      setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  const now = new Date();

  // 🔥 FILTER LOGIC
  const filtered = data.filter((d) => {
    // NAME FILTER
    const nameMatch = name
      ? (d.createdByName || "")
          .toLowerCase()
          .includes(name.toLowerCase())
      : true;

    // DEPARTMENT FILTER
    const deptMatch = department ? d.department === department : true;

    // DATE PARSE
    let created: Date | null = null;
    if (d.createdAt?.seconds) {
      created = new Date(d.createdAt.seconds * 1000);
    }

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

    return nameMatch && deptMatch && dateMatch;
  });

  // 🔥 SORT (LATEST FIRST)
  const sortedData = [...filtered].sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return bTime - aTime;
  });

  // 🔥 TOTAL
  const total = sortedData.reduce(
    (sum, d) => sum + Number(d.totalAmount || 0),
    0
  );

  // 🔥 PDF EXPORT
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Expense Report", 10, 10);

    let y = 20;

    sortedData.forEach((d) => {
      const date = d.createdAt?.seconds
        ? new Date(d.createdAt.seconds * 1000).toLocaleDateString()
        : "";

      doc.text(
        `${date} | ${d.createdByName || "Unknown"} | ${d.department} | ₹${d.totalAmount}`,
        10,
        y
      );

      y += 8;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.text(`Grand Total: ₹${total}`, 10, y + 10);
    doc.save("expense-report.pdf");
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-600 text-white px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">💰 Expense Report</h1>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-wrap gap-3">

        {/* NAME */}
        <input
          placeholder="Search Devotee"
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />

        {/* DEPARTMENT */}
        <select
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Department</option>
          <option>Kitchen</option>
          <option>Deity</option>
          <option>Maintenance</option>
          <option>Preaching</option>
          <option>Garden</option>
        </select>

        {/* DATE FILTER */}
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

        {/* DATE INPUTS */}
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
      <div className="bg-blue-100 p-4 rounded-xl mb-4 font-semibold">
        Grand Total: ₹{total}
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
              <th className="text-left">Devotee</th>
              <th className="text-left">Department</th>
              <th className="text-left">Items</th>
              <th className="text-left">Total (₹)</th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((d) => {
              const date = d.createdAt?.seconds
                ? new Date(d.createdAt.seconds * 1000).toLocaleDateString()
                : "";

              return (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{date}</td>

                  {/* NAME + ADMIN TAG */}
                  <td>
                    {d.createdByName || "Unknown"}

                    {d.createdByRole === "admin" && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </td>

                  <td>{d.department}</td>

                  {/* ITEMS */}
                  <td>
                    {d.items?.map((it: any, idx: number) => (
                      <div key={idx}>
                        {it.name} ({it.quantity}) - ₹{it.price * it.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="font-semibold">
                    ₹{d.totalAmount}
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