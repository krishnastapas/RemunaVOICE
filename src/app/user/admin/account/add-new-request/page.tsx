"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const departments = ["Kitchen", "Deity", "Cleaning", "Maintenance", "Preaching", "Garden"];
const units = ["pcs", "kg", "g", "litre", "meter", "cm"];

interface Item {
  name: string;
  quantity: number | "";
  unit: string;
  price: number | "";
}

export default function AddNewRequest() {
  const router = useRouter();

  const [department, setDepartment] = useState("");
  const [items, setItems] = useState<Item[]>([
    { name: "", quantity: "", unit: "pcs", price: "" },
  ]);
  const [loading, setLoading] = useState(false);

  /* 🔥 HANDLE ITEM CHANGE */
  const handleItemChange = (i: number, field: keyof Item, value: string) => {
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
                  : Math.max(0, Number(value)),
            }
          : item
      )
    );
  };

  const addItem = () =>
    setItems([...items, { name: "", quantity: "", unit: "pcs", price: "" }]);

  const removeItem = (i: number) =>
    setItems(items.filter((_, idx) => idx !== i));

  /* 🔥 TOTAL */
  const totalAmount = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return sum + qty * price;
  }, 0);

  /* 🔥 SUBMIT */
  const handleSubmit = async () => {
    if (!department) {
      alert("Please select department");
      return;
    }

    const confirmAdd = confirm(
      "Do you want to directly add this entry to the report?"
    );

    if (!confirmAdd) return;

    try {
      setLoading(true);

      await addDoc(collection(db, "purchaseRequests"), {
        department,
        items,
        totalAmount,
        status: "approved", // direct to report
        createdAt: serverTimestamp(),
        isAdminEntry: true,
      });

      alert("✅ Entry added to report!");

      setDepartment("");
      setItems([{ name: "", quantity: "", unit: "pcs", price: "" }]);

    } catch (err) {
      console.error(err);
      alert("❌ Error adding entry");
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

      <h1 className="text-xl font-bold mb-4">➕ Add Admin Entry</h1>

      <div className="bg-white p-5 rounded-xl shadow space-y-4">

        {/* Department */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border px-3 h-10 rounded-md"
        >
          <option value="">Select Department *</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {/* ITEMS */}
        {items.map((item, i) => (
          <div key={i} className="border p-4 rounded-lg bg-gray-50 space-y-3">

            <input
              placeholder="Item Name"
              value={item.name}
              onChange={(e) =>
                handleItemChange(i, "name", e.target.value)
              }
              className="w-full border px-3 h-10 rounded-md"
            />

            <div className="grid grid-cols-3 gap-3">

              <input
                placeholder="Qty"
                type="number"
                min="0"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(i, "quantity", e.target.value)
                }
                className="border px-3 h-10 rounded-md"
              />

              <select
                value={item.unit}
                onChange={(e) =>
                  handleItemChange(i, "unit", e.target.value)
                }
                className="border px-3 h-10 rounded-md"
              >
                {units.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>

              <input
                placeholder="Price"
                type="number"
                min="0"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(i, "price", e.target.value)
                }
                className="border px-3 h-10 rounded-md"
              />
            </div>

            <p className="text-right text-sm font-medium">
              ₹ {(Number(item.quantity) || 0) * (Number(item.price) || 0)}
            </p>

            {items.length > 1 && (
              <button
                onClick={() => removeItem(i)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Add item */}
        <button
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Item
        </button>

        {/* Total */}
        <p className="text-right font-bold text-yellow-800 text-lg">
          Net Total: ₹{totalAmount}
        </p>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          {loading ? "Adding..." : "Add Entry"}
        </button>

      </div>
    </div>
  );
}