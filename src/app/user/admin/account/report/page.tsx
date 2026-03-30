"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

/* 📊 CHART */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReportPage() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [department, setDepartment] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "purchaseRequests"),
      where("status", "==", "approved")
    );

    const unsub = onSnapshot(q, (snap) => {
      const d = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(d);
    });

    return () => unsub();
  }, []);

  /* 🔥 DATE FILTER */
  const filtered = data.filter((d) => {
    const deptMatch = department ? d.department === department : true;

    const created = d.createdAt?.seconds
      ? new Date(d.createdAt.seconds * 1000)
      : null;

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const dateMatch =
      (!from || (created && created >= from)) &&
      (!to || (created && created <= to));

    return deptMatch && dateMatch;
  });

  /* 🔥 TOTAL */
  const total = filtered.reduce(
    (sum, d) => sum + (d.totalAmount || 0),
    0
  );

  /* 🔥 GROUP BY DEPARTMENT (FOR GRAPH) */
  const grouped: any = {};
  filtered.forEach((d) => {
    grouped[d.department] =
      (grouped[d.department] || 0) + (d.totalAmount || 0);
  });

  const chartData = Object.keys(grouped).map((key) => ({
    name: key,
    total: grouped[key],
  }));

  /* 🔥 EXPORT CSV */
  const exportCSV = () => {
    let csv = "Date,Department,Item,Qty,Unit,Price,Total\n";

    filtered.forEach((d) => {
      d.items?.forEach((it: any) => {
        const date = d.createdAt?.seconds
          ? new Date(d.createdAt.seconds * 1000).toLocaleDateString()
          : "";

        csv += `${date},${d.department},${it.name},${it.quantity},${it.unit},${it.price},${it.quantity * it.price}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
  };

  /* 🔥 EXPORT PDF (simple) */
  const exportPDF = () => {
  const doc = new jsPDF();

  let y = 10;

  doc.setFontSize(12);

  filtered.forEach((d, i) => {
    doc.text(`Department: ${d.department}`, 10, y);
    y += 6;

    const date = d.createdAt?.seconds
      ? new Date(d.createdAt.seconds * 1000).toLocaleDateString("en-IN")
      : "";

    doc.text(`Date: ${date}`, 10, y);
    y += 6;

    d.items?.forEach((it: any) => {
      const total = (it.quantity || 0) * (it.price || 0);

      doc.text(
        `- ${it.name} (${it.quantity} ${it.unit}) x ₹${it.price} = ₹${total}`,
        12,
        y
      );
      y += 6;
    });

    doc.text(`Total: ₹${d.totalAmount}`, 10, y);
    y += 10;

    // 🔥 page break
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("report.pdf");
};

  return (
    <div className="p-4 bg-yellow-100 min-h-screen">

      {/* 🔙 BACK */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-600 text-white px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h1 className="text-xl font-bold mb-4">📊 Reports Dashboard</h1>

      {/* 🔥 FILTERS */}
      <div className="flex flex-wrap gap-3 mb-4">

        <select
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Departments</option>
          <option>Kitchen</option>
          <option>Deity</option>
          <option>Cleaning</option>
          <option>Maintenance</option>
          <option>Preaching</option>
        </select>

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

      {/* 🔥 TOTAL */}
      <p className="font-bold text-lg mb-3">
        Total: ₹{total.toLocaleString("en-IN")}
      </p>

      {/* 🔥 GRAPH */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-2">Department Wise Expense</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 EXPORT BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Export Excel
        </button>

        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Export PDF
        </button>
      </div>

      {/* 🔥 TABLE */}
      <div className="bg-white rounded shadow p-3">
        {filtered.map((d, i) => (
          <div key={i} className="mb-3 border-b pb-2">

            <p className="font-bold">{d.department}</p>

            {d.items?.map((it: any, idx: number) => (
              <p key={idx} className="text-sm">
                • {it.name} ({it.quantity} {it.unit}) × ₹{it.price} = ₹{it.quantity * it.price}
              </p>
            ))}

            <p className="font-bold">
              ₹{d.totalAmount}
            </p>

          </div>
        ))}
      </div>

    </div>
  );
}