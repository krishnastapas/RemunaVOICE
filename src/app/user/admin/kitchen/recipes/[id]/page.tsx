"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import BackPageName from "@/components/BackHeaderButton";

/* ================= TYPES ================= */

type Unit = "kg" | "gm" | "ltr" | "pcs";
type Category = "vegetable" | "grocery";

export const RECIPE_CATEGORIES = [
  "beverages",
  "breakfast items",
  "chutneys",
  "dal",
  "economical recipes",
  "ekadashi",
  "jam, pickles",
  "kadhi / raita",
  "khichadi",
  "masalas",
  "rice",
  "rotis",
  "sabji, dry",
  "sabji, wet",
  "soups / salads",
  "sweets",
  "sweets sustainable",
  "fhc sabjis",
] as const;

type RecipeCategory = typeof RECIPE_CATEGORIES[number];

interface RawItem {
  id: string;
  name: string;
  unit: Unit;
  category: Category;
}

interface Ingredient {
  rawItemId: string;
  qty: number;
  unit: Unit;
}

/* ================= PAGE ================= */

export default function RecipeBuilderPage() {
  const [recipeName, setRecipeName] = useState("");
  const [recipeCategory, setRecipeCategory] =
    useState<RecipeCategory | "">("");
  const [baseQty, setBaseQty] = useState(10);
  const [baseUnit, setBaseUnit] =
    useState<"devotees" | "ltr" | "pcs">("devotees");

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [rawItems, setRawItems] = useState<RawItem[]>([]);
  const [saving, setSaving] = useState(false);

  /* LOAD RAW ITEMS */
  useEffect(() => {
    getDocs(collection(db, "raw_items")).then((snap) => {
      setRawItems(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<RawItem, "id">),
        }))
      );
    });
  }, []);

  /* ADD INGREDIENT */
  const addIngredient = () => {
    setIngredients((p) => [
      ...p,
      { rawItemId: "", qty: 0, unit: "kg" },
    ]);
  };

  /* SAVE */
  const saveRecipe = async () => {
    if (!recipeName.trim()) {
      alert("Recipe name required");
      return;
    }

    if (!recipeCategory) {
      alert("Please select recipe category");
      return;
    }

    if (ingredients.length === 0) {
      alert("Add at least one ingredient");
      return;
    }

    for (const ing of ingredients) {
      if (!ing.rawItemId) {
        alert("Select raw item for all ingredients");
        return;
      }
    }

    setSaving(true);

    await addDoc(collection(db, "recipes"), {
      name: recipeName.trim().toLowerCase(),
      category: recipeCategory,
      baseQty,
      baseUnit,
      ingredients,
      createdAt: serverTimestamp(),
    });

    alert("✅ Recipe saved");

    setRecipeName("");
    setRecipeCategory("");
    setIngredients([]);
    setSaving(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <BackPageName
        title="🍲 Recipe Builder"
        link="/user/admin/kitchen/recipes"
      />

      {/* RECIPE NAME */}
      <input
        placeholder="recipe name (veg poha)"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* CATEGORY */}
      <select
        value={recipeCategory}
        onChange={(e) =>
          setRecipeCategory(e.target.value as RecipeCategory)
        }
        className="w-full border p-2 rounded"
      >
        <option value="">Select recipe category</option>
        {RECIPE_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* BASE QTY */}
      <div className="flex gap-2">
        <input
          type="number"
          value={baseQty}
          onChange={(e) => setBaseQty(Number(e.target.value))}
          className="border p-2 w-24"
        />
        <select
          value={baseUnit}
          onChange={(e) =>
            setBaseUnit(e.target.value as "devotees" | "ltr" | "pcs")
          }
          className="border p-2 flex-1"
        >
          <option value="devotees">Devotees</option>
          <option value="ltr">Liters</option>
          <option value="pcs">Pieces</option>
        </select>
      </div>

      {/* INGREDIENTS */}
      <h3 className="font-semibold">Ingredients</h3>

      {ingredients.map((ing, i) => (
        <div key={i} className="grid grid-cols-4 gap-2 items-center">
          <select
            value={ing.rawItemId}
            onChange={(e) => {
              const raw = rawItems.find(
                (r) => r.id === e.target.value
              );
              const c = [...ingredients];
              c[i].rawItemId = e.target.value;
              if (raw) c[i].unit = raw.unit;
              setIngredients(c);
            }}
            className="border p-1 col-span-2"
          >
            <option value="">Select raw item</option>
            {rawItems.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={ing.qty}
            onChange={(e) => {
              const c = [...ingredients];
              c[i].qty = Number(e.target.value);
              setIngredients(c);
            }}
            className="border p-1"
          />

          <select
            value={ing.unit}
            disabled
            className="border p-1 bg-gray-100"
          >
            <option>{ing.unit}</option>
          </select>
        </div>
      ))}

      <button
        onClick={addIngredient}
        className="bg-gray-200 px-3 py-1 rounded"
      >
        + Add Ingredient
      </button>

      <button
        onClick={saveRecipe}
        disabled={saving}
        className="w-full bg-yellow-700 text-white py-2 rounded font-semibold"
      >
        {saving ? "Saving…" : "Save Recipe"}
      </button>
    </div>
  );
}
