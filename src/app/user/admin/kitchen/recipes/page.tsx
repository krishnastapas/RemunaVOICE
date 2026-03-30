"use client";

import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import BackPageName from "@/components/BackHeaderButton";

interface Recipe {
  id: string;
  name: string;
  category: string;
  baseQty: number;
  baseUnit: string;
}

export default function RecipesListPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "recipes")).then((snap) => {
      setRecipes(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }))
      );
      setLoading(false);
    });
  }, []);

  const deleteRecipe = async (id: string, name: string) => {
    const ok = confirm(`Delete recipe "${name}"?`);
    if (!ok) return;
    await deleteDoc(doc(db, "recipes", id));
    setRecipes((p) => p.filter((r) => r.id !== id));
  };

  const grouped = recipes.reduce<Record<string, Recipe[]>>((acc, r) => {
    acc[r.category] = acc[r.category] || [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <BackPageName title="🍲 Kitchen Recipes" link="/user/admin/kitchen" />

      {loading ? (
        <p className="text-center">Loading…</p>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="bg-yellow-50 border rounded-lg">
            <div className="px-3 py-2 font-semibold text-yellow-900 border-b capitalize">
              {cat}
            </div>

            {items.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center px-3 py-2 border-b last:border-b-0"
              >
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-gray-500">
                    Base: {r.baseQty} {r.baseUnit}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/user/admin/kitchen/recipes/${r.id}`)
                    }
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRecipe(r.id, r.name)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* ADD BUTTON BOTTOM */}
      <button
        onClick={() => router.push("/user/admin/kitchen/recipes/new")}
        className="w-full mt-4 bg-green-600 text-white py-2 rounded font-semibold"
      >
        ➕ Add New Recipe
      </button>
    </div>
  );
}
