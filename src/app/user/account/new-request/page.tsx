"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


const departments = ["Kitchen", "Deity", "Cleaning", "Maintenance", "Preaching", "Garden"];
const units = ["pcs", "kg", "g", "litre", "meter", "cm"];

interface Item {
  name: string;
  quantity: number | "";
  unit: string;
  price: number | "";
}

export default function NewRequestPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const [department, setDepartment] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [items, setItems] = useState<Item[]>([
    { name: "", quantity: "", unit: "pcs", price: "" },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  /* 🔥 HANDLE INPUT */
  const handleItemChange = (
    i: number,
    field: keyof Item,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item, index) =>
        index === i
          ? {
              ...item,
              [field]:
                field === "name" || field === "unit"
                  ? value
                  : value === ""
                  ? ""
                  : Number(value),
            }
          : item
      )
    );
  };

  const addItem = () =>
    setItems([
      ...items,
      { name: "", quantity: "", unit: "pcs", price: "" },
    ]);

  const removeItem = (i: number) =>
    setItems(items.filter((_, idx) => idx !== i));

  /* 🔥 TOTAL */
  const totalAmount = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return sum + qty * price;
  }, 0);

  /* 🔥 SUBMIT */
  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!department) {
    setError("⚠️ Please select a department");
    return;
  }

  if (!user) return;

  try {
    setError("");
    setLoading(true);

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 3);

    await addDoc(collection(db, "purchaseRequests"), {
      department,
      items,
      totalAmount,
      userId: user.uid,
      status: "pending",
      date,
      createdAt: serverTimestamp(),
      expiryAt: expiryDate,
    });

    alert("✅ Request submitted!");
    router.push("/user/account/previous-request");

  } catch (err) {
    console.error(err);
    alert("❌ Error submitting request");
  } finally {
    setLoading(false);
  }
};

  if (authLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-yellow-100 p-4">

      {/* 🔙 BACK */}
      <button
        onClick={() => router.push("/user/account")}
        className="mb-4 bg-gray-600 text-white px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h1 className="text-xl font-bold mb-4">➕ New Request</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded space-y-4">

        {/* Department */}
        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setError(""); // clear error on select
          }}
          className={`w-full border p-2 rounded ${
            error ? "border-red-500" : ""
          }`}
          >
          <option value="">Select Department *</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Items */}
        {items.map((item, i) => (
          <div key={i} className="border p-3 rounded space-y-2">

            {/* Name */}
            <input
              placeholder="Item Name"
              value={item.name}
              onChange={(e) =>
                handleItemChange(i, "name", e.target.value)
              }
              className="w-full border p-2 rounded"
              required
            />

            {/* Qty + Unit + Price */}
            <div className="grid grid-cols-3 gap-2">

              <input
                placeholder="Qty"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(i, "quantity", e.target.value)
                }
                className="border p-2 rounded"
              />

              <select
                value={item.unit}
                onChange={(e) =>
                  handleItemChange(i, "unit", e.target.value)
                }
                className="border p-2 rounded"
              >
                {units.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>

              <input
                placeholder="Price/Qty"
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(i, "price", e.target.value)
                }
                className="border p-2 rounded"
              />
            </div>

            {/* Item total */}
            <p className="text-right text-sm">
              ₹ {(Number(item.quantity) || 0) * (Number(item.price) || 0)}
            </p>

            {/* Remove */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Add */}
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add Item
        </button>

        {/* Total */}
        <p className="text-right font-bold text-yellow-800">
          Net Total: ₹{totalAmount}
        </p>

        {/* Submit */}
        <button
          className="bg-yellow-700 text-white w-full py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
}