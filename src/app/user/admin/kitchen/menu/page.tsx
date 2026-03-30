"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import BackPageName from "@/components/BackHeaderButton";

export default function DailyMenuPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [devotees, setDevotees] = useState(10);

  useEffect(() => {
    getDocs(collection(db, "recipes")).then((s) =>
      setRecipes(s.docs.map((d) => d.data()))
    );
  }, []);

  const scale = (q: number) => (q * devotees) / 10;

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <BackPageName title="Daily Menu" link="/admin" />

      <input
        type="number"
        value={devotees}
        onChange={(e) => setDevotees(Number(e.target.value))}
        className="border p-2 w-full"
        placeholder="No of devotees"
      />

      <select
        onChange={(e) =>
          setSelected(recipes.find((r) => r.name === e.target.value))
        }
        className="border p-2 w-full"
      >
        <option>Select menu item</option>
        {recipes.map((r) => (
          <option key={r.name}>{r.name}</option>
        ))}
      </select>

      {selected && (
        <div className="border rounded p-3 bg-yellow-50">
          <h3 className="font-bold">{selected.name}</h3>
          {selected.ingredients.map((i: any) => (
            <div key={i.name} className="text-sm">
              {i.name} – {scale(i.qty)} {i.unit}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
