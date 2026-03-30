"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import BackPageName from "@/components/BackHeaderButton";

/* ================= TYPES ================= */

type Category = "vegetable" | "grocery";
type Unit = "kg" | "gm" | "ltr" | "pcs";

interface RawItem {
  name: string;
  category: Category;
  unit: Unit;
  isActive: boolean;
}

/* ================= PAGE ================= */

export default function RawItemsPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("vegetable");
  const [unit, setUnit] = useState<Unit>("kg");
  const [items, setItems] = useState<RawItem[]>([]);
  const [saving, setSaving] = useState(false);

  /* LOAD ITEMS */
  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(
        query(collection(db, "raw_items"), orderBy("name"))
      );
      setItems(snap.docs.map((d) => d.data() as RawItem));
    };
    load();
  }, []);

  /* SAVE ITEM */
  const save = async () => {
    const cleanName = name.trim().toLowerCase();
    if (!cleanName) return;

    // ❌ Prevent duplicates
    if (items.some((i) => i.name === cleanName)) {
      alert("Item already exists");
      return;
    }

    setSaving(true);

    await addDoc(collection(db, "raw_items"), {
      name: cleanName,
      category,
      unit,
      isActive: true,
      createdAt: serverTimestamp(),
    });

    setItems((p) => [
      ...p,
      { name: cleanName, category, unit, isActive: true },
    ]);

    setName("");
    setSaving(false);
  };

  /* GROUPED ITEMS */
  const vegetables = items.filter((i) => i.category === "vegetable");
  const groceries = items.filter((i) => i.category === "grocery");

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <BackPageName title="🥕 Raw Items Master" link="/user/admin/kitchen" />

      {/* ADD FORM */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-yellow-800 text-sm">
          Add New Raw Item
        </h2>

        <input
          placeholder="item name (always lowercase)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="border rounded px-2 py-2 text-sm flex-1"
          >
            <option value="vegetable">Vegetable</option>
            <option value="grocery">Grocery</option>
          </select>

          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="border rounded px-2 py-2 text-sm"
          >
            <option value="kg">kg</option>
            <option value="gm">gm</option>
            <option value="ltr">ltr</option>
            <option value="pcs">pcs</option>
          </select>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-yellow-700 text-white py-2 rounded font-semibold"
        >
          {saving ? "Saving…" : "Add Item"}
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        <ItemGroup title="🥬 Vegetables" items={vegetables} />
        <ItemGroup title="🧂 Grocery" items={groceries} />
      </div>
    </div>
  );
}

/* ================= UI BLOCK ================= */

function ItemGroup({
  title,
  items,
}: {
  title: string;
  items: RawItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="bg-yellow-50 border rounded-lg">
      <div className="px-3 py-2 font-semibold text-sm text-yellow-900 border-b">
        {title}
      </div>

      {items.map((i, idx) => (
        <div
          key={idx}
          className="flex justify-between px-3 py-2 text-sm border-b last:border-b-0"
        >
          <span className="font-medium">{i.name}</span>
          <span className="text-gray-500">{i.unit}</span>
        </div>
      ))}
    </div>
  );
}
